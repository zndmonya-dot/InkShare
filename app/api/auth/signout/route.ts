import { NextRequest, NextResponse } from 'next/server'
import { signOut } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await signOut()
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Signout error:', error)
    return NextResponse.json(
      { error: error.message || 'ログアウトに失敗しました' },
      { status: 500 }
    )
  }
}

