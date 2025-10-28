import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/auth-server'
import { getSupabaseAdmin } from '@/lib/db'

// 招待コード生成関数
function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // 紛らわしい文字を除外
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function POST(request: Request) {
  try {
    console.log('🔷 Group create: Starting...')
    
    const cookieHeader = request.headers.get('cookie') || ''
    const user = await getServerUser(cookieHeader)
    
    if (!user) {
      console.log('❌ Group create: No user found')
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
    }

    console.log('✅ Group create: User authenticated:', user.id)

    const { groupName, type } = await request.json()
    console.log('📝 Group create: Group name:', groupName, 'Type:', type)

    if (!groupName) {
      return NextResponse.json({ error: '名前を入力してください' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // ユーザーがusersテーブルに存在するか確認
    console.log('🔍 Group create: Checking if user exists in users table...')
    const { data: existingUser, error: userCheckError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()

    console.log('📊 Group create: User check result:', existingUser ? 'Found' : 'Not found', 'Error:', userCheckError)

    if (!existingUser) {
      console.error('❌ User not found in users table:', user.id, userCheckError)
      return NextResponse.json({ 
        error: 'ユーザー情報が見つかりません。再度ログインしてください' 
      }, { status: 400 })
    }
    const organizationType = type === 'business' ? 'business' : 'personal'
    const isPersonal = organizationType === 'personal'
    console.log('🏢 Group create: Organization type:', organizationType, 'Is personal:', isPersonal)

    // 組織を作成
    let inviteCode: string | null = null
    if (isPersonal) {
      // 個人グループは招待コードを生成
      inviteCode = generateInviteCode()
      console.log('🔑 Group create: Generated invite code:', inviteCode)
    }

    console.log('📝 Group create: Inserting organization...')
    const { data: orgResult, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: groupName,
        type: organizationType,
        plan: 'free',
        invite_code: inviteCode,
        is_open: isPersonal
      })
      .select('id')
      .single()

    if (orgError || !orgResult) {
      console.error('❌ Organization creation error:', JSON.stringify(orgError, null, 2))
      return NextResponse.json({ error: '作成に失敗しました' }, { status: 500 })
    }

    console.log('✅ Group create: Organization created:', orgResult.id)

    // 現在のアクティブな組織を非アクティブに
    console.log('🔄 Group create: Deactivating other organizations...')
    await supabase
      .from('user_organizations')
      .update({ is_active: false })
      .eq('user_id', user.id)

    // ユーザーを組織に紐づけ（管理者として）
    console.log('🔗 Group create: Linking user to organization...')
    const { error: linkError } = await supabase
      .from('user_organizations')
      .insert({
        user_id: user.id,
        organization_id: orgResult.id,
        role: 'admin',
        is_active: true
      })

    if (linkError) {
      console.error('❌ User organization link error:', JSON.stringify(linkError, null, 2))
      return NextResponse.json({ error: '組織への参加に失敗しました' }, { status: 500 })
    }

    console.log('✅ Group create: Success!')
    return NextResponse.json({ 
      organizationId: orgResult.id,
      inviteCode: inviteCode 
    }, { status: 200 })
  } catch (error: any) {
    console.error('Organization creation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

