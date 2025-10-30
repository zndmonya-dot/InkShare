import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/auth-server'
import { getUserProfile } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/db'

export const dynamic = 'force-dynamic'

// ステータス初期化時刻を取得
export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || ''
    const user = await getServerUser(cookieHeader)
    
    if (!user) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
    }

    const profile = await getUserProfile(user.id)
    if (!profile || !profile.currentOrganization) {
      return NextResponse.json({ error: '組織が見つかりません' }, { status: 404 })
    }

    const supabase = getSupabaseAdmin()
    const { data: org, error } = await supabase
      .from('organizations')
      .select('reset_time')
      .eq('id', profile.currentOrganization.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ resetTime: org.reset_time ?? 0 }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : '予期しないエラーが発生しました'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// ステータス初期化時刻を更新
export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || ''
    const user = await getServerUser(cookieHeader)
    
    if (!user) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
    }

    const profile = await getUserProfile(user.id)
    if (!profile || !profile.currentOrganization) {
      return NextResponse.json({ error: '組織が見つかりません' }, { status: 404 })
    }

    const { resetTime } = await request.json()

    if (typeof resetTime !== 'number' || resetTime < 0 || resetTime > 23) {
      return NextResponse.json({ error: '時刻は0-23の範囲で指定してください' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const { error } = await supabase
      .from('organizations')
      .update({ reset_time: resetTime })
      .eq('id', profile.currentOrganization.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, resetTime }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : '予期しないエラーが発生しました'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

