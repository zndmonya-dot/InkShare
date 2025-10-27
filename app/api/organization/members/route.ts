import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/auth-server'
import { getUserProfile } from '@/lib/auth'
import { query } from '@/lib/db'

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

    // 組織のメンバー一覧を取得
    const members = await query<{
      id: string
      name: string
      email: string
      avatar_color: string
      role: 'admin' | 'member'
    }>(
      `SELECT u.id, u.name, u.email, u.avatar_color, uo.role
       FROM users u
       JOIN user_organizations uo ON u.id = uo.user_id
       WHERE uo.organization_id = $1
       ORDER BY uo.role DESC, u.name ASC`,
      [profile.currentOrganization.id]
    )

    return NextResponse.json({ members }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

