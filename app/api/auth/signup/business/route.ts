import { NextResponse } from 'next/server'
import { signUpBusiness } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password, name, companyName } = await request.json()
    const user = await signUpBusiness(email, password, name, companyName)
    return NextResponse.json({ user }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

