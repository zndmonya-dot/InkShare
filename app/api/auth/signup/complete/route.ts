import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { userId, email, name, avatarColor } = await request.json()

    if (!userId || !email || !name) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdmin()

    // ユーザー情報をDBに保存
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email,
        name,
        avatar_color: avatarColor || 'from-lime-400 to-green-500'
      })

    if (userError) {
      console.error('User insert error:', userError)
      return NextResponse.json(
        { error: 'ユーザー情報の保存に失敗しました' },
        { status: 500 }
      )
    }

    // 初期ステータスを作成
    const { error: statusError } = await supabase
      .from('user_status')
      .insert({
        user_id: userId,
        status: 'available'
      })

    if (statusError) {
      console.error('Status insert error:', statusError)
      return NextResponse.json(
        { error: 'ステータスの作成に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Signup complete error:', error)
    return NextResponse.json(
      { error: error.message || 'サインアップの完了に失敗しました' },
      { status: 500 }
    )
  }
}

