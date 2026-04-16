// Simple cookie-based auth — no Supabase dependency
// Default admin: admin@launchpad.app / 12345678

export interface User {
  id: string
  email: string
  name: string
}

const USERS: Record<string, { password: string; user: User }> = {
  'admin@launchpad.app': {
    password: '12345678',
    user: { id: 'admin-001', email: 'admin@launchpad.app', name: 'Admin' },
  },
}

// In-memory user store for signups (resets on server restart)
const dynamicUsers: Record<string, { password: string; user: User }> = {}

export function authenticateUser(email: string, password: string): User | null {
  const entry = USERS[email] || dynamicUsers[email]
  if (!entry) return null
  if (entry.password !== password) return null
  return entry.user
}

export function registerUser(email: string, password: string, name?: string): User | null {
  if (USERS[email] || dynamicUsers[email]) return null // already exists
  const user: User = {
    id: `user-${Date.now()}`,
    email,
    name: name || email.split('@')[0],
  }
  dynamicUsers[email] = { password, user }
  return user
}

export function getUserByEmail(email: string): User | null {
  const entry = USERS[email] || dynamicUsers[email]
  return entry?.user || null
}

// Session token = base64(email) — dead simple, not for production
export function createSessionToken(user: User): string {
  return Buffer.from(JSON.stringify({ id: user.id, email: user.email, name: user.name })).toString('base64')
}

export function parseSessionToken(token: string): User | null {
  try {
    const parsed = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'))
    if (parsed.id && parsed.email) return parsed as User
    return null
  } catch {
    return null
  }
}

export const SESSION_COOKIE = 'launchpad_session'
