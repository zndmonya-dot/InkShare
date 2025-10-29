import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getUserProfile } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'メールアドレスとパスワードを入力してください' },
        { status: 400 }
      )
    }

    // レスポンスオブジェクトを先に作成
    let response: NextResponse

    // サーバーサイドでSupabaseクライアントを作成し、Cookieを設定
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            request.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: any) {
            request.cookies.set({
              name,
              value: '',
              ...options,
              maxAge: 0,
            })
          },
        },
      }
    )

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user) {
      return NextResponse.json(
        { error: error?.message || 'ログインに失敗しました' },
        { status: 401 }
      )
    }
    
    // ユーザーのプロフィール情報を取得して組織参加状況を確認
    const profile = await getUserProfile(data.user.id)
    const hasOrganization = profile ? (profile.organizations.length > 0) : false

    // レスポンスを作成してCookieを設定
    response = NextResponse.json({ user: data.user, hasOrganization }, { status: 200 })

    // SupabaseのセッションCookieを設定
    if (data.session) {
      response.cookies.set({
        name: 'sb-access-token',
        value: data.session.access_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30日（永続化）
        path: '/',
      })
      
      response.cookies.set({
        name: 'sb-refresh-token',
        value: data.session.refresh_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30日（永続化）
        path: '/',
      })
    }

    return response
  } catch (error: any) {
    console.error('Signin error:', error)
    return NextResponse.json(
      { error: error.message || 'ログインに失敗しました' },
      { status: 401 }
    )
  }
}

