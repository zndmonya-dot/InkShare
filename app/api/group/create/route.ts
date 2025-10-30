import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/auth-server'
import { getSupabaseAdmin } from '@/lib/db'
import { checkUserTeamLimit, LIMITS } from '@/lib/limits'

// 招待コード生成関数
function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function POST(request: Request) {
  try {
    // 1. 認証確認
    const cookieHeader = request.headers.get('cookie') || ''
    const user = await getServerUser(cookieHeader)
    
    if (!user) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
    }

    // 2. ユーザーのチーム数制限チェック
    const { allowed, currentCount } = await checkUserTeamLimit(user.id)
    
    if (!allowed) {
      return NextResponse.json({ 
        error: `チーム数の上限（${LIMITS.FREE_PLAN.MAX_TEAMS_PER_USER}チーム）に達しています。\n現在：${currentCount}チーム` 
      }, { status: 403 })
    }

    // 3. リクエストボディ取得
    const body = await request.json()
    const { groupName } = body

    if (!groupName || !groupName.trim()) {
      return NextResponse.json({ error: 'グループ名を入力してください' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // 3. 招待コード生成
    const inviteCode = generateInviteCode()

    // 4. 組織作成
    const { data: newOrg, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: groupName.trim(),
        type: 'personal',
        plan: 'free',
        invite_code: inviteCode,
        is_open: true
      })
      .select('id')
      .single()

    if (orgError) {
      console.error('❌ Organization creation failed:', orgError)
      return NextResponse.json({ 
        error: '組織の作成に失敗しました: ' + orgError.message 
      }, { status: 500 })
    }

    if (!newOrg) {
      return NextResponse.json({ 
        error: '組織の作成に失敗しました' 
      }, { status: 500 })
    }

    // 5. 既存の組織を非アクティブに
    await supabase
      .from('user_organizations')
      .update({ is_active: false })
      .eq('user_id', user.id)

    // 6. ユーザーを新しい組織にリンク
    const { error: linkError } = await supabase
      .from('user_organizations')
      .insert({
        user_id: user.id,
        organization_id: newOrg.id,
        role: 'member',
        is_active: true
      })

    if (linkError) {
      console.error('❌ User-organization link failed:', linkError)
      // 作成した組織を削除
      await supabase.from('organizations').delete().eq('id', newOrg.id)
      return NextResponse.json({ 
        error: '組織への参加に失敗しました: ' + linkError.message 
      }, { status: 500 })
    }

    // 7. 成功レスポンス
    return NextResponse.json({
      success: true,
      organizationId: newOrg.id,
      inviteCode
    }, { status: 200 })

  } catch (error: any) {
    console.error('❌ Unexpected error:', error)
    return NextResponse.json({ 
      error: 'エラーが発生しました: ' + (error.message || '不明なエラー')
    }, { status: 500 })
  }
}
