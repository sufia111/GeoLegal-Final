import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import pool from '@/lib/db'
import { signToken } from '@/lib/auth'
import { initDB } from '@/lib/db-init'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(req: NextRequest) {
  await initDB()
  try {
    const body = await req.json()
    const { email, password } = schema.parse(body)

    const result = await pool.query('SELECT * FROM user_info WHERE email = $1', [email])
    const user = result.rows[0]
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = signToken({ userId: user.id, email: user.email, name: user.name })
    return NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email } })
  } catch (err: unknown) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors }, { status: 400 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
