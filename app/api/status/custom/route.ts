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

    const { type, label, icon } = await request.json()
    const supabase = getSupabaseAdmin()

    // 1. アクティブな組織を取得
    const { data: activeOrg, error: orgError } = await supabase
      .from('user_organizations')
      .select('organization_id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .maybeSingle()

    if (orgError) {
      console.error('Active org fetch error:', orgError)
      return NextResponse.json({ error: orgError.message }, { status: 500 })
    }

    if (!activeOrg) {
      return NextResponse.json({ error: '組織が見つかりません' }, { status: 404 })
    }

    // 2. カスタムステータスを更新
    let updateData: any = { updated_at: new Date().toISOString() }

    if (type === 'custom1') {
      updateData.custom1_label = label
      updateData.custom1_icon = icon
    } else if (type === 'custom2') {
      updateData.custom2_label = label
      updateData.custom2_icon = icon
    } else {
      return NextResponse.json({ error: '無効なカスタムタイプです' }, { status: 400 })
    }

    const { error } = await supabase
      .from('user_status')
      .update(updateData)
      .eq('user_id', user.id)
      .eq('organization_id', activeOrg.organization_id)

    if (error) {
      console.error('Custom status update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Custom status POST error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

