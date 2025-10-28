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
                  className="relative bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 transition-all hover:scale-105 active:scale-95"
                >
                  {/* アバター */}
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${member.avatarColor} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                    <span className="text-white font-bold text-xl sm:text-2xl">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  
                  {/* 名前 */}
                  <div className="text-white font-medium text-sm sm:text-base mb-2 truncate">{member.name}</div>
                  
                  {/* ステータス */}
                  <div className="flex items-center justify-center gap-1.5">
                    <i className={`${config.icon} ${config.color} text-base`}></i>
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
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-xl"
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
                  className="w-full py-4 bg-ink-yellow hover:bg-ink-yellow/90 text-splat-dark font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
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
                  className="w-full py-4 bg-ink-yellow hover:bg-ink-yellow/90 text-splat-dark font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
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
                  className="w-full py-4 bg-ink-cyan hover:bg-ink-cyan/90 text-splat-dark font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
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
                  className="w-full py-4 bg-ink-cyan hover:bg-ink-cyan/90 text-splat-dark font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                >
                  <i className="ri-chat-3-line text-2xl"></i>
                  <span>話しかける</span>
                </button>
              )}
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

