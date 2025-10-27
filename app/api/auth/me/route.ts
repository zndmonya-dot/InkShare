import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, getUserProfile } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    const profile = await getUserProfile(user.id)

    return NextResponse.json({ user, profile }, { status: 200 })
  } catch (error: any) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: error.message || 'ユーザー情報の取得に失敗しました' },
      { status: 500 }
    )
  }
}

