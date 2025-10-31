'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { PresenceStatus } from '@/types'
import { STATUS_OPTIONS, CUSTOM_STATUS_CONFIG } from '@/config/status'

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

// config/status.tsからステータス設定を動的に生成
const createStatusConfig = () => {
  const config: Record<PresenceStatus, {
    label: string
    icon: string
    color: string
    bgColor: string
    glow: string
  }> = {} as any

  // プリセットステータス
  STATUS_OPTIONS.forEach(option => {
    config[option.status] = {
      label: option.label,
      icon: option.icon,
      color: option.textColor,
      bgColor: option.activeColor,
      glow: option.glowColor,
    }
  })

  // カスタムステータス
  config['custom1'] = {
    label: CUSTOM_STATUS_CONFIG.custom1.defaultLabel,
    icon: CUSTOM_STATUS_CONFIG.custom1.defaultIcon,
    color: CUSTOM_STATUS_CONFIG.custom1.textColor,
    bgColor: CUSTOM_STATUS_CONFIG.custom1.activeColor,
    glow: CUSTOM_STATUS_CONFIG.custom1.glowColor,
  }
  config['custom2'] = {
    label: CUSTOM_STATUS_CONFIG.custom2.defaultLabel,
    icon: CUSTOM_STATUS_CONFIG.custom2.defaultIcon,
    color: CUSTOM_STATUS_CONFIG.custom2.textColor,
    bgColor: CUSTOM_STATUS_CONFIG.custom2.activeColor,
    glow: CUSTOM_STATUS_CONFIG.custom2.glowColor,
  }

  return config
}

const statusConfig = createStatusConfig()

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

  // 最終更新時刻をフォーマット
  const formatLastUpdated = (isoString: string) => {
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60))
        if (diffMinutes === 0) {
          const diffSeconds = Math.floor(diffMs / 1000)
          return diffSeconds < 10 ? '今' : `${diffSeconds}秒前`
        }
        return `${diffMinutes}分前`
      }
      return `${diffHours}時間前`
    } else if (diffDays === 1) {
      return '昨日'
    } else {
      return `${diffDays}日前`
    }
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
            style={{
              transition: 'all 0.35s cubic-bezier(0.3, 0, 0.1, 1)',
              willChange: 'background-color, border-color, transform'
            }}
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
                style={{
                  transition: 'all 0.35s cubic-bezier(0.3, 0, 0.1, 1)',
                  willChange: 'background-color, border-color, transform'
                }}
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
          <div className="text-center py-20">
            <div className="relative w-24 h-24 mx-auto mb-6">
              {/* 外側のリング */}
              <div className="absolute inset-0 rounded-full border-4 border-ink-yellow/30"></div>
              {/* 回転するインク */}
              <div className="absolute inset-0 ink-spinner">
                <div className="w-full h-full rounded-full border-4 border-transparent border-t-ink-yellow border-r-ink-yellow"></div>
              </div>
              {/* 中央のロゴ */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-ink-yellow rounded-full flex items-center justify-center ink-pulse-ring">
                  <i className="ri-paint-brush-fill text-2xl text-splat-dark"></i>
                </div>
              </div>
            </div>
            <p className="text-white/70 text-lg font-medium">読み込み中...</p>
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
              
              // configが存在しない場合のデフォルト値
              if (!config) {
                config = {
                  label: 'ステータス不明',
                  icon: 'ri-question-line',
                  color: 'text-gray-400',
                  bgColor: 'bg-gray-500',
                  glow: 'shadow-gray-500/50',
                }
              }
              
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
                  
                  {/* 左上：名前と時間 */}
                  <div className="absolute top-3 left-3 text-left">
                    <div className={`font-medium text-xs sm:text-sm mb-0.5 truncate max-w-[calc(100%-1rem)] ${
                      updatedToday ? 'text-white' : 'text-gray-400'
                    }`}>
                      {member.name}
                    </div>
                    <div className={`text-xs truncate ${
                      updatedToday ? 'text-white/50' : 'text-gray-500'
                    }`}>
                      {formatLastUpdated(member.lastUpdated)}
                    </div>
                  </div>
                  
                  {/* アバター（ステータスの色で表示） */}
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full ${config.bgColor} flex items-center justify-center mx-auto mb-3 shadow-lg transition-all ${
                    !updatedToday ? 'opacity-50 grayscale' : 'shadow-xl'
                  }`} style={{ marginTop: '2.5rem' }}>
                    <span className="text-white font-bold text-xl sm:text-2xl drop-shadow-lg">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  
                  {/* ステータス */}
                  <div className="flex items-center justify-center gap-1.5">
                    <i className={`${config.icon} text-base ${
                      updatedToday ? config.color : 'text-gray-500'
                    }`}></i>
                    <span className={`text-xs sm:text-sm font-bold ${
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
      {selectedMember && (() => {
        let modalConfig = statusConfig[selectedMember.status]
        
        // modalConfigが存在しない場合のデフォルト値
        if (!modalConfig) {
          modalConfig = {
            label: 'ステータス不明',
            icon: 'ri-question-line',
            color: 'text-gray-400',
            bgColor: 'bg-gray-500',
            glow: 'shadow-gray-500/50',
          }
        }
        
        // カスタムステータスの場合、メンバー固有の設定を使用
        if (selectedMember.status === 'custom1' && selectedMember.custom1_label) {
          modalConfig = {
            ...modalConfig,
            label: selectedMember.custom1_label,
            icon: selectedMember.custom1_icon || modalConfig.icon,
            color: selectedMember.custom1_color ? selectedMember.custom1_color.replace('bg-', 'text-') : modalConfig.color,
            bgColor: selectedMember.custom1_color || modalConfig.bgColor,
          }
        } else if (selectedMember.status === 'custom2' && selectedMember.custom2_label) {
          modalConfig = {
            ...modalConfig,
            label: selectedMember.custom2_label,
            icon: selectedMember.custom2_icon || modalConfig.icon,
            color: selectedMember.custom2_color ? selectedMember.custom2_color.replace('bg-', 'text-') : modalConfig.color,
            bgColor: selectedMember.custom2_color || modalConfig.bgColor,
          }
        }
        
        return (
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
                <div className={`w-24 h-24 rounded-full ${modalConfig.bgColor} flex items-center justify-center mb-4 shadow-2xl`}>
                  <span className="text-white font-bold text-4xl drop-shadow-lg">
                    {selectedMember.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{selectedMember.name}</h3>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                  <i className={`${modalConfig.icon} ${modalConfig.color} text-xl`}></i>
                  <span className={`${modalConfig.color} font-medium`}>
                    {modalConfig.label}
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
        )
      })()}
    </div>
  )
}

