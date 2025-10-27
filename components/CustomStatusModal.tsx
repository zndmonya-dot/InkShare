'use client'

import { useState, useEffect, useCallback } from 'react'
import type { CustomStatus } from '@/types/status'
import { AVAILABLE_ICONS } from '@/constants/icons'

interface CustomStatusModalProps {
  isOpen: boolean
  currentStatus: CustomStatus
  onClose: () => void
  onSave: (label: string, icon: string) => void
}

export function CustomStatusModal({
  isOpen,
  currentStatus,
  onClose,
  onSave,
}: CustomStatusModalProps) {
  const [customLabel, setCustomLabel] = useState(currentStatus.label)
  const [customIcon, setCustomIcon] = useState(currentStatus.icon)

  // モーダルが開いた時にラベルとアイコンを更新
  useEffect(() => {
    if (isOpen) {
      setCustomLabel(currentStatus.label)
      setCustomIcon(currentStatus.icon)
    }
  }, [isOpen, currentStatus])

  const handleSave = useCallback(() => {
    onSave(customLabel, customIcon)
  }, [customLabel, customIcon, onSave])

  const handleOverlayClick = useCallback(() => {
    onClose()
  }, [onClose])

  const handleContentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-gradient-to-br from-gray-900 to-black border-2 border-lime-400/30 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(191,255,0,0.3)]"
        onClick={handleContentClick}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white drop-shadow-[0_2px_8px_rgba(191,255,0,0.5)]">
            カスタムステータス
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        <div className="space-y-5 mb-6">
          {/* ステータス名 */}
          <div>
            <label className="block text-sm font-bold text-lime-400 mb-2">
              ステータス名
            </label>
            <input
              type="text"
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              placeholder="例: 勉強中、コーヒー休憩"
              className="w-full px-4 py-3 bg-gray-800/60 text-white border-2 border-gray-700/50 rounded-xl focus:border-lime-400 focus:outline-none transition-colors text-base"
            />
          </div>

          {/* アイコン選択 */}
          <div>
            <label className="block text-sm font-bold text-lime-400 mb-3">
              アイコンを選択
            </label>
            <div className="grid grid-cols-6 gap-2 mb-3 max-h-64 overflow-y-auto p-2 bg-gray-800/30 rounded-xl border border-gray-700/50">
              {AVAILABLE_ICONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setCustomIcon(icon)}
                  className={`
                    p-3 rounded-lg transition-all
                    ${customIcon === icon
                      ? 'bg-lime-400 text-black scale-110 shadow-lg'
                      : 'bg-gray-700/50 text-white hover:bg-gray-600/50 hover:scale-105'
                    }
                  `}
                >
                  <i className={`${icon} text-xl`}></i>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400">
              または、<a href="https://remixicon.com" target="_blank" rel="noopener noreferrer" className="text-lime-400 hover:underline">remixicon.com</a>から直接入力：
            </p>
            <input
              type="text"
              value={customIcon}
              onChange={(e) => setCustomIcon(e.target.value)}
              placeholder="ri-star-line"
              className="w-full px-3 py-2 mt-2 bg-gray-800/60 text-white border border-gray-700/50 rounded-lg focus:border-lime-400 focus:outline-none transition-colors text-sm"
            />
          </div>

          {/* プレビュー */}
          <div className="bg-gray-800/60 p-5 rounded-xl border-2 border-lime-400/30 shadow-[0_0_20px_rgba(191,255,0,0.2)]">
            <p className="text-sm text-lime-400 font-bold mb-3">プレビュー</p>
            <div className="flex flex-col items-center gap-3 py-4">
              <i className={`${customIcon || 'ri-edit-line'} text-6xl text-lime-400`}></i>
              <span className="text-white font-bold text-xl">{customLabel || 'カスタムステータス'}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all active:scale-95"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={!customLabel.trim()}
            className="flex-1 py-3 bg-lime-400 hover:bg-lime-300 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all active:scale-95 shadow-[0_0_20px_rgba(191,255,0,0.4)]"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}

