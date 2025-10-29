'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { StatusButton } from '@/components/StatusButton'
import { STATUS_OPTIONS, CUSTOM_STATUS_CONFIG } from '@/config/status'

// デモ用の組織データ
const DEMO_ORGANIZATIONS = [
  { id: '1', name: '開発チーム', memberCount: 9 },
  { id: '2', name: 'デザインチーム', memberCount: 5 },
  { id: '3', name: '営業チーム', memberCount: 7 },
]

export default function DemoPage() {
  const router = useRouter()
  const [currentStatus, setCurrentStatus] = useState<string>('available')
  const [currentOrgId, setCurrentOrgId] = useState<string>('1')
  const [showOrgMenu, setShowOrgMenu] = useState(false)
  const [showCustomModal, setShowCustomModal] = useState(false)

  // 初回読み込み時にlocalStorageから復元
  useEffect(() => {
    const savedStatus = localStorage.getItem('demo-status')
    if (savedStatus) {
      setCurrentStatus(savedStatus)
    }
    const savedOrgId = localStorage.getItem('demo-org-id')
    if (savedOrgId) {
      setCurrentOrgId(savedOrgId)
    }
  }, [])

  // ステータス変更時にlocalStorageに保存
  const handleStatusChange = (status: string) => {
    setCurrentStatus(status)
    localStorage.setItem('demo-status', status)
  }

  // 組織変更時にlocalStorageに保存
  const handleOrgChange = (orgId: string) => {
    setCurrentOrgId(orgId)
    localStorage.setItem('demo-org-id', orgId)
    setShowOrgMenu(false)
  }

  const currentOrg = DEMO_ORGANIZATIONS.find(org => org.id === currentOrgId) || DEMO_ORGANIZATIONS[0]

  // デモ用のユーザー情報
  const demoUser = {
    name: 'デモユーザー',
    avatarColor: 'bg-gradient-to-br from-lime-400 to-green-500',
    organization: currentOrg.name,
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-splat-dark via-ink-blue to-splat-dark relative overflow-hidden">
      {/* 背景のインク */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-ink-yellow ink-blob blur-[100px]"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-ink-cyan ink-blob blur-[100px]" style={{animationDelay: '1.5s'}}></div>
      </div>

      {/* デモバナー */}
      <div className="relative bg-ink-yellow/90 text-splat-dark py-2 px-4 text-center text-sm border-b-2 border-ink-yellow z-20">
        <div className="font-bold">
          <i className="ri-eye-line mr-2"></i>
          デモモード - 組織切り替えとステータス選択を体験できます
        </div>
        <div className="text-xs mt-0.5 text-splat-dark/80">
          カスタマイズ機能は登録後に利用可能です
        </div>
      </div>

      {/* ヘッダー */}
      <header className="relative px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0 border-b border-white/10 bg-white/5 backdrop-blur-sm z-30">
        {/* 左側：ユーザー情報 */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`w-10 h-10 ${demoUser.avatarColor} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg`}>
            <span className="text-white font-bold text-lg">
              {demoUser.name[0]}
            </span>
          </div>
          
          <div className="flex flex-col min-w-0">
            <div className="text-white text-base sm:text-lg font-bold truncate">
              {demoUser.name}
            </div>
            <button
              onClick={() => setShowOrgMenu(true)}
              className="flex items-center gap-1 text-xs sm:text-sm text-white/70 hover:text-white truncate transition-colors group cursor-pointer"
            >
              <i className="ri-team-line flex-shrink-0"></i>
              <span className="truncate">{currentOrg.name}</span>
              <i className="ri-arrow-down-s-line flex-shrink-0 group-hover:text-ink-yellow transition-colors"></i>
            </button>
          </div>
        </div>

        {/* 右側：アクションボタン */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/signup')}
            className="px-3 sm:px-4 py-2 bg-ink-yellow hover:bg-ink-yellow/90 text-splat-dark font-bold text-xs sm:text-sm rounded-lg transition-all shadow-lg flex items-center gap-1 sm:gap-2"
          >
            <i className="ri-user-add-line text-base sm:text-lg"></i>
            <span className="hidden xs:inline">無料登録</span>
            <span className="xs:hidden">登録</span>
          </button>
          <button
            onClick={() => router.push('/demo/team')}
            className="hidden sm:flex px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-lg transition-all border border-white/20 items-center gap-2"
          >
            <i className="ri-group-line text-lg"></i>
            <span>チーム</span>
          </button>
          <button
            onClick={() => router.push('/landing')}
            className="px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm rounded-lg transition-all border border-white/20"
          >
            <i className="ri-close-line"></i>
            <span className="hidden sm:inline ml-1">終了</span>
          </button>
        </div>
      </header>

      <main className="relative flex-1 flex flex-col items-center justify-center p-4 gap-4">
        {/* チーム画面へのリンク - 目立つように */}
        <div className="w-full max-w-4xl bg-ink-cyan/20 border-2 border-ink-cyan/50 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-ink-cyan rounded-full flex items-center justify-center">
                <i className="ri-group-line text-2xl text-splat-dark"></i>
              </div>
              <div>
                <h3 className="text-white font-bold text-base sm:text-lg">チーム状況を確認</h3>
                <p className="text-white/70 text-xs sm:text-sm">メンバーのステータスを一覧で見る</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/demo/team')}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-ink-cyan hover:bg-ink-cyan/90 text-splat-dark font-bold text-sm sm:text-base rounded-lg transition-all shadow-lg whitespace-nowrap"
            >
              <i className="ri-arrow-right-line mr-1"></i>
              開く
            </button>
          </div>
        </div>

        <div className="w-full flex-1 overflow-visible relative">
          {/* ステータスボタングリッド */}
          <div className="grid grid-cols-2 auto-rows-fr gap-3 sm:gap-4 md:gap-5 h-full overflow-visible max-w-4xl mx-auto">
            {STATUS_OPTIONS.map((option) => (
              <div key={option.status}>
                <StatusButton
                  label={option.label}
                  icon={option.icon}
                  isActive={currentStatus === option.status}
                  activeColor={option.activeColor}
                  glowColor={option.glowColor}
                  onClick={() => handleStatusChange(option.status)}
                />
              </div>
            ))}

            {/* カスタムステータス1 */}
            <div className="relative">
              <StatusButton
                label={CUSTOM_STATUS_CONFIG.custom1.defaultLabel}
                icon={CUSTOM_STATUS_CONFIG.custom1.defaultIcon}
                isActive={currentStatus === 'custom1'}
                activeColor={CUSTOM_STATUS_CONFIG.custom1.activeColor}
                glowColor={CUSTOM_STATUS_CONFIG.custom1.glowColor}
                onClick={() => setShowCustomModal(true)}
              />
              <div className="absolute top-2 right-2 bg-ink-yellow text-splat-dark text-xs font-bold px-2 py-1 rounded-md shadow-lg">
                <i className="ri-lock-line mr-1"></i>登録後
              </div>
            </div>

            {/* カスタムステータス2 */}
            <div className="relative">
              <StatusButton
                label={CUSTOM_STATUS_CONFIG.custom2.defaultLabel}
                icon={CUSTOM_STATUS_CONFIG.custom2.defaultIcon}
                isActive={currentStatus === 'custom2'}
                activeColor={CUSTOM_STATUS_CONFIG.custom2.activeColor}
                glowColor={CUSTOM_STATUS_CONFIG.custom2.glowColor}
                onClick={() => setShowCustomModal(true)}
              />
              <div className="absolute top-2 right-2 bg-ink-yellow text-splat-dark text-xs font-bold px-2 py-1 rounded-md shadow-lg">
                <i className="ri-lock-line mr-1"></i>登録後
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="relative py-4 px-4 border-t border-white/10 bg-gradient-to-b from-white/5 to-white/10 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-ink-yellow font-bold text-sm">
            <i className="ri-gift-line text-lg"></i>
            <span>完全無料・クレジットカード不要</span>
          </div>
          <p className="text-white/70 text-sm">
            チーム全員のステータスをリアルタイムで共有
          </p>
          <button
            onClick={() => router.push('/signup')}
            className="w-full sm:w-auto px-8 py-3 bg-ink-yellow hover:bg-ink-yellow/90 text-splat-dark font-bold text-base rounded-xl transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mx-auto"
          >
            <i className="ri-user-add-line text-xl"></i>
            今すぐ無料で始める
          </button>
          <p className="text-white/40 text-xs">
            最大10名まで無料で利用できます
          </p>
        </div>
      </footer>

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

      {/* カスタムステータス制限モーダル */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-splat-dark to-ink-blue w-full sm:max-w-md rounded-3xl border-2 border-white/20 shadow-2xl overflow-hidden">
            {/* ヘッダー */}
            <div className="p-6 border-b border-white/10 text-center">
              <div className="w-16 h-16 bg-ink-yellow/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-lock-line text-ink-yellow text-3xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                カスタムステータス
              </h2>
              <p className="text-white/70 text-sm">
                この機能は登録後に利用できます
              </p>
            </div>

            {/* 説明 */}
            <div className="p-6 space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <i className="ri-star-smile-fill text-ink-yellow"></i>
                  カスタムステータスでできること
                </h3>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li className="flex items-start gap-2">
                    <i className="ri-check-line text-ink-yellow mt-0.5 flex-shrink-0"></i>
                    <span>自由にステータスを作成</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-check-line text-ink-yellow mt-0.5 flex-shrink-0"></i>
                    <span>アイコンと色をカスタマイズ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="ri-check-line text-ink-yellow mt-0.5 flex-shrink-0"></i>
                    <span>ステータスの並び替え</span>
                  </li>
                </ul>
              </div>

              {/* ボタン */}
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/signup')}
                  className="w-full py-3 bg-ink-yellow hover:bg-ink-yellow/90 text-splat-dark font-bold text-base rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <i className="ri-user-add-line text-xl"></i>
                  無料で登録してカスタマイズ
                </button>
                <button
                  onClick={() => setShowCustomModal(false)}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl transition-all border border-white/20"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
