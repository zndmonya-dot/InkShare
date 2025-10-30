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

  // ユーザーをグループから削除
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

