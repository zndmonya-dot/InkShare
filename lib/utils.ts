// ========================================
// ユーティリティ関数
// ========================================

import { AVATAR_COLORS, INVITE_CODE_CHARSET, INVITE_CODE_LENGTH } from './constants'

/**
 * ランダムなアバターカラーを取得
 */
export function getRandomAvatarColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
}

/**
 * 招待コードを生成
 */
export function generateInviteCode(): string {
  let code = ''
  for (let i = 0; i < INVITE_CODE_LENGTH; i++) {
    code += INVITE_CODE_CHARSET.charAt(Math.floor(Math.random() * INVITE_CODE_CHARSET.length))
  }
  return code
}

/**
 * APIエラーレスポンスを生成
 */
export function createErrorResponse(message: string, status: number = 500) {
  return Response.json({ error: message }, { status })
}

/**
 * API成功レスポンスを生成
 */
export function createSuccessResponse(data: any, status: number = 200) {
  return Response.json(data, { status })
}

