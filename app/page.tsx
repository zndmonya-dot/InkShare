'use client'

import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { getStatusConfig } from '@/constants/statusOptions'
import { CustomStatus } from '@/types/status'

// 遅延ロード（パフォーマンス最適化）
const StatusPanel = lazy(() => import('@/components/StatusPanel').then(mod => ({ default: mod.StatusPanel })))
const CustomStatusModal = lazy(() => import('@/components/CustomStatusModal').then(mod => ({ default: mod.CustomStatusModal })))

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [currentStatus, setCurrentStatus] = useState<any>('available')
  const [customStatus1, setCustomStatus1] = useState<CustomStatus>({
    label: 'カスタム1',
    icon: 'ri-edit-line',
  })
  const [customStatus2, setCustomStatus2] = useState<CustomStatus>({
    label: 'カスタム2',
    icon: 'ri-edit-line',
  })
  const [showCustomModal, setShowCustomModal] = useState<'custom1' | 'custom2' | null>(null)
  const [showOrgDropdown, setShowOrgDropdown] = useState(false)
  const [isSwitchingOrg, setIsSwitchingOrg] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)
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

        const [profileData, statusData] = await Promise.all([
          profileRes.json(),
          statusRes.json()
        ])

        console.log(`Data fetch completed in ${Math.round(performance.now() - startTime)}ms`)

        if (!profileData.user) {
          // ログインしていない場合はランディングページへ
          router.push('/landing')
          return
        }

        // グループがなくてもホーム画面は表示する
        setUserProfile(profileData.user)

        // ステータス設定
        if (statusData.status) {
          setCurrentStatus(statusData.status.status)
          setCustomStatus1({
            label: statusData.status.custom1_label || 'カスタム1',
            icon: statusData.status.custom1_icon || 'ri-edit-line',
          })
          setCustomStatus2({
            label: statusData.status.custom2_label || 'カスタム2',
            icon: statusData.status.custom2_icon || 'ri-edit-line',
          })
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
  const handleStatusChange = useCallback(async (newStatus: any) => {
    setCurrentStatus(newStatus)
    await fetch('/api/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
  }, [])

  // カスタムステータス保存
  const handleCustomSave = useCallback(async (type: 'custom1' | 'custom2', label: string, icon: string) => {
    const newCustomStatus = { label, icon }
    if (type === 'custom1') {
      setCustomStatus1(newCustomStatus)
    } else {
      setCustomStatus2(newCustomStatus)
    }
    setShowCustomModal(null)

    await fetch('/api/status/custom', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, label, icon }),
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

  // チーム脱退処理
  const handleLeaveOrganization = useCallback(async () => {
    if (!userProfile?.currentOrganization) return

    try {
      const response = await fetch('/api/organization/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId: userProfile.currentOrganization.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || '脱退に失敗しました')
        return
      }

      alert('グループから脱退しました')
      window.location.reload()
    } catch (error) {
      console.error('Leave organization error:', error)
      alert('脱退に失敗しました')
    }
  }, [userProfile])

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
      <header className="relative px-6 py-4 flex items-center justify-between flex-shrink-0 border-b border-white/10 bg-white/5 backdrop-blur-sm">
        {/* 左側：ユーザー＆グループ情報 */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <div className="text-white text-lg font-bold">{userProfile?.name}</div>
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-sm">
                {userProfile?.currentOrganization?.name || 'グループ未参加'}
              </span>
              {/* グループ切り替えボタン（複数ある場合のみ） */}
              {userProfile?.organizations && userProfile.organizations.length > 1 && (
                <button
                  onClick={() => setShowOrgDropdown(!showOrgDropdown)}
                  className="text-white/60 hover:text-white transition-all"
                  title="グループを切り替え"
                >
                  <i className="ri-arrow-down-s-line text-lg"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 右側：アクションボタン */}
        <div className="flex items-center gap-2">
          {/* 通知ベル */}
          {userProfile?.currentOrganization && (
            <button
              onClick={() => {
                // TODO: 通知一覧モーダルを表示
                alert('通知機能は開発中です')
              }}
              className="relative w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all border border-white/20"
              title="通知"
            >
              <i className="ri-notification-3-line text-lg text-white/80"></i>
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>
          )}
          
          {userProfile?.currentOrganization && (
            <button
              onClick={() => router.push('/team')}
              className="px-5 py-2.5 bg-ink-yellow hover:bg-ink-yellow/90 text-splat-dark font-bold text-sm rounded-xl transition-all shadow-lg flex items-center gap-2"
            >
              <i className="ri-group-line text-lg"></i>
              <span>チーム</span>
            </button>
          )}
          {/* アカウント設定 */}
          <button
            onClick={() => router.push('/account')}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all border border-white/20"
            title="アカウント設定"
          >
            <i className="ri-user-settings-line text-lg text-white/80"></i>
          </button>
          
          {userProfile?.currentOrganization?.role === 'admin' && (
            <button
              onClick={() => router.push('/settings')}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all border border-white/20"
              title="組織設定"
            >
              <i className="ri-settings-3-line text-lg text-white/80"></i>
            </button>
          )}
          <button
            onClick={() => router.push('/logout')}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all border border-white/20"
            title="ログアウト"
          >
            <i className="ri-logout-box-line text-lg text-white/80"></i>
          </button>
        </div>
      </header>

      {/* グループ切り替えモーダル - 操作性改善版 */}
      {showOrgDropdown && userProfile?.organizations && userProfile.organizations.length > 1 && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowOrgDropdown(false)}
        >
          <div 
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">グループ</h2>
              <button
                onClick={() => setShowOrgDropdown(false)}
                className="text-white/60 hover:text-white transition-all"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            
            <div className="space-y-3 mb-6">
              {userProfile.organizations.map((org: any) => (
                <button
                  key={org.id}
                  onClick={() => {
                    if (org.id !== userProfile.currentOrganization?.id) {
                      setShowOrgDropdown(false)
                      handleOrgSwitch(org.id)
                    }
                  }}
                  disabled={isSwitchingOrg || org.id === userProfile.currentOrganization?.id}
                  className={`w-full text-left px-6 py-4 rounded-xl transition-all text-lg ${
                    org.id === userProfile.currentOrganization?.id
                      ? 'bg-ink-yellow/30 text-white font-bold border-2 border-ink-yellow cursor-default'
                      : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/20 cursor-pointer'
                  } ${isSwitchingOrg ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{org.name}</span>
                    {org.id === userProfile.currentOrganization?.id && (
                      <i className="ri-check-line text-2xl text-ink-yellow"></i>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* 脱退ボタンを分離 */}
            {userProfile?.currentOrganization && (
              <div className="pt-6 border-t border-white/20">
                <button
                  onClick={() => {
                    setShowOrgDropdown(false)
                    setTimeout(() => {
                      if (confirm(`本当に「${userProfile.currentOrganization.name}」から脱退しますか？\n\n※唯一の管理者の場合は脱退できません`)) {
                        handleLeaveOrganization()
                      }
                    }, 100)
                  }}
                  className="w-full px-6 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-lg rounded-xl transition-all border border-red-500/30 hover:border-red-500/50"
                >
                  <i className="ri-logout-circle-line mr-2"></i>
                  現在のグループから脱退
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <main className="relative flex-1 flex items-center justify-center p-4">
        {!userProfile?.currentOrganization ? (
          // グループがない場合 - クリーン版
          <div className="max-w-md w-full text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
            <div className="mb-8">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                <i className="ri-inbox-line text-5xl text-white/60"></i>
              </div>
              <p className="text-white text-xl font-bold">グループがありません</p>
              <p className="text-white/60 text-sm mt-2">グループを作成するか、招待コードで参加しましょう</p>
            </div>
            <button
              onClick={() => router.push('/join')}
              className="w-full px-6 py-4 bg-ink-magenta hover:bg-ink-magenta/90 text-white font-bold text-lg rounded-xl transition-all mb-3 shadow-lg"
            >
              <span className="flex items-center justify-center gap-2">
                <i className="ri-key-2-line text-xl"></i>
                招待コードで参加
              </span>
            </button>
            <button
              onClick={() => router.push('/group/create')}
              className="w-full px-6 py-4 bg-white/10 hover:bg-white/20 text-ink-cyan font-bold text-lg rounded-xl transition-all border border-ink-cyan/50 hover:border-ink-cyan"
            >
              <span className="flex items-center justify-center gap-2">
                <i className="ri-add-line text-xl"></i>
                グループを作成
              </span>
            </button>
          </div>
                ) : (
                  // グループがある場合の通常表示
                  <Suspense fallback={
                    <div className="text-white text-lg">読み込み中...</div>
                  }>
                    <StatusPanel
                      currentStatus={currentStatus}
                      onStatusChange={handleStatusChange}
                      customStatus1={customStatus1}
                      customStatus2={customStatus2}
                      onCustomClick={(type) => setShowCustomModal(type)}
                    />
                  </Suspense>
                )}
      </main>

              {showCustomModal && (
                <Suspense fallback={null}>
                  <CustomStatusModal
                    isOpen={!!showCustomModal}
                    onClose={() => setShowCustomModal(null)}
                    onSave={(label, icon) => handleCustomSave(showCustomModal, label, icon)}
                    currentStatus={showCustomModal === 'custom1' ? customStatus1 : customStatus2}
                  />
                </Suspense>
              )}
    </div>
  )
}
