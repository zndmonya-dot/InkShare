import { createClient } from './supabase'
import { query, queryOne } from './db'

export interface UserProfile {
  id: string
  email: string
  name: string
  organizationId: string
  role: 'admin' | 'member'
  avatarColor: string
}

// Supabaseからユーザープロフィールを取得
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const user = await queryOne<{
    id: string
    email: string
    name: string
    organization_id: string
    role: 'admin' | 'member'
    avatar_color: string
  }>(
    'SELECT id, email, name, organization_id, role, avatar_color FROM users WHERE id = $1',
    [userId]
  )

  if (!user) return null

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    organizationId: user.organization_id,
    role: user.role,
    avatarColor: user.avatar_color,
  }
}

// サインアップ（Supabase Auth + 追加情報をDB保存）
export async function signUp(email: string, password: string, name: string, teamName: string) {
  const supabase = createClient()

  // 1. Supabase Authでユーザー作成
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) throw authError
  if (!authData.user) throw new Error('ユーザーの作成に失敗しました')

  // 2. 組織を作成
  const orgResult = await queryOne<{ id: string }>(
    'INSERT INTO organizations (name, plan) VALUES ($1, $2) RETURNING id',
    [teamName, 'free']
  )

  if (!orgResult) throw new Error('組織の作成に失敗しました')

  // 3. アバターカラーをランダムに選択
  const avatarColors = [
    'from-lime-400 to-green-500',
    'from-cyan-400 to-blue-500',
    'from-orange-400 to-yellow-500',
    'from-rose-400 to-pink-500',
    'from-purple-400 to-indigo-500',
  ]
  const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)]

  // 4. ユーザー情報をDBに保存
  await query(
    `INSERT INTO users (id, organization_id, email, name, role, avatar_color)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [authData.user.id, orgResult.id, email, name, 'admin', randomColor]
  )

  // 5. 初期ステータスを作成
  await query(
    'INSERT INTO user_status (user_id, status) VALUES ($1, $2)',
    [authData.user.id, 'available']
  )

  return authData.user
}

// サインイン
export async function signIn(email: string, password: string) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data.user
}

// サインアウト
export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// 現在のユーザーを取得
export async function getCurrentUser() {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  return data.user
}

