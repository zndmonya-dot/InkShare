import { PresenceStatus, StatusConfig, NotificationType } from '@/types'

// ========================================
// ステータス設定（全画面共通）
// ========================================

export const STATUS_OPTIONS: StatusConfig[] = [
  {
    status: 'available',
    label: '話しかけてOK',
    icon: 'ri-checkbox-circle-line',
    activeColor: 'bg-lime-400',
    glowColor: 'shadow-lime-400/50',
  },
  {
    status: 'busy',
    label: '取込中',
    icon: 'ri-focus-3-line',
    activeColor: 'bg-rose-500',
    glowColor: 'shadow-rose-500/50',
  },
  {
    status: 'want-to-talk',
    label: '誰か雑談しましょう',
    icon: 'ri-chat-3-line',
    activeColor: 'bg-cyan-400',
    glowColor: 'shadow-cyan-400/50',
  },
  {
    status: 'want-lunch',
    label: 'お昼誘ってください',
    icon: 'ri-restaurant-line',
    activeColor: 'bg-orange-400',
    glowColor: 'shadow-orange-400/50',
  },
  {
    status: 'need-help',
    label: '現在困っている',
    icon: 'ri-emotion-unhappy-line',
    activeColor: 'bg-yellow-400',
    glowColor: 'shadow-yellow-400/50',
  },
  {
    status: 'going-home',
    label: '定時で帰りたい',
    icon: 'ri-time-line',
    activeColor: 'bg-blue-500',
    glowColor: 'shadow-blue-500/50',
  },
  {
    status: 'leaving',
    label: '帰宅',
    icon: 'ri-home-heart-line',
    activeColor: 'bg-teal-400',
    glowColor: 'shadow-teal-400/50',
  },
  {
    status: 'out',
    label: '外出中',
    icon: 'ri-walk-line',
    activeColor: 'bg-slate-500',
    glowColor: 'shadow-slate-500/50',
  },
]

// ========================================
// カスタムステータスの設定
// ========================================

export const CUSTOM_STATUS_CONFIG = {
  custom1: {
    defaultLabel: 'カスタム1',
    defaultIcon: 'ri-star-line',
    activeColor: 'bg-fuchsia-500',
    glowColor: 'shadow-fuchsia-500/50',
  },
  custom2: {
    defaultLabel: 'カスタム2',
    defaultIcon: 'ri-star-line',
    activeColor: 'bg-purple-500',
    glowColor: 'shadow-purple-500/50',
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
    request: 'ランチ行きましょう',
    accepted: 'がランチOKしました！',
    declined: 'は今回は難しいようです',
    buttonText: 'ランチ行きましょう',
    buttonColor: 'bg-orange-500 hover:bg-orange-400',
    icon: 'ri-restaurant-line',
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

