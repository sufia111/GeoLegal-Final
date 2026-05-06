import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import pool from '@/lib/db'
import { getTokenFromRequest } from '@/lib/auth'

const anthropic = new Anthropic({ apiKey: process.env.AI_API_KEY })

const SYSTEM_PROMPT = `You are GeoLegal, an AI legal assistant specializing in Indian law, IPC (Indian Penal Code), constitutional rights, and jurisdiction-specific laws across Indian states and union territories. Provide accurate, clear legal information while advising users to consult a qualified lawyer for specific legal advice.`

export async function POST(req: NextRequest) {
  const payload = getTokenFromRequest(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { chatId, message } = await req.json()
    if (!chatId || !message) return NextResponse.json({ error: 'chatId and message required' }, { status: 400 })

    // Verify chat belongs to user
    const chatResult = await pool.query(
      'SELECT * FROM chats WHERE id = $1 AND user_id = $2',
      [chatId, payload.userId]
    )
    if (!chatResult.rows[0]) return NextResponse.json({ error: 'Chat not found' }, { status: 404 })

    // Save user message
    const userMsgResult = await pool.query(
      'INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3) RETURNING *',
      [chatId, 'user', message]
    )

    // Get conversation history for context
    const historyResult = await pool.query(
      'SELECT role, content FROM messages WHERE chat_id = $1 ORDER BY created_at ASC',
      [chatId]
    )

    const messages: Anthropic.MessageParam[] = historyResult.rows.map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

    // Call Anthropic
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages,
    })

    const assistantContent = response.content[0].type === 'text' ? response.content[0].text : ''

    // Save assistant message
    const assistantMsgResult = await pool.query(
      'INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3) RETURNING *',
      [chatId, 'assistant', assistantContent]
    )

    // Update chat title if first message
    const msgCount = historyResult.rows.length
    if (msgCount <= 1) {
      const title = message.slice(0, 80)
      await pool.query('UPDATE chats SET title = $1, updated_at = NOW() WHERE id = $2', [title, chatId])
    } else {
      await pool.query('UPDATE chats SET updated_at = NOW() WHERE id = $1', [chatId])
    }

    return NextResponse.json({
      userMessage: userMsgResult.rows[0],
      assistantMessage: assistantMsgResult.rows[0],
    })
  } catch (err) {
    console.error('Chat respond error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
