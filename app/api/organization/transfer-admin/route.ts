import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/auth-server'
import { getSupabaseAdmin } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || ''
    const user = await getServerUser(cookieHeader)
    if (!user) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
    }

    const { newAdminId } = await request.json()
    if (!newAdminId) {
      return NextResponse.json({ error: '新しい管理者を選択してください' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // アクティブな組織を取得
    const { data: activeOrg, error: orgError } = await supabase
      .from('user_organizations')
      .select('organization_id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .maybeSingle()

    if (orgError || !activeOrg) {
      return NextResponse.json({ error: '組織が見つかりません' }, { status: 404 })
    }

    // 現在のユーザーが管理者か確認
    const { data: currentUserOrg, error: currentUserError } = await supabase
      .from('user_organizations')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', activeOrg.organization_id)
      .maybeSingle()

    if (currentUserError || !currentUserOrg || currentUserOrg.role !== 'admin') {
      return NextResponse.json({ error: '管理者権限がありません' }, { status: 403 })
    }

    // 新しい管理者が同じ組織のメンバーか確認
    const { data: newAdminOrg, error: newAdminError } = await supabase
      .from('user_organizations')
      .select('role')
      .eq('user_id', newAdminId)
      .eq('organization_id', activeOrg.organization_id)
      .maybeSingle()

    if (newAdminError || !newAdminOrg) {
      return NextResponse.json({ error: '新しい管理者が組織のメンバーではありません' }, { status: 400 })
    }

    // トランザクション的に処理
    // 1. 現在の管理者をメンバーに降格
    const { error: demoteError } = await supabase
      .from('user_organizations')
      .update({ role: 'member' })
      .eq('user_id', user.id)
      .eq('organization_id', activeOrg.organization_id)

    if (demoteError) {
      return NextResponse.json({ error: '管理者の降格に失敗しました' }, { status: 500 })
    }

    // 2. 新しい管理者を昇格
    const { error: promoteError } = await supabase
      .from('user_organizations')
      .update({ role: 'admin' })
      .eq('user_id', newAdminId)
      .eq('organization_id', activeOrg.organization_id)

    if (promoteError) {
      // ロールバック
      await supabase
        .from('user_organizations')
        .update({ role: 'admin' })
        .eq('user_id', user.id)
        .eq('organization_id', activeOrg.organization_id)

      return NextResponse.json({ error: '管理者の昇格に失敗しました' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Transfer admin error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

