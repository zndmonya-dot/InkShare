import { createClient } from '@supabase/supabase-js'

// Supabaseサーバー側クライアント（Service Role Key使用）
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase環境変数が設定されていません')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// クエリヘルパー関数（互換性のため残す）
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  // SQL文をSupabaseのRPCまたはクエリに変換する必要がある
  // 今のところは警告を出す
  console.warn('⚠️ query() は非推奨です。Supabaseクライアントを直接使用してください')
  return []
}

// 単一行取得ヘルパー
export async function queryOne<T = any>(
  text: string,
  params?: any[]
): Promise<T | null> {
  console.warn('⚠️ queryOne() は非推奨です。Supabaseクライアントを直接使用してください')
  return null
}

// トランザクションヘルパー
export async function transaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  console.warn('⚠️ transaction() は非推奨です。Supabaseクライアントを直接使用してください')
  throw new Error('トランザクションは未実装です')
}

// Supabase admin clientを取得
export { getSupabaseAdmin }

