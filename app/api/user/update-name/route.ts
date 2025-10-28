import { getSupabaseAdmin } from '@/lib/db'
import { getAuthenticatedUser, errorResponse, successResponse, withErrorHandler } from '@/lib/api-helpers'

export const POST = withErrorHandler(async (request: Request) => {
  const { user, error: authError } = await getAuthenticatedUser(request)
  if (authError) return authError

  const { name } = await request.json()

  if (!name || !name.trim()) {
    return errorResponse('表示名を入力してください', 400)
  }

  const supabase = getSupabaseAdmin()

  const { error } = await supabase
    .from('users')
    .update({ name: name.trim() })
    .eq('id', user!.id)

  if (error) {
    console.error('Name update error:', error)
    return errorResponse(error.message)
  }

  return successResponse()
})

