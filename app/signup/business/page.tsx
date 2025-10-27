'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function BusinessSignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password.length < 8) {
      setError('パスワードは8文字以上で設定してください')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/signup/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, companyName }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'サインアップに失敗しました')
      }

      router.push('/')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'サインアップに失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-6 overflow-hidden relative">
      {/* 背景のインク飛び散りエフェクト */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-cyan-400 opacity-10 rounded-full blur-3xl ink-float"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-500 opacity-10 rounded-full blur-3xl ink-pulse"></div>
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-orange-400 opacity-10 rounded-full blur-3xl ink-drip"></div>

      <div className="relative w-full max-w-md">
        {/* ロゴ */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-16 h-16 bg-cyan-400 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.6)] relative overflow-visible">
                <i className="ri-paint-brush-fill text-4xl text-gray-900"></i>
                {/* インク飛び散り */}
                <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-cyan-300 opacity-70 ink-splash"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-blue-300 opacity-60 ink-drip"></div>
              </div>
              <h1 className="text-3xl font-bold text-white drop-shadow-[0_0_20px_rgba(34,211,238,0.5)] splatoon-glow">
                InkLink
              </h1>
            </div>
            <p className="text-cyan-400 text-sm font-bold">法人向けアカウント作成</p>
          </div>
        </div>

        {/* サインアップフォーム */}
        <div className="relative bg-gray-800/60 border-2 border-cyan-400/30 rounded-2xl p-8 backdrop-blur-sm shadow-[0_0_50px_rgba(34,211,238,0.1)] overflow-visible">
          {/* カードのインク飛び散り */}
          <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-cyan-300 opacity-50 blur-md ink-splash"></div>
          <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-orange-300 opacity-40 blur-sm ink-drip"></div>

          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            <i className="ri-building-line mr-2"></i>
            法人アカウント作成
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-rose-500/20 border-2 border-rose-500 rounded-xl text-rose-300 text-sm relative overflow-visible">
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-400 opacity-70 ink-pulse"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* 会社名 */}
            <div>
              <label className="block text-sm font-bold text-cyan-400 mb-2">
                <i className="ri-building-line mr-1"></i>
                会社名・組織名
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                placeholder="株式会社サンプル"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gray-900/60 text-white border-2 border-gray-700 rounded-xl focus:border-cyan-400 focus:outline-none transition-all placeholder:text-gray-500 disabled:opacity-50"
              />
            </div>

            {/* 担当者名 */}
            <div>
              <label className="block text-sm font-bold text-cyan-400 mb-2">
                <i className="ri-user-line mr-1"></i>
                担当者名
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="山田太郎"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gray-900/60 text-white border-2 border-gray-700 rounded-xl focus:border-cyan-400 focus:outline-none transition-all placeholder:text-gray-500 disabled:opacity-50"
              />
            </div>

            {/* メールアドレス */}
            <div>
              <label className="block text-sm font-bold text-cyan-400 mb-2">
                <i className="ri-mail-line mr-1"></i>
                メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@company.com"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gray-900/60 text-white border-2 border-gray-700 rounded-xl focus:border-cyan-400 focus:outline-none transition-all placeholder:text-gray-500 disabled:opacity-50"
              />
            </div>

            {/* パスワード */}
            <div>
              <label className="block text-sm font-bold text-cyan-400 mb-2">
                <i className="ri-lock-password-line mr-1"></i>
                パスワード (8文字以上)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gray-900/60 text-white border-2 border-gray-700 rounded-xl focus:border-cyan-400 focus:outline-none transition-all placeholder:text-gray-500 disabled:opacity-50"
              />
            </div>

            {/* サインアップボタン */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-black font-bold text-lg bg-cyan-400 hover:bg-cyan-300 transition-all active:scale-95 relative overflow-hidden group"
              disabled={isLoading}
            >
              <span className="relative z-10 flex items-center justify-center">
                {isLoading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    アカウント作成中...
                  </>
                ) : (
                  <>
                    <i className="ri-building-line mr-2"></i>
                    法人アカウントを作成
                  </>
                )}
              </span>
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-cyan-300 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 w-full h-full bg-cyan-300 opacity-20 blur-xl animate-ink-pulse group-hover:opacity-0"></div>
            </button>
          </form>

          {/* ログインリンク */}
          <div className="mt-6 text-center text-sm space-y-2">
            <div>
              <Link href="/signup/personal" className="text-lime-300 hover:underline">
                個人向けアカウント作成はこちら
              </Link>
            </div>
            <div>
              <Link href="/login" className="text-gray-400 hover:underline">
                すでにアカウントをお持ちですか？ ログイン
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

