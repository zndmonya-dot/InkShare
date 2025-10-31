'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ToastContainer, ToastType } from '@/components/Toast'

function CreateGroupContent() {
  const router = useRouter()
  
  const [groupName, setGroupName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [error, setError] = useState('')
  const [showInviteCode, setShowInviteCode] = useState(false)
  const [generatedInviteCode, setGeneratedInviteCode] = useState('')
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([])

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

    try {
      const response = await fetch('/api/group/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          groupName
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '作成に失敗しました')
      }

      // 招待コードを表示
      if (data.inviteCode) {
        setGeneratedInviteCode(data.inviteCode)
      }
      setShowInviteCode(true)
    } catch (err: any) {
      setError(err.message || '作成に失敗しました')
      setIsLoading(false)
    }
  }

  const handleContinue = () => {
    // グループ作成後は強制リロードしてから遷移
    window.location.href = '/'
  }

  // 認証チェック中はローディング表示
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-splat-dark via-ink-blue to-splat-dark flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-ink-yellow/30"></div>
          <div className="absolute inset-0 ink-spinner">
            <div className="w-full h-full rounded-full border-4 border-transparent border-t-ink-yellow border-r-ink-yellow"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-ink-yellow rounded-full ink-pulse-ring"></div>
          </div>
        </div>
      </div>
    )
  }

  if (showInviteCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-splat-dark via-ink-blue to-splat-dark flex items-center justify-center p-6 relative overflow-hidden">
        {/* 背景のインク */}
        <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
          <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-ink-yellow ink-blob blur-[100px]"></div>
          <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-ink-cyan ink-blob blur-[100px]" style={{animationDelay: '1.5s'}}></div>
        </div>

        {/* トースト通知 */}
        <ToastContainer 
          toasts={toasts} 
          onClose={(id) => setToasts(toasts.filter(t => t.id !== id))} 
        />

        <div className="relative w-full max-w-md bg-white/10 backdrop-blur-sm border-2 border-ink-yellow/40 rounded-2xl p-8 shadow-2xl z-10 animate-fade-in-scale">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/50 animate-bounce">
              <i className="ri-check-line text-5xl text-white"></i>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              グループが作成されました！
            </h2>
            
            {generatedInviteCode && (
              <>
                <p className="text-white/70 mb-6">
                  メンバーを招待するには、以下のコードを共有してください
                </p>
                <div className="bg-white/5 border-2 border-ink-yellow rounded-xl p-6 mb-6">
                  <div className="text-sm text-ink-yellow mb-2 font-medium">招待コード</div>
                  <div className="text-4xl font-bold text-white tracking-widest">
                    {generatedInviteCode}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedInviteCode)
                      const id = Date.now().toString()
                      setToasts([...toasts, { id, message: '招待コードをコピーしました', type: 'success' }])
                    }}
                    className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm border border-white/20"
                    style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  >
                    <i className="ri-clipboard-line mr-1"></i>
                    コピー
                  </button>
                </div>
              </>
            )}
            
            <button
              onClick={handleContinue}
              className="w-full py-4 rounded-xl text-splat-dark font-bold text-lg bg-ink-yellow hover:bg-ink-yellow/90 shadow-lg"
              style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
            >
              <i className="ri-arrow-right-line mr-2"></i>
              InkShareを始める
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-splat-dark via-ink-blue to-splat-dark flex items-center justify-center p-6 overflow-hidden relative">
      {/* 背景のインク */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-ink-yellow ink-blob blur-[100px]"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-ink-cyan ink-blob blur-[100px]" style={{animationDelay: '1.5s'}}></div>
      </div>

      {/* トースト通知 */}
      <ToastContainer 
        toasts={toasts} 
        onClose={(id) => setToasts(toasts.filter(t => t.id !== id))} 
      />

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
              <div className="w-20 h-20 bg-ink-yellow rounded-full flex items-center justify-center shadow-2xl shadow-ink-yellow/50">
                <i className="ri-paint-brush-fill text-5xl text-splat-dark"></i>
              </div>
              <h1 className="text-5xl font-black text-white">
                InkShare
              </h1>
            </div>
            <p className="text-ink-yellow text-base font-bold">新しいグループを作成</p>
          </div>
        </div>

        {/* グループ作成フォーム */}
        <div className="relative bg-white/10 backdrop-blur-sm border-2 border-ink-yellow/40 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
            <i className="ri-team-line"></i>
            グループ作成
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500 rounded-xl text-rose-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-5">
            {/* グループ名 */}
            <div>
              <label className="block text-sm font-bold text-ink-yellow mb-2">
                <i className="ri-team-line mr-1"></i>
                グループ名
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
                placeholder="例: 友達の勉強会"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white/5 text-white border border-white/20 rounded-xl focus:border-ink-yellow focus:outline-none placeholder:text-white/40 disabled:opacity-50"
                style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
              />
            </div>

            {/* 作成ボタン */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl text-splat-dark font-bold text-lg bg-ink-yellow hover:bg-ink-yellow/90 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  作成中...
                </>
              ) : (
                <>
                  <i className="ri-add-circle-line mr-2"></i>
                  グループを作成
                </>
              )}
            </button>
          </form>

          {/* リンク */}
          <div className="mt-6 text-center text-sm space-y-2">
            <div>
              <Link href="/join" className="text-ink-cyan hover:underline">
                招待コードで参加
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

export default function CreateGroupPage() {
  return <CreateGroupContent />
}

