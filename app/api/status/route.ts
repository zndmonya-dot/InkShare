import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/auth-server'
import { getSupabaseAdmin } from '@/lib/db'
import { DEFAULT_CUSTOM_STATUS } from '@/lib/constants'

// ステータス取得（現在アクティブな組織のステータス）
export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || ''
    const user = await getServerUser(cookieHeader)
    if (!user) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
    }

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
      // 組織がない場合はデフォルトステータスを返す
      return NextResponse.json({ 
        status: {
          status: 'available',
          custom1_label: DEFAULT_CUSTOM_STATUS.custom1.label,
          custom1_icon: DEFAULT_CUSTOM_STATUS.custom1.icon,
          custom1_color: 'bg-fuchsia-400',
          custom2_label: DEFAULT_CUSTOM_STATUS.custom2.label,
          custom2_icon: DEFAULT_CUSTOM_STATUS.custom2.icon,
          custom2_color: 'bg-purple-400'
        }
      }, { status: 200 })
    }

    // 2. 該当組織のステータスを取得
    const { data: status, error } = await supabase
      .from('user_status')
      .select('status, custom1_label, custom1_icon, custom1_color, custom2_label, custom2_icon, custom2_color, updated_at')
      .eq('user_id', user.id)
      .eq('organization_id', activeOrg.organization_id)
      .maybeSingle()

    if (error) {
      console.error('Status fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // ステータスがない場合はデフォルトを作成
    if (!status) {
      const { data: newStatus, error: createError } = await supabase
        .from('user_status')
        .insert({
          user_id: user.id,
          organization_id: activeOrg.organization_id,
          status: 'available',
          custom1_label: DEFAULT_CUSTOM_STATUS.custom1.label,
          custom1_icon: DEFAULT_CUSTOM_STATUS.custom1.icon,
          custom1_color: 'bg-fuchsia-400',
          custom2_label: DEFAULT_CUSTOM_STATUS.custom2.label,
          custom2_icon: DEFAULT_CUSTOM_STATUS.custom2.icon,
          custom2_color: 'bg-purple-400'
        })
        .select('status, custom1_label, custom1_icon, custom1_color, custom2_label, custom2_icon, custom2_color, updated_at')
        .single()

      if (createError) {
        console.error('Status creation error:', createError)
        return NextResponse.json({ error: createError.message }, { status: 500 })
      }

      return NextResponse.json({ status: newStatus }, { status: 200 })
    }

    // 3. 組織のreset_timeを取得
    const { data: orgSettings, error: orgSettingsError } = await supabase
      .from('organizations')
      .select('reset_time')
      .eq('id', activeOrg.organization_id)
      .single()

    if (orgSettingsError) {
      console.error('Org settings fetch error:', orgSettingsError)
    }

    const resetHour = orgSettings?.reset_time ?? 0 // デフォルトは0時

    // 4. 日付と時刻をチェックして、reset_time以降に更新されていなければ自動リセット
    const now = new Date()
    const jstOffset = 9 * 60 // JST = UTC+9
    const jstNow = new Date(now.getTime() + jstOffset * 60 * 1000)
    
    const updatedAt = new Date(status.updated_at)
    const updatedJST = new Date(updatedAt.getTime() + jstOffset * 60 * 1000)
    
    // 今日のreset_timeの時刻を計算
    const todayResetTime = new Date(jstNow.getFullYear(), jstNow.getMonth(), jstNow.getDate(), resetHour, 0, 0)
    
    // 最終更新が今日のreset_time以前の場合、ステータスをリセット
    const shouldReset = updatedJST < todayResetTime && jstNow >= todayResetTime
    
    if (shouldReset) {
      const { data: resetStatus, error: resetError } = await supabase
        .from('user_status')
        .update({ 
          status: 'available',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('organization_id', activeOrg.organization_id)
        .select('status, custom1_label, custom1_icon, custom1_color, custom2_label, custom2_icon, custom2_color, updated_at')
        .single()

      if (resetError) {
        console.error('Status reset error:', resetError)
        return NextResponse.json({ error: resetError.message }, { status: 500 })
      }

      return NextResponse.json({ status: resetStatus, wasReset: true }, { status: 200 })
    }

    return NextResponse.json({ status, wasReset: false }, { status: 200 })
  } catch (error: any) {
    console.error('Status GET error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ステータス更新（現在アクティブな組織のステータス）
export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || ''
    const user = await getServerUser(cookieHeader)
    if (!user) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
    }

    const { status: newStatus } = await request.json()

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

    // 2. 該当組織のステータスを更新
    const { error } = await supabase
      .from('user_status')
      .update({ 
        status: newStatus, 
        updated_at: new Date().toISOString() 
      })
      .eq('user_id', user.id)
      .eq('organization_id', activeOrg.organization_id)

    if (error) {
      console.error('Status update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Status POST error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

