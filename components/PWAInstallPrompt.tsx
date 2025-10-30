'use client'

import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // インストール済みかチェック
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // iOS判定
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

    // Android/Desktop: beforeinstallpromptイベント
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const installEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(installEvent)
      
      // 初回訪問から少し経ってから表示
      setTimeout(() => {
        const dismissed = localStorage.getItem('pwa-install-dismissed')
        if (!dismissed) { 
          setShowPrompt(true)
        }
      }, 5000) // 5秒後
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // iOS: 手動で表示判定
    if (iOS && !isInstalled) {
      setTimeout(() => {
        const dismissed = localStorage.getItem('pwa-install-dismissed')
        if (!dismissed) {
          setShowPrompt(true)
        }
      }, 5000)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [isInstalled])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('PWA installed')
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-install-dismissed', 'true')
  }

  if (!showPrompt || isInstalled) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <div className="bg-gray-800/95 backdrop-blur-lg border-2 border-lime-400/40 rounded-2xl p-4 shadow-[0_0_30px_rgba(191,255,0,0.3)] max-w-md mx-auto relative overflow-visible">
        {/* インク飛び散り */}
        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-lime-300 opacity-70 animate-pulse"></div>
        
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
          aria-label="閉じる"
        >
          <i className="ri-close-line text-xl"></i>
        </button>

        <div className="flex items-start gap-3 pr-6">
          <div className="w-12 h-12 bg-lime-400 rounded-xl flex items-center justify-center flex-shrink-0">
            <i className="ri-paint-brush-fill text-2xl text-gray-900"></i>
          </div>
          
          <div className="flex-1">
            <h3 className="text-white font-bold text-base mb-1">
              InkShareをインストール
            </h3>
            <p className="text-gray-300 text-sm mb-3">
              {isIOS 
                ? 'Safariの共有ボタンから「ホーム画面に追加」でアプリとして使えます'
                : 'ホーム画面に追加してアプリのように使いましょう'}
            </p>

            {!isIOS && deferredPrompt && (
              <button
                onClick={handleInstallClick}
                className="w-full py-2 rounded-lg text-black font-bold text-sm bg-lime-400 hover:bg-lime-300 transition-all active:scale-95"
              >
                <i className="ri-download-line mr-1"></i>
                インストール
              </button>
            )}

            {isIOS && (
              <div className="flex items-center gap-2 text-xs text-lime-400">
                <i className="ri-share-line"></i>
                <span>共有</span>
                <i className="ri-arrow-right-s-line"></i>
                <i className="ri-add-box-line"></i>
                <span>ホーム画面に追加</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

