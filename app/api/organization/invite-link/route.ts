import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/auth-server'
import { getUserProfile } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/db'

export const dynamic = 'force-dynamic'

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

    if (profile.currentOrganization.role !== 'admin') {
      return NextResponse.json({ error: '管理者のみアクセス可能です' }, { status: 403 })
    }

    const supabase = getSupabaseAdmin()

    // 招待コードを取得または生成
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('invite_code')
      .eq('id', profile.currentOrganization.id)
      .single()

    if (orgError) {
      console.error('Organization fetch error:', orgError)
      return NextResponse.json({ error: orgError.message }, { status: 500 })
    }

    let inviteCode = org.invite_code

    if (!inviteCode) {
      // 招待コードを生成
      inviteCode = generateInviteToken()
      const { error: updateError } = await supabase
        .from('organizations')
        .update({ invite_code: inviteCode })
        .eq('id', profile.currentOrganization.id)

      if (updateError) {
        console.error('Invite code update error:', updateError)
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const inviteLink = `${baseUrl}/invite/${inviteCode}`

    return NextResponse.json({ inviteLink }, { status: 200 })
  } catch (error: any) {
    console.error('Invite link error:', error)
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

