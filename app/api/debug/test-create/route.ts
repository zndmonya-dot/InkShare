import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/auth-server'
import { getSupabaseAdmin } from '@/lib/db'

export async function POST(request: Request) {
  const steps: any = {}
  
  try {
    // Step 1: 認証確認
    steps.step1_auth = { status: 'starting' }
    const cookieHeader = request.headers.get('cookie') || ''
    const user = await getServerUser(cookieHeader)
    
    if (!user) {
      steps.step1_auth = { status: 'failed', error: 'No user found' }
      return NextResponse.json({ steps, finalError: 'Not authenticated' }, { status: 401 })
    }
    steps.step1_auth = { status: 'success', userId: user.id }

    // Step 2: リクエストボディ
    steps.step2_body = { status: 'starting' }
    const { groupName } = await request.json()
    steps.step2_body = { status: 'success', groupName }

    const supabase = getSupabaseAdmin()

    // Step 3: ユーザー存在確認
    steps.step3_userCheck = { status: 'starting' }
    const { data: existingUser, error: userCheckError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()

    if (!existingUser) {
      steps.step3_userCheck = { status: 'failed', error: userCheckError }
      return NextResponse.json({ steps, finalError: 'User not found in DB' }, { status: 400 })
    }
    steps.step3_userCheck = { status: 'success' }

    // Step 4: 組織作成
    steps.step4_orgCreate = { status: 'starting' }
    const inviteCode = 'TEST1234'
    
    const { data: orgResult, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: groupName,
        type: 'personal',
        plan: 'free',
        invite_code: inviteCode,
        is_open: true
      })
      .select('id')
      .single()

    if (orgError || !orgResult) {
      steps.step4_orgCreate = { 
        status: 'failed', 
        error: orgError,
        errorCode: orgError?.code,
        errorMessage: orgError?.message,
        errorDetails: orgError?.details
      }
      return NextResponse.json({ steps, finalError: 'Organization creation failed' }, { status: 500 })
    }
    steps.step4_orgCreate = { status: 'success', orgId: orgResult.id }

    // Step 5: 他の組織を非アクティブに
    steps.step5_deactivate = { status: 'starting' }
    const { error: deactivateError } = await supabase
      .from('user_organizations')
      .update({ is_active: false })
      .eq('user_id', user.id)
    
    if (deactivateError) {
      steps.step5_deactivate = { status: 'failed', error: deactivateError }
    } else {
      steps.step5_deactivate = { status: 'success' }
    }

    // Step 6: ユーザーと組織をリンク
    steps.step6_link = { status: 'starting' }
    const { error: linkError } = await supabase
      .from('user_organizations')
      .insert({
        user_id: user.id,
        organization_id: orgResult.id,
        role: 'admin',
        is_active: true
      })

    if (linkError) {
      steps.step6_link = { 
        status: 'failed', 
        error: linkError,
        errorCode: linkError?.code,
        errorMessage: linkError?.message,
        errorDetails: linkError?.details
      }
      return NextResponse.json({ steps, finalError: 'Link creation failed' }, { status: 500 })
    }
    steps.step6_link = { status: 'success' }

    return NextResponse.json({ 
      success: true,
      steps,
      result: {
        organizationId: orgResult.id,
        inviteCode
      }
    }, { status: 200 })

  } catch (error: any) {
    return NextResponse.json({ 
      success: false,
      steps,
      finalError: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

