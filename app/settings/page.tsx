'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [inviteLink, setInviteLink] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [members, setMembers] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ユーザープロフィール取得
        const profileRes = await fetch('/api/auth/me')
        const profileData = await profileRes.json()

        if (!profileData.user || !profileData.user.currentOrganization) {
          router.push('/landing')
          return
        }

        setUserProfile(profileData.user)

        // 管理者かチェック
        if (profileData.user.currentOrganization.role !== 'admin') {
          router.push('/')
          return
        }

        // 招待リンク生成
        const inviteRes = await fetch('/api/organization/invite-link')
        const inviteData = await inviteRes.json()
        setInviteLink(inviteData.inviteLink)

        // メンバー一覧取得
        const membersRes = await fetch('/api/organization/members')
        const membersData = await membersRes.json()
        setMembers(membersData.members || [])

        setIsLoading(false)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        router.push('/')
      }
    }

    fetchData()
  }, [router])

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-splat-dark via-ink-blue to-splat-dark flex items-center justify-center">
        <div className="text-center relative">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-ink-yellow/30"></div>
            <div className="absolute inset-0 ink-spinner">
              <div className="w-full h-full rounded-full border-4 border-transparent border-t-ink-yellow border-r-ink-yellow"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-ink-yellow rounded-full flex items-center justify-center ink-pulse-ring">
                <i className="ri-paint-brush-fill text-2xl text-splat-dark"></i>
              </div>
            </div>
          </div>
          <p className="text-white/70 text-lg font-medium">読み込み中...</p>
        </div>
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

      <div className="max-w-4xl mx-auto relative z-10">
        {/* ヘッダー */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/')}
            className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all border border-white/20"
          >
            <i className="ri-arrow-left-line text-2xl text-white"></i>
          </button>
          <h1 className="text-2xl font-bold text-white">
            <i className="ri-settings-3-line mr-2"></i>
            組織設定
          </h1>
        </div>

        {/* 組織情報 */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <i className="ri-building-line"></i>
            組織情報
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/60">組織名</span>
              <span className="text-white font-medium">{userProfile?.currentOrganization?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">タイプ</span>
              <span className="text-white font-bold">
                {userProfile?.currentOrganization?.type === 'business' ? '法人向け' : '個人向け'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">メンバー数</span>
              <span className="text-white font-medium">{members.length}名</span>
            </div>
          </div>
        </div>

        {/* 招待リンク（法人向けのみ） */}
        {userProfile?.currentOrganization?.type === 'business' && (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <i className="ri-user-add-line"></i>
              メンバーを招待
            </h2>
            <p className="text-white/60 mb-4 text-sm">
              以下のリンクを共有して、メンバーを招待してください
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={inviteLink}
                readOnly
                className="flex-1 px-4 py-3 bg-white/5 text-white border border-white/20 rounded-xl focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className={`px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
                  copySuccess
                    ? 'bg-green-500 text-white'
                    : 'bg-ink-yellow hover:bg-ink-yellow/90 text-splat-dark'
                }`}
              >
                <i className={`${copySuccess ? 'ri-check-line' : 'ri-file-copy-line'} mr-2`}></i>
                {copySuccess ? 'コピーしました！' : 'コピー'}
              </button>
            </div>
          </div>
        )}

        {/* メンバー一覧 */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <i className="ri-team-line"></i>
            メンバー一覧
          </h2>
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${member.avatar_color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <i className="ri-user-line text-2xl text-white"></i>
                  </div>
                  <div>
                    <div className="text-white font-medium">{member.name}</div>
                    <div className="text-white/60 text-sm">{member.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      member.role === 'admin'
                        ? 'bg-ink-cyan/20 text-ink-cyan border border-ink-cyan/30'
                        : 'bg-white/10 text-white/70 border border-white/20'
                    }`}
                  >
                    {member.role === 'admin' ? '管理者' : 'メンバー'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

