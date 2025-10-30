import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const supabase = getSupabaseAdmin()
    
    const { data: org, error } = await supabase
      .from('organizations')
      .select('id, name, type')
      .eq('invite_code', params.token)
      .maybeSingle()

    if (error || !org) {
      return NextResponse.json({ error: '招待リンクが無効です' }, { status: 404 })
    }

    return NextResponse.json({ organization: org }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

