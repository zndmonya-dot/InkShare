import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/auth-server'
import { createClient } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || ''
    const user = await getServerUser(cookieHeader)
    
    if (!user) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'パスワードを入力してください' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: '新しいパスワードは6文字以上である必要があります' }, { status: 400 })
    }

    // クライアント側のSupabaseインスタンスでパスワード更新
    const supabase = createClient()

    // 現在のパスワードで再認証
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    })

    if (signInError) {
      return NextResponse.json({ error: '現在のパスワードが正しくありません' }, { status: 401 })
    }

    // パスワード更新
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (updateError) {
      console.error('Password update error:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Password update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

