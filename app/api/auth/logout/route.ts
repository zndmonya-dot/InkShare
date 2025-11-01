import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie') || ''
    const supabase = createServerSupabaseClient(cookieHeader)

    // Supabaseセッションをクリア
    const { error } = await supabase.auth.signOut()

    // ログアウトは成功したとみなす（エラーがあってもCookieをクリア）
    // サーバー側のログアウトが失敗しても、クライアント側でCookieをクリアできる
    if (error) {
      console.error('Logout warning (ignored):', error)
    }

    // Cookieをクリアするレスポンスを返す
    const response = NextResponse.json({ success: true }, { status: 200 })
    
    // @supabase/ssrで使用されるCookie名を削除
    const cookiesToDelete = [
      'sb-access-token',
      'sb-refresh-token',
      'sb-auth-token',
      'sb-auth-code-verifier',
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

