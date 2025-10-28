import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/auth-server'
import { query, queryOne } from '@/lib/db'

// 招待コード生成関数
function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // 紛らわしい文字を除外
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || ''
    const user = await getServerUser(cookieHeader)
    
    if (!user) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
    }

    const { groupName, type } = await request.json()

    if (!groupName) {
      return NextResponse.json({ error: '名前を入力してください' }, { status: 400 })
    }

    const organizationType = type === 'business' ? 'business' : 'personal'
    const isPersonal = organizationType === 'personal'

    // 組織を作成
    let inviteCode: string | null = null
    if (isPersonal) {
      // 個人グループは招待コードを生成
      inviteCode = generateInviteCode()
    }

    const orgResult = await queryOne<{ id: string }>(
      'INSERT INTO organizations (name, type, plan, invite_code, is_open) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [groupName, organizationType, 'free', inviteCode, isPersonal]
    )

    if (!orgResult) {
      return NextResponse.json({ error: '作成に失敗しました' }, { status: 500 })
    }

    // 現在のアクティブな組織を非アクティブに
    await query(
      'UPDATE user_organizations SET is_active = false WHERE user_id = $1',
      [user.id]
    )

    // ユーザーを組織に紐づけ（管理者として）
    await query(
      `INSERT INTO user_organizations (user_id, organization_id, role, is_active)
       VALUES ($1, $2, $3, $4)`,
      [user.id, orgResult.id, 'admin', true]
    )

    return NextResponse.json({ 
      organizationId: orgResult.id,
      inviteCode: inviteCode 
    }, { status: 200 })
  } catch (error: any) {
    console.error('Organization creation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

