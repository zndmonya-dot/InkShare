import { PresenceStatus, StatusConfig, NotificationType } from '@/types'

// ========================================
// ステータス設定（全画面共通）
// ========================================

export const STATUS_OPTIONS: StatusConfig[] = [
  // 基本ステータス（よく使う）
  {
    status: 'available',
    label: '話しかけてOK！',
    icon: 'ri-chat-smile-3-fill',
    activeColor: 'bg-lime-400',
    glowColor: 'shadow-lime-400/50',
  },
  {
    status: 'busy',
    label: '取込中です！',
    icon: 'ri-stop-circle-fill',
    activeColor: 'bg-red-500',
    glowColor: 'shadow-red-500/50',
  },
  
  // 日常的な離席・帰宅
  {
    status: 'want-lunch',
    label: '会議中です！',
    icon: 'ri-slideshow-fill',
    activeColor: 'bg-blue-500',
    glowColor: 'shadow-blue-500/50',
  },
  {
    status: 'going-home',
    label: '定時で帰ります！',
    icon: 'ri-logout-circle-fill',
    activeColor: 'bg-indigo-400',
    glowColor: 'shadow-indigo-400/50',
  },
  {
    status: 'out',
    label: '外出中です！',
    icon: 'ri-footprint-fill',
    activeColor: 'bg-slate-400',
    glowColor: 'shadow-slate-400/50',
  },
  
  // 特殊な状態
  {
    status: 'need-help',
    label: '現在困ってます…',
    icon: 'ri-error-warning-fill',
    activeColor: 'bg-yellow-400',
    glowColor: 'shadow-yellow-400/50',
  },
  
  // デモ用（質問への回答）
  {
    status: 'want-to-talk',
    label: 'はい！',
    icon: 'ri-emotion-happy-fill',
    activeColor: 'bg-green-500',
    glowColor: 'shadow-green-500/50',
  },
  {
    status: 'leaving',
    label: 'いいえ…',
    icon: 'ri-emotion-sad-fill',
    activeColor: 'bg-sky-400',
    glowColor: 'shadow-sky-400/50',
  },
]

// ========================================
// カスタムステータスの設定
// ========================================

export const CUSTOM_STATUS_CONFIG = {
  custom1: {
    defaultLabel: 'カスタム1',
    defaultIcon: 'ri-star-smile-fill',
    activeColor: 'bg-fuchsia-400',
    glowColor: 'shadow-fuchsia-400/50',
  },
  custom2: {
    defaultLabel: 'カスタム2',
    defaultIcon: 'ri-star-smile-fill',
    activeColor: 'bg-purple-400',
    glowColor: 'shadow-purple-400/50',
  },
}

// ========================================
// ステータス別のアクション制御
// ========================================

// 通知を送信できないステータス（そっとしておく）
export const DO_NOT_DISTURB_STATUSES: PresenceStatus[] = [
  'busy',       // 取込中
  'leaving',    // 帰宅
  'out',        // 外出中
  'going-home', // 定時で帰りたい
]

// ステータスごとの専用アクション
export const STATUS_SPECIFIC_ACTIONS: Partial<Record<PresenceStatus, NotificationType>> = {
  'need-help': 'help',
  'want-lunch': 'lunch',
  'want-to-talk': 'chat',
}

// ========================================
// 通知メッセージの設定
// ========================================

export const NOTIFICATION_MESSAGES = {
  want_to_talk: {
    request: '話しかけたいです',
    accepted: 'が話しかけてOKしました！',
    declined: 'は今は難しいようです',
    buttonText: '話しかける',
    buttonColor: 'bg-cyan-500 hover:bg-cyan-400',
    icon: 'ri-chat-3-line',
  },
  lunch: {
    request: '会議中です',
    accepted: 'が対応可能です',
    declined: 'は現在対応できません',
    buttonText: '確認する',
    buttonColor: 'bg-blue-500 hover:bg-blue-400',
    icon: 'ri-slideshow-line',
  },
  help: {
    request: '助けに行きます',
    accepted: 'が助けを待っています！',
    declined: 'は今は大丈夫なようです',
    buttonText: '助けに行きます',
    buttonColor: 'bg-yellow-500 hover:bg-yellow-400 text-black',
    icon: 'ri-emotion-happy-line',
  },
  chat: {
    request: '雑談しましょう',
    accepted: 'が雑談OKしました！',
    declined: 'は今は難しいようです',
    buttonText: '雑談しましょう',
    buttonColor: 'bg-blue-500 hover:bg-blue-400',
    icon: 'ri-message-3-line',
  },
}

// ========================================
// ヘルパー関数
// ========================================

/**
 * ステータスから設定を取得
 */
export function getStatusConfig(status: PresenceStatus): StatusConfig | null {
  return STATUS_OPTIONS.find(s => s.status === status) || null
}

/**
 * そっとしておくべきステータスかチェック
 */
export function shouldNotDisturb(status: PresenceStatus): boolean {
  return DO_NOT_DISTURB_STATUSES.includes(status)
}

/**
 * ステータス専用のアクションを取得
 */
export function getStatusAction(status: PresenceStatus): NotificationType | null {
  return STATUS_SPECIFIC_ACTIONS[status] || null
}

