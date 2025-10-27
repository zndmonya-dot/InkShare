import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/auth-server'
import { query, queryOne } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || ''
    const user = await getServerUser(cookieHeader)
    if (!user) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
    }

    const { inviteCode } = await request.json()

    // 組織を検索
    const org = await queryOne<{ id: string; name: string; type: string }>(
      'SELECT id, name, type FROM organizations WHERE invite_code = $1',
      [inviteCode]
    )

    if (!org) {
      return NextResponse.json({ error: '招待コードが無効です' }, { status: 404 })
    }

    // すでに参加しているかチェック
    const existing = await queryOne(
      'SELECT id FROM user_organizations WHERE user_id = $1 AND organization_id = $2',
      [user.id, org.id]
    )

    if (existing) {
      return NextResponse.json({ error: 'すでにこの組織に参加しています' }, { status: 400 })
    }

    // 現在のアクティブな組織を非アクティブに
    await query(
      'UPDATE user_organizations SET is_active = false WHERE user_id = $1',
      [user.id]
    )

    // 組織に参加
    await query(
      `INSERT INTO user_organizations (user_id, organization_id, role, is_active)
       VALUES ($1, $2, $3, $4)`,
      [user.id, org.id, 'member', true]
    )

    return NextResponse.json({ organization: org }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

