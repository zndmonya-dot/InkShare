import { createClient } from './supabase'
import { query, queryOne } from './db'

export interface UserProfile {
  id: string
  email: string
  name: string
  avatarColor: string
  currentOrganization?: {
    id: string
    name: string
    type: 'business' | 'personal'
    role: 'admin' | 'member'
  }
  organizations: Array<{
    id: string
    name: string
    type: 'business' | 'personal'
    role: 'admin' | 'member'
    isActive: boolean
  }>
}

// Supabaseからユーザープロフィールを取得
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  // ユーザー基本情報を取得
  const user = await queryOne<{
    id: string
    email: string
    name: string
    avatar_color: string
  }>(
    'SELECT id, email, name, avatar_color FROM users WHERE id = $1',
    [userId]
  )

  if (!user) return null

  // 所属組織を取得
  const organizations = await query<{
    org_id: string
    org_name: string
    org_type: 'business' | 'personal'
    role: 'admin' | 'member'
    is_active: boolean
  }>(
    `SELECT 
      o.id as org_id,
      o.name as org_name,
      o.type as org_type,
      uo.role,
      uo.is_active
    FROM user_organizations uo
    JOIN organizations o ON uo.organization_id = o.id
    WHERE uo.user_id = $1
    ORDER BY uo.is_active DESC, uo.joined_at DESC`,
    [userId]
  )

  const orgs = organizations.map(org => ({
    id: org.org_id,
    name: org.org_name,
    type: org.org_type,
    role: org.role,
    isActive: org.is_active,
  }))

  const currentOrg = orgs.find(org => org.isActive)

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarColor: user.avatar_color,
    currentOrganization: currentOrg ? {
      id: currentOrg.id,
      name: currentOrg.name,
      type: currentOrg.type,
      role: currentOrg.role,
    } : undefined,
    organizations: orgs,
  }
}

// 法人向けサインアップ（管理者が組織を作成）
export async function signUpBusiness(email: string, password: string, name: string, companyName: string) {
  const supabase = createClient()

  // 1. Supabase Authでユーザー作成
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) throw authError
  if (!authData.user) throw new Error('ユーザーの作成に失敗しました')

  // 2. 法人組織を作成
  const orgResult = await queryOne<{ id: string }>(
    'INSERT INTO organizations (name, type, plan) VALUES ($1, $2, $3) RETURNING id',
    [companyName, 'business', 'free']
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
    `INSERT INTO users (id, email, name, avatar_color) VALUES ($1, $2, $3, $4)`,
    [authData.user.id, email, name, randomColor]
  )

  // 5. ユーザーを組織に紐づけ（管理者として）
  await query(
    `INSERT INTO user_organizations (user_id, organization_id, role, is_active)
     VALUES ($1, $2, $3, $4)`,
    [authData.user.id, orgResult.id, 'admin', true]
  )

  // 6. 初期ステータスを作成
  await query(
    'INSERT INTO user_status (user_id, status) VALUES ($1, $2)',
    [authData.user.id, 'available']
  )

  return authData.user
}

// 個人向けサインアップ（グループを作成）
export async function signUpPersonal(email: string, password: string, name: string, groupName: string) {
  const supabase = createClient()

  // 1. Supabase Authでユーザー作成
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) throw authError
  if (!authData.user) throw new Error('ユーザーの作成に失敗しました')

  // 2. 個人向け組織を作成（参加コード生成）
  const inviteCode = generateInviteCode()
  const orgResult = await queryOne<{ id: string }>(
    'INSERT INTO organizations (name, type, plan, invite_code, is_open) VALUES ($1, $2, $3, $4, $5) RETURNING id',
    [groupName, 'personal', 'free', inviteCode, true]
  )

  if (!orgResult) throw new Error('グループの作成に失敗しました')

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
    `INSERT INTO users (id, email, name, avatar_color) VALUES ($1, $2, $3, $4)`,
    [authData.user.id, email, name, randomColor]
  )

  // 5. ユーザーを組織に紐づけ（管理者として）
  await query(
    `INSERT INTO user_organizations (user_id, organization_id, role, is_active)
     VALUES ($1, $2, $3, $4)`,
    [authData.user.id, orgResult.id, 'admin', true]
  )

  // 6. 初期ステータスを作成
  await query(
    'INSERT INTO user_status (user_id, status) VALUES ($1, $2)',
    [authData.user.id, 'available']
  )

  return { user: authData.user, inviteCode }
}

// 参加コードで既存グループに参加
export async function joinGroupByCode(userId: string, inviteCode: string) {
  // 組織を検索
  const org = await queryOne<{ id: string; name: string; type: string }>(
    'SELECT id, name, type FROM organizations WHERE invite_code = $1 AND type = $2',
    [inviteCode, 'personal']
  )

  if (!org) throw new Error('招待コードが無効です')

  // すでに参加しているかチェック
  const existing = await queryOne(
    'SELECT id FROM user_organizations WHERE user_id = $1 AND organization_id = $2',
    [userId, org.id]
  )

  if (existing) throw new Error('すでにこのグループに参加しています')

  // 現在のアクティブな組織を非アクティブに
  await query(
    'UPDATE user_organizations SET is_active = false WHERE user_id = $1',
    [userId]
  )

  // グループに参加
  await query(
    `INSERT INTO user_organizations (user_id, organization_id, role, is_active)
     VALUES ($1, $2, $3, $4)`,
    [userId, org.id, 'member', true]
  )

  return org
}

// 招待コード生成
function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // 紛らわしい文字を除外
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
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

