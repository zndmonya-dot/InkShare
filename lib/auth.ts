import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key'
const SALT_ROUNDS = 10

export interface TokenPayload {
  userId: string
  email: string
  organizationId: string
  role: 'admin' | 'member'
}

// JWTトークンを生成
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '30d',
  })
}

// JWTトークンを検証
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
    return decoded
  } catch (error) {
    return null
  }
}

// パスワードをハッシュ化
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

// パスワードを検証
export async function verifyPassword(
  password: string,
  passwordHash: string
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash)
}

// Cookieからトークンを取得
export function getTokenFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null
  
  const cookies = cookieHeader.split(';').map(c => c.trim())
  const authCookie = cookies.find(c => c.startsWith('auth-token='))
  
  if (!authCookie) return null
  
  return authCookie.split('=')[1]
}

// Cookie文字列を生成
export function generateAuthCookie(token: string): string {
  const maxAge = 30 * 24 * 60 * 60 // 30日
  return `auth-token=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
}

// Cookieを削除
export function clearAuthCookie(): string {
  return `auth-token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`
}

