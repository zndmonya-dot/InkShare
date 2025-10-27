import type { PresenceStatus } from '@/types/status'

export interface StatusOption {
  status: PresenceStatus
  label: string
  icon: string
  activeColor: string
  glowColor: string
}

export const STATUS_OPTIONS: StatusOption[] = [
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

export const CUSTOM_STATUS_COLORS = {
  custom1: {
    activeColor: 'bg-fuchsia-500',
    glowColor: 'shadow-fuchsia-500/50',
  },
  custom2: {
    activeColor: 'bg-purple-500',
    glowColor: 'shadow-purple-500/50',
  },
} as const

