import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || ''
    const supabase = createServerSupabaseClient(cookieHeader)

    // Supabaseセッションをクリア
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout error:', error)
      return NextResponse.json(
        { error: 'ログアウトに失敗しました' },
        { status: 500 }
      )
    }

    // Cookieをクリアするレスポンスを返す
    const response = NextResponse.json({ success: true }, { status: 200 })
    
    // すべてのSupabase認証Cookieを削除
    const cookiesToDelete = [
      'sb-access-token',
      'sb-refresh-token',
      'sb-auth-token',
    ]

    cookiesToDelete.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        maxAge: 0,
        path: '/',
      })
    })

    return response
  } catch (error: any) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: error.message || 'ログアウトに失敗しました' },
      { status: 500 }
    )
  }
}

