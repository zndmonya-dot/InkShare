'use client'

import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-splat-dark via-ink-blue to-splat-dark flex items-center justify-center p-8 overflow-hidden relative">
      {/* 背景のインク - スクロール防止版 */}
      <div className="fixed inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-ink-yellow ink-blob blur-[100px]"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-ink-cyan ink-blob blur-[100px]" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="relative max-w-5xl w-full">
        {/* ロゴ - バランス版 */}
        <div className="text-center mb-16">
          <div className="inline-flex flex-col items-center gap-6 relative">
            {/* ロゴアイコン - シンプル版 */}
            <div className="relative w-28 h-28 bg-ink-yellow rounded-full flex items-center justify-center shadow-xl">
              <i className="ri-paint-brush-fill text-7xl text-splat-dark relative z-10"></i>
            </div>
            
            {/* ブランド名 */}
            <h1 className="text-7xl font-black text-white tracking-tight">
              InkLink
            </h1>
          </div>

          {/* キャッチコピー */}
          <div className="mt-10 space-y-4">
            <p className="text-3xl text-ink-yellow font-bold">
              話しかけやすさを、可視化する
            </p>
            <p className="text-lg text-white/70">
              チームの今をリアルタイムで共有する、ステータス管理ツール
            </p>
          </div>
        </div>

        {/* 特徴 - クリーン版 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white/5 backdrop-blur-sm border-2 border-ink-yellow/50 rounded-2xl p-8 text-center transition-all hover:bg-white/10 hover:border-ink-yellow">
            <i className="ri-chat-check-line text-5xl text-ink-yellow mb-4"></i>
            <h3 className="text-ink-yellow font-bold text-lg mb-3">リアルタイムステータス</h3>
            <p className="text-white/70 text-sm">
              10種類のステータスで、今話しかけていいかすぐわかる
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border-2 border-ink-cyan/50 rounded-2xl p-8 text-center transition-all hover:bg-white/10 hover:border-ink-cyan">
            <i className="ri-team-line text-5xl text-ink-cyan mb-4"></i>
            <h3 className="text-ink-cyan font-bold text-lg mb-3">プロアクティブな交流</h3>
            <p className="text-white/70 text-sm">
              積極的なコミュニケーションを促進
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border-2 border-ink-magenta/50 rounded-2xl p-8 text-center transition-all hover:bg-white/10 hover:border-ink-magenta">
            <i className="ri-smartphone-line text-5xl text-ink-magenta mb-4"></i>
            <h3 className="text-ink-magenta font-bold text-lg mb-3">PWA対応</h3>
            <p className="text-white/70 text-sm">
              スマホにインストールして使える
            </p>
          </div>
        </div>

        {/* CTA - デモボタン追加 */}
        <div className="text-center space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* サインアップボタン */}
            <Link
              href="/signup"
              className="inline-block px-12 py-4 bg-ink-yellow hover:bg-ink-yellow/90 text-splat-dark text-xl font-black rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              無料で始める
            </Link>

            {/* ログインボタン - 目立つように */}
            <Link
              href="/login"
              className="inline-block px-12 py-4 bg-white/10 hover:bg-white/20 text-white text-xl font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 border-2 border-white/30 hover:border-white/50"
            >
              ログイン
            </Link>
          </div>

          {/* デモボタン */}
          <div>
            <Link
              href="/demo"
              className="inline-block px-8 py-3 bg-ink-cyan/20 hover:bg-ink-cyan/30 text-ink-cyan text-base font-bold rounded-xl transition-all hover:scale-105 active:scale-95 border border-ink-cyan/50"
            >
              <i className="ri-play-circle-line mr-2"></i>
              デモを試す（ログイン不要）
            </Link>
          </div>

          <p className="text-white/60 text-base font-bold">
            個人グループも法人組織も作成できます
          </p>

          {/* フッター */}
          <div className="mt-8 space-y-2">
            <p className="text-white/50 text-sm">
              無料プラン: 最大10名まで
            </p>
            <p className="text-white/40 text-xs">
              Created by <span className="text-white/60 font-medium">Kenya Okada</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

