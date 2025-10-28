import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/auth-server'
import { getSupabaseAdmin } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || ''
    const user = await getServerUser(cookieHeader)
    
    if (!user) {
      return NextResponse.json({ 
        error: 'Not authenticated',
        user: null 
      }, { status: 401 })
    }

    const supabase = getSupabaseAdmin()

    // usersテーブルを確認
    const { data: dbUser, error: dbUserError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    // user_organizationsテーブルを確認
    const { data: userOrgs, error: userOrgsError } = await supabase
      .from('user_organizations')
      .select('*')
      .eq('user_id', user.id)

    return NextResponse.json({
      authUser: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      },
      dbUser: dbUser || null,
      dbUserError: dbUserError || null,
      userOrganizations: userOrgs || [],
      userOrgsError: userOrgsError || null,
      message: dbUser ? 'ユーザーはusersテーブルに存在します' : 'ユーザーがusersテーブルに存在しません！'
    }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 })
  }
}

