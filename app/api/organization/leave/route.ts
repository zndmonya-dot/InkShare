import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/auth-server'
import { getSupabaseAdmin } from '@/lib/db'

// チーム脱退API
export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || ''
    const user = await getServerUser(cookieHeader)
    
    if (!user) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
    }

    const { organizationId } = await request.json()

    if (!organizationId) {
      return NextResponse.json({ error: '組織IDが必要です' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // 1. 組織のメンバー数を確認
    const { data: members, error: membersError } = await supabase
      .from('user_organizations')
      .select('user_id, role')
      .eq('organization_id', organizationId)

    if (membersError) {
      console.error('Members fetch error:', membersError)
      return NextResponse.json({ error: membersError.message }, { status: 500 })
    }

    // 2. 自分が管理者で、かつ唯一の管理者の場合は脱退不可
    const admins = members?.filter(m => m.role === 'admin') || []
    const isOnlyAdmin = admins.length === 1 && admins[0].user_id === user.id

    if (isOnlyAdmin) {
      return NextResponse.json(
        { error: '唯一の管理者は脱退できません。別の管理者を指定するか、グループを削除してください。' },
        { status: 400 }
      )
    }

    // 3. ユーザーをグループから削除
    const { error: deleteError } = await supabase
      .from('user_organizations')
      .delete()
      .eq('user_id', user.id)
      .eq('organization_id', organizationId)

    if (deleteError) {
      console.error('Leave organization error:', deleteError)
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    // 4. そのグループのステータスも削除
    await supabase
      .from('user_status')
      .delete()
      .eq('user_id', user.id)
      .eq('organization_id', organizationId)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Leave organization error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

