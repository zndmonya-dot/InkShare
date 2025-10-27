'use client'

import Link from 'next/link'

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-6 overflow-hidden relative">
      {/* 背景のインク飛び散りエフェクト */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-lime-400 opacity-10 rounded-full blur-3xl ink-float"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-400 opacity-10 rounded-full blur-3xl ink-pulse"></div>
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-orange-400 opacity-10 rounded-full blur-3xl ink-drip"></div>

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
                InkLink
              </h1>
            </div>
          </div>
        </div>

        {/* ウェルカムメッセージ */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-3">
            <i className="ri-check-line text-lime-400 mr-2"></i>
            アカウント作成完了！
          </h2>
          <p className="text-gray-400 text-lg">
            次は、グループを作成するか、既存のグループに参加してください
          </p>
        </div>

        {/* アクション選択 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* グループを作成 */}
          <div className="bg-gray-800/60 border-2 border-lime-400/40 rounded-2xl p-8 backdrop-blur-sm relative overflow-visible group hover:border-lime-400 transition-all">
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-lime-300 opacity-50 blur-sm ink-splash group-hover:scale-125 transition-transform"></div>
            <div className="text-center mb-6">
              <i className="ri-group-line text-6xl text-lime-400 mb-4 block"></i>
              <h3 className="text-lime-400 font-bold text-2xl mb-2">グループを作成</h3>
              <p className="text-gray-400 text-sm">
                新しいグループを作って、友達を招待しましょう
              </p>
            </div>
            <Link
              href="/group/create"
              className="block w-full py-3 rounded-xl text-black font-bold text-lg bg-lime-400 hover:bg-lime-300 transition-all active:scale-95 text-center"
            >
              <i className="ri-add-line mr-2"></i>
              グループを作成
            </Link>
          </div>

          {/* グループに参加 */}
          <div className="bg-gray-800/60 border-2 border-cyan-400/40 rounded-2xl p-8 backdrop-blur-sm relative overflow-visible group hover:border-cyan-400 transition-all">
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-cyan-300 opacity-50 blur-sm ink-splash group-hover:scale-125 transition-transform"></div>
            <div className="text-center mb-6">
              <i className="ri-key-line text-6xl text-cyan-400 mb-4 block"></i>
              <h3 className="text-cyan-400 font-bold text-2xl mb-2">グループに参加</h3>
              <p className="text-gray-400 text-sm">
                招待コードを使って、既存のグループに参加しましょう
              </p>
            </div>
            <Link
              href="/join"
              className="block w-full py-3 rounded-xl text-black font-bold text-lg bg-cyan-400 hover:bg-cyan-300 transition-all active:scale-95 text-center"
            >
              <i className="ri-login-box-line mr-2"></i>
              招待コードで参加
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

