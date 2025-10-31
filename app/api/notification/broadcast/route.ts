import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClientWithReqRes } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClientWithReqRes(req)
    
    // 認証確認
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const { message, type } = await req.json()

    if (!message || !type) {
      return NextResponse.json(
        { error: 'メッセージとタイプが必要です' },
        { status: 400 }
      )
    }

    // ユーザーの所属組織を取得
    const { data: orgData, error: orgError } = await supabase
      .from('user_organizations')
      .select('organization_id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (orgError || !orgData) {
      return NextResponse.json(
        { error: '組織が見つかりません' },
        { status: 404 }
      )
    }

    // 組織の全メンバーを取得（自分以外）
    const { data: members, error: membersError } = await supabase
      .from('user_organizations')
      .select('user_id')
      .eq('organization_id', orgData.organization_id)
      .neq('user_id', user.id)

    if (membersError) {
      return NextResponse.json(
        { error: 'メンバーの取得に失敗しました' },
        { status: 500 }
      )
    }

    // 送信者の情報を取得
    const { data: senderData, error: senderError } = await supabase
      .from('users')
      .select('name, avatar_color')
      .eq('id', user.id)
      .single()

    if (senderError || !senderData) {
      return NextResponse.json(
        { error: '送信者の情報が取得できません' },
        { status: 500 }
      )
    }

    // 各メンバーに通知を送信
    const notifications = members.map(member => ({
      from_user_id: user.id,
      from_user_name: senderData.name,
      from_user_avatar: senderData.avatar_color,
      to_user_id: member.user_id,
      organization_id: orgData.organization_id,
      type: type,
      message: message,
      status: 'pending',
      read: false,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24時間後
    }))

    // 通知を一括挿入
    const { error: insertError } = await supabase
      .from('notifications')
      .insert(notifications)

    if (insertError) {
      console.error('Notification insert error:', insertError)
      return NextResponse.json(
        { error: '通知の送信に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      count: members.length,
      message: `${members.length}名に通知を送信しました`
    })

  } catch (error) {
    console.error('Broadcast notification error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

