'use client'

import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-6 overflow-hidden relative">
      {/* 背景のインク飛び散りエフェクト */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-lime-400 opacity-10 rounded-full blur-3xl ink-float"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-400 opacity-10 rounded-full blur-3xl ink-pulse"></div>
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-orange-400 opacity-10 rounded-full blur-3xl ink-drip"></div>

      <div className="relative max-w-4xl w-full text-center">
        {/* ロゴ */}
        <div className="mb-8 flex items-center justify-center gap-6">
          <div className="w-24 h-24 bg-lime-400 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(191,255,0,0.7)] relative overflow-visible ink-pulse">
            <i className="ri-paint-brush-fill text-6xl text-gray-900"></i>
            {/* インク飛び散り */}
            <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-lime-300 opacity-70 ink-splash"></div>
            <div className="absolute -bottom-2 -left-2 w-5 h-5 rounded-full bg-yellow-300 opacity-60 ink-drip"></div>
          </div>
          <h1 className="text-6xl font-bold text-white drop-shadow-[0_0_30px_rgba(191,255,0,0.6)] splatoon-glow">
            InkLink
          </h1>
        </div>

        {/* キャッチコピー */}
        <p className="text-2xl text-lime-400 font-bold mb-4 splatoon-glow">
          話しかけやすさを、可視化する
        </p>
        <p className="text-lg text-gray-400 mb-12">
          チームの今をリアルタイムで共有する、ステータス管理ツール
        </p>

        {/* 特徴 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-800/60 border-2 border-lime-400/30 rounded-2xl p-6 backdrop-blur-sm relative overflow-visible group hover:border-lime-400/60 transition-all">
            <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-lime-300 opacity-50 blur-sm ink-splash group-hover:scale-125 transition-transform"></div>
            <div className="mb-3">
              <i className="ri-chat-check-line text-5xl text-lime-400"></i>
            </div>
            <h3 className="text-lime-400 font-bold text-lg mb-2">リアルタイムステータス</h3>
            <p className="text-gray-400 text-sm">
              10種類のステータスで、今話しかけていいかすぐわかる
            </p>
          </div>

          <div className="bg-gray-800/60 border-2 border-cyan-400/30 rounded-2xl p-6 backdrop-blur-sm relative overflow-visible group hover:border-cyan-400/60 transition-all">
            <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-cyan-300 opacity-50 blur-sm ink-splash group-hover:scale-125 transition-transform"></div>
            <div className="mb-3">
              <i className="ri-team-line text-5xl text-cyan-400"></i>
            </div>
            <h3 className="text-cyan-400 font-bold text-lg mb-2">プロアクティブな交流</h3>
            <p className="text-gray-400 text-sm">
              「誰か雑談しましょう」「お昼誘って」など、積極的なコミュニケーションを促進
            </p>
          </div>

          <div className="bg-gray-800/60 border-2 border-orange-400/30 rounded-2xl p-6 backdrop-blur-sm relative overflow-visible group hover:border-orange-400/60 transition-all">
            <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-orange-300 opacity-50 blur-sm ink-splash group-hover:scale-125 transition-transform"></div>
            <div className="mb-3">
              <i className="ri-smartphone-line text-5xl text-orange-400"></i>
            </div>
            <h3 className="text-orange-400 font-bold text-lg mb-2">PWA対応</h3>
            <p className="text-gray-400 text-sm">
              スマホにインストールして、アプリみたいに使える
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-8">
          {/* プラン選択 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* 法人向けプラン */}
            <div className="bg-gray-800/60 border-2 border-cyan-400/40 rounded-2xl p-6 backdrop-blur-sm relative overflow-visible group hover:border-cyan-400 transition-all">
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-cyan-300 opacity-50 blur-sm ink-splash group-hover:scale-125 transition-transform"></div>
              <div className="mb-4">
                <i className="ri-building-line text-5xl text-cyan-400"></i>
              </div>
              <h3 className="text-cyan-400 font-bold text-2xl mb-2">法人向け</h3>
              <p className="text-gray-400 text-sm mb-6">
                組織全体でセキュアに管理。管理者による招待制で安心。
              </p>
              <Link
                href="/signup/business"
                className="block w-full py-3 rounded-xl text-black font-bold text-lg bg-cyan-400 hover:bg-cyan-300 transition-all active:scale-95 text-center"
              >
                <i className="ri-building-line mr-2"></i>
                法人アカウント作成
              </Link>
            </div>

            {/* 個人向けプラン */}
            <div className="bg-gray-800/60 border-2 border-lime-400/40 rounded-2xl p-6 backdrop-blur-sm relative overflow-visible group hover:border-lime-400 transition-all">
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-lime-300 opacity-50 blur-sm ink-splash group-hover:scale-125 transition-transform"></div>
              <div className="mb-4">
                <i className="ri-group-line text-5xl text-lime-400"></i>
              </div>
              <h3 className="text-lime-400 font-bold text-2xl mb-2">個人向け</h3>
              <p className="text-gray-400 text-sm mb-6">
                友達や勉強会で気軽に使える。参加コードで簡単に招待。
              </p>
              <Link
                href="/signup/personal"
                className="block w-full py-3 rounded-xl text-black font-bold text-lg bg-lime-400 hover:bg-lime-300 transition-all active:scale-95 text-center"
              >
                <i className="ri-group-line mr-2"></i>
                グループを作成
              </Link>
            </div>
          </div>

          {/* ログインボタン */}
          <div className="text-center">
            <Link
              href="/login"
              className="inline-block px-12 py-4 bg-white/10 hover:bg-white/20 text-lime-400 font-bold text-lg rounded-2xl transition-all border-2 border-lime-400/50 hover:border-lime-400 active:scale-95"
            >
              <span className="flex items-center gap-2">
                <i className="ri-login-box-line"></i>
                ログイン
              </span>
            </Link>
          </div>
        </div>

        {/* フッター */}
        <div className="mt-16 text-gray-500 text-sm">
          <p>無料プラン: 最大10名まで</p>
        </div>
      </div>
    </div>
  )
}

