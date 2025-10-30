'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'

import type { Organization } from '@/types'

export default function InvitePage({ params }: { params: { token: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [error, setError] = useState('')
  const [isJoining, setIsJoining] = useState(false)

  const handleJoinOrganization = async () => {
    setIsJoining(true)
    setError('')

    try {
      const res = await fetch(`/api/organization/join-by-invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode: params.token }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '参加に失敗しました')
      }

      // 成功したらメインページへ
      router.push('/')
      router.refresh()
    } catch (err) {
      const error = err instanceof Error ? err.message : '予期しないエラーが発生しました'
      setError(error)
      setIsJoining(false)
    }
  }

  useEffect(() => {
    const init = async () => {
      try {
        // 認証状態チェック
        const user = await getCurrentUser()
        setIsLoggedIn(!!user)

        // 組織情報取得
        const res = await fetch(`/api/organization/invite/${params.token}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || '招待リンクが無効です')
        }

        setOrganization(data.organization)

        // ログイン済みで、自動参加可能な場合
        if (user) {
          await handleJoinOrganization()
        } else {
          setIsLoading(false)
        }
      } catch (err) {
        const error = err instanceof Error ? err.message : '予期しないエラーが発生しました'
        setError(error)
        setIsLoading(false)
      }
    }

    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.token])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center text-lime-400 text-2xl splatoon-glow">
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-6">
        <div className="relative w-full max-w-md bg-gray-800/60 border-2 border-rose-400/30 rounded-2xl p-8 backdrop-blur-sm text-center">
          <div className="mb-6">
            <i className="ri-error-warning-line text-6xl text-rose-400"></i>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">エラー</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            href="/landing"
            className="inline-block px-8 py-3 rounded-xl text-black font-bold bg-lime-400 hover:bg-lime-300 transition-all"
          >
            トップページへ
          </Link>
        </div>
      </div>
    )
  }

  if (isJoining) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center text-lime-400 text-2xl splatoon-glow">
        参加中...
      </div>
    )
  }

  // ログインしていない場合
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-6 overflow-hidden relative">
        {/* 背景のインク飛び散りエフェクト */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-cyan-400 opacity-10 rounded-full blur-3xl ink-float"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-500 opacity-10 rounded-full blur-3xl ink-pulse"></div>

        <div className="relative w-full max-w-md">
          {/* ロゴ */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="w-16 h-16 bg-cyan-400 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.6)]">
                <i className="ri-paint-brush-fill text-4xl text-gray-900"></i>
              </div>
              <h1 className="text-3xl font-bold text-white drop-shadow-[0_0_20px_rgba(34,211,238,0.5)] splatoon-glow">
                Inkshare
              </h1>
            </div>
          </div>

          <div className="relative bg-gray-800/60 border-2 border-cyan-400/30 rounded-2xl p-8 backdrop-blur-sm">
            <div className="text-center mb-6">
              <i className="ri-mail-open-line text-6xl text-cyan-400 mb-4 block"></i>
              <h2 className="text-2xl font-bold text-white mb-2">組織への招待</h2>
              <p className="text-gray-400 mb-4">
                {organization?.name} から招待されています
              </p>
              <div className="bg-cyan-400/10 border border-cyan-400/30 rounded-xl p-4 mb-6">
                <div className="text-cyan-400 font-bold text-lg">{organization?.name}</div>
                <div className="text-gray-400 text-sm mt-1">
                  {organization?.type === 'business' ? '法人向け' : '個人向け'}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href={`/login?redirect=/invite/${params.token}`}
                className="block w-full py-3 rounded-xl text-black font-bold text-lg bg-cyan-400 hover:bg-cyan-300 transition-all text-center"
              >
                <i className="ri-login-box-line mr-2"></i>
                ログインして参加
              </Link>
              <Link
                href={`/signup/business?inviteToken=${params.token}`}
                className="block w-full py-3 rounded-xl text-cyan-400 font-bold text-lg bg-white/10 hover:bg-white/20 transition-all border-2 border-cyan-400/50 hover:border-cyan-400 text-center"
              >
                <i className="ri-user-add-line mr-2"></i>
                アカウントを作成して参加
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

