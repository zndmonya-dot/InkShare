import { NextResponse } from 'next/server'
import { signUpPersonal } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()
    const result = await signUpPersonal(email, password, name)
    
    // メール確認が必要かどうかを判定
    const needsEmailConfirmation = result.needsEmailConfirmation || false
    
    return NextResponse.json({ 
      user: result.user,
      needsEmailConfirmation 
    }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

