'use client'

import { memo } from 'react'

interface StatusButtonProps {
  label: string
  icon: string
  activeColor: string
  glowColor: string
  isActive: boolean
  onClick: (e: React.MouseEvent) => void
  onDoubleClick?: (e: React.MouseEvent) => void
}

// activeColorから色名を抽出してインク飛び散り用の色を生成
const getInkColors = (activeColor: string) => {
  const colorMap: Record<string, { light: string; medium: string; dark: string; bright: string }> = {
    'bg-lime-400': { light: 'bg-lime-200', medium: 'bg-lime-300', dark: 'bg-lime-500', bright: 'bg-yellow-300' },
    'bg-lime-500': { light: 'bg-lime-300', medium: 'bg-lime-400', dark: 'bg-lime-600', bright: 'bg-yellow-400' },
    'bg-red-500': { light: 'bg-red-300', medium: 'bg-red-400', dark: 'bg-red-600', bright: 'bg-rose-400' },
    'bg-pink-500': { light: 'bg-pink-300', medium: 'bg-pink-400', dark: 'bg-pink-600', bright: 'bg-rose-400' },
    'bg-rose-500': { light: 'bg-rose-300', medium: 'bg-rose-400', dark: 'bg-rose-600', bright: 'bg-pink-400' },
    'bg-orange-500': { light: 'bg-orange-300', medium: 'bg-orange-400', dark: 'bg-orange-600', bright: 'bg-yellow-400' },
    'bg-yellow-500': { light: 'bg-yellow-300', medium: 'bg-yellow-400', dark: 'bg-yellow-600', bright: 'bg-amber-400' },
    'bg-green-500': { light: 'bg-green-300', medium: 'bg-green-400', dark: 'bg-green-600', bright: 'bg-lime-400' },
    'bg-emerald-500': { light: 'bg-emerald-300', medium: 'bg-emerald-400', dark: 'bg-emerald-600', bright: 'bg-green-400' },
    'bg-teal-500': { light: 'bg-teal-300', medium: 'bg-teal-400', dark: 'bg-teal-600', bright: 'bg-cyan-400' },
    'bg-cyan-500': { light: 'bg-cyan-300', medium: 'bg-cyan-400', dark: 'bg-cyan-600', bright: 'bg-sky-400' },
    'bg-cyan-400': { light: 'bg-cyan-200', medium: 'bg-cyan-300', dark: 'bg-cyan-500', bright: 'bg-blue-300' },
    'bg-sky-500': { light: 'bg-sky-300', medium: 'bg-sky-400', dark: 'bg-sky-600', bright: 'bg-blue-400' },
    'bg-orange-400': { light: 'bg-orange-200', medium: 'bg-orange-300', dark: 'bg-orange-500', bright: 'bg-yellow-400' },
    'bg-yellow-400': { light: 'bg-yellow-200', medium: 'bg-yellow-300', dark: 'bg-yellow-500', bright: 'bg-amber-300' },
    'bg-blue-400': { light: 'bg-blue-200', medium: 'bg-blue-300', dark: 'bg-blue-500', bright: 'bg-sky-400' },
    'bg-blue-500': { light: 'bg-blue-300', medium: 'bg-blue-400', dark: 'bg-blue-600', bright: 'bg-sky-400' },
    'bg-indigo-500': { light: 'bg-indigo-300', medium: 'bg-indigo-400', dark: 'bg-indigo-600', bright: 'bg-blue-400' },
    'bg-purple-500': { light: 'bg-purple-300', medium: 'bg-purple-400', dark: 'bg-purple-600', bright: 'bg-violet-400' },
    'bg-violet-500': { light: 'bg-violet-300', medium: 'bg-violet-400', dark: 'bg-violet-600', bright: 'bg-purple-400' },
    'bg-fuchsia-500': { light: 'bg-fuchsia-300', medium: 'bg-fuchsia-400', dark: 'bg-fuchsia-600', bright: 'bg-pink-400' },
    'bg-pink-400': { light: 'bg-pink-200', medium: 'bg-pink-300', dark: 'bg-pink-500', bright: 'bg-rose-300' },
    'bg-teal-400': { light: 'bg-teal-200', medium: 'bg-teal-300', dark: 'bg-teal-500', bright: 'bg-cyan-300' },
    'bg-slate-400': { light: 'bg-slate-200', medium: 'bg-slate-300', dark: 'bg-slate-500', bright: 'bg-gray-300' },
    'bg-slate-500': { light: 'bg-slate-300', medium: 'bg-slate-400', dark: 'bg-slate-600', bright: 'bg-gray-400' },
    'bg-fuchsia-400': { light: 'bg-fuchsia-200', medium: 'bg-fuchsia-300', dark: 'bg-fuchsia-500', bright: 'bg-pink-400' },
    'bg-purple-400': { light: 'bg-purple-200', medium: 'bg-purple-300', dark: 'bg-purple-500', bright: 'bg-violet-300' },
    'bg-indigo-400': { light: 'bg-indigo-200', medium: 'bg-indigo-300', dark: 'bg-indigo-500', bright: 'bg-purple-400' },
    'bg-sky-400': { light: 'bg-sky-200', medium: 'bg-sky-300', dark: 'bg-sky-500', bright: 'bg-cyan-300' },
  }
  return colorMap[activeColor] || { light: 'bg-white', medium: 'bg-white', dark: 'bg-white', bright: 'bg-white' }
}

// 背景色に応じて適切な文字色を返す（濃い色は白文字、明るい色は黒文字）
const getTextColor = (activeColor: string): string => {
  // 白文字が必要な濃い色
  const darkColors = [
    'bg-red-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 
    'bg-green-500', 'bg-teal-500', 'bg-cyan-500', 'bg-violet-500',
    'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500', 'bg-indigo-400',
    'bg-sky-500', 'bg-emerald-500', 'bg-slate-500', 'bg-slate-400'
  ]
  
  return darkColors.includes(activeColor) ? 'text-white' : 'text-splat-dark'
}

export const StatusButton = memo(function StatusButton({
  label,
  icon,
  activeColor,
  glowColor,
  isActive,
  onClick,
  onDoubleClick,
}: StatusButtonProps) {
  const inkColors = getInkColors(activeColor)
  const textColor = getTextColor(activeColor)
  
  return (
    <button
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      style={{
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform, background-color, box-shadow',
      }}
      className={`
        relative w-full h-full rounded-2xl p-4 sm:p-5 md:p-6
        flex flex-col items-center justify-center
        ${
          isActive
            ? `${activeColor} shadow-2xl scale-105 border-2 border-splat-dark/20`
            : 'bg-white/5 shadow-lg hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] border-2 border-white/15 hover:border-white/25 backdrop-blur-sm'
        }
      `}
    >
      {/* コンテンツ */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-3 h-full">
        <i className={`${icon} text-6xl sm:text-7xl md:text-8xl ${isActive ? textColor : 'text-white/50'} flex-shrink-0`}></i>
        <span
          className={`
            text-sm sm:text-base md:text-lg font-bold text-center leading-tight px-2
            ${isActive ? textColor : 'text-white/60'}
          `}
        >
          {label}
        </span>
      </div>
    </button>
  )
})

