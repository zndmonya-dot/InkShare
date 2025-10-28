'use client'

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
    'bg-rose-500': { light: 'bg-rose-300', medium: 'bg-rose-400', dark: 'bg-rose-600', bright: 'bg-pink-400' },
    'bg-cyan-400': { light: 'bg-cyan-200', medium: 'bg-cyan-300', dark: 'bg-cyan-500', bright: 'bg-blue-300' },
    'bg-orange-400': { light: 'bg-orange-200', medium: 'bg-orange-300', dark: 'bg-orange-500', bright: 'bg-yellow-400' },
    'bg-yellow-400': { light: 'bg-yellow-200', medium: 'bg-yellow-300', dark: 'bg-yellow-500', bright: 'bg-amber-300' },
    'bg-blue-500': { light: 'bg-blue-300', medium: 'bg-blue-400', dark: 'bg-blue-600', bright: 'bg-sky-400' },
    'bg-teal-400': { light: 'bg-teal-200', medium: 'bg-teal-300', dark: 'bg-teal-500', bright: 'bg-cyan-300' },
    'bg-slate-500': { light: 'bg-slate-300', medium: 'bg-slate-400', dark: 'bg-slate-600', bright: 'bg-gray-400' },
    'bg-fuchsia-500': { light: 'bg-fuchsia-300', medium: 'bg-fuchsia-400', dark: 'bg-fuchsia-600', bright: 'bg-pink-400' },
    'bg-purple-500': { light: 'bg-purple-300', medium: 'bg-purple-400', dark: 'bg-purple-600', bright: 'bg-violet-400' },
  }
  return colorMap[activeColor] || { light: 'bg-white', medium: 'bg-white', dark: 'bg-white', bright: 'bg-white' }
}

export function StatusButton({
  label,
  icon,
  activeColor,
  glowColor,
  isActive,
  onClick,
  onDoubleClick,
}: StatusButtonProps) {
  const inkColors = getInkColors(activeColor)
  
  return (
    <button
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      style={{
        transition: 'all 0.3s ease-out',
      }}
      className={`
        relative w-full h-full rounded-2xl p-4 sm:p-5 md:p-6
        flex flex-col items-center justify-center
        ${
          isActive
            ? `${activeColor} shadow-2xl scale-105 border-2 border-splat-dark/20`
            : 'bg-white/5 shadow-lg hover:bg-white/10 hover:scale-[1.02] active:scale-95 border-2 border-white/15 hover:border-white/25 backdrop-blur-sm'
        }
      `}
    >
      {/* コンテンツ */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-3 h-full">
        <i className={`${icon} text-6xl sm:text-7xl md:text-8xl ${isActive ? 'text-splat-dark' : 'text-white/50'} flex-shrink-0`}></i>
        <span
          className={`
            text-sm sm:text-base md:text-lg font-bold text-center leading-tight px-2
            ${isActive ? 'text-splat-dark' : 'text-white/60'}
          `}
        >
          {label}
        </span>
      </div>
    </button>
  )
}

