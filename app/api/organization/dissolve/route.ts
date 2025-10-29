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

    // デバッグ用：組織の詳細を確認
    const { data: orgData, error: orgFetchError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', activeOrg.organization_id)
      .single()

    if (orgFetchError) {
      console.error('Organization fetch error:', orgFetchError)
      return NextResponse.json({ error: `組織の取得に失敗: ${orgFetchError.message}` }, { status: 500 })
    }

    console.log('Deleting organization:', orgData)

    // 組織を削除（CASCADE設定により、関連データも自動削除される）
    const { error: deleteError, data: deleteData } = await supabase
      .from('organizations')
      .delete()
      .eq('id', activeOrg.organization_id)
      .select()

    if (deleteError) {
      console.error('Organization delete error:', deleteError)
      return NextResponse.json({ 
        error: `組織の削除に失敗しました: ${deleteError.message}`,
        details: deleteError 
      }, { status: 500 })
    }

    console.log('Organization deleted successfully:', deleteData)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Dissolve organization error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

