'use client'

import { useState, useEffect } from 'react'
import { requestNotificationPermission, checkNotificationPermission } from '@/lib/notifications'

export function NotificationPermissionPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    const currentPermission = checkNotificationPermission()
    setPermission(currentPermission)

    // 許可されていない場合、少し時間を置いてから表示
    if (currentPermission === 'default') {
      const dismissed = localStorage.getItem('notification-permission-dismissed')
      if (!dismissed) {
        setTimeout(() => {
          setShowPrompt(true)
        }, 10000) // 10秒後
      }
    }
  }, [])

  const handleAllow = async () => {
    const newPermission = await requestNotificationPermission()
    setPermission(newPermission)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('notification-permission-dismissed', 'true')
  }

  if (!showPrompt || permission !== 'default') return null

  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-slide-down">
      <div className="bg-gray-800/95 backdrop-blur-lg border-2 border-cyan-400/40 rounded-2xl p-4 shadow-[0_0_30px_rgba(34,211,238,0.3)] max-w-md mx-auto relative overflow-visible">
        {/* インク飛び散り */}
        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-cyan-300 opacity-70 animate-pulse"></div>
        
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
          aria-label="閉じる"
        >
          <i className="ri-close-line text-xl"></i>
        </button>

        <div className="flex items-start gap-3 pr-6">
          <div className="w-12 h-12 bg-cyan-400 rounded-xl flex items-center justify-center flex-shrink-0">
            <i className="ri-notification-line text-2xl text-gray-900"></i>
          </div>
          
          <div className="flex-1">
            <h3 className="text-white font-bold text-base mb-1">
              通知を有効にする
            </h3>
            <p className="text-gray-300 text-sm mb-3">
              チームメンバーのステータス変更をリアルタイムで通知します
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleAllow}
                className="flex-1 py-2 rounded-lg text-black font-bold text-sm bg-cyan-400 hover:bg-cyan-300 transition-all active:scale-95"
              >
                <i className="ri-notification-line mr-1"></i>
                有効にする
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 rounded-lg text-gray-300 font-bold text-sm bg-white/10 hover:bg-white/20 transition-all active:scale-95"
              >
                後で
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

