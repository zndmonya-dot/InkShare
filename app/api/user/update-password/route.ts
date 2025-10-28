import { createClient } from '@/lib/supabase'
import { getAuthenticatedUser, errorResponse, successResponse, withErrorHandler } from '@/lib/api-helpers'

export const POST = withErrorHandler(async (request: Request) => {
  const { user, error: authError } = await getAuthenticatedUser(request)
  if (authError) return authError

  const { currentPassword, newPassword } = await request.json()

  if (!currentPassword || !newPassword) {
    return errorResponse('パスワードを入力してください', 400)
  }

  if (newPassword.length < 6) {
    return errorResponse('新しいパスワードは6文字以上である必要があります', 400)
  }

  // クライアント側のSupabaseインスタンスでパスワード更新
  const supabase = createClient()

  // 現在のパスワードで再認証
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user!.email,
    password: currentPassword,
  })

  if (signInError) {
    return errorResponse('現在のパスワードが正しくありません', 401)
  }

  // パスワード更新
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (updateError) {
    console.error('Password update error:', updateError)
    return errorResponse(updateError.message)
  }

  return successResponse()
})

