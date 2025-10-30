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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-splat-dark via-ink-blue to-splat-dark flex items-center justify-center p-6 relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
          <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-ink-magenta ink-blob blur-[100px]"></div>
          <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-ink-cyan ink-blob blur-[100px]" style={{animationDelay: '1.5s'}}></div>
        </div>
        <div className="relative w-full max-w-md bg-white/10 backdrop-blur-sm border-2 border-ink-magenta/40 rounded-2xl p-8 shadow-2xl z-10 text-center animate-fade-in-scale">
          <div className="w-20 h-20 bg-ink-magenta rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-ink-magenta/50">
            <i className="ri-error-warning-line text-5xl text-white"></i>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">エラー</h2>
          <p className="text-white/60 mb-6">{error}</p>
          <Link
            href="/landing"
            className="inline-block px-8 py-4 rounded-xl text-splat-dark font-bold bg-ink-yellow hover:bg-ink-yellow/90 shadow-lg"
            style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            トップページへ
          </Link>
        </div>
      </div>
    )
  }

  if (isJoining) {
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

  // ログインしていない場合
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-splat-dark via-ink-blue to-splat-dark flex items-center justify-center p-6 overflow-hidden relative">
        {/* 背景のインク */}
        <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
          <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-ink-cyan ink-blob blur-[100px]"></div>
          <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-ink-yellow ink-blob blur-[100px]" style={{animationDelay: '1.5s'}}></div>
        </div>

        <div className="relative w-full max-w-md z-10">
          {/* ロゴ */}
          <div className="text-center mb-10 animate-fade-in-scale">
            <div className="inline-block">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-20 h-20 bg-ink-cyan rounded-full flex items-center justify-center shadow-2xl shadow-ink-cyan/50">
                  <i className="ri-paint-brush-fill text-5xl text-splat-dark"></i>
                </div>
                <h1 className="text-5xl font-black text-white">
                  Inkshare
                </h1>
              </div>
              <p className="text-ink-cyan text-base font-bold">招待リンク</p>
            </div>
          </div>

          <div className="relative bg-white/10 backdrop-blur-sm border-2 border-ink-cyan/40 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-ink-cyan rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-ink-cyan/50">
                <i className="ri-mail-open-line text-5xl text-splat-dark"></i>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">グループへの招待</h2>
              <p className="text-white/60 mb-4">
                {organization?.name} から招待されています
              </p>
              <div className="bg-white/5 border-2 border-ink-cyan rounded-xl p-4 mb-6">
                <div className="text-ink-cyan font-bold text-xl">{organization?.name}</div>
                <div className="text-white/50 text-sm mt-1">
                  {organization?.type === 'business' ? '法人向け' : '個人向け'}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href={`/login?redirect=/invite/${params.token}`}
                className="block w-full py-4 rounded-xl text-splat-dark font-bold text-lg bg-ink-cyan hover:bg-ink-cyan/90 shadow-lg text-center"
                style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
              >
                <i className="ri-login-box-line mr-2"></i>
                ログインして参加
              </Link>
              <Link
                href={`/signup?inviteToken=${params.token}`}
                className="block w-full py-4 rounded-xl text-ink-cyan font-bold text-lg bg-white/10 hover:bg-white/20 border-2 border-ink-cyan/50 hover:border-ink-cyan text-center"
                style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
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

