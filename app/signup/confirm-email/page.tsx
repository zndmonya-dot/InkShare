'use client'

import Link from 'next/link'

export default function ConfirmEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-6 overflow-hidden relative">
      {/* 背景のインク飛び散りエフェクト */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-lime-400 opacity-10 rounded-full blur-3xl ink-float"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-400 opacity-10 rounded-full blur-3xl ink-pulse"></div>
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-orange-400 opacity-10 rounded-full blur-3xl ink-drip"></div>

      <div className="relative max-w-md w-full">
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

        {/* メール確認メッセージ */}
        <div className="bg-gray-800/60 border-2 border-cyan-400/40 rounded-2xl p-8 backdrop-blur-sm relative overflow-visible text-center">
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-cyan-300 opacity-50 blur-sm ink-splash"></div>
          
          <div className="mb-6">
            <i className="ri-mail-send-line text-6xl text-cyan-400"></i>
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">
            確認メールを送信しました
          </h2>

          <p className="text-gray-300 mb-6">
            ご登録いただいたメールアドレスに確認メールを送信しました。
            <br />
            メール内のリンクをクリックして、アカウントを有効化してください。
          </p>

          <div className="bg-cyan-900/20 border border-cyan-400/30 rounded-xl p-4 mb-6">
            <p className="text-cyan-300 text-sm">
              <i className="ri-information-line mr-2"></i>
              メールが届かない場合は、迷惑メールフォルダをご確認ください
            </p>
          </div>

          <Link
            href="/login"
            className="block w-full py-3 rounded-xl text-black font-bold text-lg bg-cyan-400 hover:bg-cyan-300 transition-all active:scale-95"
          >
            <i className="ri-login-box-line mr-2"></i>
            ログインページへ
          </Link>
        </div>
      </div>
    </div>
  )
}

