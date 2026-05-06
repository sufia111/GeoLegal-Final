import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { getTokenFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const payload = getTokenFromRequest(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const result = await pool.query(
      `SELECT sc.*, c.title, c.created_at as chat_created_at, c.updated_at as chat_updated_at
       FROM saved_chats sc
       JOIN chats c ON c.id = sc.chat_id
       WHERE sc.user_id = $1
       ORDER BY sc.saved_at DESC`,
      [payload.userId]
    )
    return NextResponse.json({ savedChats: result.rows })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const payload = getTokenFromRequest(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { chatId } = body
    if (!chatId) return NextResponse.json({ error: 'chatId required' }, { status: 400 })

    const result = await pool.query(
      'INSERT INTO saved_chats (user_id, chat_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
      [payload.userId, chatId]
    )
    return NextResponse.json({ savedChat: result.rows[0] }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
