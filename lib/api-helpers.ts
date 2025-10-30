// ========================================
// API Route用の共通ヘルパー関数
// ========================================

import { NextResponse } from 'next/server'
import { getServerUser } from './auth-server'
import { getSupabaseAdmin } from './db'

/**
 * 認証済みユーザーを取得（APIルート用）
 * ログインしていない場合は401エラーを返す
 */
export async function getAuthenticatedUser(request: Request) {
  const cookieHeader = request.headers.get('cookie') || ''
  const user = await getServerUser(cookieHeader)
  
  if (!user) {
    return {
      user: null,
      error: NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
    }
  }
  
  return { user, error: null }
}

/**
 * アクティブな組織を取得
 * 組織がない場合はnullを返す
 */
export async function getActiveOrganization(userId: string) {
  const supabase = getSupabaseAdmin()
  
  const { data, error } = await supabase
    .from('user_organizations')
    .select('organization_id')
    .eq('user_id', userId)
    .eq('is_active', true)
    .maybeSingle()
  
  if (error) {
    console.error('Active org fetch error:', error)
    return {
      organizationId: null,
      error: NextResponse.json({ error: error.message }, { status: 500 })
    }
  }
  
  return {
    organizationId: data?.organization_id || null,
    error: null
  }
}

/**
 * エラーレスポンスを生成
 */
export function errorResponse(message: string, status: number = 500) {
  return NextResponse.json({ error: message }, { status })
}

/**
 * 成功レスポンスを生成
 */
export function successResponse(data: unknown = { success: true }, status: number = 200) {
  return NextResponse.json(data, { status })
}

/**
 * エラーメッセージを取得
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return '予期しないエラーが発生しました'
}

/**
 * try-catchでラップされたAPIハンドラー
 */
export function withErrorHandler(
  handler: (request: Request, ...args: unknown[]) => Promise<Response>
) {
  return async (request: Request, ...args: unknown[]): Promise<Response> => {
    try {
      return await handler(request, ...args)
    } catch (error) {
      console.error('API error:', error)
      return errorResponse(getErrorMessage(error))
    }
  }
}

