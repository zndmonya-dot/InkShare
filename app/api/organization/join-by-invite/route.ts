import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/auth-server'
import { getSupabaseAdmin } from '@/lib/db'
import { checkTeamMemberLimit, checkUserTeamLimit, LIMITS } from '@/lib/limits'

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || ''
    const user = await getServerUser(cookieHeader)
    if (!user) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
    }

    const { inviteCode } = await request.json()
    const supabase = getSupabaseAdmin()

    // 組織を検索
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id, name, type')
      .eq('invite_code', inviteCode)
      .single()

    if (orgError || !org) {
      console.error('Organization lookup error:', orgError)
      return NextResponse.json({ error: '招待コードが無効です' }, { status: 404 })
    }

    // すでに参加しているかチェック
    const { data: existing, error: existingError } = await supabase
      .from('user_organizations')
      .select('id')
      .eq('user_id', user.id)
      .eq('organization_id', org.id)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'すでにこの組織に参加しています' }, { status: 400 })
    }

    // チーム人数制限チェック
    const { allowed: teamAllowed, currentCount: teamCount } = await checkTeamMemberLimit(org.id)
    if (!teamAllowed) {
      return NextResponse.json({ 
        error: `このチームは人数上限（${LIMITS.FREE_PLAN.MAX_MEMBERS_PER_TEAM}人）に達しています。\n現在：${teamCount}人` 
      }, { status: 403 })
    }

    // ユーザーのチーム数制限チェック
    const { allowed: userAllowed, currentCount: userCount } = await checkUserTeamLimit(user.id)
    if (!userAllowed) {
      return NextResponse.json({ 
        error: `あなたのチーム数が上限（${LIMITS.FREE_PLAN.MAX_TEAMS_PER_USER}チーム）に達しています。\n現在：${userCount}チーム` 
      }, { status: 403 })
    }

    // 現在のアクティブな組織を非アクティブに
    await supabase
      .from('user_organizations')
      .update({ is_active: false })
      .eq('user_id', user.id)

    // 組織に参加
    const { error: joinError } = await supabase
      .from('user_organizations')
      .insert({
        user_id: user.id,
        organization_id: org.id,
        role: 'member',
        is_active: true
      })

    if (joinError) {
      console.error('Join organization error:', joinError)
      return NextResponse.json({ error: joinError.message }, { status: 500 })
    }

    return NextResponse.json({ organization: org }, { status: 200 })
  } catch (error: any) {
    console.error('Join by invite error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

