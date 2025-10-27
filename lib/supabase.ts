import { createBrowserClient } from '@supabase/ssr'

// Supabaseクライアント（クライアント側）
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Supabase環境変数が設定されていません')
  }

  return createBrowserClient(
    supabaseUrl || '',
    supabaseKey || '',
    {
      cookies: {
        get(name: string) {
          if (typeof document === 'undefined') return undefined
          const cookie = document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${name}=`))
          return cookie ? decodeURIComponent(cookie.split('=')[1]) : undefined
        },
        set(name: string, value: string, options: any) {
          if (typeof document === 'undefined') return
          let cookie = `${name}=${encodeURIComponent(value)}`
          if (options?.maxAge) {
            cookie += `; max-age=${options.maxAge}`
          }
          if (options?.path) {
            cookie += `; path=${options.path}`
          }
          document.cookie = cookie
        },
        remove(name: string, options: any) {
          if (typeof document === 'undefined') return
          document.cookie = `${name}=; path=${options?.path || '/'}; max-age=0`
        },
      },
    }
  )
}

