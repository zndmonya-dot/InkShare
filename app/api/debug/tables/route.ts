import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const supabase = getSupabaseAdmin()

    // organizationsテーブルを確認
    const { data: orgs, error: orgsError } = await supabase
      .from('organizations')
      .select('*')
      .limit(5)

    // usersテーブルを確認
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5)

    // user_organizationsテーブルを確認
    const { data: userOrgs, error: userOrgsError } = await supabase
      .from('user_organizations')
      .select('*')
      .limit(5)

    // user_statusテーブルを確認
    const { data: userStatus, error: userStatusError } = await supabase
      .from('user_status')
      .select('*')
      .limit(5)

    return NextResponse.json({
      tables: {
        organizations: {
          exists: !orgsError,
          error: orgsError,
          count: orgs?.length || 0,
          sample: orgs || []
        },
        users: {
          exists: !usersError,
          error: usersError,
          count: users?.length || 0,
          sample: users || []
        },
        user_organizations: {
          exists: !userOrgsError,
          error: userOrgsError,
          count: userOrgs?.length || 0,
          sample: userOrgs || []
        },
        user_status: {
          exists: !userStatusError,
          error: userStatusError,
          count: userStatus?.length || 0,
          sample: userStatus || []
        }
      }
    }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 })
  }
}

