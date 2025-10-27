import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/auth-server'
import { query, queryOne } from '@/lib/db'

// ステータス取得
export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || ''
    const user = await getServerUser(cookieHeader)
    if (!user) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
    }

    const status = await queryOne(
      `SELECT status, custom1_label, custom1_icon, custom2_label, custom2_icon, updated_at
       FROM user_status WHERE user_id = $1`,
      [user.id]
    )

    return NextResponse.json({ status }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ステータス更新
export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || ''
    const user = await getServerUser(cookieHeader)
    if (!user) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
    }

    const { status: newStatus } = await request.json()

    await query(
      `UPDATE user_status SET status = $1, updated_at = NOW()
       WHERE user_id = $2`,
      [newStatus, user.id]
    )

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

