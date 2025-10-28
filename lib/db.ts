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

// PostgreSQL クエリを実行するヘルパー
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const supabase = getSupabaseAdmin()
  
  // パラメータをバインドしてRPCとして実行
  const { data, error } = await supabase.rpc('execute_sql', {
    sql_query: text,
    sql_params: params || []
  })

  if (error) {
    console.error('Query error:', error)
    throw new Error(error.message)
  }

  return data || []
}

// 単一行取得ヘルパー
export async function queryOne<T = any>(
  text: string,
  params?: any[]
): Promise<T | null> {
  const results = await query<T>(text, params)
  return results.length > 0 ? results[0] : null
}

// トランザクションヘルパー
export async function transaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  const supabase = getSupabaseAdmin()
  // Supabaseはトランザクションを直接サポートしていないため、
  // RPCで実装する必要があります
  throw new Error('トランザクションは未実装です')
}

// Supabase admin clientを取得
export { getSupabaseAdmin }

