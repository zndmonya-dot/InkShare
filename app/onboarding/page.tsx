'use client'

import Link from 'next/link'

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-6 overflow-hidden relative">
      {/* 背景のインク飛び散りエフェクト */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-lime-400 opacity-10 rounded-full blur-3xl ink-float"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-400 opacity-10 rounded-full blur-3xl ink-pulse"></div>
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-orange-400 opacity-10 rounded-full blur-3xl ink-drip"></div>

      {/* ログアウトボタン（右上） */}
      <Link
        href="/logout"
        className="absolute top-6 right-6 px-4 py-2 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-lg transition-all border border-gray-700 hover:border-gray-500 text-sm"
      >
        <i className="ri-logout-box-line mr-1"></i>
        ログアウト
      </Link>

      <div className="relative max-w-2xl w-full">
        {/* ロゴ */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-20 h-20 bg-lime-400 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(191,255,0,0.7)] relative overflow-visible">
                <i className="ri-paint-brush-fill text-5xl text-gray-900"></i>
                {/* インク飛び散り */}
                <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-lime-300 opacity-70 ink-splash"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-yellow-300 opacity-60 ink-drip"></div>
              </div>
              <h1 className="text-4xl font-bold text-white drop-shadow-[0_0_25px_rgba(191,255,0,0.6)] splatoon-glow">
                Inkshare
              </h1>
            </div>
          </div>
        </div>

        {/* ウェルカムメッセージ */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-3">
            Inkshareを始めましょう
          </h2>
          <p className="text-gray-400 text-lg">
            グループを作成するか、既存のグループに参加してください
          </p>
        </div>

        {/* アクション選択 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 個人グループを作成 */}
          <div className="bg-gray-800/60 border-2 border-lime-400/40 rounded-2xl p-6 backdrop-blur-sm relative overflow-visible group hover:border-lime-400 transition-all">
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-lime-300 opacity-50 blur-sm ink-splash group-hover:scale-125 transition-transform"></div>
            <div className="text-center mb-4">
              <i className="ri-group-line text-5xl text-lime-400 mb-3 block"></i>
              <h3 className="text-lime-400 font-bold text-xl mb-2">個人グループ作成</h3>
              <p className="text-gray-400 text-xs">
                友達や勉強会で使える気軽なグループ
              </p>
            </div>
            <Link
              href="/group/create?type=personal"
              className="block w-full py-2.5 rounded-xl text-black font-bold text-base bg-lime-400 hover:bg-lime-300 transition-all active:scale-95 text-center"
            >
              <i className="ri-add-line mr-1"></i>
              作成する
            </Link>
          </div>

          {/* 法人組織を作成 */}
          <div className="bg-gray-800/60 border-2 border-cyan-400/40 rounded-2xl p-6 backdrop-blur-sm relative overflow-visible group hover:border-cyan-400 transition-all">
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-cyan-300 opacity-50 blur-sm ink-splash group-hover:scale-125 transition-transform"></div>
            <div className="text-center mb-4">
              <i className="ri-building-line text-5xl text-cyan-400 mb-3 block"></i>
              <h3 className="text-cyan-400 font-bold text-xl mb-2">法人組織作成</h3>
              <p className="text-gray-400 text-xs">
                会社やチームで使える組織
              </p>
            </div>
            <Link
              href="/group/create?type=business"
              className="block w-full py-2.5 rounded-xl text-black font-bold text-base bg-cyan-400 hover:bg-cyan-300 transition-all active:scale-95 text-center"
            >
              <i className="ri-add-line mr-1"></i>
              作成する
            </Link>
          </div>

          {/* 招待コードで参加 */}
          <div className="bg-gray-800/60 border-2 border-orange-400/40 rounded-2xl p-6 backdrop-blur-sm relative overflow-visible group hover:border-orange-400 transition-all">
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-orange-300 opacity-50 blur-sm ink-splash group-hover:scale-125 transition-transform"></div>
            <div className="text-center mb-4">
              <i className="ri-key-line text-5xl text-orange-400 mb-3 block"></i>
              <h3 className="text-orange-400 font-bold text-xl mb-2">招待で参加</h3>
              <p className="text-gray-400 text-xs">
                既存のグループや組織に参加する
              </p>
            </div>
            <Link
              href="/join"
              className="block w-full py-2.5 rounded-xl text-black font-bold text-base bg-orange-400 hover:bg-orange-300 transition-all active:scale-95 text-center"
            >
              <i className="ri-login-box-line mr-1"></i>
              参加する
            </Link>
          </div>
        </div>

        {/* スキップオプション */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-400 text-sm hover:underline"
          >
            後で設定する
          </Link>
        </div>
      </div>
    </div>
  )
}

