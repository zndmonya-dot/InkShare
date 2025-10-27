import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// サーバーサイド用のSupabaseクライアント（API Routes用）
export function createServerSupabaseClient(cookieHeader?: string) {
  // クッキーをパースしてオブジェクトに変換
  const parsedCookies = cookieHeader ? cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=')
    if (key && value) {
      acc[key] = decodeURIComponent(value)
    }
    return acc
  }, {} as Record<string, string>) : {}

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return parsedCookies[name]
        },
        set() {},
        remove() {},
      },
    }
  )
}

// Request/Responseベースのサーバーサイド用Supabaseクライアント
export function createServerSupabaseClientWithReqRes(
  request: Request,
  response?: Response
) {
  const cookieStore: Record<string, string> = {}
  
  // リクエストからcookieを読み取る
  const cookieHeader = request.headers.get('cookie') || ''
  cookieHeader.split(';').forEach(cookie => {
    const [key, value] = cookie.trim().split('=')
    if (key && value) {
      cookieStore[key] = decodeURIComponent(value)
    }
  })

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore[name]
        },
        set(name: string, value: string, options: any) {
          cookieStore[name] = value
        },
        remove(name: string, options: any) {
          delete cookieStore[name]
        },
      },
    }
  )
}

