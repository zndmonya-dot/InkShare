import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/auth-server'
import { joinGroupByCode } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || ''
    const user = await getServerUser(cookieHeader)
    if (!user) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
    }

    const { inviteCode } = await request.json()
    const org = await joinGroupByCode(user.id, inviteCode)
    
    return NextResponse.json({ organization: org }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

