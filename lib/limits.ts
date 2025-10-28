// マネタイズ制限設定

export const LIMITS = {
  FREE_PLAN: {
    MAX_MEMBERS_PER_TEAM: 10,      // 1チーム10人まで
    MAX_TEAMS_PER_USER: 5,         // 1アカウント5チームまで
  },
}

// チームのメンバー数をチェック
export async function checkTeamMemberLimit(organizationId: string): Promise<{ allowed: boolean; currentCount: number }> {
  const { getSupabaseAdmin } = await import('./db')
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('user_organizations')
    .select('user_id')
    .eq('organization_id', organizationId)

  if (error) {
    console.error('Member count check error:', error)
    return { allowed: false, currentCount: 0 }
  }

  const currentCount = data?.length || 0
  return {
    allowed: currentCount < LIMITS.FREE_PLAN.MAX_MEMBERS_PER_TEAM,
    currentCount,
  }
}

// ユーザーのチーム数をチェック
export async function checkUserTeamLimit(userId: string): Promise<{ allowed: boolean; currentCount: number }> {
  const { getSupabaseAdmin } = await import('./db')
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('user_organizations')
    .select('organization_id')
    .eq('user_id', userId)

  if (error) {
    console.error('Team count check error:', error)
    return { allowed: false, currentCount: 0 }
  }

  // ユニークな組織IDの数を数える
  const uniqueOrgIds = new Set(data?.map(uo => uo.organization_id) || [])
  const currentCount = uniqueOrgIds.size

  return {
    allowed: currentCount < LIMITS.FREE_PLAN.MAX_TEAMS_PER_USER,
    currentCount,
  }
}

