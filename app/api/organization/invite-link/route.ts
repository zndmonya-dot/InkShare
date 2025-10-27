import { NextResponse } from 'next/server'
import { getCurrentUser, getUserProfile } from '@/lib/auth'
import { queryOne, query } from '@/lib/db'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
    }

    const profile = await getUserProfile(user.id)
    if (!profile || !profile.currentOrganization) {
      return NextResponse.json({ error: '組織が見つかりません' }, { status: 404 })
    }

    if (profile.currentOrganization.role !== 'admin') {
      return NextResponse.json({ error: '管理者のみアクセス可能です' }, { status: 403 })
    }

    // 招待コードを取得または生成
    let org = await queryOne<{ invite_code: string | null }>(
      'SELECT invite_code FROM organizations WHERE id = $1',
      [profile.currentOrganization.id]
    )

    if (!org || !org.invite_code) {
      // 招待コードを生成
      const inviteCode = generateInviteToken()
      await query(
        'UPDATE organizations SET invite_code = $1 WHERE id = $2',
        [inviteCode, profile.currentOrganization.id]
      )
      org = { invite_code: inviteCode }
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const inviteLink = `${baseUrl}/invite/${org.invite_code}`

    return NextResponse.json({ inviteLink }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function generateInviteToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let token = ''
  for (let i = 0; i < 16; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

