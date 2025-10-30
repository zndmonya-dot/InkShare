'use client'

import { useState, useEffect, useCallback } from 'react'
import type { CustomStatus } from '@/types'
import { AVAILABLE_ICONS } from '@/constants/icons'

interface CustomStatusModalProps {
  isOpen: boolean
  currentStatus: CustomStatus & { color?: string }
  onClose: () => void
  onSave: (label: string, icon: string, color: string) => void
}

// カラーパレット
const COLOR_OPTIONS = [
  { name: '赤', class: 'bg-red-500' },
  { name: 'ピンク', class: 'bg-pink-500' },
  { name: 'ローズ', class: 'bg-rose-500' },
  { name: 'オレンジ', class: 'bg-orange-500' },
  { name: '黄色', class: 'bg-yellow-500' },
  { name: 'ライム', class: 'bg-lime-500' },
  { name: '緑', class: 'bg-green-500' },
  { name: 'エメラルド', class: 'bg-emerald-500' },
  { name: 'ティール', class: 'bg-teal-500' },
  { name: 'シアン', class: 'bg-cyan-500' },
  { name: '水色', class: 'bg-sky-500' },
  { name: '青', class: 'bg-blue-500' },
  { name: 'インディゴ', class: 'bg-indigo-500' },
  { name: '紫', class: 'bg-purple-500' },
  { name: 'バイオレット', class: 'bg-violet-500' },
  { name: 'フクシア', class: 'bg-fuchsia-500' },
]

export function CustomStatusModal({
  isOpen,
  currentStatus,
  onClose,
  onSave,
}: CustomStatusModalProps) {
  const [customLabel, setCustomLabel] = useState(currentStatus.label)
  const [customIcon, setCustomIcon] = useState(currentStatus.icon)
  const [customColor, setCustomColor] = useState(currentStatus.color || 'bg-fuchsia-500')

  // モーダルが開いた時にラベル、アイコン、色を更新
  useEffect(() => {
    if (isOpen) {
      setCustomLabel(currentStatus.label)
      setCustomIcon(currentStatus.icon)
      setCustomColor(currentStatus.color || 'bg-fuchsia-500')
    }
  }, [isOpen, currentStatus])

  // モーダル表示時に背景スクロールをロック
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleSave = useCallback(() => {
    onSave(customLabel, customIcon, customColor)
  }, [customLabel, customIcon, customColor, onSave])

  const handleOverlayClick = useCallback(() => {
    onClose()
  }, [onClose])

  const handleContentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={handleContentClick}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            カスタムステータス
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {/* ステータス名 */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              ステータス名
            </label>
            <input
              type="text"
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              placeholder="例: 勉強中、コーヒー休憩"
              className="w-full px-4 py-3 bg-white/5 text-white border border-white/20 rounded-xl focus:border-ink-yellow focus:outline-none transition-all placeholder:text-white/40"
            />
          </div>

          {/* 色選択 */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              色を選択
            </label>
            <div className="grid grid-cols-8 gap-2 p-2 bg-white/5 rounded-xl border border-white/20">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color.class}
                  onClick={() => setCustomColor(color.class)}
                  className={`
                    w-8 h-8 rounded-lg transition-all ${color.class}
                    ${customColor === color.class
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-splat-dark scale-110'
                      : 'hover:scale-105'
                    }
                  `}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* アイコン選択 */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              アイコンを選択
            </label>
            <div className="grid grid-cols-6 gap-2 mb-3 max-h-48 overflow-y-auto p-2 bg-white/5 rounded-xl border border-white/20">
              {AVAILABLE_ICONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setCustomIcon(icon)}
                  className={`
                    p-3 rounded-lg transition-all
                    ${customIcon === icon
                      ? 'bg-ink-yellow text-splat-dark scale-105'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <i className={`${icon} text-xl`}></i>
                </button>
              ))}
            </div>
            <p className="text-xs text-white/60">
              または、<a href="https://remixicon.com" target="_blank" rel="noopener noreferrer" className="text-ink-cyan hover:underline">remixicon.com</a>から直接入力：
            </p>
            <input
              type="text"
              value={customIcon}
              onChange={(e) => setCustomIcon(e.target.value)}
              placeholder="ri-star-line"
              className="w-full px-3 py-2 mt-2 bg-white/5 text-white border border-white/20 rounded-lg focus:border-ink-yellow focus:outline-none transition-all placeholder:text-white/40 text-sm"
            />
          </div>

          {/* プレビュー */}
          <div className={`${customColor} p-5 rounded-xl border-2 border-splat-dark/20`}>
            <p className="text-sm text-splat-dark font-medium mb-3">プレビュー</p>
            <div className="flex flex-col items-center gap-3 py-4">
              <i className={`${customIcon || 'ri-edit-line'} text-6xl text-splat-dark`}></i>
              <span className="text-splat-dark font-bold text-lg">{customLabel || 'カスタムステータス'}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all border border-white/20"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={!customLabel.trim()}
            className="flex-1 py-3 bg-ink-yellow hover:bg-ink-yellow/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-splat-dark font-bold rounded-xl transition-all shadow-lg"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}

