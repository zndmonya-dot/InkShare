'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { StatusPanel } from '@/components/StatusPanel'
import { CustomStatusModal } from '@/components/CustomStatusModal'
import { getStatusConfig } from '@/constants/statusOptions'
import { CustomStatus } from '@/types/status'

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

  // 初期データ取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ユーザープロフィール取得
        const profileRes = await fetch('/api/auth/me')
        const profileData = await profileRes.json()

        if (!profileData.user) {
          // ログインしていない場合はランディングページへ
          router.push('/landing')
          return
        }

        // グループがなくてもホーム画面は表示する
        setUserProfile(profileData.user)

        // ステータス取得
        const statusRes = await fetch('/api/status')
        const statusData = await statusRes.json()

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
  const handleOrgSwitch = async (orgId: string) => {
    try {
      await fetch('/api/organization/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId: orgId }),
      })
      router.refresh()
      window.location.reload() // 全体をリロード
    } catch (error) {
      console.error('Failed to switch organization:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center text-lime-400 text-2xl splatoon-glow">
        Loading InkLink...
      </div>
    )
  }

  const statusConfig = getStatusConfig(currentStatus)

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      {/* ヘッダー */}
      <header className="px-4 py-3 sm:py-4 flex items-center justify-between flex-shrink-0 overflow-visible">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 ${statusConfig.bgColor} rounded-2xl flex items-center justify-center shadow-lg relative overflow-visible ${statusConfig.glow}`}>
            <i className={`${statusConfig.icon} text-3xl sm:text-4xl text-gray-900`}></i>
            {/* インク飛び散り */}
            <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full ${statusConfig.inkLight} opacity-70 ink-splash`}></div>
            <div className={`absolute -bottom-1 -left-1 w-3 h-3 rounded-full ${statusConfig.inkMedium} opacity-60 ink-drip`}></div>
          </div>
          <div>
            <div className="text-white text-base sm:text-lg font-bold">{userProfile?.name}</div>
            {/* 組織切り替えドロップダウン */}
            {userProfile?.organizations && userProfile.organizations.length > 1 ? (
              <select
                value={userProfile.currentOrganization?.id || ''}
                onChange={(e) => handleOrgSwitch(e.target.value)}
                className="text-sm sm:text-base text-gray-400 bg-transparent border border-gray-700 rounded px-2 py-1 hover:border-lime-400 transition-colors cursor-pointer"
              >
                {userProfile.organizations.map((org: any) => (
                  <option key={org.id} value={org.id} className="bg-gray-800">
                    {org.name} {org.isActive && '(現在)'}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-sm sm:text-base text-gray-400">
                {userProfile?.currentOrganization?.name || 'グループ未参加'}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {userProfile?.currentOrganization?.role === 'admin' && (
            <button
              onClick={() => router.push('/settings')}
              className="relative w-10 h-10 sm:w-12 sm:h-12 bg-cyan-400 hover:bg-cyan-300 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]"
              title="組織設定"
            >
              <i className="ri-settings-3-line text-xl sm:text-2xl text-gray-900"></i>
            </button>
          )}
          <button
            onClick={() => router.push('/logout')}
            className="relative w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all active:scale-95 border border-gray-700 hover:border-gray-500"
            title="ログアウト"
          >
            <i className="ri-logout-box-line text-xl sm:text-2xl text-gray-300"></i>
          </button>
          {userProfile?.currentOrganization && (
            <button
              onClick={() => router.push('/team')}
              className="relative px-4 sm:px-6 py-2 sm:py-3 bg-lime-400 hover:bg-lime-300 text-black font-bold text-sm sm:text-base rounded-xl transition-all active:scale-95 shadow-[0_0_30px_rgba(191,255,0,0.5)] hover:shadow-[0_0_40px_rgba(191,255,0,0.7)] overflow-visible group"
            >
              {/* インク飛び散り */}
              <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-lime-300 opacity-70 ink-splash group-hover:scale-110 transition-transform"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-yellow-300 opacity-60 ink-drip group-hover:scale-110 transition-transform"></div>
              <span className="relative z-10 flex items-center gap-2">
                <i className="ri-group-line"></i>
                <span className="hidden sm:inline">チームを見る</span>
              </span>
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 overflow-visible">
        {!userProfile?.currentOrganization ? (
          // グループがない場合の表示
          <div className="max-w-2xl w-full text-center">
            <div className="bg-gray-800/60 border-2 border-orange-400/30 rounded-2xl p-8 backdrop-blur-sm">
              <div className="w-20 h-20 bg-orange-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(251,146,60,0.7)]">
                <i className="ri-user-add-line text-5xl text-gray-900"></i>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                グループに参加しましょう
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                友達から招待コードをもらって参加するか、新しいグループを作成してください
              </p>
              
              {/* メインアクション：招待コードで参加 */}
              <button
                onClick={() => router.push('/join')}
                className="w-full px-8 py-5 bg-orange-400 hover:bg-orange-300 text-black font-bold text-xl rounded-xl transition-all active:scale-95 shadow-[0_0_40px_rgba(251,146,60,0.6)] mb-6"
              >
                <i className="ri-key-2-line mr-2"></i>
                招待コードで参加
              </button>

              {/* サブアクション：グループ作成 */}
              <details className="text-left">
                <summary className="text-gray-400 hover:text-white transition-colors cursor-pointer text-center mb-4">
                  または新しいグループを作成
                </summary>
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <button
                    onClick={() => router.push('/group/create?type=personal')}
                    className="flex-1 px-6 py-3 bg-lime-400/20 hover:bg-lime-400/30 text-lime-400 font-bold rounded-xl transition-all border-2 border-lime-400/50"
                  >
                    <i className="ri-group-line mr-2"></i>
                    個人グループ
                  </button>
                  <button
                    onClick={() => router.push('/group/create?type=business')}
                    className="flex-1 px-6 py-3 bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-400 font-bold rounded-xl transition-all border-2 border-cyan-400/50"
                  >
                    <i className="ri-building-line mr-2"></i>
                    法人組織
                  </button>
                </div>
              </details>
            </div>
          </div>
        ) : (
          // グループがある場合の通常表示
          <StatusPanel
            currentStatus={currentStatus}
            onStatusChange={handleStatusChange}
            customStatus1={customStatus1}
            customStatus2={customStatus2}
            onCustomClick={(type) => setShowCustomModal(type)}
          />
        )}
      </main>

      {showCustomModal && (
        <CustomStatusModal
          isOpen={!!showCustomModal}
          onClose={() => setShowCustomModal(null)}
          onSave={(label, icon) => handleCustomSave(showCustomModal, label, icon)}
          currentStatus={showCustomModal === 'custom1' ? customStatus1 : customStatus2}
        />
      )}
    </div>
  )
}
