'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function LogoutPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const supabase = createClient()
        
        // Supabaseからサインアウト
        const { error: signOutError } = await supabase.auth.signOut()

        if (signOutError) {
          throw new Error(signOutError.message)
        }

        // すべてのSupabase関連Cookieをクリア
        document.cookie.split(";").forEach((c) => {
          const cookieName = c.trim().split("=")[0]
          if (cookieName.includes('sb-')) {
            document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
          }
        })

        setIsLoading(false)
        
        // 2秒後にログインページへリダイレクト
        setTimeout(() => {
          router.push('/login')
          router.refresh()
        }, 2000)
      } catch (err: any) {
        console.error('Logout error:', err)
        setError(err.message || 'ログアウトに失敗しました')
        setIsLoading(false)
      }
    }

    handleLogout()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-splat-dark via-ink-blue to-splat-dark flex items-center justify-center p-6 relative overflow-hidden">
      {/* 背景のインク */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-ink-yellow ink-blob blur-[100px]"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-ink-cyan ink-blob blur-[100px]" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="relative max-w-md w-full text-center z-10">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl animate-fade-in-scale">
          {isLoading ? (
            <>
              {/* ローディングスピナー */}
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-ink-yellow/30"></div>
                <div className="absolute inset-0 ink-spinner">
                  <div className="w-full h-full rounded-full border-4 border-transparent border-t-ink-yellow border-r-ink-yellow"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-ink-yellow rounded-full flex items-center justify-center ink-pulse-ring">
                    <i className="ri-logout-box-line text-2xl text-splat-dark"></i>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                ログアウト中...
              </h2>
              <p className="text-white/70">
                セッションをクリアしています
              </p>
            </>
          ) : error ? (
            <>
              {/* エラー */}
              <div className="w-20 h-20 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-rose-500/50">
                <i className="ri-error-warning-line text-4xl text-white"></i>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                エラーが発生しました
              </h2>
              <p className="text-rose-300 mb-6">{error}</p>
              <Link
                href="/login"
                className="inline-block px-6 py-3 bg-ink-yellow hover:bg-ink-yellow/90 text-splat-dark font-bold rounded-xl shadow-lg"
                style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
              >
                <i className="ri-arrow-left-line mr-2"></i>
                ログインページへ
              </Link>
            </>
          ) : (
            <>
              {/* 成功 */}
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/50 animate-bounce">
                <i className="ri-check-line text-5xl text-white"></i>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                ログアウト完了！
              </h2>
              <p className="text-white/70 mb-6">
                またのご利用をお待ちしています
              </p>
              <Link
                href="/login"
                className="inline-block px-6 py-3 bg-ink-cyan hover:bg-ink-cyan/90 text-splat-dark font-bold rounded-xl shadow-lg"
                style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
              >
                <i className="ri-login-box-line mr-2"></i>
                今すぐログインへ
              </Link>
              <p className="text-white/50 text-xs mt-4">
                {isLoading ? '読み込み中...' : '2秒後に自動的にリダイレクトします...'}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

