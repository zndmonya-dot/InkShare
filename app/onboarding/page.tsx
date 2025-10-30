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
                InkShare
              </h1>
            </div>
          </div>
        </div>

        {/* ウェルカムメッセージ */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
            さあ、始めよう！
          </h2>
          <p className="text-white/60 text-lg">
            新しいグループを作るか、招待コードで参加
          </p>
        </div>

        {/* アクション選択 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* グループを作成 */}
          <Link
            href="/group/create"
            className="relative bg-white/10 backdrop-blur-sm border-2 border-ink-yellow/40 rounded-3xl p-10 hover:border-ink-yellow hover:shadow-2xl hover:shadow-ink-yellow/30 transition-all duration-300 group cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            style={{ 
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              willChange: 'transform, box-shadow, border-color'
            }}
          >
            {/* 光るエフェクト */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-ink-yellow/0 via-ink-yellow/5 to-ink-yellow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative text-center">
              {/* アイコン */}
              <div className="relative w-28 h-28 mx-auto mb-6">
                <div className="absolute inset-0 bg-ink-yellow rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative w-full h-full bg-ink-yellow rounded-full flex items-center justify-center shadow-2xl shadow-ink-yellow/50 group-hover:scale-110 group-hover:rotate-[5deg] transition-all duration-300">
                  <i className="ri-add-circle-fill text-6xl text-splat-dark"></i>
                </div>
              </div>
              
              {/* テキスト */}
              <h3 className="text-ink-yellow font-black text-3xl mb-3 group-hover:scale-105 transition-transform">
                グループを作成
              </h3>
              <p className="text-white/60 text-base leading-relaxed">
                新しいグループを作成して<br />
                メンバーを招待
              </p>
              
              {/* 矢印アイコン */}
              <div className="mt-6 flex items-center justify-center gap-2 text-ink-yellow font-bold">
                <span>作成する</span>
                <i className="ri-arrow-right-line text-xl group-hover:translate-x-2 transition-transform"></i>
              </div>
            </div>
          </Link>

          {/* 招待コードで参加 */}
          <Link
            href="/join"
            className="relative bg-white/10 backdrop-blur-sm border-2 border-ink-cyan/40 rounded-3xl p-10 hover:border-ink-cyan hover:shadow-2xl hover:shadow-ink-cyan/30 transition-all duration-300 group cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            style={{ 
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              willChange: 'transform, box-shadow, border-color'
            }}
          >
            {/* 光るエフェクト */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-ink-cyan/0 via-ink-cyan/5 to-ink-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative text-center">
              {/* アイコン */}
              <div className="relative w-28 h-28 mx-auto mb-6">
                <div className="absolute inset-0 bg-ink-cyan rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative w-full h-full bg-ink-cyan rounded-full flex items-center justify-center shadow-2xl shadow-ink-cyan/50 group-hover:scale-110 group-hover:rotate-[-5deg] transition-all duration-300">
                  <i className="ri-key-2-fill text-6xl text-splat-dark"></i>
                </div>
              </div>
              
              {/* テキスト */}
              <h3 className="text-ink-cyan font-black text-3xl mb-3 group-hover:scale-105 transition-transform">
                招待で参加
              </h3>
              <p className="text-white/60 text-base leading-relaxed">
                既存のグループに<br />
                招待コードで参加
              </p>
              
              {/* 矢印アイコン */}
              <div className="mt-6 flex items-center justify-center gap-2 text-ink-cyan font-bold">
                <span>参加する</span>
                <i className="ri-arrow-right-line text-xl group-hover:translate-x-2 transition-transform"></i>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

