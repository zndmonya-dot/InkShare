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
          className={`
            relative w-full h-full rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6
            flex flex-col items-center justify-center
            transition-all duration-300 ease-out
            active:scale-95
            ${
              isActive
                ? `${activeColor} ${glowColor} shadow-[0_0_30px] scale-105 border-2 border-white/30`
                : 'bg-gray-800/60 shadow-lg hover:bg-gray-800/80 border-2 border-gray-700/50'
            }
          `}
    >
        {/* 背景アニメーション - アクティブ時のみ */}
        {isActive && (
          <>
            <div
              className={`
              absolute inset-0 rounded-2xl ${activeColor} opacity-60 blur-2xl
              animate-pulse
            `}
            />
            {/* インク飛び散り風エフェクト - Splatoon強化版（カラー付き） */}
            {/* 大きな飛び散り */}
            <div className={`absolute -top-4 -right-4 w-12 h-12 rounded-full ${inkColors.light} opacity-60 blur-lg ink-splash`}></div>
            <div className={`absolute -bottom-4 -left-4 w-10 h-10 rounded-full ${inkColors.medium} opacity-50 blur-md ink-drip`} style={{ animationDelay: '0.2s' }}></div>
            <div className={`absolute top-1/2 -right-5 w-8 h-8 rounded-full ${inkColors.light} opacity-45 blur-md ink-pulse`} style={{ animationDelay: '0.4s' }}></div>
            
            {/* 中サイズの飛び散り */}
            <div className={`absolute -top-3 left-1/4 w-7 h-7 rounded-full ${inkColors.bright} opacity-40 blur-sm ink-float`}></div>
            <div className={`absolute bottom-1/4 -left-3 w-6 h-6 rounded-full ${inkColors.medium} opacity-50 blur-sm ink-drip`} style={{ animationDelay: '0.6s' }}></div>
            <div className={`absolute top-1/4 -left-2 w-5 h-5 rounded-full ${inkColors.light} opacity-35 blur-sm ink-pulse`} style={{ animationDelay: '0.1s' }}></div>
            <div className={`absolute -bottom-2 right-1/4 w-5 h-5 rounded-full ${inkColors.bright} opacity-45 blur-sm ink-float`} style={{ animationDelay: '0.3s' }}></div>
            
            {/* 小さい飛び散り */}
            <div className={`absolute -top-2 right-1/3 w-4 h-4 rounded-full ${inkColors.medium} opacity-55 ink-splash`} style={{ animationDelay: '0.5s' }}></div>
            <div className={`absolute bottom-1 -right-2 w-4 h-4 rounded-full ${inkColors.light} opacity-45 ink-drip`}></div>
            <div className={`absolute top-1 -left-1 w-3 h-3 rounded-full ${inkColors.dark} opacity-60 ink-pulse`} style={{ animationDelay: '0.7s' }}></div>
            <div className={`absolute -top-1 left-1/3 w-3 h-3 rounded-full ${inkColors.bright} opacity-35 ink-float`} style={{ animationDelay: '0.2s' }}></div>
            <div className={`absolute bottom-0 left-2/3 w-2 h-2 rounded-full ${inkColors.medium} opacity-65 ink-splash`} style={{ animationDelay: '0.4s' }}></div>
            <div className={`absolute top-2 -right-1 w-2 h-2 rounded-full ${inkColors.light} opacity-50 ink-drip`} style={{ animationDelay: '0.8s' }}></div>
            
            {/* 極小の飛び散り */}
            <div className={`absolute top-1/3 -right-0.5 w-1.5 h-1.5 rounded-full ${inkColors.bright} opacity-70 ink-pulse`}></div>
            <div className={`absolute bottom-1/3 -left-0.5 w-1.5 h-1.5 rounded-full ${inkColors.light} opacity-60 ink-float`} style={{ animationDelay: '0.6s' }}></div>
            <div className={`absolute -top-0.5 left-1/2 w-1 h-1 rounded-full ${inkColors.medium} opacity-55 ink-splash`} style={{ animationDelay: '0.3s' }}></div>
          </>
        )}

      {/* コンテンツ */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-2 sm:gap-3 h-full">
        <i className={`${icon} text-5xl sm:text-6xl md:text-7xl ${isActive ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]' : 'text-gray-500'} flex-shrink-0`}></i>
        <span
          className={`
            text-xs sm:text-sm md:text-base font-bold text-center leading-tight px-1 sm:px-2
            ${isActive ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' : 'text-gray-500'}
          `}
        >
          {label}
        </span>
      </div>

      {/* リップル効果の準備（将来的に追加可能） */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className="ripple" />
      </div>
    </button>
  )
}

