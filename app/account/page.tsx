'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AccountSettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()

        if (!data.user) {
          router.push('/landing')
          return
        }

        setUserProfile(data.user)
        setName(data.user.name)
        setEmail(data.user.email)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to fetch user:', error)
        router.push('/landing')
      }
    }

    fetchData()
  }, [router])

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const res = await fetch('/api/user/update-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      if (res.ok) {
        alert('表示名を更新しました')
      } else {
        const data = await res.json()
        alert(data.error || '更新に失敗しました')
      }
    } catch (error) {
      alert('更新に失敗しました')
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      alert('新しいパスワードが一致しません')
      return
    }

    try {
      const res = await fetch('/api/user/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      if (res.ok) {
        alert('パスワードを更新しました')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        const data = await res.json()
        alert(data.error || '更新に失敗しました')
      }
    } catch (error) {
      alert('更新に失敗しました')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-splat-dark via-ink-blue to-splat-dark flex items-center justify-center">
        <div className="text-white text-lg">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-splat-dark via-ink-blue to-splat-dark p-6 overflow-hidden">
      {/* 背景のインク - スクロール防止版 */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-ink-yellow ink-blob blur-[100px]"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-ink-cyan ink-blob blur-[100px]" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="max-w-2xl mx-auto relative">
        {/* ヘッダー */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/')}
            className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all border border-white/20"
          >
            <i className="ri-arrow-left-line text-2xl text-white"></i>
          </button>
          <h1 className="text-2xl font-bold text-white">
            <i className="ri-user-settings-line mr-2"></i>
            アカウント設定
          </h1>
        </div>

        {/* 表示名変更 */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <i className="ri-user-line"></i>
            表示名
          </h2>
          <form onSubmit={handleNameUpdate}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="w-full px-4 py-3 bg-white/5 text-white text-base border border-white/20 rounded-xl focus:border-ink-yellow focus:outline-none transition-all mb-4"
              placeholder="表示名"
              style={{ fontSize: '16px' }}
            />
            <button
              type="submit"
              className="w-full py-3 bg-ink-yellow hover:bg-ink-yellow/90 text-splat-dark font-bold rounded-xl transition-all shadow-lg"
            >
              表示名を更新
            </button>
          </form>
        </div>

        {/* メールアドレス（表示のみ） */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <i className="ri-mail-line"></i>
            メールアドレス
          </h2>
          <div className="text-white/70 text-sm mb-2">{email}</div>
          <div className="text-white/50 text-xs">
            ※メールアドレスの変更は現在サポートされていません
          </div>
        </div>

        {/* 所属グループ */}
        {userProfile?.organizations && userProfile.organizations.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <i className="ri-team-line"></i>
              所属グループ
            </h2>
            <div className="space-y-3">
              {userProfile.organizations.map((org: any) => (
                <div
                  key={org.id}
                  className={`p-4 rounded-xl border transition-all ${
                    org.isActive
                      ? 'bg-ink-yellow/20 border-ink-yellow/40'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium">{org.name}</span>
                        {org.isActive && (
                          <span className="px-2 py-0.5 bg-ink-yellow text-splat-dark text-xs font-bold rounded">
                            現在選択中
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className={`${org.role === 'admin' ? 'text-ink-cyan' : 'text-white/60'}`}>
                          {org.role === 'admin' ? '管理者' : 'メンバー'}
                        </span>
                        <span className="text-white/40">·</span>
                        <span className="text-white/60">
                          {org.type === 'business' ? '法人向け' : '個人向け'}
                        </span>
                      </div>
                    </div>
                    {!org.isActive && (
                      <button
                        onClick={async () => {
                          if (!confirm(`${org.name}から脱退しますか？`)) return
                          
                          try {
                            const res = await fetch('/api/organization/leave', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ organizationId: org.id }),
                            })

                            if (res.ok) {
                              alert('グループから脱退しました')
                              window.location.reload()
                            } else {
                              const data = await res.json()
                              alert(data.error || '脱退に失敗しました')
                            }
                          } catch (error) {
                            alert('脱退に失敗しました')
                          }
                        }}
                        className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 rounded-lg text-sm font-medium transition-all"
                      >
                        <i className="ri-logout-box-line mr-1"></i>
                        脱退
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-white/50 text-xs">
              <i className="ri-information-line mr-1"></i>
              現在選択中のグループからは脱退できません。他のグループに切り替えてから脱退してください。
            </p>
          </div>
        )}

        {/* パスワード変更 */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <i className="ri-lock-line"></i>
            パスワード変更
          </h2>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full px-4 py-3 bg-white/5 text-white text-base border border-white/20 rounded-xl focus:border-ink-yellow focus:outline-none transition-all"
              placeholder="現在のパスワード"
              style={{ fontSize: '16px' }}
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full px-4 py-3 bg-white/5 text-white text-base border border-white/20 rounded-xl focus:border-ink-yellow focus:outline-none transition-all"
              placeholder="新しいパスワード"
              style={{ fontSize: '16px' }}
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full px-4 py-3 bg-white/5 text-white text-base border border-white/20 rounded-xl focus:border-ink-yellow focus:outline-none transition-all"
              placeholder="新しいパスワード（確認）"
              style={{ fontSize: '16px' }}
            />
            <button
              type="submit"
              className="w-full py-3 bg-ink-cyan hover:bg-ink-cyan/90 text-splat-dark font-bold rounded-xl transition-all shadow-lg"
            >
              パスワードを更新
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

