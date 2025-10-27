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
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center text-lime-400 text-2xl splatoon-glow">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center transition-all"
            >
              <i className="ri-arrow-left-line text-2xl text-lime-400"></i>
            </button>
            <h1 className="text-3xl font-bold text-white">
              <i className="ri-settings-3-line mr-2"></i>
              組織設定
            </h1>
          </div>
        </div>

        {/* 組織情報 */}
        <div className="bg-gray-800/60 border-2 border-cyan-400/30 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-cyan-400 mb-4">
            <i className="ri-building-line mr-2"></i>
            組織情報
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">組織名</span>
              <span className="text-white font-bold">{userProfile?.currentOrganization?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">タイプ</span>
              <span className="text-white font-bold">
                {userProfile?.currentOrganization?.type === 'business' ? '法人向け' : '個人向け'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">メンバー数</span>
              <span className="text-white font-bold">{members.length}名</span>
            </div>
          </div>
        </div>

        {/* 招待リンク（法人向けのみ） */}
        {userProfile?.currentOrganization?.type === 'business' && (
          <div className="bg-gray-800/60 border-2 border-lime-400/30 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-lime-400 mb-4">
              <i className="ri-user-add-line mr-2"></i>
              メンバーを招待
            </h2>
            <p className="text-gray-400 mb-4 text-sm">
              以下のリンクを共有して、メンバーを招待してください
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={inviteLink}
                readOnly
                className="flex-1 px-4 py-3 bg-gray-900/60 text-white border-2 border-gray-700 rounded-xl focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  copySuccess
                    ? 'bg-green-400 text-black'
                    : 'bg-lime-400 hover:bg-lime-300 text-black'
                }`}
              >
                <i className={`${copySuccess ? 'ri-check-line' : 'ri-file-copy-line'} mr-2`}></i>
                {copySuccess ? 'コピーしました！' : 'コピー'}
              </button>
            </div>
          </div>
        )}

        {/* メンバー一覧 */}
        <div className="bg-gray-800/60 border-2 border-orange-400/30 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-orange-400 mb-4">
            <i className="ri-team-line mr-2"></i>
            メンバー一覧
          </h2>
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-gray-900/60 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${member.avatar_color} rounded-xl flex items-center justify-center`}>
                    <i className="ri-user-line text-2xl text-gray-900"></i>
                  </div>
                  <div>
                    <div className="text-white font-bold">{member.name}</div>
                    <div className="text-gray-400 text-sm">{member.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-bold ${
                      member.role === 'admin'
                        ? 'bg-cyan-400/20 text-cyan-400'
                        : 'bg-gray-700 text-gray-300'
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

