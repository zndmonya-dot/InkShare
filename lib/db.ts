import { Pool, QueryResult } from 'pg'

// PostgreSQL接続プール（シングルトン）
let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL
    
    if (!databaseUrl) {
      console.warn('⚠️ DATABASE_URL が設定されていません')
    }

    pool = new Pool({
      connectionString: databaseUrl,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })

    pool.on('error', (err) => {
      console.error('Unexpected database error:', err)
    })
  }

  return pool
}

// クエリヘルパー関数
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const pool = getPool()
  const result: QueryResult<T> = await pool.query(text, params)
  return result.rows
}

// 単一行取得ヘルパー
export async function queryOne<T = any>(
  text: string,
  params?: any[]
): Promise<T | null> {
  const rows = await query<T>(text, params)
  return rows.length > 0 ? rows[0] : null
}

// トランザクションヘルパー
export async function transaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  const pool = getPool()
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

