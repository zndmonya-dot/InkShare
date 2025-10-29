'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { PresenceStatus } from '@/app/page'

interface Member {
  id: string
  name: string
  status: PresenceStatus
  lastUpdated: string
  avatarColor: string
  custom1_label?: string
  custom1_icon?: string
  custom1_color?: string
  custom2_label?: string
  custom2_icon?: string
  custom2_color?: string
}

const statusConfig: Record<PresenceStatus, {
  label: string
  icon: string
  color: string
  bgColor: string
  glow: string
  inkLight: string
  inkMedium: string
  inkDark: string
}> = {
  available: { 
    label: '話しかけてOK！', 
    icon: 'ri-chat-smile-3-fill', 
    color: 'text-lime-400',
    bgColor: 'bg-lime-400',
    glow: 'shadow-lime-400/50',
    inkLight: 'bg-lime-200',
    inkMedium: 'bg-lime-300',
    inkDark: 'bg-yellow-300'
  },
  busy: { 
    label: '取込中です！', 
    icon: 'ri-stop-circle-fill', 
    color: 'text-red-500',
    bgColor: 'bg-red-500',
    glow: 'shadow-red-500/50',
    inkLight: 'bg-red-300',
    inkMedium: 'bg-red-400',
    inkDark: 'bg-pink-400'
  },
  'want-to-talk': { 
    label: 'はい！', 
    icon: 'ri-emotion-happy-fill', 
    color: 'text-green-500',
    bgColor: 'bg-green-500',
    glow: 'shadow-green-500/50',
    inkLight: 'bg-green-200',
    inkMedium: 'bg-green-300',
    inkDark: 'bg-lime-300'
  },
  'want-lunch': { 
    label: 'お昼いってきます！', 
    icon: 'ri-restaurant-2-fill', 
    color: 'text-orange-400',
    bgColor: 'bg-orange-400',
    glow: 'shadow-orange-400/50',
    inkLight: 'bg-orange-200',
    inkMedium: 'bg-orange-300',
    inkDark: 'bg-yellow-400'
  },
  'need-help': { 
    label: '現在困ってます…', 
    icon: 'ri-error-warning-fill', 
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400',
    glow: 'shadow-yellow-400/50',
    inkLight: 'bg-yellow-200',
    inkMedium: 'bg-yellow-300',
    inkDark: 'bg-amber-300'
  },
  'going-home': { 
    label: '定時で帰ります！', 
    icon: 'ri-logout-circle-fill', 
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-400',
    glow: 'shadow-indigo-400/50',
    inkLight: 'bg-indigo-300',
    inkMedium: 'bg-indigo-400',
    inkDark: 'bg-purple-400'
  },
  'leaving': { 
    label: 'いいえ…', 
    icon: 'ri-emotion-sad-fill', 
    color: 'text-sky-400',
    bgColor: 'bg-sky-400',
    glow: 'shadow-sky-400/50',
    inkLight: 'bg-sky-200',
    inkMedium: 'bg-sky-300',
    inkDark: 'bg-cyan-300'
  },
  'out': { 
    label: '外出中です！', 
    icon: 'ri-footprint-fill', 
    color: 'text-slate-400',
    bgColor: 'bg-slate-400',
    glow: 'shadow-slate-400/50',
    inkLight: 'bg-slate-300',
    inkMedium: 'bg-slate-400',
    inkDark: 'bg-gray-400'
  },
  'custom1': { 
    label: 'カスタム1', 
    icon: 'ri-star-smile-fill', 
    color: 'text-fuchsia-400',
    bgColor: 'bg-fuchsia-400',
    glow: 'shadow-fuchsia-400/50',
    inkLight: 'bg-fuchsia-300',
    inkMedium: 'bg-fuchsia-400',
    inkDark: 'bg-pink-400'
  },
  'custom2': { 
    label: 'カスタム2', 
    icon: 'ri-star-smile-fill', 
    color: 'text-purple-400',
    bgColor: 'bg-purple-400',
    glow: 'shadow-purple-400/50',
    inkLight: 'bg-purple-300',
    inkMedium: 'bg-purple-400',
    inkDark: 'bg-violet-400'
  },
}

export default function TeamPage() {
  const router = useRouter()
  const [filterStatus, setFilterStatus] = useState<PresenceStatus | 'all'>('all')
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  // チェック：最終更新が今日（JST）かどうか
  const isUpdatedToday = (lastUpdated: string) => {
    const now = new Date()
    const jstOffset = 9 * 60 // JST = UTC+9
    const jstNow = new Date(now.getTime() + jstOffset * 60 * 1000)
    const todayJST = new Date(jstNow.getFullYear(), jstNow.getMonth(), jstNow.getDate())
    
    const updated = new Date(lastUpdated)
    const updatedJST = new Date(updated.getTime() + jstOffset * 60 * 1000)
    const updateDateJST = new Date(updatedJST.getFullYear(), updatedJST.getMonth(), updatedJST.getDate())
    
    return updateDateJST >= todayJST
  }

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch('/api/organization/members')
        if (res.ok) {
          const data = await res.json()
          setMembers(data.members || [])
        }
      } catch (error) {
        console.error('Failed to fetch members:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMembers()
  }, [])

  const filteredMembers = filterStatus === 'all' 
    ? members 
    : members.filter(m => m.status === filterStatus)

  return (
    <div className="min-h-screen bg-gradient-to-br from-splat-dark via-ink-blue to-splat-dark overflow-hidden relative">
      {/* 背景のインク - スクロール防止版 */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-ink-yellow ink-blob blur-[100px]"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-ink-cyan ink-blob blur-[100px]" style={{animationDelay: '1.5s'}}></div>
      </div>

      {/* ヘッダー */}
      <header className="relative p-4 flex items-center justify-between border-b border-white/10 sticky top-0 bg-white/5 backdrop-blur-sm z-10">
        <button
          onClick={() => router.back()}
          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all text-sm font-medium border border-white/20"
        >
          <i className="ri-arrow-left-line mr-1"></i>
          戻る
        </button>
        <h1 className="text-xl font-bold text-white">チーム状況</h1>
        <div className="w-16" /> {/* スペーサー */}
      </header>

      {/* フィルター - クリーン版 */}
      <div className="relative sticky top-[73px] bg-white/5 backdrop-blur-sm z-10 p-4 border-b border-white/10">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
              filterStatus === 'all' 
                ? 'bg-white/20 text-white border border-white/30' 
                : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
            }`}
          >
            <i className="ri-group-line mr-1.5"></i>
            全員
          </button>
          {Object.entries(statusConfig).filter(([key]) => !key.startsWith('custom')).map(([key, config]) => {
            const status = key as PresenceStatus
            const isActive = filterStatus === status
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                  isActive
                    ? `${config.bgColor} text-splat-dark border border-splat-dark/20`
                    : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                }`}
              >
                <i className={`${config.icon} mr-1.5`}></i>
                {config.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* メンバーリスト */}
      <main className="p-4 overflow-visible">
        {loading ? (
          <div className="text-center py-20 text-white/70">
            <i className="ri-loader-4-line text-6xl mb-4 animate-spin"></i>
            <p className="text-lg">読み込み中...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <i className="ri-user-search-line text-6xl mb-4"></i>
            <p className="text-lg">該当するメンバーがいません</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 overflow-visible">
            {filteredMembers.map((member) => {
              let config = statusConfig[member.status]
              const updatedToday = isUpdatedToday(member.lastUpdated)
              
              // カスタムステータスの場合、メンバー固有の設定を使用
              if (member.status === 'custom1' && member.custom1_label) {
                config = {
                  ...config,
                  label: member.custom1_label,
                  icon: member.custom1_icon || config.icon,
                  color: member.custom1_color ? `text-${member.custom1_color.replace('bg-', '')}` : config.color,
                  bgColor: member.custom1_color || config.bgColor,
                }
              } else if (member.status === 'custom2' && member.custom2_label) {
                config = {
                  ...config,
                  label: member.custom2_label,
                  icon: member.custom2_icon || config.icon,
                  color: member.custom2_color ? `text-${member.custom2_color.replace('bg-', '')}` : config.color,
                  bgColor: member.custom2_color || config.bgColor,
                }
              }
              
              return (
                <button
                  key={member.id}
                  onClick={() => setSelectedMember(member)}
                  className={`relative bg-white/5 border rounded-xl p-4 hover:bg-white/10 transition-all hover:scale-105 active:scale-95 ${
                    updatedToday 
                      ? 'border-white/10 hover:border-white/20' 
                      : 'border-gray-500/30 hover:border-gray-500/50'
                  }`}
                >
                  {/* 未更新バッジ */}
                  {!updatedToday && (
                    <div className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full shadow-lg border border-gray-400 flex items-center gap-1">
                      <i className="ri-time-line"></i>
                      <span>未更新</span>
                    </div>
                  )}
                  
                  {/* アバター */}
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${member.avatarColor} flex items-center justify-center mx-auto mb-3 shadow-lg ${
                    !updatedToday ? 'opacity-50 grayscale' : ''
                  }`}>
                    <span className="text-white font-bold text-xl sm:text-2xl">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  
                  {/* 名前 */}
                  <div className={`font-medium text-sm sm:text-base mb-2 truncate ${
                    updatedToday ? 'text-white' : 'text-gray-400'
                  }`}>
                    {member.name}
                  </div>
                  
                  {/* ステータス */}
                  <div className="flex items-center justify-center gap-1.5">
                    <i className={`${config.icon} text-base ${
                      updatedToday ? config.color : 'text-gray-500'
                    }`}></i>
                    <span className={`text-xs sm:text-sm font-medium ${
                      updatedToday ? config.color : 'text-gray-500'
                    }`}>
                      {config.label}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </main>

      {/* メンバー詳細モーダル */}
      {selectedMember && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* アバター＆ステータス */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${selectedMember.avatarColor} flex items-center justify-center mb-4 shadow-lg`}>
                <span className="text-white font-bold text-4xl">
                  {selectedMember.name.charAt(0)}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{selectedMember.name}</h3>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <i className={`${statusConfig[selectedMember.status].icon} ${statusConfig[selectedMember.status].color} text-xl`}></i>
                <span className={`${statusConfig[selectedMember.status].color} font-medium`}>
                  {statusConfig[selectedMember.status].label}
                </span>
              </div>
            </div>

            {/* 閉じるボタン */}
            <button
              onClick={() => setSelectedMember(null)}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all border border-white/20"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

