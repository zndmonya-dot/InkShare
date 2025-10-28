'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DemoPage() {
  const router = useRouter()

  useEffect(() => {
    const loginAsDemo = async () => {
      try {
        // デモユーザーでログイン
        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'demo@inklink.app',
            password: 'demo1234',
          }),
        })

        if (response.ok) {
          // ログイン成功、ホームへ
          router.push('/')
        } else {
          // デモユーザーが存在しない場合は作成を促す
          alert('デモユーザーの準備中です。しばらくお待ちください。')
          router.push('/landing')
        }
      } catch (error) {
        console.error('Demo login error:', error)
        alert('デモモードの起動に失敗しました')
        router.push('/landing')
      }
    }

    loginAsDemo()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-splat-dark via-ink-blue to-splat-dark flex items-center justify-center">
      {/* スピナー */}
      <div className="text-center relative">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-ink-cyan/30"></div>
          <div className="absolute inset-0 ink-spinner">
            <div className="w-full h-full rounded-full border-4 border-transparent border-t-ink-cyan border-r-ink-cyan"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-ink-cyan rounded-full flex items-center justify-center ink-pulse-ring">
              <i className="ri-play-circle-fill text-2xl text-splat-dark"></i>
            </div>
          </div>
        </div>
        <p className="text-white/70 text-lg font-medium">デモモードを起動中...</p>
      </div>
    </div>
  )
}

