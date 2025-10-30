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

    // ユーザー情報とステータスを並列取得
    const memberPromises = (userOrgs || []).map(async (uo) => {
      const [userResult, statusResult] = await Promise.all([
        supabase
          .from('users')
          .select('id, name, email, avatar_color')
          .eq('id', uo.user_id)
          .single(),
        supabase
          .from('user_status')
          .select('status, custom1_label, custom1_icon, custom1_color, custom2_label, custom2_icon, custom2_color, updated_at')
          .eq('user_id', uo.user_id)
          .eq('organization_id', profile.currentOrganization.id)
          .maybeSingle()
      ])

      const user = userResult.data
      const status = statusResult.data

      if (user) {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarColor: user.avatar_color,
          role: uo.role,
          status: status?.status || 'available',
          lastUpdated: status?.updated_at || new Date().toISOString(),
          custom1_label: status?.custom1_label,
          custom1_icon: status?.custom1_icon,
          custom1_color: status?.custom1_color,
          custom2_label: status?.custom2_label,
          custom2_icon: status?.custom2_icon,
          custom2_color: status?.custom2_color,
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

