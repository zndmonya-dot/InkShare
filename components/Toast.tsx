'use client'

import { useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
  message: string
  type: ToastType
  duration?: number
  onClose: () => void
}

const toastConfig = {
  success: {
    bgColor: 'bg-ink-green',
    borderColor: 'border-green-500',
    icon: '✓',
    textColor: 'text-white',
  },
  error: {
    bgColor: 'bg-ink-red',
    borderColor: 'border-red-500',
    icon: '✕',
    textColor: 'text-white',
  },
  info: {
    bgColor: 'bg-ink-blue',
    borderColor: 'border-blue-500',
    icon: 'ℹ',
    textColor: 'text-white',
  },
  warning: {
    bgColor: 'bg-ink-yellow',
    borderColor: 'border-yellow-500',
    icon: '⚠',
    textColor: 'text-splat-dark',
  },
}

export function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  const config = toastConfig[type]

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in-scale">
      <div
        className={`
          ${config.bgColor} ${config.borderColor} ${config.textColor}
          border-2 rounded-lg shadow-lg
          px-4 py-3 min-w-[280px] max-w-[90vw]
          flex items-center gap-3
          backdrop-blur-sm
        `}
        role="alert"
      >
        <span className="text-2xl font-bold flex-shrink-0">{config.icon}</span>
        <p className="text-sm font-semibold flex-1">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="閉じる"
        >
          <i className="ri-close-line text-xl"></i>
        </button>
      </div>
    </div>
  )
}

// トースト管理用のコンポーネント
export function ToastContainer({ toasts, onClose }: { toasts: Array<{ id: string; message: string; type: ToastType }>, onClose: (id: string) => void }) {
  return (
    <>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onClose(toast.id)}
        />
      ))}
    </>
  )
}

// トーストを表示するためのカスタムフック
export function useToast() {
  const showToast = (
    message: string,
    type: ToastType,
    toasts: Array<{ id: string; message: string; type: ToastType }>,
    setToasts: (toasts: Array<{ id: string; message: string; type: ToastType }>) => void
  ) => {
    const id = Date.now().toString()
    setToasts([...toasts, { id, message, type }])
  }

  return { showToast }
}

