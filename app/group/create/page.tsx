'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function CreateGroupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'personal' // 'personal' or 'business'
  
  const [groupName, setGroupName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [error, setError] = useState('')
  const [showInviteCode, setShowInviteCode] = useState(false)
  const [generatedInviteCode, setGeneratedInviteCode] = useState('')

  const isPersonal = type === 'personal'
  const isBusiness = type === 'business'

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
          groupName, 
          type: type // 'personal' or 'business'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '作成に失敗しました')
      }

      // 招待コードを表示（個人グループのみ）
      if (isPersonal && data.inviteCode) {
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
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center text-lime-400 text-2xl splatoon-glow">
        <div className="flex items-center gap-3">
          <i className="ri-loader-4-line animate-spin"></i>
          Loading...
        </div>
      </div>
    )
  }

  if (showInviteCode) {
    const accentColor = isPersonal ? 'lime' : 'cyan'
    const borderColor = isPersonal ? 'border-lime-400/30' : 'border-cyan-400/30'
    const textColor = isPersonal ? 'text-lime-400' : 'text-cyan-400'
    const bgColor = isPersonal ? 'bg-lime-400' : 'bg-cyan-400'
    const hoverBgColor = isPersonal ? 'hover:bg-lime-300' : 'hover:bg-cyan-300'
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-6">
        <div className={`relative w-full max-w-md bg-gray-800/60 border-2 ${borderColor} rounded-2xl p-8 backdrop-blur-sm`}>
          <div className="text-center">
            <div className="mb-6">
              <i className={`ri-check-line text-6xl ${textColor}`}></i>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              {isPersonal ? 'グループが作成されました！' : '組織が作成されました！'}
            </h2>
            
            {isPersonal && generatedInviteCode && (
              <>
                <p className="text-gray-400 mb-6">
                  友達を招待するには、以下のコードを共有してください
                </p>
                <div className={`bg-gray-900/80 border-2 ${borderColor.replace('/30', '')} rounded-xl p-6 mb-6`}>
                  <div className={`text-sm ${textColor} mb-2`}>招待コード</div>
                  <div className="text-4xl font-bold text-white tracking-widest">
                    {generatedInviteCode}
                  </div>
                </div>
              </>
            )}
            
            {isBusiness && (
              <p className="text-gray-400 mb-6">
                設定画面からメンバーを招待できます
              </p>
            )}
            
            <button
              onClick={handleContinue}
              className={`w-full py-3 rounded-xl text-black font-bold text-lg ${bgColor} ${hoverBgColor} transition-all active:scale-95`}
            >
              <i className="ri-arrow-right-line mr-2"></i>
              InkLinkを始める
            </button>
          </div>
        </div>
      </div>
    )
  }

  const accentColor = isPersonal ? 'lime' : 'cyan'
  const bgGlow1 = isPersonal ? 'bg-lime-400' : 'bg-cyan-400'
  const bgGlow2 = isPersonal ? 'bg-green-500' : 'bg-blue-500'
  const bgGlow3 = isPersonal ? 'bg-yellow-400' : 'bg-teal-400'
  const borderColor = isPersonal ? 'border-lime-400/30' : 'border-cyan-400/30'
  const textColor = isPersonal ? 'text-lime-400' : 'text-cyan-400'
  const bgColor = isPersonal ? 'bg-lime-400' : 'bg-cyan-400'
  const hoverBgColor = isPersonal ? 'hover:bg-lime-300' : 'hover:bg-cyan-300'
  const inkColor1 = isPersonal ? 'bg-lime-300' : 'bg-cyan-300'
  const inkColor2 = isPersonal ? 'bg-yellow-300' : 'bg-blue-300'
  const shadowColor = isPersonal ? 'shadow-[0_0_30px_rgba(191,255,0,0.6)]' : 'shadow-[0_0_30px_rgba(34,211,238,0.6)]'
  const shadowColor2 = isPersonal ? 'shadow-[0_0_50px_rgba(191,255,0,0.1)]' : 'shadow-[0_0_50px_rgba(34,211,238,0.1)]'
  const iconClass = isPersonal ? 'ri-group-line' : 'ri-building-line'
  const title = isPersonal ? '個人グループを作成' : '法人組織を作成'
  const placeholder = isPersonal ? '友達の勉強会' : '株式会社サンプル'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-6 overflow-hidden relative">
      {/* 背景のインク飛び散りエフェクト */}
      <div className={`absolute top-20 left-20 w-96 h-96 ${bgGlow1} opacity-10 rounded-full blur-3xl ink-float`}></div>
      <div className={`absolute bottom-20 right-20 w-80 h-80 ${bgGlow2} opacity-10 rounded-full blur-3xl ink-pulse`}></div>
      <div className={`absolute top-1/2 left-1/3 w-64 h-64 ${bgGlow3} opacity-10 rounded-full blur-3xl ink-drip`}></div>

      {/* ログアウトボタン（右上） */}
      <Link
        href="/logout"
        className="absolute top-6 right-6 px-4 py-2 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-lg transition-all border border-gray-700 hover:border-gray-500 text-sm"
      >
        <i className="ri-logout-box-line mr-1"></i>
        ログアウト
      </Link>

      <div className="relative w-full max-w-md">
        {/* ロゴ */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <div className="flex items-center gap-4 mb-2">
              <div className={`w-16 h-16 ${bgColor} rounded-2xl flex items-center justify-center ${shadowColor} relative overflow-visible`}>
                <i className="ri-paint-brush-fill text-4xl text-gray-900"></i>
                {/* インク飛び散り */}
                <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full ${inkColor1} opacity-70 ink-splash`}></div>
                <div className={`absolute -bottom-1 -left-1 w-3 h-3 rounded-full ${inkColor2} opacity-60 ink-drip`}></div>
              </div>
              <h1 className="text-3xl font-bold text-white drop-shadow-[0_0_20px_rgba(191,255,0,0.5)] splatoon-glow">
                InkLink
              </h1>
            </div>
            <p className={`${textColor} text-sm font-bold`}>{title}</p>
          </div>
        </div>

        {/* グループ作成フォーム */}
        <div className={`relative bg-gray-800/60 border-2 ${borderColor} rounded-2xl p-8 backdrop-blur-sm ${shadowColor2} overflow-visible`}>
          {/* カードのインク飛び散り */}
          <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full ${inkColor1} opacity-50 blur-md ink-splash`}></div>
          <div className={`absolute -bottom-3 -left-3 w-6 h-6 rounded-full ${inkColor2} opacity-40 blur-sm ink-drip`}></div>

          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            <i className={`${iconClass} mr-2`}></i>
            {title}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-rose-500/20 border-2 border-rose-500 rounded-xl text-rose-300 text-sm relative overflow-visible">
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-400 opacity-70 ink-pulse"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-5">
            {/* グループ/組織名 */}
            <div>
              <label className={`block text-sm font-bold ${textColor} mb-2`}>
                <i className={`${iconClass} mr-1`}></i>
                {isPersonal ? 'グループ名' : '組織名'}
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
                placeholder={placeholder}
                disabled={isLoading}
                className={`w-full px-4 py-3 bg-gray-900/60 text-white border-2 border-gray-700 rounded-xl focus:${borderColor.replace('/30', '')} focus:outline-none transition-all placeholder:text-gray-500 disabled:opacity-50`}
              />
            </div>

            {/* 作成ボタン */}
            <button
              type="submit"
              className={`w-full py-3 rounded-xl text-black font-bold text-lg ${bgColor} ${hoverBgColor} transition-all active:scale-95 relative overflow-hidden group`}
              disabled={isLoading}
            >
              <span className="relative z-10 flex items-center justify-center">
                {isLoading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    作成中...
                  </>
                ) : (
                  <>
                    <i className={`${iconClass} mr-2`}></i>
                    {isPersonal ? 'グループを作成' : '組織を作成'}
                  </>
                )}
              </span>
              <div className={`absolute inset-0 w-full h-full bg-gradient-to-br from-${accentColor}-300 to-${accentColor === 'lime' ? 'green' : 'blue'}-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              <div className={`absolute inset-0 w-full h-full ${inkColor1} opacity-20 blur-xl animate-ink-pulse group-hover:opacity-0`}></div>
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

