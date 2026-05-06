import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import pool from '@/lib/db'
import { signToken } from '@/lib/auth'
import { initDB } from '@/lib/db-init'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(req: NextRequest) {
  await initDB()
  try {
    const body = await req.json()
    const { name, email, password } = schema.parse(body)
    const passwordHash = await bcrypt.hash(password, 10)

    const result = await pool.query(
      'INSERT INTO user_info (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, passwordHash]
    )
    const user = result.rows[0]
    const token = signToken({ userId: user.id, email: user.email, name: user.name })
    return NextResponse.json({ token, user }, { status: 201 })
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    const msg = err instanceof Error ? err.message : 'Server error'
    if (msg.includes('unique') || msg.includes('duplicate')) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
