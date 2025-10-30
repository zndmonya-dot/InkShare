// ========================================
// ステータス関連の型定義
// ========================================

export type PresenceStatus =
  | 'available'      // 話しかけてOK
  | 'busy'           // 取込中
  | 'want-to-talk'   // 誰か雑談しましょう
  | 'want-lunch'     // お昼誘ってください
  | 'need-help'      // 現在困っている
  | 'going-home'     // 定時で帰りたい
  | 'leaving'        // 帰宅
  | 'out'            // 外出中
  | 'custom1'        // カスタム1
  | 'custom2'        // カスタム2

export interface CustomStatus {
  label: string
  icon: string
}

export interface StatusConfig {
  status: PresenceStatus
  label: string
  icon: string
  activeColor: string
  textColor: string
  glowColor: string
}

// ========================================
// ユーザー関連の型定義
// ========================================

export interface User {
  id: string
  email: string
  name: string
  avatarColor: string
  organizationId: string
  role: 'admin' | 'member'
  createdAt: Date
  updatedAt: Date
}

export interface UserStatus {
  id: string
  userId: string
  organizationId: string
  status: PresenceStatus
  customStatus1Label: string
  customStatus1Icon: string
  customStatus2Label: string
  customStatus2Icon: string
  updatedAt: Date
}

// ========================================
// 組織関連の型定義
// ========================================

export type OrganizationType = 'business' | 'personal'

export interface Organization {
  id: string
  name: string
  type: OrganizationType
  inviteCode?: string
  createdAt: Date
  createdBy: string
}

export interface OrganizationInfo {
  id: string
  name: string
  type: OrganizationType
  role: 'admin' | 'member'
  isActive?: boolean
}

export interface UserProfile {
  id: string
  email: string
  name: string
  avatarColor: string
  currentOrganization?: OrganizationInfo
  organizations: OrganizationInfo[]
}

export interface UserStatusData {
  status: PresenceStatus
  custom1_label?: string
  custom1_icon?: string
  custom1_color?: string
  custom2_label?: string
  custom2_icon?: string
  custom2_color?: string
  updated_at?: string
}

// ========================================
// 通知関連の型定義
// ========================================

export type NotificationType = 
  | 'want_to_talk'  // 話しかけたい
  | 'help'          // 助けに行く
  | 'lunch'         // ランチ行きましょう
  | 'chat'          // 雑談しましょう

export type NotificationStatus = 
  | 'pending'   // 返信待ち
  | 'accepted'  // 承諾
  | 'declined'  // 辞退

export interface Notification {
  id: string
  fromUserId: string
  fromUserName: string
  fromUserAvatar: string
  toUserId: string
  organizationId: string
  type: NotificationType
  message?: string
  status: NotificationStatus
  read: boolean
  repliedAt?: Date
  createdAt: Date
  expiresAt: Date
}

// ========================================
// チーム表示用の型定義
// ========================================

export interface TeamMember {
  id: string
  name: string
  status: PresenceStatus
  avatarColor: string
  customStatus1?: CustomStatus
  customStatus2?: CustomStatus
  lastUpdated: Date
}

// ========================================
// プラン関連の型定義
// ========================================

export type PlanType = 'free' | 'pro' | 'enterprise'

export interface PlanLimits {
  maxMembers: number
  customStatusLimit: number
  notificationsEnabled: boolean
  analyticsEnabled: boolean
  apiEnabled: boolean
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    maxMembers: 10,
    customStatusLimit: 2,
    notificationsEnabled: false,
    analyticsEnabled: false,
    apiEnabled: false,
  },
  pro: {
    maxMembers: 50,
    customStatusLimit: Infinity,
    notificationsEnabled: true,
    analyticsEnabled: true,
    apiEnabled: false,
  },
  enterprise: {
    maxMembers: Infinity,
    customStatusLimit: Infinity,
    notificationsEnabled: true,
    analyticsEnabled: true,
    apiEnabled: true,
  },
}

