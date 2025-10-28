import { createClient } from './supabase'

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
  const { getSupabaseAdmin } = await import('./db')
  const supabase = getSupabaseAdmin()

  // ユーザー基本情報を取得
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, email, name, avatar_color')
    .eq('id', userId)
    .maybeSingle()

  if (!user) {
    console.error('User fetch error:', userError)
    return null
  }

  // 所属組織を取得
  const { data: userOrgs, error: orgsError } = await supabase
    .from('user_organizations')
    .select(`
      organization_id,
      role,
      is_active,
      organizations (
        id,
        name,
        type
      )
    `)
    .eq('user_id', userId)
    .order('is_active', { ascending: false })
    .order('joined_at', { ascending: false })

  if (orgsError) {
    console.error('Organizations fetch error:', orgsError)
  }

  console.log('📊 getUserProfile: Raw userOrgs data:', JSON.stringify(userOrgs, null, 2))

  const organizations = (userOrgs || []).map((uo: any) => ({
    id: uo.organizations?.id,
    name: uo.organizations?.name,
    type: uo.organizations?.type,
    role: uo.role,
    isActive: uo.is_active,
  })).filter(org => org.id) // 不完全なデータを除外

  const currentOrg = organizations.find(org => org.isActive)

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
    organizations,
  }
}

// 法人向けサインアップ（管理者が組織を作成）
// 注: この関数は現在使用されていません。サインアップは /api/auth/signup を使用してください。
export async function signUpBusiness(email: string, password: string, name: string, companyName: string) {
  const supabase = createClient()
  const { getSupabaseAdmin } = await import('./db')
  const supabaseAdmin = getSupabaseAdmin()

  // 1. Supabase Authでユーザー作成
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) throw authError
  if (!authData.user) throw new Error('ユーザーの作成に失敗しました')

  // 2. 法人組織を作成
  const { data: orgResult, error: orgError } = await supabaseAdmin
    .from('organizations')
    .insert({
      name: companyName,
      type: 'business',
      plan: 'free'
    })
    .select('id')
    .single()

  if (orgError || !orgResult) throw new Error('組織の作成に失敗しました')

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
  const { error: userError } = await supabaseAdmin
    .from('users')
    .insert({
      id: authData.user.id,
      email,
      name,
      avatar_color: randomColor
    })

  if (userError) throw userError

  // 5. ユーザーを組織に紐づけ（管理者として）
  const { error: linkError } = await supabaseAdmin
    .from('user_organizations')
    .insert({
      user_id: authData.user.id,
      organization_id: orgResult.id,
      role: 'admin',
      is_active: true
    })

  if (linkError) throw linkError

  // 6. 初期ステータスを作成
  const { error: statusError } = await supabaseAdmin
    .from('user_status')
    .insert({
      user_id: authData.user.id,
      status: 'available'
    })

  if (statusError) throw statusError

  return authData.user
}

// 個人向けサインアップ（アカウントのみ作成、グループなし）
export async function signUpPersonal(email: string, password: string, name: string) {
  const supabase = createClient()
  const { getSupabaseAdmin } = await import('./db')
  const supabaseAdmin = getSupabaseAdmin()

  // 1. Supabase Authでユーザー作成
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) throw authError
  if (!authData.user) throw new Error('ユーザーの作成に失敗しました')

  // メール確認が必要かどうかを判定
  const needsEmailConfirmation = !authData.session

  // 2. アバターカラーをランダムに選択
  const avatarColors = [
    'from-lime-400 to-green-500',
    'from-cyan-400 to-blue-500',
    'from-orange-400 to-yellow-500',
    'from-rose-400 to-pink-500',
    'from-purple-400 to-indigo-500',
  ]
  const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)]

  // 3. ユーザー情報をDBに保存（グループなし）
  const { error: userError } = await supabaseAdmin
    .from('users')
    .insert({
      id: authData.user.id,
      email,
      name,
      avatar_color: randomColor
    })

  if (userError) throw userError

  // 4. 初期ステータスを作成
  const { error: statusError } = await supabaseAdmin
    .from('user_status')
    .insert({
      user_id: authData.user.id,
      status: 'available'
    })

  if (statusError) throw statusError

  return {
    user: authData.user,
    needsEmailConfirmation
  }
}

// 参加コードで既存グループに参加
export async function joinGroupByCode(userId: string, inviteCode: string) {
  const { getSupabaseAdmin } = await import('./db')
  const supabase = getSupabaseAdmin()

  // 組織を検索
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .select('id, name, type')
    .eq('invite_code', inviteCode)
    .eq('type', 'personal')
    .maybeSingle()

  if (orgError || !org) throw new Error('招待コードが無効です')

  // すでに参加しているかチェック
  const { data: existing } = await supabase
    .from('user_organizations')
    .select('id')
    .eq('user_id', userId)
    .eq('organization_id', org.id)
    .maybeSingle()

  if (existing) throw new Error('すでにこのグループに参加しています')

  // 現在のアクティブな組織を非アクティブに
  await supabase
    .from('user_organizations')
    .update({ is_active: false })
    .eq('user_id', userId)

  // グループに参加
  const { error: joinError } = await supabase
    .from('user_organizations')
    .insert({
      user_id: userId,
      organization_id: org.id,
      role: 'member',
      is_active: true
    })

  if (joinError) throw new Error('グループへの参加に失敗しました')

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

// 現在のユーザーを取得（クライアントサイド用）
export async function getCurrentUser() {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  return data.user
}


