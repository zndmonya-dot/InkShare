import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/auth-server'
import { getSupabaseAdmin } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || ''
    const user = await getServerUser(cookieHeader)
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const supabase = getSupabaseAdmin()

    // ステップ1: user_organizations の生データを取得
    const { data: rawUserOrgs, error: rawError } = await supabase
      .from('user_organizations')
      .select('*')
      .eq('user_id', user.id)

    // ステップ2: JOIN付きで取得
    const { data: joinedData, error: joinError } = await supabase
      .from('user_organizations')
      .select(`
        *,
        organizations (*)
      `)
      .eq('user_id', user.id)

    return NextResponse.json({
      userId: user.id,
      userName: user.email,
      step1_rawUserOrgs: {
        data: rawUserOrgs,
        error: rawError
      },
      step2_joinedData: {
        data: joinedData,
        error: joinError
      }
    }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 })
  }
}

