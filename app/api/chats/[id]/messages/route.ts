import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { getTokenFromRequest } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = getTokenFromRequest(req)
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  try {
    const body = await req.json()
    const { content, role } = body
    if (!content) return NextResponse.json({ error: 'Content required' }, { status: 400 })
    const msgRole = role === 'assistant' ? 'assistant' : 'user'

    // Verify chat belongs to user
    const chatResult = await pool.query(
      'SELECT * FROM chats WHERE id = $1 AND user_id = $2',
      [id, payload.userId]
    )
    if (!chatResult.rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const result = await pool.query(
      'INSERT INTO messages (chat_id, role, content) VALUES ($1, $2, $3) RETURNING *',
      [id, msgRole, content]
    )
    return NextResponse.json({ message: result.rows[0] }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
