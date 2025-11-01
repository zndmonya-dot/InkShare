'use client'

import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { getStatusConfig } from '@/config/status'
import { CustomStatus, PresenceStatus, UserProfile } from '@/types'
import { DEFAULT_CUSTOM_STATUS } from '@/lib/constants'
import { StatusPanel } from '@/components/StatusPanel'

// 遅延ロード（パフォーマンス最適化）
const CustomStatusModal = lazy(() => import('@/components/CustomStatusModal').then(mod => ({ default: mod.CustomStatusModal })))

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [currentStatus, setCurrentStatus] = useState<PresenceStatus>('available')
  const [customStatus1, setCustomStatus1] = useState<CustomStatus & { color?: string }>({ ...DEFAULT_CUSTOM_STATUS.custom1, color: 'bg-fuchsia-400' })
  const [customStatus2, setCustomStatus2] = useState<CustomStatus & { color?: string }>({ ...DEFAULT_CUSTOM_STATUS.custom2, color: 'bg-purple-400' })
  const [customStatus3, setCustomStatus3] = useState<CustomStatus & { color?: string }>({ ...DEFAULT_CUSTOM_STATUS.custom3, color: 'bg-pink-400' })
  const [customStatus4, setCustomStatus4] = useState<CustomStatus & { color?: string }>({ ...DEFAULT_CUSTOM_STATUS.custom4, color: 'bg-violet-400' })
  const [showCustomModal, setShowCustomModal] = useState<'custom1' | 'custom2' | 'custom3' | 'custom4' | null>(null)
  const [showOrgDropdown, setShowOrgDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isSwitchingOrg, setIsSwitchingOrg] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 初期データ取得（並列化で高速化）
  useEffect(() => {
    const fetchData = async () => {
      const startTime = performance.now()
      
      try {
        // プロフィールとステータスを並列取得
        const [profileRes, statusRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/status')
        ])

        // レスポンスステータスをチェック
        const profileData = await profileRes.json()

        console.log(`Data fetch completed in ${Math.round(performance.now() - startTime)}ms`)

        if (!profileData.user) {
          // ログインしていない場合はランディングページへ
          router.push('/landing')
          return
        }

        // グループがない場合はonboarding画面へ
        if (!profileData.user.currentOrganization) {
          router.push('/onboarding')
          return
        }

        setUserProfile(profileData.user)

        // ステータス設定（401エラーの場合は無視）
        if (statusRes.ok) {
          const statusData = await statusRes.json()
          if (statusData.status) {
            setCurrentStatus(statusData.status.status)
            setCustomStatus1({
              label: statusData.status.custom1_label || 'カスタム1',
              icon: statusData.status.custom1_icon || 'ri-star-smile-fill',
              color: statusData.status.custom1_color || 'bg-fuchsia-400',
            })
            setCustomStatus2({
              label: statusData.status.custom2_label || 'カスタム2',
              icon: statusData.status.custom2_icon || 'ri-star-smile-fill',
              color: statusData.status.custom2_color || 'bg-purple-400',
            })
            setCustomStatus3({
              label: statusData.status.custom3_label || 'カスタム3',
              icon: statusData.status.custom3_icon || 'ri-star-smile-fill',
              color: statusData.status.custom3_color || 'bg-pink-400',
            })
            setCustomStatus4({
              label: statusData.status.custom4_label || 'カスタム4',
              icon: statusData.status.custom4_icon || 'ri-star-smile-fill',
              color: statusData.status.custom4_color || 'bg-violet-400',
            })
            
            // 0時を過ぎてリセットされた場合、通知を表示
            if (statusData.wasReset) {
              console.log('ステータスが0時にリセットされました')
            }
          }
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        router.push('/landing')
      }
    }

    fetchData()
  }, [router])

  // ステータス変更
  const handleStatusChange = useCallback(async (newStatus: PresenceStatus) => {
    setCurrentStatus(newStatus)
    await fetch('/api/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
  }, [])

  // カスタムステータス保存
  const handleCustomSave = useCallback(async (type: 'custom1' | 'custom2' | 'custom3' | 'custom4', label: string, icon: string, color: string) => {
    const newCustomStatus = { label, icon, color }
    if (type === 'custom1') {
      setCustomStatus1(newCustomStatus)
    } else if (type === 'custom2') {
      setCustomStatus2(newCustomStatus)
    } else if (type === 'custom3') {
      setCustomStatus3(newCustomStatus)
    } else {
      setCustomStatus4(newCustomStatus)
    }
    setShowCustomModal(null)

    await fetch('/api/status/custom', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, label, icon, color }),
    })
  }, [])

  // 定時自動切り替え（17:00になったら「定時で帰りたい」に）
  useEffect(() => {
    const AUTO_CHANGE_HOUR = 17
    const CHECK_INTERVAL_MS = 60 * 1000 // 1分

    const checkTime = async () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()

      if (hours === AUTO_CHANGE_HOUR && minutes === 0 && currentStatus !== 'going-home') {
        await handleStatusChange('going-home')
      }
    }

    const interval = setInterval(checkTime, CHECK_INTERVAL_MS)
    checkTime() // 初回実行

    return () => clearInterval(interval)
  }, [currentStatus, handleStatusChange])

  // 組織切り替え
  const handleOrgSwitch = useCallback(async (orgId: string) => {
    // 既に切り替え中の場合は何もしない
    if (isSwitchingOrg) {
      console.log('Already switching, ignoring...')
      return
    }
    
    console.log('Switching organization to:', orgId)
    setIsSwitchingOrg(true)
    setShowOrgDropdown(false)
    
    try {
      const response = await fetch('/api/organization/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId: orgId }),
      })
      
      if (!response.ok) {
        console.error('Failed to switch organization:', await response.text())
        setIsSwitchingOrg(false)
        return
      }
      
      console.log('Organization switched successfully, reloading...')
      // 少し待ってからリロード（ちらつき防止）
      setTimeout(() => {
        window.location.reload()
      }, 100)
    } catch (error) {
      console.error('Failed to switch organization:', error)
      setIsSwitchingOrg(false)
    }
  }, [isSwitchingOrg])

  // ドロップダウン外クリックで閉じる
  useEffect(() => {
    if (!showOrgDropdown) return
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowOrgDropdown(false)
      }
    }
    
    // 少し遅延させてイベントリスナーを追加（即座の閉じるを防ぐ）
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 100)
    
    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showOrgDropdown])

  // ステータス設定を取得（デフォルト値を設定）
  const statusConfig = getStatusConfig(currentStatus)

  if (isLoading) {
    return (
      <div className="h-screen bg-gradient-to-br from-splat-dark via-ink-blue to-splat-dark flex items-center justify-center relative overflow-hidden">
        {/* 背景のインク - スクロール防止版 */}
        <div className="fixed inset-0 opacity-20 pointer-events-none overflow-hidden">
          <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-ink-yellow ink-blob blur-[100px]"></div>
          <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-ink-cyan ink-blob blur-[100px]" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        {/* スプラトゥーン風スピナー */}
        <div className="text-center relative">
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
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-splat-dark via-ink-blue to-splat-dark relative overflow-hidden">
      {/* 背景のインク - スクロール防止版 */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-ink-yellow ink-blob blur-[100px]"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-ink-cyan ink-blob blur-[100px]" style={{animationDelay: '1.5s'}}></div>
      </div>
      {/* ヘッダー - 改善版 */}
      <header className="relative px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0 border-b border-white/10 bg-white/5 backdrop-blur-sm min-h-[72px]">
        {/* 左側：ユーザー＆グループ情報 */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* アバター */}
          <div className={`w-10 h-10 ${userProfile?.avatarColor || 'bg-gradient-to-br from-lime-400 to-green-500'} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg`}>
            <span className="text-white font-bold text-lg">
              {userProfile?.name?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          
          {/* ユーザー情報 */}
          <div className="flex flex-col min-w-0">
            <div className="text-white text-base sm:text-lg font-bold truncate">
              {userProfile?.name}
            </div>
            <button
              onClick={() => userProfile?.organizations && userProfile.organizations.length > 1 && setShowOrgDropdown(!showOrgDropdown)}
              className={`flex items-center gap-1 text-xs sm:text-sm ${
                userProfile?.organizations && userProfile.organizations.length > 1
                  ? 'text-white/70 hover:text-white cursor-pointer'
                  : 'text-white/50 cursor-default'
              } transition-all truncate max-w-[200px] h-5 sm:h-6`}
              disabled={!userProfile?.organizations || userProfile.organizations.length <= 1}
              title={userProfile?.currentOrganization?.name || 'グループ未参加'}
            >
              <i className="ri-team-line flex-shrink-0"></i>
              <span className="truncate">
                {userProfile?.currentOrganization?.name || 'グループ未参加'}
              </span>
              {userProfile?.organizations && userProfile.organizations.length > 1 && (
                <i className="ri-arrow-down-s-line flex-shrink-0"></i>
              )}
            </button>
          </div>
        </div>

        {/* 右側：アクションボタン */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* チームボタン（グループがある場合のみ） */}
          {userProfile?.currentOrganization && (
            <button
              onClick={() => router.push('/team')}
              className="hidden sm:flex px-4 py-2 bg-ink-yellow hover:bg-ink-yellow/90 text-splat-dark font-bold text-sm rounded-lg transition-all shadow-lg items-center gap-2"
              title="チーム"
            >
              <i className="ri-group-line text-lg"></i>
              <span className="hidden md:inline">チーム</span>
            </button>
          )}
          
          {/* モバイル用：メニューボタン */}
          <div className="relative sm:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all border border-white/20"
            >
              <i className="ri-more-2-fill text-xl text-white/80"></i>
            </button>
          </div>

          {/* デスクトップ用：個別ボタン */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => router.push('/account')}
              className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all border border-white/20"
              title="アカウント設定"
            >
              <i className="ri-user-settings-line text-lg text-white/80"></i>
            </button>
            
            <button
              onClick={() => router.push('/settings')}
              className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all border border-white/20"
              title="組織設定"
            >
              <i className="ri-settings-3-line text-lg text-white/80"></i>
            </button>
            
            <button
              onClick={() => router.push('/logout')}
              className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all border border-white/20"
              title="ログアウト"
            >
              <i className="ri-logout-box-line text-lg text-white/80"></i>
            </button>
          </div>
        </div>
      </header>

      {/* モバイル専用：メニューモーダル */}
      {showMobileMenu && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end sm:hidden"
          onClick={() => setShowMobileMenu(false)}
        >
          <div 
            className="bg-white/10 backdrop-blur-md border-t border-white/20 rounded-t-3xl w-full shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-2">
              {/* チームボタン */}
              {userProfile?.currentOrganization && (
                <button
                  onClick={() => {
                    setShowMobileMenu(false)
                    router.push('/team')
                  }}
                  className="w-full px-5 py-4 bg-ink-yellow hover:bg-ink-yellow/90 text-splat-dark font-bold rounded-xl transition-all shadow-lg flex items-center gap-3"
                >
                  <i className="ri-group-line text-xl"></i>
                  <span>チーム</span>
                </button>
              )}
              
              {/* グループ切り替えボタン（複数ある場合のみ） */}
              {userProfile?.organizations && userProfile.organizations.length > 1 && (
                <button
                  onClick={() => {
                    setShowMobileMenu(false)
                    setTimeout(() => setShowOrgDropdown(true), 100)
                  }}
                  className="w-full px-5 py-4 bg-white/10 hover:bg-white/15 text-white font-medium rounded-xl transition-all border border-white/20 flex items-center gap-3"
                >
                  <i className="ri-swap-line text-xl"></i>
                  <span>グループ切り替え</span>
                </button>
              )}
              
              {/* アカウント設定 */}
              <button
                onClick={() => {
                  setShowMobileMenu(false)
                  router.push('/account')
                }}
                className="w-full px-5 py-4 bg-white/10 hover:bg-white/15 text-white font-medium rounded-xl transition-all border border-white/20 flex items-center gap-3"
              >
                <i className="ri-user-settings-line text-xl"></i>
                <span>アカウント設定</span>
              </button>
              
              {/* 組織設定 */}
              <button
                onClick={() => {
                  setShowMobileMenu(false)
                  router.push('/settings')
                }}
                className="w-full px-5 py-4 bg-white/10 hover:bg-white/15 text-white font-medium rounded-xl transition-all border border-white/20 flex items-center gap-3"
              >
                <i className="ri-settings-3-line text-xl"></i>
                <span>組織設定</span>
              </button>
              
              {/* ログアウト */}
              <button
                onClick={() => {
                  setShowMobileMenu(false)
                  router.push('/logout')
                }}
                className="w-full px-5 py-4 bg-white/10 hover:bg-white/15 text-rose-400 font-medium rounded-xl transition-all border border-white/20 flex items-center gap-3"
              >
                <i className="ri-logout-box-line text-xl"></i>
                <span>ログアウト</span>
              </button>
            </div>
            
            {/* 閉じるエリア */}
            <button
              onClick={() => setShowMobileMenu(false)}
              className="w-full py-4 text-white/50 text-sm"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* グループ切り替えドロップダウン - シンプル版 */}
      {showOrgDropdown && userProfile?.organizations && userProfile.organizations.length > 1 && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowOrgDropdown(false)}
        >
          <div 
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">グループを切り替え</h2>
              <button
                onClick={() => setShowOrgDropdown(false)}
                className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            
            <div className="space-y-2">
              {userProfile.organizations.map((org) => (
                <button
                  key={org.id}
                  onClick={() => {
                    if (org.id !== userProfile.currentOrganization?.id) {
                      setShowOrgDropdown(false)
                      handleOrgSwitch(org.id)
                    }
                  }}
                  disabled={isSwitchingOrg || org.id === userProfile.currentOrganization?.id}
                  className={`w-full text-left px-5 py-3.5 rounded-xl transition-all ${
                    org.id === userProfile.currentOrganization?.id
                      ? 'bg-ink-yellow/20 text-white font-bold border-2 border-ink-yellow cursor-default'
                      : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/20 cursor-pointer'
                  } ${isSwitchingOrg ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{org.name}</div>
                      <div className="text-xs text-white/50 mt-0.5">
                        メンバー · {org.type === 'business' ? '法人' : '個人'}
                      </div>
                    </div>
                    {org.id === userProfile.currentOrganization?.id && (
                      <i className="ri-check-line text-2xl text-ink-yellow"></i>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-white/50 text-xs text-center">
                <i className="ri-information-line mr-1"></i>
                グループの脱退は「アカウント設定」から行えます
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="relative flex-1 flex flex-col items-center p-4 overflow-y-auto">
        <div className="w-full flex-shrink-0">
          <StatusPanel
            currentStatus={currentStatus}
            onStatusChange={handleStatusChange}
            customStatus1={customStatus1}
            customStatus2={customStatus2}
            customStatus3={customStatus3}
            customStatus4={customStatus4}
            onCustomClick={(type) => setShowCustomModal(type)}
          />
        </div>
      </main>

              {showCustomModal && (
                <Suspense fallback={null}>
                  <CustomStatusModal
                    isOpen={!!showCustomModal}
                    onClose={() => setShowCustomModal(null)}
                    onSave={(label, icon, color) => handleCustomSave(showCustomModal, label, icon, color)}
                    currentStatus={
                      showCustomModal === 'custom1' ? customStatus1 :
                      showCustomModal === 'custom2' ? customStatus2 :
                      showCustomModal === 'custom3' ? customStatus3 :
                      customStatus4
                    }
                  />
                </Suspense>
              )}
    </div>
  )
}
