// サーバーサイド専用の認証ヘルパー（API Routesでのみ使用）
import { createServerSupabaseClient } from './supabase-server'

// サーバーサイド用：現在のユーザーを取得
export async function getServerUser(cookieHeader: string) {
  console.log('🔍 getServerUser: Starting...')
  console.log('🍪 Cookie header:', cookieHeader ? 'Present' : 'Missing')
  
  try {
    const supabase = createServerSupabaseClient(cookieHeader)
    console.log('✅ getServerUser: Supabase client created')
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    console.log('📊 getServerUser: User data:', user ? `User ID: ${user.id}` : 'No user')
    console.log('❌ getServerUser: Error:', error)
    
    if (error || !user) {
      console.log('⚠️ getServerUser: Returning null')
      return null
    }

    console.log('✅ getServerUser: Returning user')
    return user
  } catch (err) {
    console.error('💥 getServerUser: Exception:', err)
    return null
  }
}

