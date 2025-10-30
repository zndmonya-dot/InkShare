'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { UserProfile } from '@/types'

interface Toast {
  message: string
  type: 'success' | 'error' | 'info'
}

export default function AccountSettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isUpdatingName, setIsUpdatingName] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  const [passwordStrength, setPasswordStrength] = useState(0)

  // トースト表示
  const showToast = useCallback((message: string, type: Toast['type']) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  // 表示名のバリデーション
  const validateName = useCallback((value: string): boolean => {
    if (!value.trim()) {
      setNameError('表示名を入力してください')
      return false
    }
    if (value.length > 50) {
      setNameError('表示名は50文字以内で入力してください')
      return false
    }
    setNameError('')
    return true
  }, [])

  // パスワード強度を計算
  const calculatePasswordStrength = useCallback((password: string): number => {
    let strength = 0
    if (password.length >= 8) strength += 1
    if (password.length >= 12) strength += 1
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    return Math.min(strength, 4)
  }, [])

  // パスワードのバリデーション
  const validatePassword = useCallback((value: string): boolean => {
    if (value.length < 8) {
      setPasswordError('パスワードは8文字以上で入力してください')
      return false
    }
    if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
      setPasswordError('パスワードは英字と数字を含める必要があります')
      return false
    }
    setPasswordError('')
    return true
  }, [])

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

  const handleNameUpdate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateName(name)) {
      return
    }

    setIsUpdatingName(true)
    try {
      const res = await fetch('/api/user/update-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      if (res.ok) {
        showToast('表示名を更新しました', 'success')
        setUserProfile(prev => prev ? { ...prev, name } : null)
      } else {
        const data = await res.json()
        showToast(data.error || '更新に失敗しました', 'error')
      }
    } catch (error) {
      showToast('更新に失敗しました', 'error')
    } finally {
      setIsUpdatingName(false)
    }
  }, [name, validateName, showToast])

  const handlePasswordUpdate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentPassword) {
      setPasswordError('現在のパスワードを入力してください')
      return
    }

    if (!validatePassword(newPassword)) {
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('新しいパスワードが一致しません')
      return
    }

    setIsUpdatingPassword(true)
    setPasswordError('')

    try {
      const res = await fetch('/api/user/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      if (res.ok) {
        showToast('パスワードを更新しました', 'success')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setPasswordStrength(0)
        setShowCurrentPassword(false)
        setShowNewPassword(false)
        setShowConfirmPassword(false)
      } else {
        const data = await res.json()
        showToast(data.error || '更新に失敗しました', 'error')
      }
    } catch (error) {
      showToast('更新に失敗しました', 'error')
    } finally {
      setIsUpdatingPassword(false)
    }
  }, [currentPassword, newPassword, confirmPassword, validatePassword, showToast])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-splat-dark via-ink-blue to-splat-dark flex items-center justify-center">
        <div className="text-center relative">
          <div className="relative w-24 h-24 mx-auto mb-6">
            {/* 外側のリング */}
            <div className="absolute inset-0 rounded-full border-4 border-ink-yellow/30"></div>
            {/* 回転するインク */}
            <div className="absolute inset-0 ink-spinner">
              <div className="w-full h-full rounded-full border-4 border-transparent border-t-ink-yellow border-r-ink-yellow"></div>
            </div>
            {/* 中央のロゴ */}
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
      {/* トースト通知 */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div
            className={`px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-sm flex items-center gap-3 ${
              toast.type === 'success'
                ? 'bg-green-500/90 border-green-400 text-white'
                : toast.type === 'error'
                ? 'bg-rose-500/90 border-rose-400 text-white'
                : 'bg-blue-500/90 border-blue-400 text-white'
            }`}
          >
            <i
              className={`text-2xl ${
                toast.type === 'success'
                  ? 'ri-checkbox-circle-line'
                  : toast.type === 'error'
                  ? 'ri-error-warning-line'
                  : 'ri-information-line'
              }`}
            ></i>
            <p className="font-medium">{toast.message}</p>
            <button
              onClick={() => setToast(null)}
              className="ml-2 hover:opacity-70 transition-opacity"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
        </div>
      )}

      {/* 背景のインク - スクロール防止版 */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-ink-yellow ink-blob blur-[100px]"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-ink-cyan ink-blob blur-[100px]" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* ヘッダー */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/')}
            className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center border border-white/20"
            style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
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
            <div className="mb-4">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (nameError) validateName(e.target.value)
                }}
                autoComplete="name"
                className={`w-full px-4 py-3 bg-white/5 text-white text-base border rounded-xl focus:outline-none ${
                  nameError
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-white/20 focus:border-ink-yellow'
                }`}
                placeholder="表示名"
                maxLength={50}
                style={{ 
                  fontSize: '16px',
                  transition: 'border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
              {nameError && (
                <p className="mt-2 text-rose-400 text-sm flex items-center gap-1">
                  <i className="ri-error-warning-line"></i>
                  {nameError}
                </p>
              )}
              <p className="mt-2 text-white/50 text-xs">
                {name.length}/50文字
              </p>
            </div>
            <button
              type="submit"
              disabled={isUpdatingName || !!nameError}
              className="w-full py-3 bg-ink-yellow hover:bg-ink-yellow/90 text-splat-dark font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
            >
              {isUpdatingName ? (
                <>
                  <i className="ri-loader-4-line animate-spin"></i>
                  更新中...
                </>
              ) : (
                <>
                  <i className="ri-save-line"></i>
                  表示名を更新
                </>
              )}
            </button>
          </form>
        </div>

        {/* メールアドレス（表示のみ） */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <i className="ri-mail-line"></i>
            メールアドレス
          </h2>
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
            <i className="ri-mail-fill text-2xl text-white/40"></i>
            <div className="flex-1">
              <div className="text-white font-medium">{email}</div>
              <div className="text-white/50 text-xs mt-1 flex items-center gap-1">
                <i className="ri-information-line"></i>
                メールアドレスの変更は現在サポートされていません
              </div>
            </div>
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
                  className={`p-4 rounded-xl border ${
                    org.isActive
                      ? 'bg-ink-yellow/20 border-ink-yellow/40 shadow-lg shadow-ink-yellow/10'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                >
                  <div className="flex items-center gap-4">
                    {/* グループアイコン */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      org.isActive 
                        ? 'bg-ink-yellow text-splat-dark' 
                        : 'bg-white/10 text-white/60'
                    }`}>
                      <i className={`${org.type === 'business' ? 'ri-building-2-fill' : 'ri-team-fill'} text-2xl`}></i>
                    </div>
                    
                    {/* グループ情報 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-bold truncate">{org.name}</span>
                        {org.isActive && (
                          <span className="px-2 py-0.5 bg-ink-yellow text-splat-dark text-xs font-bold rounded flex-shrink-0">
                            <i className="ri-check-line mr-1"></i>
                            使用中
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-white/60">
                        <i className="ri-shield-user-line"></i>
                        <span>メンバー</span>
                        <span className="text-white/40">•</span>
                        <i className={org.type === 'business' ? 'ri-briefcase-line' : 'ri-user-smile-line'}></i>
                        <span>{org.type === 'business' ? '法人向け' : '個人向け'}</span>
                      </div>
                    </div>
                    
                    {/* 脱退ボタン */}
                    {!org.isActive && (
                      <button
                        onClick={async () => {
                          if (!confirm(`${org.name}から脱退しますか？\n\nこの操作は取り消せません。`)) return
                          
                          try {
                            const res = await fetch('/api/organization/leave', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ organizationId: org.id }),
                            })

                            if (res.ok) {
                              showToast('グループから脱退しました', 'success')
                              setTimeout(() => window.location.reload(), 1000)
                            } else {
                              const data = await res.json()
                              showToast(data.error || '脱退に失敗しました', 'error')
                            }
                          } catch (error) {
                            showToast('脱退に失敗しました', 'error')
                          }
                        }}
                        className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 rounded-lg text-sm font-medium flex-shrink-0"
                        style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
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
            {/* 現在のパスワード */}
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value)
                  if (passwordError) setPasswordError('')
                }}
                autoComplete="current-password"
                className={`w-full px-4 py-3 pr-12 bg-white/5 text-white text-base border rounded-xl focus:outline-none transition-all ${
                  passwordError && !newPassword && !confirmPassword
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-white/20 focus:border-ink-yellow'
                }`}
                placeholder="現在のパスワード"
                style={{ fontSize: '16px' }}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                <i className={showCurrentPassword ? 'ri-eye-off-line text-xl' : 'ri-eye-line text-xl'}></i>
              </button>
            </div>

            {/* 新しいパスワード */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value)
                    setPasswordStrength(calculatePasswordStrength(e.target.value))
                    if (passwordError) setPasswordError('')
                  }}
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 pr-12 bg-white/5 text-white text-base border rounded-xl focus:outline-none transition-all ${
                    passwordError && newPassword
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-white/20 focus:border-ink-yellow'
                  }`}
                  placeholder="新しいパスワード"
                  style={{ fontSize: '16px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  <i className={showNewPassword ? 'ri-eye-off-line text-xl' : 'ri-eye-line text-xl'}></i>
                </button>
              </div>
              {/* パスワード強度インジケーター */}
              {newPassword && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          level <= passwordStrength
                            ? passwordStrength === 1
                              ? 'bg-red-500'
                              : passwordStrength === 2
                              ? 'bg-orange-500'
                              : passwordStrength === 3
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                            : 'bg-white/10'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <p className={`text-xs ${
                    passwordStrength === 1
                      ? 'text-red-400'
                      : passwordStrength === 2
                      ? 'text-orange-400'
                      : passwordStrength === 3
                      ? 'text-yellow-400'
                      : 'text-green-400'
                  }`}>
                    {passwordStrength === 1 && '弱い'}
                    {passwordStrength === 2 && 'やや弱い'}
                    {passwordStrength === 3 && '普通'}
                    {passwordStrength === 4 && '強い'}
                  </p>
                </div>
              )}
            </div>

            {/* 新しいパスワード（確認） */}
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  if (passwordError) setPasswordError('')
                }}
                autoComplete="new-password"
                className={`w-full px-4 py-3 pr-12 bg-white/5 text-white text-base border rounded-xl focus:outline-none transition-all ${
                  passwordError && confirmPassword
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-white/20 focus:border-ink-yellow'
                }`}
                placeholder="新しいパスワード（確認）"
                style={{ fontSize: '16px' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                <i className={showConfirmPassword ? 'ri-eye-off-line text-xl' : 'ri-eye-line text-xl'}></i>
              </button>
            </div>

            {/* エラーメッセージ */}
            {passwordError && (
              <p className="text-rose-400 text-sm flex items-center gap-1">
                <i className="ri-error-warning-line"></i>
                {passwordError}
              </p>
            )}

            {/* パスワード要件 */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
              <p className="text-white/80 text-xs font-medium mb-2 flex items-center gap-2">
                <i className="ri-shield-check-line"></i>
                パスワード要件
              </p>
              <div className="space-y-1.5">
                <div className={`text-xs flex items-center gap-2 ${
                  newPassword.length >= 8 ? 'text-green-400' : 'text-white/50'
                }`}>
                  <i className={`${newPassword.length >= 8 ? 'ri-checkbox-circle-fill' : 'ri-checkbox-blank-circle-line'}`}></i>
                  <span>8文字以上</span>
                </div>
                <div className={`text-xs flex items-center gap-2 ${
                  /[A-Za-z]/.test(newPassword) ? 'text-green-400' : 'text-white/50'
                }`}>
                  <i className={`${/[A-Za-z]/.test(newPassword) ? 'ri-checkbox-circle-fill' : 'ri-checkbox-blank-circle-line'}`}></i>
                  <span>英字を含む</span>
                </div>
                <div className={`text-xs flex items-center gap-2 ${
                  /[0-9]/.test(newPassword) ? 'text-green-400' : 'text-white/50'
                }`}>
                  <i className={`${/[0-9]/.test(newPassword) ? 'ri-checkbox-circle-fill' : 'ri-checkbox-blank-circle-line'}`}></i>
                  <span>数字を含む</span>
                </div>
                <div className={`text-xs flex items-center gap-2 ${
                  passwordStrength >= 4 ? 'text-green-400' : 'text-white/50'
                }`}>
                  <i className={`${passwordStrength >= 4 ? 'ri-checkbox-circle-fill' : 'ri-checkbox-blank-circle-line'}`}></i>
                  <span>大文字・小文字・記号を含むとさらに安全</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdatingPassword || !currentPassword || !newPassword || !confirmPassword}
              className="w-full py-3 bg-ink-cyan hover:bg-ink-cyan/90 text-splat-dark font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
            >
              {isUpdatingPassword ? (
                <>
                  <i className="ri-loader-4-line animate-spin"></i>
                  更新中...
                </>
              ) : (
                <>
                  <i className="ri-lock-password-line"></i>
                  パスワードを更新
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

