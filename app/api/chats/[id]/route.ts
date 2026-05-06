import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { getTokenFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = getTokenFromRequest(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  try {
    const chatResult = await pool.query(
      'SELECT * FROM chats WHERE id = $1 AND user_id = $2',
      [id, payload.userId]
    )
    if (!chatResult.rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const messagesResult = await pool.query(
      'SELECT * FROM messages WHERE chat_id = $1 ORDER BY created_at ASC',
      [id]
    )
    return NextResponse.json({ chat: chatResult.rows[0], messages: messagesResult.rows })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = getTokenFromRequest(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  try {
    await pool.query('DELETE FROM chats WHERE id = $1 AND user_id = $2', [id, payload.userId])
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
