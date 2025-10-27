'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { PresenceStatus } from '@/app/page'

interface Member {
  id: string
  name: string
  status: PresenceStatus
  lastUpdated: Date
  avatarColor: string
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
    label: '話しかけてOK', 
    icon: 'ri-checkbox-circle-line', 
    color: 'text-lime-400',
    bgColor: 'bg-lime-400',
    glow: 'shadow-lime-400/50',
    inkLight: 'bg-lime-200',
    inkMedium: 'bg-lime-300',
    inkDark: 'bg-yellow-300'
  },
  busy: { 
    label: '取込中', 
    icon: 'ri-focus-3-line', 
    color: 'text-rose-500',
    bgColor: 'bg-rose-500',
    glow: 'shadow-rose-500/50',
    inkLight: 'bg-rose-300',
    inkMedium: 'bg-rose-400',
    inkDark: 'bg-pink-400'
  },
  'want-to-talk': { 
    label: '誰か雑談しましょう', 
    icon: 'ri-chat-3-line', 
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400',
    glow: 'shadow-cyan-400/50',
    inkLight: 'bg-cyan-200',
    inkMedium: 'bg-cyan-300',
    inkDark: 'bg-blue-300'
  },
  'want-lunch': { 
    label: 'お昼誘ってください', 
    icon: 'ri-restaurant-line', 
    color: 'text-orange-400',
    bgColor: 'bg-orange-400',
    glow: 'shadow-orange-400/50',
    inkLight: 'bg-orange-200',
    inkMedium: 'bg-orange-300',
    inkDark: 'bg-yellow-400'
  },
  'need-help': { 
    label: '現在困っている', 
    icon: 'ri-emotion-unhappy-line', 
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400',
    glow: 'shadow-yellow-400/50',
    inkLight: 'bg-yellow-200',
    inkMedium: 'bg-yellow-300',
    inkDark: 'bg-amber-300'
  },
  'going-home': { 
    label: '定時で帰りたい', 
    icon: 'ri-time-line', 
    color: 'text-blue-500',
    bgColor: 'bg-blue-500',
    glow: 'shadow-blue-500/50',
    inkLight: 'bg-blue-300',
    inkMedium: 'bg-blue-400',
    inkDark: 'bg-sky-400'
  },
  'leaving': { 
    label: '帰宅', 
    icon: 'ri-home-heart-line', 
    color: 'text-teal-400',
    bgColor: 'bg-teal-400',
    glow: 'shadow-teal-400/50',
    inkLight: 'bg-teal-200',
    inkMedium: 'bg-teal-300',
    inkDark: 'bg-cyan-300'
  },
  'out': { 
    label: '外出中', 
    icon: 'ri-walk-line', 
    color: 'text-slate-500',
    bgColor: 'bg-slate-500',
    glow: 'shadow-slate-500/50',
    inkLight: 'bg-slate-300',
    inkMedium: 'bg-slate-400',
    inkDark: 'bg-gray-400'
  },
  'custom1': { 
    label: 'カスタム1', 
    icon: 'ri-edit-line', 
    color: 'text-fuchsia-500',
    bgColor: 'bg-fuchsia-500',
    glow: 'shadow-fuchsia-500/50',
    inkLight: 'bg-fuchsia-300',
    inkMedium: 'bg-fuchsia-400',
    inkDark: 'bg-pink-400'
  },
  'custom2': { 
    label: 'カスタム2', 
    icon: 'ri-edit-line', 
    color: 'text-purple-500',
    bgColor: 'bg-purple-500',
    glow: 'shadow-purple-500/50',
    inkLight: 'bg-purple-300',
    inkMedium: 'bg-purple-400',
    inkDark: 'bg-violet-400'
  },
}

export default function TeamPage() {
  const router = useRouter()
  const [filterStatus, setFilterStatus] = useState<PresenceStatus | 'all'>('all')
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  // サンプルデータ（後でLocalStorageやバックエンドと連携）
  const members: Member[] = [
    { id: '1', name: '山田太郎', status: 'available', lastUpdated: new Date(), avatarColor: 'from-lime-400 to-green-500' },
    { id: '2', name: '佐藤花子', status: 'busy', lastUpdated: new Date(), avatarColor: 'from-rose-400 to-pink-500' },
    { id: '3', name: '鈴木次郎', status: 'want-lunch', lastUpdated: new Date(), avatarColor: 'from-orange-400 to-yellow-500' },
    { id: '4', name: '田中美咲', status: 'want-to-talk', lastUpdated: new Date(), avatarColor: 'from-cyan-400 to-blue-500' },
    { id: '5', name: '高橋健太', status: 'need-help', lastUpdated: new Date(), avatarColor: 'from-yellow-400 to-amber-500' },
    { id: '6', name: '伊藤優子', status: 'going-home', lastUpdated: new Date(), avatarColor: 'from-blue-400 to-indigo-500' },
    { id: '7', name: '渡辺誠', status: 'out', lastUpdated: new Date(), avatarColor: 'from-slate-400 to-gray-500' },
    { id: '8', name: '中村結衣', status: 'leaving', lastUpdated: new Date(), avatarColor: 'from-teal-400 to-cyan-500' },
  ]

  const filteredMembers = filterStatus === 'all' 
    ? members 
    : members.filter(m => m.status === filterStatus)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black overflow-x-hidden">
      {/* ヘッダー */}
      <header className="p-4 flex items-center justify-between border-b border-white/10 sticky top-0 bg-black/50 backdrop-blur-lg z-10 overflow-visible">
        <button
          onClick={() => router.back()}
          className="relative px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black rounded-xl transition-all active:scale-95 text-sm font-bold shadow-[0_0_20px_rgba(34,211,238,0.5)] overflow-visible group"
        >
          {/* インク飛び散りエフェクト - 強化版 */}
          <div className="absolute -top-2 -left-3 w-4 h-4 rounded-full bg-cyan-300 opacity-60 ink-splash"></div>
          <div className="absolute -bottom-2 -right-2 w-3 h-3 rounded-full bg-cyan-500 opacity-50 ink-drip"></div>
          <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-blue-300 opacity-40 ink-pulse"></div>
          <div className="absolute -top-1 right-1/3 w-2 h-2 rounded-full bg-cyan-200 opacity-50 ink-float"></div>
          <div className="absolute bottom-1 -left-1 w-1.5 h-1.5 rounded-full bg-blue-400 opacity-60 ink-drip" style={{ animationDelay: '0.2s' }}></div>
          
          <span className="relative z-10 splatoon-glow">
            <i className="ri-arrow-left-line mr-1"></i>
            戻る
          </span>
        </button>
        <h1 className="text-xl font-bold text-white drop-shadow-[0_2px_8px_rgba(34,211,238,0.5)]">チーム状況</h1>
        <div className="w-16" /> {/* スペーサー */}
      </header>

      {/* フィルター */}
      <div className="sticky top-[73px] bg-black/50 backdrop-blur-lg z-10 p-4 border-b border-white/10 overflow-visible">
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide overflow-y-visible">
          <button
            onClick={() => setFilterStatus('all')}
            className={`relative px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all overflow-visible ${
              filterStatus === 'all' 
                ? 'bg-white text-black scale-105 shadow-[0_0_20px_rgba(255,255,255,0.4)]' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {filterStatus === 'all' && (
              <>
                <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-gray-300 opacity-60 ink-splash"></div>
                <div className="absolute -bottom-2 -left-2 w-2 h-2 rounded-full bg-gray-400 opacity-50 ink-drip"></div>
                <div className="absolute top-0 -right-1 w-1.5 h-1.5 rounded-full bg-white opacity-70 ink-pulse"></div>
                <div className="absolute -bottom-1 right-1/4 w-1 h-1 rounded-full bg-gray-300 opacity-50 ink-float"></div>
              </>
            )}
            <span className="relative z-10">
              <i className="ri-group-line text-lg mr-1.5"></i>
              全員
            </span>
          </button>
          {Object.entries(statusConfig).filter(([key]) => !key.startsWith('custom')).map(([key, config]) => {
            const status = key as PresenceStatus
            const isActive = filterStatus === status
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`relative px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all overflow-visible ${
                  isActive
                    ? `${config.bgColor} text-black scale-105 shadow-[0_0_20px] ${config.glow}`
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {isActive && (
                  <>
                    {/* カラフルなインク飛び散り */}
                    <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full ${config.inkLight} opacity-70 ink-splash`}></div>
                    <div className={`absolute -bottom-2 -left-2 w-3 h-3 rounded-full ${config.inkMedium} opacity-60 ink-drip`}></div>
                    <div className={`absolute top-0 left-1/4 w-2 h-2 rounded-full ${config.inkDark} opacity-50 ink-pulse`}></div>
                    <div className={`absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full ${config.inkLight} opacity-65 ink-float`}></div>
                    <div className={`absolute bottom-0 -right-1 w-1.5 h-1.5 rounded-full ${config.inkMedium} opacity-75 ink-drip`} style={{ animationDelay: '0.2s' }}></div>
                    <div className={`absolute -bottom-1 right-1/3 w-2 h-2 rounded-full ${config.inkDark} opacity-55 ink-splash`} style={{ animationDelay: '0.4s' }}></div>
                    <div className={`absolute top-1 -right-1 w-1 h-1 rounded-full ${config.inkLight} opacity-80 ink-pulse`} style={{ animationDelay: '0.1s' }}></div>
                  </>
                )}
                <span className="relative z-10">
                  <i className={`${config.icon} text-lg mr-1.5`}></i>
                  {config.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* メンバーリスト */}
      <main className="p-4 overflow-visible">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <i className="ri-user-search-line text-6xl mb-4"></i>
            <p className="text-lg">該当するメンバーがいません</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 overflow-visible">
            {filteredMembers.map((member) => {
              const config = statusConfig[member.status]
              return (
                <button
                  key={member.id}
                  onClick={() => setSelectedMember(member)}
                  className="relative bg-gray-800/60 border-2 border-gray-700/50 rounded-2xl p-4 hover:border-white/30 transition-all hover:scale-105 active:scale-95 group overflow-visible"
                >
                  {/* ホバー時のカラフルなインク飛び散りエフェクト - 強化版 */}
                  <div className={`absolute -top-3 -right-3 w-5 h-5 rounded-full ${config.inkLight} opacity-0 group-hover:opacity-70 transition-all duration-300 blur-md group-hover:ink-splash`}></div>
                  <div className={`absolute -bottom-3 -left-3 w-4 h-4 rounded-full ${config.inkMedium} opacity-0 group-hover:opacity-60 transition-all duration-300 blur-sm group-hover:ink-drip`}></div>
                  <div className={`absolute top-0 right-1/4 w-3 h-3 rounded-full ${config.inkDark} opacity-0 group-hover:opacity-55 transition-all duration-300 group-hover:ink-pulse`}></div>
                  <div className={`absolute -top-2 -left-2 w-3 h-3 rounded-full ${config.inkLight} opacity-0 group-hover:opacity-65 transition-all duration-300 group-hover:ink-float`}></div>
                  <div className={`absolute bottom-1 -right-2 w-2 h-2 rounded-full ${config.inkMedium} opacity-0 group-hover:opacity-75 transition-all duration-300 group-hover:ink-splash`}></div>
                  <div className={`absolute -bottom-1 right-1/3 w-2 h-2 rounded-full ${config.inkDark} opacity-0 group-hover:opacity-50 transition-all duration-300 group-hover:ink-pulse`}></div>
                  <div className={`absolute top-1 -left-1 w-1.5 h-1.5 rounded-full ${config.inkLight} opacity-0 group-hover:opacity-80 transition-all duration-300 group-hover:ink-drip`}></div>
                  <div className={`absolute -top-1 right-1/4 w-1 h-1 rounded-full ${config.inkMedium} opacity-0 group-hover:opacity-70 transition-all duration-300 group-hover:ink-float`}></div>
                  
                  {/* アバター */}
                  <div className={`relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${member.avatarColor} flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px] ${config.glow} group-hover:shadow-[0_0_25px] transition-shadow`}>
                    <span className="text-white font-bold text-xl sm:text-2xl">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  
                  {/* 名前 */}
                  <div className="relative z-10 text-white font-bold text-sm sm:text-base mb-2 truncate">{member.name}</div>
                  
                  {/* ステータス */}
                  <div className="relative z-10 flex items-center justify-center gap-1.5 mb-1">
                    <i className={`${config.icon} ${config.color} text-base sm:text-lg`}></i>
                    <span className={`${config.color} text-xs sm:text-sm font-medium`}>
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
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-gradient-to-br from-gray-900 to-black border-2 border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* アバター＆ステータス */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${selectedMember.avatarColor} flex items-center justify-center flex-shrink-0`}>
                <span className="text-white font-bold text-3xl">
                  {selectedMember.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">{selectedMember.name}</h3>
                <div className="flex items-center gap-2">
                  <i className={`${statusConfig[selectedMember.status].icon} ${statusConfig[selectedMember.status].color} text-xl`}></i>
                  <span className={`${statusConfig[selectedMember.status].color} font-medium`}>
                    {statusConfig[selectedMember.status].label}
                  </span>
                </div>
              </div>
            </div>

            {/* アクションボタン（ステータス別） */}
            <div className="space-y-3 mb-4">
              {/* 帰宅・取込中・外出中・定時で帰りたいの場合はアクションなし */}
              {['leaving', 'busy', 'out', 'going-home'].includes(selectedMember.status) && (
                <div className="text-center py-4 text-gray-400">
                  <i className="ri-time-line text-4xl mb-2"></i>
                  <p className="text-sm">今は連絡を控えましょう</p>
                </div>
              )}

              {/* 困っている → 助けに行くのみ */}
              {selectedMember.status === 'need-help' && (
                <button
                  onClick={() => {
                    alert(`${selectedMember.name}さんに「助けに行きます」通知を送信しました！`)
                    setSelectedMember(null)
                  }}
                  className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                >
                  <i className="ri-emotion-happy-line text-2xl"></i>
                  <span>助けに行きます</span>
                </button>
              )}

              {/* お昼誘って → ランチ行きましょうのみ */}
              {selectedMember.status === 'want-lunch' && (
                <button
                  onClick={() => {
                    alert(`${selectedMember.name}さんに「ランチ行きましょう」通知を送信しました！`)
                    setSelectedMember(null)
                  }}
                  className="w-full py-4 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                >
                  <i className="ri-restaurant-line text-2xl"></i>
                  <span>ランチ行きましょう</span>
                </button>
              )}

              {/* 雑談したい → 雑談しましょうのみ */}
              {selectedMember.status === 'want-to-talk' && (
                <button
                  onClick={() => {
                    alert(`${selectedMember.name}さんに「雑談しましょう」通知を送信しました！`)
                    setSelectedMember(null)
                  }}
                  className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                >
                  <i className="ri-message-3-line text-2xl"></i>
                  <span>雑談しましょう</span>
                </button>
              )}

              {/* その他（available, custom1, custom2）→ 話しかける */}
              {!['leaving', 'busy', 'out', 'going-home', 'need-help', 'want-lunch', 'want-to-talk'].includes(selectedMember.status) && (
                <button
                  onClick={() => {
                    alert(`${selectedMember.name}さんに「話しかけたい」通知を送信しました！`)
                    setSelectedMember(null)
                  }}
                  className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                >
                  <i className="ri-chat-3-line text-2xl"></i>
                  <span>話しかける</span>
                </button>
              )}
            </div>

            {/* 閉じるボタン */}
            <button
              onClick={() => setSelectedMember(null)}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

