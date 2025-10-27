'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { StatusPanel } from '@/components/StatusPanel'
import type { PresenceStatus, CustomStatus } from '@/types/status'

// 型を再エクスポート（後方互換性のため）
export type { PresenceStatus, CustomStatus }

const DEFAULT_CUSTOM_STATUS: CustomStatus = {
  label: 'カスタム',
  icon: 'ri-edit-line',
}

const AUTO_CHANGE_HOUR = 17
const CHECK_INTERVAL_MS = 60 * 1000 // 1分

export default function Home() {
  const router = useRouter()
  const [currentStatus, setCurrentStatus] = useState<PresenceStatus>('available')
  const [customStatus1, setCustomStatus1] = useState<CustomStatus>({
    ...DEFAULT_CUSTOM_STATUS,
    label: 'カスタム1',
  })
  const [customStatus2, setCustomStatus2] = useState<CustomStatus>({
    ...DEFAULT_CUSTOM_STATUS,
    label: 'カスタム2',
  })
  const [showCustomModal, setShowCustomModal] = useState<'custom1' | 'custom2' | null>(null)

  // 定時自動切り替え（17:00になったら「定時で帰りたい」に）
  useEffect(() => {

    const checkTime = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()

      // 17:00になったら自動で「定時で帰りたい」に
      if (hours === AUTO_CHANGE_HOUR && minutes === 0 && currentStatus !== 'going-home') {
        setCurrentStatus('going-home')
      }
    }

    const interval = setInterval(checkTime, CHECK_INTERVAL_MS)
    checkTime() // 初回実行

    return () => clearInterval(interval)
  }, [currentStatus])

  // ステータス変更ハンドラー
  const handleStatusChange = useCallback((status: PresenceStatus) => {
    setCurrentStatus(status)
    // TODO: バックエンドに送信
  }, [])

  // カスタムステータス編集開始ハンドラー
  const handleCustomEdit = useCallback((customId: 'custom1' | 'custom2') => {
    setShowCustomModal(customId)
  }, [])

  // カスタムステータス保存ハンドラー
  const handleCustomSave = useCallback((label: string, icon: string) => {
    setShowCustomModal((current) => {
      if (current === 'custom1') {
        setCustomStatus1({ label, icon })
      } else if (current === 'custom2') {
        setCustomStatus2({ label, icon })
      }
      return null
    })
  }, [])

  // モーダルを閉じるハンドラー
  const handleCloseModal = useCallback(() => {
    setShowCustomModal(null)
  }, [])

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      {/* ヘッダー */}
      <header className="px-4 py-3 sm:py-4 flex items-center justify-between flex-shrink-0 overflow-visible">
        <h1 className="text-lg sm:text-xl font-bold text-white drop-shadow-[0_2px_8px_rgba(191,255,0,0.5)]">
          在籍管理
        </h1>
        <button
          onClick={() => router.push('/team')}
          className="relative px-5 py-2.5 sm:px-6 sm:py-3 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-xl transition-all active:scale-95 text-sm sm:text-base shadow-[0_0_25px_rgba(191,255,0,0.6)] hover:shadow-[0_0_35px_rgba(191,255,0,0.8)] overflow-visible group"
        >
          {/* インク飛び散りエフェクト - 強化版 */}
          <div className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-lime-300 opacity-70 ink-splash"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-lime-500 opacity-60 ink-drip"></div>
          <div className="absolute top-0 -right-4 w-3 h-3 rounded-full bg-yellow-300 opacity-50 ink-pulse"></div>
          <div className="absolute -top-2 left-1/4 w-3 h-3 rounded-full bg-lime-200 opacity-40 ink-float"></div>
          <div className="absolute bottom-0 right-1/3 w-2 h-2 rounded-full bg-lime-400 opacity-50 ink-drip" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute top-1 -left-1 w-2 h-2 rounded-full bg-yellow-400 opacity-60 ink-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute -bottom-1 right-1/4 w-1.5 h-1.5 rounded-full bg-lime-500 opacity-40 ink-splash" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute top-1/2 -right-2 w-1.5 h-1.5 rounded-full bg-yellow-300 opacity-50 ink-float" style={{ animationDelay: '0.4s' }}></div>
          
          <span className="relative z-10 flex items-center splatoon-glow">
            <i className="ri-group-line mr-1.5"></i>
            チームを見る
          </span>
        </button>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 px-2 py-2 overflow-visible">
        <StatusPanel
          currentStatus={currentStatus}
          customStatus1={customStatus1}
          customStatus2={customStatus2}
          onStatusChange={handleStatusChange}
          onCustomEdit={handleCustomEdit}
          showCustomModal={showCustomModal}
          onCloseCustomModal={handleCloseModal}
          onCustomSave={handleCustomSave}
        />
      </main>
    </div>
  )
}

