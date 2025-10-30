'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'

export default function JoinGroupPage() {
  const router = useRouter()
  const [inviteCode, setInviteCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser()
      setIsLoggedIn(!!user)
      setIsCheckingAuth(false)
    }
    checkAuth()
  }, [])

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (inviteCode.length !== 8) {
      setError('招待コードは8文字です')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/group/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode: inviteCode.toUpperCase() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'グループへの参加に失敗しました')
      }

      // 成功したらメインページへ
      router.push('/')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'グループへの参加に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-splat-dark via-ink-blue to-splat-dark flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-ink-cyan/30"></div>
          <div className="absolute inset-0 ink-spinner">
            <div className="w-full h-full rounded-full border-4 border-transparent border-t-ink-cyan border-r-ink-cyan"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-ink-cyan rounded-full ink-pulse-ring"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-splat-dark via-ink-blue to-splat-dark flex items-center justify-center p-6 relative overflow-hidden">
        {/* 背景のインク */}
        <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
          <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-ink-magenta ink-blob blur-[100px]"></div>
          <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-ink-cyan ink-blob blur-[100px]" style={{animationDelay: '1.5s'}}></div>
        </div>

        <div className="relative w-full max-w-md bg-white/10 backdrop-blur-sm border-2 border-ink-magenta/40 rounded-2xl p-8 shadow-2xl z-10 text-center animate-fade-in-scale">
          <div className="w-20 h-20 bg-ink-magenta rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-ink-magenta/50">
            <i className="ri-lock-line text-5xl text-white"></i>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            ログインが必要です
          </h2>
          <p className="text-white/70 mb-6">
            グループに参加するには、まずアカウントを作成してください
          </p>
          <div className="space-y-3">
            <Link
              href="/signup"
              className="block w-full py-4 rounded-xl text-splat-dark font-bold text-lg bg-ink-yellow hover:bg-ink-yellow/90 shadow-lg"
              style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
            >
              <i className="ri-user-add-line mr-2"></i>
              アカウントを作成
            </Link>
            <Link
              href="/login"
              className="block w-full py-4 rounded-xl text-ink-yellow font-bold text-lg bg-white/10 hover:bg-white/20 border-2 border-ink-yellow/50 hover:border-ink-yellow"
              style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
            >
              <i className="ri-login-box-line mr-2"></i>
              ログイン
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-splat-dark via-ink-blue to-splat-dark flex items-center justify-center p-6 overflow-hidden relative">
      {/* 背景のインク */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-ink-cyan ink-blob blur-[100px]"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-ink-yellow ink-blob blur-[100px]" style={{animationDelay: '1.5s'}}></div>
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

      <div className="relative w-full max-w-md z-10">
        {/* ロゴ */}
        <div className="text-center mb-10 animate-fade-in-scale">
          <div className="inline-block">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-20 h-20 bg-ink-cyan rounded-full flex items-center justify-center shadow-2xl shadow-ink-cyan/50">
                <i className="ri-paint-brush-fill text-5xl text-splat-dark"></i>
              </div>
              <h1 className="text-5xl font-black text-white">
                InkShare
              </h1>
            </div>
            <p className="text-ink-cyan text-base font-bold">招待コードで参加</p>
          </div>
        </div>

        {/* 参加フォーム */}
        <div className="relative bg-white/10 backdrop-blur-sm border-2 border-ink-cyan/40 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
            <i className="ri-key-2-line"></i>
            招待コードを入力
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500 rounded-xl text-rose-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleJoin} className="space-y-5">
            {/* 招待コード */}
            <div>
              <label className="block text-sm font-bold text-ink-cyan mb-3 text-center">
                <i className="ri-key-2-line mr-1"></i>
                8文字の招待コード
              </label>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                required
                placeholder="ABC12345"
                maxLength={8}
                disabled={isLoading}
                className="w-full px-4 py-4 bg-white/5 text-white border-2 border-white/20 rounded-xl focus:border-ink-cyan focus:outline-none placeholder:text-white/30 disabled:opacity-50 text-center text-3xl font-black tracking-[0.3em]"
                style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
              />
              <p className="text-white/50 text-xs mt-2 text-center">
                グループの管理者から共有された招待コードを入力
              </p>
            </div>

            {/* 参加ボタン */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl text-splat-dark font-bold text-lg bg-ink-cyan hover:bg-ink-cyan/90 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  参加中...
                </>
              ) : (
                <>
                  <i className="ri-login-box-line mr-2"></i>
                  グループに参加
                </>
              )}
            </button>
          </form>

          {/* リンク */}
          <div className="mt-6 text-center text-sm space-y-2">
            <div>
              <Link href="/group/create" className="text-ink-yellow hover:underline">
                招待コードがない場合は新しいグループを作成
              </Link>
            </div>
            <div>
              <Link href="/onboarding" className="text-white/60 hover:text-white hover:underline">
                戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

