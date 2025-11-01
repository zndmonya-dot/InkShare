// ========================================
// アプリケーション全体で使用する定数
// ========================================

/**
 * アバターカラー配列（ランダム選択用）
 */
export const AVATAR_COLORS = [
  'from-lime-400 to-green-500',
  'from-cyan-400 to-blue-500',
  'from-orange-400 to-yellow-500',
  'from-rose-400 to-pink-500',
  'from-purple-400 to-indigo-500',
] as const

/**
 * カスタムステータスのデフォルト値
 */
export const DEFAULT_CUSTOM_STATUS = {
  custom1: {
    label: 'カスタム1',
    icon: 'ri-edit-line',
  },
  custom2: {
    label: 'カスタム2',
    icon: 'ri-edit-line',
  },
  custom3: {
    label: 'カスタム3',
    icon: 'ri-edit-line',
  },
  custom4: {
    label: 'カスタム4',
    icon: 'ri-edit-line',
  },
} as const

/**
 * 招待コード生成用の文字セット（紛らわしい文字を除外）
 */
export const INVITE_CODE_CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

/**
 * 招待コードの長さ
 */
export const INVITE_CODE_LENGTH = 8

