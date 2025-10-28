import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'パスワードは8文字以上で設定してください' },
        { status: 400 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Admin権限で、メール確認済みとしてユーザーを作成
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // メール確認を自動的に完了
    })

    if (authError || !authData.user) {
      console.error('User creation error:', authError)
      return NextResponse.json(
        { error: authError?.message || 'ユーザーの作成に失敗しました' },
        { status: 500 }
      )
    }

    // アバターカラーをランダムに選択
    const { getRandomAvatarColor } = await import('@/lib/utils')
    const randomColor = getRandomAvatarColor()

    // ユーザー情報をDBに保存
    const { error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name,
        avatar_color: randomColor
      })

    if (userError) {
      console.error('User insert error:', userError)
      // ユーザー情報の保存に失敗した場合は、認証ユーザーも削除
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { error: 'ユーザー情報の保存に失敗しました' },
        { status: 500 }
      )
    }

    // 初期ステータスを作成
    const { error: statusError } = await supabaseAdmin
      .from('user_status')
      .insert({
        user_id: authData.user.id,
        status: 'available'
      })

    if (statusError) {
      console.error('Status insert error:', statusError)
      // ステータス作成失敗は致命的ではないのでログのみ
    }

    return NextResponse.json({
      success: true,
      userId: authData.user.id,
      email: authData.user.email
    }, { status: 200 })
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: error.message || 'サインアップに失敗しました' },
      { status: 500 }
    )
  }
}

