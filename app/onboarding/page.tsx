'use client'

import Link from 'next/link'

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-splat-dark via-ink-blue to-splat-dark flex items-center justify-center p-6 overflow-hidden relative">
      {/* 背景のインク */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-ink-yellow ink-blob blur-[100px]"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-ink-cyan ink-blob blur-[100px]" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-[50%] left-[50%] w-[300px] h-[300px] bg-ink-magenta ink-blob blur-[100px]" style={{animationDelay: '3s'}}></div>
      </div>

      {/* ログアウトボタン（右上） */}
      <Link
        href="/logout"
        className="absolute top-6 right-6 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20"
        style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 20 }}
      >
        <i className="ri-logout-box-line mr-1"></i>
        ログアウト
      </Link>

      <div className="relative max-w-3xl w-full z-10">
        {/* ロゴ */}
        <div className="text-center mb-10 animate-fade-in-scale">
          <div className="inline-block">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-20 h-20 bg-ink-yellow rounded-full flex items-center justify-center shadow-2xl shadow-ink-yellow/50">
                <i className="ri-paint-brush-fill text-5xl text-splat-dark"></i>
              </div>
              <h1 className="text-5xl font-black text-white">
                Inkshare
              </h1>
            </div>
          </div>
        </div>

        {/* ウェルカムメッセージ */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Inkshareを始めましょう
          </h2>
          <p className="text-white/70 text-lg">
            グループを作成するか、既存のグループに参加してください
          </p>
        </div>

        {/* アクション選択 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* グループを作成 */}
          <div className="bg-white/10 backdrop-blur-sm border-2 border-ink-yellow/40 rounded-2xl p-8 hover:border-ink-yellow hover:shadow-2xl hover:shadow-ink-yellow/20 transition-all group">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-ink-yellow rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-ink-yellow/50 group-hover:scale-110 transition-transform">
                <i className="ri-add-circle-fill text-4xl text-splat-dark"></i>
              </div>
              <h3 className="text-ink-yellow font-bold text-2xl mb-3">グループを作成</h3>
              <p className="text-white/70 text-sm">
                新しいグループを作成して<br />メンバーを招待しましょう
              </p>
            </div>
            <Link
              href="/group/create"
              className="block w-full py-4 rounded-xl text-splat-dark font-bold text-lg bg-ink-yellow hover:bg-ink-yellow/90 shadow-lg"
              style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
            >
              <i className="ri-add-line mr-2 text-xl"></i>
              作成する
            </Link>
          </div>

          {/* 招待コードで参加 */}
          <div className="bg-white/10 backdrop-blur-sm border-2 border-ink-cyan/40 rounded-2xl p-8 hover:border-ink-cyan hover:shadow-2xl hover:shadow-ink-cyan/20 transition-all group">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-ink-cyan rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-ink-cyan/50 group-hover:scale-110 transition-transform">
                <i className="ri-key-2-fill text-4xl text-splat-dark"></i>
              </div>
              <h3 className="text-ink-cyan font-bold text-2xl mb-3">招待で参加</h3>
              <p className="text-white/70 text-sm">
                既存のグループに<br />招待コードで参加します
              </p>
            </div>
            <Link
              href="/join"
              className="block w-full py-4 rounded-xl text-splat-dark font-bold text-lg bg-ink-cyan hover:bg-ink-cyan/90 shadow-lg"
              style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
            >
              <i className="ri-login-box-line mr-2 text-xl"></i>
              参加する
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

