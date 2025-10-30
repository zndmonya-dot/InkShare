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
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [showDissolveModal, setShowDissolveModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const [dissolveConfirmText, setDissolveConfirmText] = useState('')
  const [resetTime, setResetTime] = useState(0)
  const [isSavingResetTime, setIsSavingResetTime] = useState(false)

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

        // ステータス初期化時刻を取得
        const resetTimeRes = await fetch('/api/organization/reset-time')
        const resetTimeData = await resetTimeRes.json()
        setResetTime(resetTimeData.resetTime ?? 0)

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

  const handleTransferAdmin = async () => {
    if (!selectedMember) return
    
    if (!confirm(`${selectedMember.name}さんに管理者権限を移譲しますか？\n\nあなたは一般メンバーになります。`)) {
      return
    }

    try {
      const res = await fetch('/api/organization/transfer-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newAdminId: selectedMember.id }),
      })

      if (res.ok) {
        alert('管理者権限を移譲しました')
        router.push('/')
      } else {
        const data = await res.json()
        alert(data.error || '移譲に失敗しました')
      }
    } catch (error) {
      alert('移譲に失敗しました')
    }
  }

  const handleSaveResetTime = async () => {
    setIsSavingResetTime(true)
    try {
      const res = await fetch('/api/organization/reset-time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetTime }),
      })

      if (res.ok) {
        alert(`ステータス初期化時刻を${resetTime}時に設定しました`)
      } else {
        const data = await res.json()
        alert(data.error || '設定に失敗しました')
      }
    } catch (error) {
      alert('設定に失敗しました')
    } finally {
      setIsSavingResetTime(false)
    }
  }

  const handleDissolve = async () => {
    if (dissolveConfirmText !== userProfile?.currentOrganization?.name) {
      alert('組織名が一致しません')
      return
    }

    try {
      const res = await fetch('/api/organization/dissolve', {
        method: 'POST',
      })

      const data = await res.json()

      if (res.ok) {
        alert('組織を解散しました')
        router.push('/landing')
      } else {
        console.error('Dissolve error:', data)
        alert(`解散に失敗しました\n\nエラー: ${data.error}\n\n詳細: ${JSON.stringify(data.details || {})}`)
      }
    } catch (error: any) {
      console.error('Dissolve error:', error)
      alert(`解散に失敗しました\n\nエラー: ${error.message}`)
    }
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

        {/* ステータス初期化時刻設定 */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <i className="ri-time-line"></i>
            ステータス自動初期化設定
          </h2>
          <p className="text-white/60 mb-4 text-sm">
            毎日指定した時刻にすべてのメンバーのステータスを自動的に「話しかけてOK！」にリセットします
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-xs">
              <label className="text-white/80 text-sm mb-2 block">初期化時刻（JST）</label>
              <div className="relative">
                <select
                  value={resetTime}
                  onChange={(e) => setResetTime(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white/5 text-white border border-white/20 rounded-xl focus:outline-none focus:border-ink-yellow appearance-none cursor-pointer pr-10"
                >
                  {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                    <option key={hour} value={hour} className="bg-gray-800">
                      {hour}:00 {hour === 0 ? '（深夜0時）' : hour === 9 ? '（始業時）' : hour === 12 ? '（お昼）' : ''}
                    </option>
                  ))}
                </select>
                <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none text-xl"></i>
              </div>
            </div>
            <button
              onClick={handleSaveResetTime}
              disabled={isSavingResetTime}
              className="px-6 py-3 bg-ink-yellow hover:bg-ink-yellow/90 text-splat-dark font-bold rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isSavingResetTime ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  保存中...
                </>
              ) : (
                <>
                  <i className="ri-save-line mr-2"></i>
                  保存
                </>
              )}
            </button>
          </div>
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <p className="text-blue-300 text-sm flex items-start gap-2">
              <i className="ri-information-line text-lg flex-shrink-0 mt-0.5"></i>
              <span>
                現在の設定: <strong>{resetTime}:00</strong> に自動リセット
                {resetTime === 0 && '（深夜0時）'}
              </span>
            </p>
          </div>
        </div>

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
                  {member.role !== 'admin' && member.id !== userProfile?.id && (
                    <button
                      onClick={() => {
                        setSelectedMember(member)
                        setShowTransferModal(true)
                      }}
                      className="px-3 py-1 bg-ink-yellow/20 hover:bg-ink-yellow/30 text-ink-yellow text-sm font-medium rounded-lg transition-all border border-ink-yellow/30"
                    >
                      管理者に任命
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 管理者移譲 */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6 shadow-xl mt-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <i className="ri-user-shared-line"></i>
            管理者移譲
          </h2>
          <p className="text-white/60 mb-4 text-sm">
            他のメンバーに管理者権限を移譲できます。移譲後、あなたは一般メンバーになります。
          </p>
          <button
            onClick={() => setShowTransferModal(true)}
            className="w-full py-3 bg-ink-cyan hover:bg-ink-cyan/90 text-splat-dark font-bold rounded-xl transition-all shadow-lg"
          >
            <i className="ri-arrow-left-right-line mr-2"></i>
            管理者を移譲
          </button>
        </div>

        {/* 組織解散 */}
        <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
            <i className="ri-delete-bin-line"></i>
            組織解散（危険な操作）
          </h2>
          <p className="text-white/60 mb-4 text-sm">
            組織を完全に削除します。この操作は取り消せません。全メンバーのデータが削除されます。
          </p>
          <button
            onClick={() => setShowDissolveModal(true)}
            className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg"
          >
            <i className="ri-alert-line mr-2"></i>
            組織を解散
          </button>
        </div>
      </div>

      {/* 管理者移譲モーダル */}
      {showTransferModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowTransferModal(false)
            setSelectedMember(null)
          }}
        >
          <div
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-4">管理者を移譲</h3>
            <p className="text-white/60 mb-4 text-sm">
              移譲するメンバーを選択してください
            </p>
            <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
              {members.filter(m => m.role !== 'admin' && m.id !== userProfile?.id).map((member) => (
                <button
                  key={member.id}
                  onClick={() => setSelectedMember(member)}
                  className={`w-full p-4 rounded-xl transition-all text-left ${
                    selectedMember?.id === member.id
                      ? 'bg-ink-yellow/20 border-2 border-ink-yellow'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${member.avatar_color} rounded-lg flex items-center justify-center`}>
                      <i className="ri-user-line text-xl text-white"></i>
                    </div>
                    <div>
                      <div className="text-white font-medium">{member.name}</div>
                      <div className="text-white/60 text-xs">{member.email}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowTransferModal(false)
                  setSelectedMember(null)
                }}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all border border-white/20"
              >
                キャンセル
              </button>
              <button
                onClick={handleTransferAdmin}
                disabled={!selectedMember}
                className="flex-1 py-3 bg-ink-yellow hover:bg-ink-yellow/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-splat-dark font-bold rounded-xl transition-all shadow-lg"
              >
                移譲する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 組織解散モーダル */}
      {showDissolveModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowDissolveModal(false)
            setDissolveConfirmText('')
          }}
        >
          <div
            className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
              <i className="ri-alert-line"></i>
              組織解散の確認
            </h3>
            <p className="text-white/80 mb-4 text-sm">
              この操作は取り消せません。組織「<strong className="text-white">{userProfile?.currentOrganization?.name}</strong>」とすべてのメンバーのデータが完全に削除されます。
            </p>
            <p className="text-white/60 mb-4 text-sm">
              続行するには、組織名を正確に入力してください：
            </p>
            <input
              type="text"
              value={dissolveConfirmText}
              onChange={(e) => setDissolveConfirmText(e.target.value)}
              placeholder={userProfile?.currentOrganization?.name}
              className="w-full px-4 py-3 bg-white/5 text-white border border-red-500/30 rounded-xl focus:outline-none focus:border-red-500 mb-6"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDissolveModal(false)
                  setDissolveConfirmText('')
                }}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all border border-white/20"
              >
                キャンセル
              </button>
              <button
                onClick={handleDissolve}
                disabled={dissolveConfirmText !== userProfile?.currentOrganization?.name}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg"
              >
                解散する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

