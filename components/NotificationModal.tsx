'use client'

import { Notification, NotificationStatus } from '@/types'
import { NOTIFICATION_MESSAGES } from '@/config/status'

interface NotificationModalProps {
  notification: Notification
  onReply: (notificationId: string, status: NotificationStatus) => void
  onClose: () => void
}

export function NotificationModal({
  notification,
  onReply,
  onClose,
}: NotificationModalProps) {
  const config = NOTIFICATION_MESSAGES[notification.type]

  const handleReply = (status: NotificationStatus) => {
    onReply(notification.id, status)
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-gray-900 to-black border-2 border-white/20 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in slide-in-from-bottom duration-300 sm:slide-in-from-bottom-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* アバターとメッセージ */}
        <div className="text-center mb-6">
          {/* アバター */}
          <div
            className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${notification.fromUserAvatar} flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-4`}
          >
            {notification.fromUserName.charAt(0)}
          </div>

          {/* 送信者名 */}
          <h2 className="text-xl font-bold text-white mb-2">
            <i className={`${config.icon} mr-2`}></i>
            {notification.fromUserName}さんから
          </h2>

          {/* メッセージ */}
          <p className="text-lg text-gray-300 font-semibold">
            「{config.request}」
          </p>
        </div>

        {/* 返信ボタン */}
        <div className="space-y-3 mb-4">
          {/* はい */}
          <button
            onClick={() => handleReply('accepted')}
            className="w-full py-4 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
          >
            <i className="ri-checkbox-circle-line text-2xl"></i>
            <span>はい</span>
          </button>

          {/* いいえ */}
          <button
            onClick={() => handleReply('declined')}
            className="w-full py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
          >
            <i className="ri-close-circle-line text-2xl"></i>
            <span>いいえ</span>
          </button>
        </div>

        {/* 後で返信 */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all"
        >
          後で返信
        </button>
      </div>
    </div>
  )
}

