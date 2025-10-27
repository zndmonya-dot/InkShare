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
    supabaseKey || ''
  )
}

