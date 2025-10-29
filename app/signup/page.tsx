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
      const signupResponse = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })

      if (!signupResponse.ok) {
        const data = await signupResponse.json()
        throw new Error(data.error || 'サインアップに失敗しました')
      }

      const supabase = createClient()
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError || !signInData.session) {
        throw new Error('ログインに失敗しました')
      }

      router.push('/')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'サインアップに失敗しました')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-splat-dark via-ink-blue to-splat-dark flex items-center justify-center p-6 overflow-hidden relative">
      {/* 背景のインク - スクロール防止版 */}
      <div className="fixed inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-ink-cyan ink-blob blur-[100px]"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-ink-magenta ink-blob blur-[100px]" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* ロゴ */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-16 h-16 bg-ink-cyan rounded-full flex items-center justify-center shadow-xl">
                <i className="ri-paint-brush-fill text-4xl text-splat-dark"></i>
              </div>
              <h1 className="text-5xl font-black text-white">
                Inkshare
              </h1>
            </div>
            <p className="text-white/70 text-base font-bold">アカウントを作成して始めよう</p>
          </div>
        </div>

        {/* サインアップフォーム */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            アカウント作成
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500 rounded-xl text-rose-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* 名前 */}
            <div>
              <label className="block text-sm font-medium text-ink-cyan mb-2">
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
                autoComplete="name"
                className="w-full px-4 py-3 bg-white/5 text-white text-base border border-white/20 rounded-xl focus:border-ink-cyan focus:outline-none transition-all placeholder:text-white/40 disabled:opacity-50"
                style={{ fontSize: '16px' }}
              />
            </div>

            {/* メールアドレス */}
            <div>
              <label className="block text-sm font-medium text-ink-cyan mb-2">
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
                autoComplete="email"
                className="w-full px-4 py-3 bg-white/5 text-white text-base border border-white/20 rounded-xl focus:border-ink-cyan focus:outline-none transition-all placeholder:text-white/40 disabled:opacity-50"
                style={{ fontSize: '16px' }}
              />
            </div>

            {/* パスワード */}
            <div>
              <label className="block text-sm font-medium text-ink-cyan mb-2">
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
                autoComplete="new-password"
                className="w-full px-4 py-3 bg-white/5 text-white text-base border border-white/20 rounded-xl focus:border-ink-cyan focus:outline-none transition-all placeholder:text-white/40 disabled:opacity-50"
                style={{ fontSize: '16px' }}
              />
              <p className="text-xs text-white/50 mt-1">
                8文字以上で設定してください
              </p>
            </div>

            {/* サインアップボタン */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-ink-cyan hover:bg-ink-cyan/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-splat-dark text-lg font-bold rounded-xl transition-all shadow-lg mt-2"
            >
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
            </button>
          </form>

          {/* 利用規約 */}
          <p className="mt-4 text-xs text-white/50 text-center">
            サインアップすることで、利用規約に同意したことになります
          </p>

          {/* ログインへのリンク */}
          <div className="mt-6 text-center pt-6 border-t border-white/10">
            <p className="text-white/60 text-sm mb-3">
              すでにアカウントをお持ちの方は
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-2 bg-white/10 hover:bg-white/20 text-ink-yellow font-medium rounded-lg transition-all border border-ink-yellow/50 hover:border-ink-yellow"
            >
              ログイン
            </Link>
          </div>
        </div>

        {/* 戻るリンク */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-white/50 hover:text-white transition-colors text-sm inline-flex items-center gap-1"
          >
            <i className="ri-arrow-left-line"></i>
            トップに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}
