import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { query } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
    }

    const { type, label, icon } = await request.json()

    if (type === 'custom1') {
      await query(
        `UPDATE user_status SET custom1_label = $1, custom1_icon = $2, updated_at = NOW()
         WHERE user_id = $3`,
        [label, icon, user.id]
      )
    } else if (type === 'custom2') {
      await query(
        `UPDATE user_status SET custom2_label = $1, custom2_icon = $2, updated_at = NOW()
         WHERE user_id = $3`,
        [label, icon, user.id]
      )
    } else {
      return NextResponse.json({ error: '無効なカスタムタイプです' }, { status: 400 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

