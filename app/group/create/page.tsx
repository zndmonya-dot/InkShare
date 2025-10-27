'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CreateGroupPage() {
  const router = useRouter()
  const [groupName, setGroupName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [error, setError] = useState('')
  const [showInviteCode, setShowInviteCode] = useState(false)
  const [generatedInviteCode, setGeneratedInviteCode] = useState('')

  // 認証チェック
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        const data = await response.json()

        if (!data.user) {
          // ログインしていない場合はランディングページへ
          router.push('/landing')
          return
        }

        setIsCheckingAuth(false)
      } catch (error) {
        console.error('認証チェックエラー:', error)
        router.push('/landing')
      }
    }

    checkAuth()
  }, [router])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)
    setError('')

    // デバッグ：クッキーを確認
    console.log('🍪 All cookies:', document.cookie)

    try {
      const response = await fetch('/api/group/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // クッキーを含める
        body: JSON.stringify({ groupName }),
      })
      
      console.log('📤 Response status:', response.status)
      console.log('📤 Response headers:', [...response.headers.entries()])

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'グループの作成に失敗しました')
      }

      // 招待コードを表示
      setGeneratedInviteCode(data.inviteCode)
      setShowInviteCode(true)
    } catch (err: any) {
      setError(err.message || 'グループの作成に失敗しました')
      setIsLoading(false)
    }
  }

  const handleContinue = () => {
    router.push('/')
    router.refresh()
  }

  // 認証チェック中はローディング表示
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center text-lime-400 text-2xl splatoon-glow">
        <div className="flex items-center gap-3">
          <i className="ri-loader-4-line animate-spin"></i>
          Loading...
        </div>
      </div>
    )
  }

  if (showInviteCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-6">
        <div className="relative w-full max-w-md bg-gray-800/60 border-2 border-lime-400/30 rounded-2xl p-8 backdrop-blur-sm">
          <div className="text-center">
            <div className="mb-6">
              <i className="ri-check-line text-6xl text-lime-400"></i>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              グループが作成されました！
            </h2>
            <p className="text-gray-400 mb-6">
              友達を招待するには、以下のコードを共有してください
            </p>
            <div className="bg-gray-900/80 border-2 border-lime-400 rounded-xl p-6 mb-6">
              <div className="text-sm text-lime-400 mb-2">招待コード</div>
              <div className="text-4xl font-bold text-white tracking-widest">
                {generatedInviteCode}
              </div>
            </div>
            <button
              onClick={handleContinue}
              className="w-full py-3 rounded-xl text-black font-bold text-lg bg-lime-400 hover:bg-lime-300 transition-all active:scale-95"
            >
              <i className="ri-arrow-right-line mr-2"></i>
              InkLinkを始める
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-6 overflow-hidden relative">
      {/* 背景のインク飛び散りエフェクト */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-lime-400 opacity-10 rounded-full blur-3xl ink-float"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-green-500 opacity-10 rounded-full blur-3xl ink-pulse"></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-yellow-400 opacity-10 rounded-full blur-3xl ink-drip"></div>

      <div className="relative w-full max-w-md">
        {/* ロゴ */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-16 h-16 bg-lime-400 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(191,255,0,0.6)] relative overflow-visible">
                <i className="ri-paint-brush-fill text-4xl text-gray-900"></i>
                {/* インク飛び散り */}
                <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-lime-300 opacity-70 ink-splash"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-yellow-300 opacity-60 ink-drip"></div>
              </div>
              <h1 className="text-3xl font-bold text-white drop-shadow-[0_0_20px_rgba(191,255,0,0.5)] splatoon-glow">
                InkLink
              </h1>
            </div>
            <p className="text-lime-400 text-sm font-bold">グループを作成</p>
          </div>
        </div>

        {/* グループ作成フォーム */}
        <div className="relative bg-gray-800/60 border-2 border-lime-400/30 rounded-2xl p-8 backdrop-blur-sm shadow-[0_0_50px_rgba(191,255,0,0.1)] overflow-visible">
          {/* カードのインク飛び散り */}
          <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-lime-300 opacity-50 blur-md ink-splash"></div>
          <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-yellow-300 opacity-40 blur-sm ink-drip"></div>

          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            <i className="ri-group-line mr-2"></i>
            グループを作成
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-rose-500/20 border-2 border-rose-500 rounded-xl text-rose-300 text-sm relative overflow-visible">
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-400 opacity-70 ink-pulse"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-5">
            {/* グループ名 */}
            <div>
              <label className="block text-sm font-bold text-lime-400 mb-2">
                <i className="ri-group-line mr-1"></i>
                グループ名
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
                placeholder="友達の勉強会"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gray-900/60 text-white border-2 border-gray-700 rounded-xl focus:border-lime-400 focus:outline-none transition-all placeholder:text-gray-500 disabled:opacity-50"
              />
            </div>

            {/* 作成ボタン */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-black font-bold text-lg bg-lime-400 hover:bg-lime-300 transition-all active:scale-95 relative overflow-hidden group"
              disabled={isLoading}
            >
              <span className="relative z-10 flex items-center justify-center">
                {isLoading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    グループ作成中...
                  </>
                ) : (
                  <>
                    <i className="ri-group-line mr-2"></i>
                    グループを作成
                  </>
                )}
              </span>
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-lime-300 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 w-full h-full bg-lime-300 opacity-20 blur-xl animate-ink-pulse group-hover:opacity-0"></div>
            </button>
          </form>

          {/* リンク */}
          <div className="mt-6 text-center text-sm space-y-2">
            <div>
              <Link href="/join" className="text-cyan-300 hover:underline">
                招待コードでグループに参加
              </Link>
            </div>
            <div>
              <Link href="/" className="text-gray-400 hover:underline">
                ホームに戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

