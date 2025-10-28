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
    const cookieHeader = request.headers.get('cookie') || ''
    const user = await getServerUser(cookieHeader)
    
    if (!user) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
    }

    const { groupName, type } = await request.json()

    if (!groupName) {
      return NextResponse.json({ error: '名前を入力してください' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const organizationType = type === 'business' ? 'business' : 'personal'
    const isPersonal = organizationType === 'personal'

    // 組織を作成
    let inviteCode: string | null = null
    if (isPersonal) {
      // 個人グループは招待コードを生成
      inviteCode = generateInviteCode()
    }

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
      console.error('Organization creation error:', orgError)
      return NextResponse.json({ error: '作成に失敗しました' }, { status: 500 })
    }

    // 現在のアクティブな組織を非アクティブに
    await supabase
      .from('user_organizations')
      .update({ is_active: false })
      .eq('user_id', user.id)

    // ユーザーを組織に紐づけ（管理者として）
    const { error: linkError } = await supabase
      .from('user_organizations')
      .insert({
        user_id: user.id,
        organization_id: orgResult.id,
        role: 'admin',
        is_active: true
      })

    if (linkError) {
      console.error('User organization link error:', linkError)
      return NextResponse.json({ error: '組織への参加に失敗しました' }, { status: 500 })
    }

    return NextResponse.json({ 
      organizationId: orgResult.id,
      inviteCode: inviteCode 
    }, { status: 200 })
  } catch (error: any) {
    console.error('Organization creation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

