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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-6">
      <div className="relative max-w-md w-full text-center">
        <div className="bg-gray-800/60 border-2 border-lime-400/30 rounded-2xl p-8 backdrop-blur-sm">
          {isLoading ? (
            <>
              <div className="w-16 h-16 bg-lime-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(191,255,0,0.6)]">
                <i className="ri-logout-box-line text-4xl text-gray-900"></i>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                ログアウト中...
              </h2>
              <div className="flex items-center justify-center gap-2 text-lime-400">
                <i className="ri-loader-4-line animate-spin text-2xl"></i>
                <span>セッションをクリアしています</span>
              </div>
            </>
          ) : error ? (
            <>
              <div className="w-16 h-16 bg-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <i className="ri-error-warning-line text-4xl text-white"></i>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                エラーが発生しました
              </h2>
              <p className="text-rose-300 mb-6">{error}</p>
              <Link
                href="/login"
                className="inline-block px-6 py-3 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-xl transition-all"
              >
                ログインページへ
              </Link>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.6)]">
                <i className="ri-check-line text-4xl text-white"></i>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                ログアウト完了
              </h2>
              <p className="text-gray-400 mb-6">
                ログインページにリダイレクトします...
              </p>
              <Link
                href="/login"
                className="inline-block px-6 py-3 bg-lime-400 hover:bg-lime-300 text-black font-bold rounded-xl transition-all"
              >
                <i className="ri-login-box-line mr-2"></i>
                今すぐログインへ
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

