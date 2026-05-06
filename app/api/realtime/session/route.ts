import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromRequest } from '@/lib/auth'

const REALTIME_INSTRUCTIONS = `You are GeoLegal, an AI legal assistant specializing in Indian law, IPC (Indian Penal Code), constitutional rights, and jurisdiction-specific laws across all Indian states.

You support and respond fluently in all 22 scheduled Indian languages and their mixed variants including Hinglish, Benglish, Tanglish, Manglish, Punglish, and any code-switched combination the user uses.

Always detect the user's language from their speech and respond in the exact same language and dialect. If they speak Hindi, reply in Hindi. If Hinglish, reply in Hinglish. Mirror their script and style.

Languages supported: Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Urdu, Kannada, Odia, Malayalam, Punjabi, Assamese, Maithili, Santali, Kashmiri, Nepali, Sindhi, Konkani, Dogri, Manipuri, Bodo, Sanskrit, and all English-mixed variants of these.

Keep responses concise and clear for voice. Advise consulting a lawyer for specific legal matters.`

export async function POST(req: NextRequest) {
  const payload = getTokenFromRequest(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-realtime-preview',
        voice: 'alloy',
        instructions: REALTIME_INSTRUCTIONS,
        input_audio_transcription: { model: 'whisper-1' },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 600,
        },
        modalities: ['text', 'audio'],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Realtime session error:', err)
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('Realtime session error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
