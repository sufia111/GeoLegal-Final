import pool from './db'

let initialized = false

export async function initDB() {
  if (initialized) return
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_info (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        provider VARCHAR(50) DEFAULT 'email',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS chats (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES user_info(id) ON DELETE CASCADE,
        title VARCHAR(500) DEFAULT 'New Chat',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        chat_id INTEGER REFERENCES chats(id) ON DELETE CASCADE,
        role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS saved_chats (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES user_info(id) ON DELETE CASCADE,
        chat_id INTEGER REFERENCES chats(id) ON DELETE CASCADE,
        saved_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, chat_id)
      );
    `)
    initialized = true
    console.log('DB initialized')
  } catch (err) {
    console.error('DB init error:', err)
  }
}
