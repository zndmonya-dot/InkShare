import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { query } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
    }

    const { organizationId } = await request.json()

    // すべての組織を非アクティブに
    await query(
      'UPDATE user_organizations SET is_active = false WHERE user_id = $1',
      [user.id]
    )

    // 指定された組織をアクティブに
    await query(
      'UPDATE user_organizations SET is_active = true WHERE user_id = $1 AND organization_id = $2',
      [user.id, organizationId]
    )

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

