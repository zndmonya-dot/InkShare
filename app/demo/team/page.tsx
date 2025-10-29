'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// 組織ごとのメンバーデータ
const DEMO_TEAMS = {
  '1': { // 開発チーム
    name: '開発チーム',
    members: [
      { name: '山田太郎', status: 'available', lastUpdated: new Date(Date.now() - 5 * 60 * 1000).toISOString() }, // 5分前
      { name: '佐藤花子', status: 'busy', lastUpdated: new Date(Date.now() - 2 * 60 * 1000).toISOString() }, // 2分前
      { name: '鈴木次郎', status: 'want-lunch', lastUpdated: new Date(Date.now() - 15 * 60 * 1000).toISOString() }, // 15分前
      { name: '田中美咲', status: 'available', lastUpdated: new Date(Date.now() - 30 * 60 * 1000).toISOString() }, // 30分前
      { name: '高橋健太', status: 'out', lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() }, // 2時間前
      { name: '伊藤優子', status: 'going-home', lastUpdated: new Date(Date.now() - 45 * 60 * 1000).toISOString() }, // 45分前
      { name: '渡辺誠', status: 'available', lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() }, // 昨日（未更新）
      { name: '中村結衣', status: 'busy', lastUpdated: new Date(Date.now() - 1 * 60 * 1000).toISOString() }, // 1分前
    ]
  },
  '2': { // デザインチーム
    name: 'デザインチーム',
    members: [
      { name: '加藤愛美', status: 'available', lastUpdated: new Date(Date.now() - 5 * 60 * 1000).toISOString() }, // 5分前
      { name: '小林優斗', status: 'busy', lastUpdated: new Date(Date.now() - 10 * 60 * 1000).toISOString() }, // 10分前
      { name: '山本さくら', status: 'want-lunch', lastUpdated: new Date(Date.now() - 20 * 60 * 1000).toISOString() }, // 20分前
      { name: '森田大輔', status: 'going-home', lastUpdated: new Date(Date.now() - 30 * 60 * 1000).toISOString() }, // 30分前
    ]
  },
  '3': { // 営業チーム
    name: '営業チーム',
    members: [
      { name: '松本健一', status: 'available', lastUpdated: new Date(Date.now() - 3 * 60 * 1000).toISOString() }, // 3分前
      { name: '井上麻衣', status: 'out', lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() }, // 2時間前
      { name: '木村雄一', status: 'busy', lastUpdated: new Date(Date.now() - 8 * 60 * 1000).toISOString() }, // 8分前
      { name: '斉藤なつみ', status: 'want-lunch', lastUpdated: new Date(Date.now() - 25 * 60 * 1000).toISOString() }, // 25分前
      { name: '清水直樹', status: 'available', lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() }, // 昨日（未更新）
      { name: '前田真理子', status: 'going-home', lastUpdated: new Date(Date.now() - 50 * 60 * 1000).toISOString() }, // 50分前
    ]
  }
}

// デモ用のメンバーデータ（自分のステータスは動的に変更）
const getInitialMembers = (myStatus: string = 'available', orgId: string = '1') => {
  const team = DEMO_TEAMS[orgId as keyof typeof DEMO_TEAMS] || DEMO_TEAMS['1']
  return [
    { 
      id: '0', 
      name: 'デモユーザー', 
      status: myStatus,
      lastUpdated: new Date().toISOString(),
      isMe: true
    },
    ...team.members.map((member, index) => ({
      id: `${index + 1}`,
      name: member.name,
      status: member.status,
      lastUpdated: member.lastUpdated,
      isMe: false
    }))
  ]
}

const statusConfig: Record<string, {
  label: string
  icon: string
  color: string
  bgColor: string
  avatarColor: string
}> = {
  available: { label: '話しかけてOK！', icon: 'ri-chat-smile-3-fill', color: 'text-lime-400', bgColor: 'bg-lime-400', avatarColor: 'from-lime-400 to-green-500' },
  busy: { label: '取込中です！', icon: 'ri-stop-circle-fill', color: 'text-red-500', bgColor: 'bg-red-500', avatarColor: 'from-red-500 to-rose-500' },
  'want-to-talk': { label: 'はい！', icon: 'ri-emotion-happy-fill', color: 'text-green-500', bgColor: 'bg-green-500', avatarColor: 'from-green-500 to-emerald-500' },
  'want-lunch': { label: 'お昼いってきます！', icon: 'ri-restaurant-2-fill', color: 'text-orange-400', bgColor: 'bg-orange-400', avatarColor: 'from-orange-400 to-yellow-500' },
  'need-help': { label: '現在困ってます…', icon: 'ri-error-warning-fill', color: 'text-yellow-400', bgColor: 'bg-yellow-400', avatarColor: 'from-yellow-400 to-amber-500' },
  'going-home': { label: '定時で帰ります！', icon: 'ri-logout-circle-fill', color: 'text-indigo-400', bgColor: 'bg-indigo-400', avatarColor: 'from-indigo-400 to-purple-500' },
  'leaving': { label: 'いいえ…', icon: 'ri-emotion-sad-fill', color: 'text-sky-400', bgColor: 'bg-sky-400', avatarColor: 'from-sky-400 to-blue-500' },
  'out': { label: '外出中です！', icon: 'ri-footprint-fill', color: 'text-slate-400', bgColor: 'bg-slate-400', avatarColor: 'from-slate-400 to-gray-500' },
  'custom1': { label: 'カスタム1', icon: 'ri-star-smile-fill', color: 'text-fuchsia-400', bgColor: 'bg-fuchsia-400', avatarColor: 'from-fuchsia-400 to-pink-500' },
  'custom2': { label: 'カスタム2', icon: 'ri-star-smile-fill', color: 'text-purple-400', bgColor: 'bg-purple-400', avatarColor: 'from-purple-400 to-violet-500' },
}

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

// デモ用の組織データ（メインページと同じ）
const DEMO_ORGANIZATIONS = [
  { id: '1', name: '開発チーム', memberCount: 9 },
  { id: '2', name: 'デザインチーム', memberCount: 5 },
  { id: '3', name: '営業チーム', memberCount: 7 },
]

export default function DemoTeamPage() {
  const router = useRouter()
  const [members, setMembers] = useState<any[]>([])
  const [currentOrgId, setCurrentOrgId] = useState<string>('1')
  const [showOrgMenu, setShowOrgMenu] = useState(false)

  // localStorageから自分のステータスと組織IDを読み込んでメンバーリストを作成
  useEffect(() => {
    const savedStatus = localStorage.getItem('demo-status') || 'available'
    const savedOrgId = localStorage.getItem('demo-org-id') || '1'
    setCurrentOrgId(savedOrgId)
    setMembers(getInitialMembers(savedStatus, savedOrgId))
  }, [])

  // 組織変更時の処理
  const handleOrgChange = (orgId: string) => {
    setCurrentOrgId(orgId)
    localStorage.setItem('demo-org-id', orgId)
    const savedStatus = localStorage.getItem('demo-status') || 'available'
    setMembers(getInitialMembers(savedStatus, orgId))
    setShowOrgMenu(false)
  }

  const isUpdatedToday = (lastUpdated: string) => {
    const now = new Date()
    const updated = new Date(lastUpdated)
    return now.toDateString() === updated.toDateString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-splat-dark via-ink-blue to-splat-dark overflow-hidden relative">
      {/* 背景のインク */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-ink-yellow ink-blob blur-[100px]"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-ink-cyan ink-blob blur-[100px]" style={{animationDelay: '1.5s'}}></div>
      </div>

      {/* デモバナー */}
      <div className="relative bg-ink-yellow/90 text-splat-dark py-2 px-4 text-center text-sm border-b-2 border-ink-yellow z-20">
        <div className="font-bold">
          <i className="ri-eye-line mr-2"></i>
          デモモード - 組織切り替えで異なるチームを確認できます
        </div>
        <div className="text-xs mt-0.5 text-splat-dark/80">
          カスタマイズ機能は登録後に利用可能です
        </div>
      </div>

      {/* ヘッダー */}
      <header className="relative p-4 flex items-center justify-between border-b border-white/10 sticky top-0 bg-white/5 backdrop-blur-sm z-10">
        <button
          onClick={() => router.push('/demo')}
          className="px-3 sm:px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all text-xs sm:text-sm font-medium border border-white/20 flex items-center gap-1"
        >
          <i className="ri-arrow-left-line"></i>
          <span className="hidden xs:inline">戻る</span>
        </button>
        <button
          onClick={() => setShowOrgMenu(true)}
          className="text-center group"
        >
          <h1 className="text-lg sm:text-xl font-bold text-white">チーム状況</h1>
          <div className="flex items-center justify-center gap-1 text-xs sm:text-sm text-white/60 group-hover:text-ink-yellow transition-colors">
            <span>{DEMO_TEAMS[currentOrgId as keyof typeof DEMO_TEAMS]?.name || '開発チーム'}</span>
            <i className="ri-arrow-down-s-line"></i>
          </div>
        </button>
        <button
          onClick={() => router.push('/signup')}
          className="px-3 sm:px-4 py-2.5 bg-ink-yellow hover:bg-ink-yellow/90 text-splat-dark font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg flex items-center gap-1"
        >
          <i className="ri-user-add-line"></i>
          <span className="hidden xs:inline">登録</span>
        </button>
      </header>

      {/* メンバーリスト */}
      <main className="p-4 overflow-visible space-y-4">
        {/* ステータス画面へのリンク */}
        <div className="bg-ink-yellow/20 border-2 border-ink-yellow/50 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-ink-yellow rounded-full flex items-center justify-center">
                <i className="ri-paint-brush-fill text-2xl text-splat-dark"></i>
              </div>
              <div>
                <h3 className="text-white font-bold text-base sm:text-lg">ステータスを変更</h3>
                <p className="text-white/70 text-xs sm:text-sm">自分のステータスを設定する</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/demo')}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-ink-yellow hover:bg-ink-yellow/90 text-splat-dark font-bold text-sm sm:text-base rounded-lg transition-all shadow-lg whitespace-nowrap"
            >
              <i className="ri-arrow-right-line mr-1"></i>
              開く
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 overflow-visible">
          {members.map((member) => {
            const config = statusConfig[member.status]
            const updatedToday = isUpdatedToday(member.lastUpdated)
            
            return (
              <div
                key={member.id}
                className={`relative bg-white/5 border rounded-xl p-4 transition-all ${
                  updatedToday 
                    ? 'border-white/10' 
                    : 'border-gray-500/30'
                } ${(member as any).isMe ? 'ring-2 ring-ink-yellow/50' : ''}`}
              >
                {/* 自分バッジ */}
                {(member as any).isMe && (
                  <div className="absolute -top-2 -left-2 bg-ink-yellow text-splat-dark text-xs px-2 py-1 rounded-full shadow-lg border border-ink-yellow/50 font-bold flex items-center gap-1">
                    <i className="ri-user-star-fill"></i>
                    <span>自分</span>
                  </div>
                )}
                
                {/* アバター */}
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${config.avatarColor} flex items-center justify-center mx-auto mb-3 shadow-lg ${
                  !updatedToday ? 'opacity-50 grayscale' : ''
                }`}>
                  <span className="text-white font-bold text-xl sm:text-2xl">
                    {member.name.charAt(0)}
                  </span>
                </div>
                
                {/* 名前 */}
                <div className={`font-medium text-sm sm:text-base mb-1 truncate ${
                  updatedToday ? 'text-white' : 'text-gray-400'
                }`}>
                  {member.name}
                </div>
                
                {/* 最終更新 */}
                <div className={`text-xs mb-2 ${
                  updatedToday ? 'text-white/50' : 'text-gray-500'
                }`}>
                  {formatLastUpdated(member.lastUpdated)}
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
              </div>
            )
          })}
        </div>

        {/* 登録促進カード */}
        <div className="bg-gradient-to-br from-ink-yellow/20 to-ink-cyan/20 border-2 border-ink-yellow/50 rounded-2xl p-6 backdrop-blur-sm text-center">
          <div className="w-16 h-16 bg-ink-yellow rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-gift-line text-3xl text-splat-dark"></i>
          </div>
          <h3 className="text-white font-bold text-xl mb-2">
            実際のチームで使ってみませんか？
          </h3>
          <p className="text-white/70 text-sm mb-4">
            完全無料・クレジットカード不要で今すぐ始められます
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push('/signup')}
              className="px-6 py-3 bg-ink-yellow hover:bg-ink-yellow/90 text-splat-dark font-bold text-base rounded-xl transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <i className="ri-user-add-line text-xl"></i>
              無料で始める
            </button>
            <button
              onClick={() => router.push('/landing')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium text-base rounded-xl transition-all border border-white/20"
            >
              詳細を見る
            </button>
          </div>
          <p className="text-white/50 text-xs mt-3">
            最大10名まで無料で利用できます
          </p>
        </div>
      </main>

      {/* 組織切り替えモーダル */}
      {showOrgMenu && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-gradient-to-br from-splat-dark to-ink-blue w-full sm:w-auto sm:min-w-[400px] sm:max-w-md rounded-t-3xl sm:rounded-3xl border-t-2 sm:border-2 border-white/20 shadow-2xl overflow-hidden">
            {/* ヘッダー */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <i className="ri-team-line text-ink-yellow"></i>
                  組織を選択
                </h2>
                <button
                  onClick={() => setShowOrgMenu(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                >
                  <i className="ri-close-line text-white text-xl"></i>
                </button>
              </div>
              <p className="text-white/60 text-sm">
                切り替えると、そのチームのメンバー状況が表示されます
              </p>
            </div>

            {/* 組織リスト */}
            <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
              {DEMO_ORGANIZATIONS.map((org) => (
                <button
                  key={org.id}
                  onClick={() => handleOrgChange(org.id)}
                  className={`w-full p-4 rounded-xl transition-all ${
                    org.id === currentOrgId
                      ? 'bg-ink-yellow/20 border-2 border-ink-yellow shadow-lg shadow-ink-yellow/20'
                      : 'bg-white/5 border-2 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        org.id === currentOrgId ? 'bg-ink-yellow' : 'bg-white/10'
                      }`}>
                        <i className={`ri-team-fill text-2xl ${
                          org.id === currentOrgId ? 'text-splat-dark' : 'text-white/70'
                        }`}></i>
                      </div>
                      <div className="text-left">
                        <div className={`font-bold text-base ${
                          org.id === currentOrgId ? 'text-ink-yellow' : 'text-white'
                        }`}>
                          {org.name}
                        </div>
                        <div className="text-white/50 text-sm">
                          {org.memberCount}人のメンバー
                        </div>
                      </div>
                    </div>
                    {org.id === currentOrgId && (
                      <i className="ri-check-line text-ink-yellow text-2xl"></i>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

