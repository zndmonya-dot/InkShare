'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
      // 1. サーバー側でユーザー作成（メール確認スキップ）
      const signupResponse = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })

      if (!signupResponse.ok) {
        const data = await signupResponse.json()
        throw new Error(data.error || 'サインアップに失敗しました')
      }

      // 2. クライアント側でログイン
      const supabase = createClient()
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError || !signInData.session) {
        throw new Error('ログインに失敗しました')
      }

      // 3. ホーム画面へ（グループなし状態で表示）
      router.push('/')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'サインアップに失敗しました')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-6 overflow-hidden">
      {/* 背景のインク飛び散りエフェクト */}
      <div className="absolute top-10 right-20 w-72 h-72 bg-cyan-400 opacity-10 rounded-full blur-3xl ink-float"></div>
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-orange-400 opacity-10 rounded-full blur-3xl ink-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-56 h-56 bg-lime-400 opacity-10 rounded-full blur-3xl ink-drip"></div>

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
            <p className="text-gray-400 text-sm">アカウントを作成して始めよう</p>
          </div>
        </div>

        {/* サインアップフォーム */}
        <div className="relative bg-gray-800/60 border-2 border-cyan-400/30 rounded-2xl p-8 backdrop-blur-sm shadow-[0_0_50px_rgba(34,211,238,0.1)] overflow-visible">
          {/* カードのインク飛び散り */}
          <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-cyan-300 opacity-50 blur-md ink-splash"></div>
          <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-orange-300 opacity-40 blur-sm ink-drip"></div>

          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            アカウント作成
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-rose-500/20 border-2 border-rose-500 rounded-xl text-rose-300 text-sm relative overflow-visible">
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-400 opacity-70 ink-pulse"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* 名前 */}
            <div>
              <label className="block text-sm font-bold text-cyan-400 mb-2">
                <i className="ri-user-line mr-1"></i>
                あなたの名前
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
                placeholder="your@email.com"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gray-900/60 text-white border-2 border-gray-700 rounded-xl focus:border-cyan-400 focus:outline-none transition-all placeholder:text-gray-500 disabled:opacity-50"
              />
            </div>

            {/* パスワード */}
            <div>
              <label className="block text-sm font-bold text-cyan-400 mb-2">
                <i className="ri-lock-password-line mr-1"></i>
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="8文字以上"
                minLength={8}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gray-900/60 text-white border-2 border-gray-700 rounded-xl focus:border-cyan-400 focus:outline-none transition-all placeholder:text-gray-500 disabled:opacity-50"
              />
              <p className="text-xs text-gray-400 mt-1">
                8文字以上で設定してください
              </p>
            </div>

            {/* サインアップボタン */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full py-4 bg-cyan-400 hover:bg-cyan-300 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold text-lg rounded-xl transition-all active:scale-95 shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:shadow-[0_0_40px_rgba(34,211,238,0.7)] overflow-visible group mt-6"
            >
              {!isLoading && (
                <>
                  {/* ボタンのインク飛び散り */}
                  <div className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-cyan-300 opacity-70 ink-splash group-hover:scale-110 transition-transform"></div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-blue-300 opacity-60 ink-drip group-hover:scale-110 transition-transform"></div>
                  <div className="absolute top-1 -right-2 w-3 h-3 rounded-full bg-cyan-200 opacity-50 ink-pulse"></div>
                </>
              )}
              <span className="relative z-10">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="ri-loader-4-line animate-spin"></i>
                    作成中...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <i className="ri-user-add-line"></i>
                    アカウントを作成
                  </span>
                )}
              </span>
            </button>
          </form>

          {/* 利用規約 */}
          <p className="mt-4 text-xs text-gray-400 text-center">
            サインアップすることで、利用規約に同意したことになります
          </p>

          {/* ログインへのリンク */}
          <div className="mt-6 text-center pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-sm mb-2">
              すでにアカウントをお持ちの方は
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-2 bg-white/10 hover:bg-white/20 text-cyan-400 font-bold rounded-xl transition-all border-2 border-cyan-400/30 hover:border-cyan-400/50"
            >
              <i className="ri-login-box-line mr-1"></i>
              ログイン
            </Link>
          </div>
        </div>

        {/* 戻るリンク */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center gap-1"
          >
            <i className="ri-arrow-left-line"></i>
            トップに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}

