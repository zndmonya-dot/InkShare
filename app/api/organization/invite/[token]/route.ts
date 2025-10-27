import { NextResponse } from 'next/server'
import { queryOne } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const org = await queryOne<{
      id: string
      name: string
      type: 'business' | 'personal'
    }>(
      'SELECT id, name, type FROM organizations WHERE invite_code = $1',
      [params.token]
    )

    if (!org) {
      return NextResponse.json({ error: '招待リンクが無効です' }, { status: 404 })
    }

    return NextResponse.json({ organization: org }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

