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
    // デバッグ：全てのヘッダーを表示
    console.log('📨 Request headers:')
    request.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`)
    })
    
    // リクエストからクッキーを取得
    const cookieHeader = request.headers.get('cookie') || ''
    console.log('🍪 Raw cookie header:', cookieHeader)
    
    const user = await getServerUser(cookieHeader)
    if (!user) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
    }

    const { groupName } = await request.json()

    if (!groupName) {
      return NextResponse.json({ error: 'グループ名を入力してください' }, { status: 400 })
    }

    // グループ（個人向け組織）を作成
    const inviteCode = generateInviteCode()
    const orgResult = await queryOne<{ id: string }>(
      'INSERT INTO organizations (name, type, plan, invite_code, is_open) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [groupName, 'personal', 'free', inviteCode, true]
    )

    if (!orgResult) {
      return NextResponse.json({ error: 'グループの作成に失敗しました' }, { status: 500 })
    }

    // 現在のアクティブな組織を非アクティブに
    await query(
      'UPDATE user_organizations SET is_active = false WHERE user_id = $1',
      [user.id]
    )

    // ユーザーをグループに紐づけ（管理者として）
    await query(
      `INSERT INTO user_organizations (user_id, organization_id, role, is_active)
       VALUES ($1, $2, $3, $4)`,
      [user.id, orgResult.id, 'admin', true]
    )

    return NextResponse.json({ 
      organizationId: orgResult.id,
      inviteCode 
    }, { status: 200 })
  } catch (error: any) {
    console.error('Group creation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

