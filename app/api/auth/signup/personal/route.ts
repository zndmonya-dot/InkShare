import { NextResponse } from 'next/server'
import { signUpPersonal } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password, name, groupName } = await request.json()
    const { user, inviteCode } = await signUpPersonal(email, password, name, groupName)
    return NextResponse.json({ user, inviteCode }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

