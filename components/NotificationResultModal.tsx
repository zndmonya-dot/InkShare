'use client'

import { Notification } from '@/types'
import { NOTIFICATION_MESSAGES } from '@/config/status'

interface NotificationResultModalProps {
  notification: Notification
  onClose: () => void
}

export function NotificationResultModal({
  notification,
  onClose,
}: NotificationResultModalProps) {
  const config = NOTIFICATION_MESSAGES[notification.type]
  const isAccepted = notification.status === 'accepted'

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-gray-900 to-black border-2 border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 結果アイコン */}
        <div className="text-center mb-6">
          {isAccepted ? (
            <>
              <div className="w-20 h-20 mx-auto rounded-full bg-lime-400 flex items-center justify-center mb-4 animate-bounce">
                <i className="ri-checkbox-circle-fill text-5xl text-black"></i>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                承諾されました！
              </h2>
            </>
          ) : (
            <>
              <div className="w-20 h-20 mx-auto rounded-full bg-gray-600 flex items-center justify-center mb-4">
                <i className="ri-close-circle-fill text-5xl text-white"></i>
              </div>
              <h2 className="text-xl font-bold text-gray-300 mb-2">
                今回は難しいようです
              </h2>
            </>
          )}

          {/* メッセージ */}
          <p className="text-lg text-gray-300">
            {notification.fromUserName}さん
            {isAccepted ? config.accepted : config.declined}
          </p>
        </div>

        {/* OKボタン */}
        <button
          onClick={onClose}
          className={`w-full py-4 ${
            isAccepted
              ? 'bg-lime-400 hover:bg-lime-300 text-black'
              : 'bg-white/10 hover:bg-white/20 text-white'
          } font-bold rounded-xl transition-all active:scale-95 shadow-lg`}
        >
          OK
        </button>
      </div>
    </div>
  )
}

