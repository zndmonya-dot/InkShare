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

    const { organizationId } = await request.json()
    const supabase = getSupabaseAdmin()

    // すべての組織を非アクティブに
    const { error: deactivateError } = await supabase
      .from('user_organizations')
      .update({ is_active: false })
      .eq('user_id', user.id)

    if (deactivateError) {
      console.error('Deactivate error:', deactivateError)
      return NextResponse.json({ error: deactivateError.message }, { status: 500 })
    }

    // 指定された組織をアクティブに
    const { error: activateError } = await supabase
      .from('user_organizations')
      .update({ is_active: true })
      .eq('user_id', user.id)
      .eq('organization_id', organizationId)

    if (activateError) {
      console.error('Activate error:', activateError)
      return NextResponse.json({ error: activateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Switch organization error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

