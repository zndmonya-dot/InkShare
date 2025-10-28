import { getSupabaseAdmin } from '@/lib/db'
import { getAuthenticatedUser, errorResponse, successResponse, withErrorHandler } from '@/lib/api-helpers'

// チーム脱退API
export const POST = withErrorHandler(async (request: Request) => {
  const { user, error: authError } = await getAuthenticatedUser(request)
  if (authError) return authError

  const { organizationId } = await request.json()

  if (!organizationId) {
    return errorResponse('組織IDが必要です', 400)
  }

  const supabase = getSupabaseAdmin()

  // 1. 組織のメンバー数を確認
  const { data: members, error: membersError } = await supabase
    .from('user_organizations')
    .select('user_id, role')
    .eq('organization_id', organizationId)

  if (membersError) {
    console.error('Members fetch error:', membersError)
    return errorResponse(membersError.message)
  }

  // 2. 自分が管理者で、かつ唯一の管理者の場合は脱退不可
  const admins = members?.filter(m => m.role === 'admin') || []
  const isOnlyAdmin = admins.length === 1 && admins[0].user_id === user!.id

  if (isOnlyAdmin) {
    return errorResponse('唯一の管理者は脱退できません。別の管理者を指定するか、グループを削除してください。', 400)
  }

  // 3. ユーザーをグループから削除
  const { error: deleteError } = await supabase
    .from('user_organizations')
    .delete()
    .eq('user_id', user!.id)
    .eq('organization_id', organizationId)

  if (deleteError) {
    console.error('Leave organization error:', deleteError)
    return errorResponse(deleteError.message)
  }

  // 4. そのグループのステータスも削除
  await supabase
    .from('user_status')
    .delete()
    .eq('user_id', user!.id)
    .eq('organization_id', organizationId)

  return successResponse()
})

