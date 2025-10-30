import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/auth-server'
import { getUserProfile } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/db'

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

    // 組織のメンバー一覧を取得
    const { data: userOrgs, error: orgsError } = await supabase
      .from('user_organizations')
      .select('user_id, role')
      .eq('organization_id', profile.currentOrganization.id)
      .order('role', { ascending: false })

    if (orgsError) {
      return NextResponse.json({ error: orgsError.message }, { status: 500 })
    }

    // ユーザー情報を並列取得
    const memberPromises = (userOrgs || []).map(async (uo) => {
      const { data: user } = await supabase
        .from('users')
        .select('id, name, email, avatar_color')
        .eq('id', uo.user_id)
        .single()

      if (user) {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar_color: user.avatar_color,
          role: uo.role,
        }
      }
      return null
    })

    const memberResults = await Promise.all(memberPromises)
    const members = memberResults.filter((m): m is NonNullable<typeof m> => m !== null)

    return NextResponse.json({ members }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

