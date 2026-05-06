import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import pool from '@/lib/db'
import { getTokenFromRequest } from '@/lib/auth'

const openai = new OpenAI({ apiKey: process.env.AI_API_KEY })

const SYSTEM_PROMPT = `You are GeoLegal, an AI legal assistant specializing in Indian law, IPC (Indian Penal Code), constitutional rights, and jurisdiction-specific laws across all Indian states and union territories.

You support and respond fluently in all 22 scheduled Indian languages and their mixed variants:
- Pure languages: Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Urdu, Kannada, Odia, Malayalam, Punjabi, Assamese, Maithili, Santali, Kashmiri, Nepali, Sindhi, Konkani, Dogri, Manipuri, Bodo, Sanskrit
- Mixed/code-switched: Hinglish (Hindi+English), Benglish (Bengali+English), Tanglish (Tamil+English), Manglish (Malayalam+English), Punglish (Punjabi+English), mixed Hindi-Punjabi, mixed Hindi-Urdu, Gujarati-English, and any other combination the user uses

IMPORTANT: Always detect and match the user's language. If they write in Hinglish, respond in Hinglish. If Bengali, respond in Bengali. Mirror their script (Devanagari, Bengali script, etc.) and language style exactly.

Use web_search to find current legal information, recent judgments, new laws, or any factual data you need to give accurate answers.

Provide accurate, clear legal information. Always advise users to consult a qualified lawyer for specific legal advice.`

export async function POST(req: NextRequest) {
  const payload = getTokenFromRequest(req)
  if (!payload) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  try {
    const { chatId, message } = await req.json()
    if (!chatId || !message) {
      return new Response(JSON.stringify({ error: 'chatId and message required' }), { status: 400 })
    }

    // Verify chat belongs to user
    const chatResult = await pool.query(
      'SELECT * FROM chats WHERE id = $1 AND user_id = $2',
      [chatId, payload.userId]
    )
    if (!chatResult.rows[0]) {
      return new Response(JSON.stringify({ error: 'Chat not found' }), { status: 404 })
    }

    // Save user message
    const userMsgResult = await pool.query(
      'INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3) RETURNING *',
      [chatId, 'user', message]
    )

    // Get conversation history
    const historyResult = await pool.query(
      'SELECT role, content FROM messages WHERE chat_id = $1 ORDER BY created_at ASC',
      [chatId]
    )

    const inputMessages = historyResult.rows.map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

    // Stream with web search
    const stream = await openai.responses.create({
      model: 'gpt-4o',
      instructions: SYSTEM_PROMPT,
      input: inputMessages,
      tools: [{ type: 'web_search_preview' }],
      stream: true,
    })

    const encoder = new TextEncoder()
    let fullText = ''

    const readable = new ReadableStream({
      async start(controller) {
        // Send user message id first
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'user_message', message: userMsgResult.rows[0] })}\n\n`)
        )

        try {
          for await (const event of stream) {
            if (
              event.type === 'response.output_text.delta' &&
              'delta' in event &&
              typeof event.delta === 'string'
            ) {
              fullText += event.delta
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'delta', text: event.delta })}\n\n`)
              )
            }
          }

          // Save complete assistant message
          const assistantMsgResult = await pool.query(
            'INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3) RETURNING *',
            [chatId, 'assistant', fullText]
          )

          // Update chat title
          const msgCount = historyResult.rows.length
          if (msgCount <= 1) {
            await pool.query('UPDATE chats SET title = $1, updated_at = NOW() WHERE id = $2', [
              message.slice(0, 80),
              chatId,
            ])
          } else {
            await pool.query('UPDATE chats SET updated_at = NOW() WHERE id = $1', [chatId])
          }

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: 'done', assistantMessage: assistantMsgResult.rows[0] })}\n\n`
            )
          )
        } catch (err) {
          console.error('Stream error:', err)
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'error', message: 'Stream failed' })}\n\n`)
          )
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (err) {
    console.error('Chat stream error:', err)
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })
  }
}
