@echo off
setlocal

echo ========================================
echo デモユーザーのセットアップ
echo ========================================
echo.

REM .env.local から環境変数を読み込む
for /f "usebackq tokens=1,* delims==" %%a in (".env.local") do (
    set "%%a=%%b"
)

echo デモユーザーをSupabaseに作成します...
echo.
echo Email: demo@inklink.app
echo Password: demo1234
echo Name: デモユーザー
echo.

REM Supabase CLIでデモユーザーを作成するSQLを実行
echo -- デモユーザー作成SQL > temp_demo.sql
echo -- 注意: Supabaseダッシュボードから手動で実行してください >> temp_demo.sql
echo. >> temp_demo.sql
echo -- 1. Supabaseダッシュボード > Authentication > Users から >> temp_demo.sql
echo --    「Add user」でデモユーザーを作成 >> temp_demo.sql
echo --    Email: demo@inklink.app >> temp_demo.sql
echo --    Password: demo1234 >> temp_demo.sql
echo. >> temp_demo.sql
echo -- 2. 以下のSQLをSQL Editorで実行 >> temp_demo.sql
echo. >> temp_demo.sql
echo INSERT INTO users (id, email, name, created_at) >> temp_demo.sql
echo VALUES ( >> temp_demo.sql
echo   (SELECT id FROM auth.users WHERE email = 'demo@inklink.app'), >> temp_demo.sql
echo   'demo@inklink.app', >> temp_demo.sql
echo   'デモユーザー', >> temp_demo.sql
echo   NOW() >> temp_demo.sql
echo ) >> temp_demo.sql
echo ON CONFLICT (id) DO NOTHING; >> temp_demo.sql
echo. >> temp_demo.sql
echo -- 3. デモ用のグループを作成 >> temp_demo.sql
echo INSERT INTO organizations (name, type, plan, invite_code, is_open, created_at) >> temp_demo.sql
echo VALUES ('デモグループ', 'personal', 'free', 'DEMO2024', TRUE, NOW()) >> temp_demo.sql
echo RETURNING id; >> temp_demo.sql
echo. >> temp_demo.sql
echo -- 4. デモユーザーをデモグループに追加（上記で取得したIDを使用） >> temp_demo.sql
echo INSERT INTO user_organizations (user_id, organization_id, role, is_active) >> temp_demo.sql
echo VALUES ( >> temp_demo.sql
echo   (SELECT id FROM auth.users WHERE email = 'demo@inklink.app'), >> temp_demo.sql
echo   (SELECT id FROM organizations WHERE invite_code = 'DEMO2024'), >> temp_demo.sql
echo   'admin', >> temp_demo.sql
echo   TRUE >> temp_demo.sql
echo ); >> temp_demo.sql
echo. >> temp_demo.sql
echo -- 5. デモユーザーのステータスを作成 >> temp_demo.sql
echo INSERT INTO user_status (user_id, organization_id, status, created_at) >> temp_demo.sql
echo VALUES ( >> temp_demo.sql
echo   (SELECT id FROM auth.users WHERE email = 'demo@inklink.app'), >> temp_demo.sql
echo   (SELECT id FROM organizations WHERE invite_code = 'DEMO2024'), >> temp_demo.sql
echo   'available', >> temp_demo.sql
echo   NOW() >> temp_demo.sql
echo ) >> temp_demo.sql
echo ON CONFLICT (user_id, organization_id) DO NOTHING; >> temp_demo.sql

echo.
echo ========================================
echo SQLファイルを生成しました: temp_demo.sql
echo ========================================
echo.
echo 次の手順:
echo 1. Supabaseダッシュボードを開く
echo 2. Authentication ^> Users から「Add user」でデモユーザーを作成
echo    - Email: demo@inklink.app
echo    - Password: demo1234
echo 3. SQL Editor で temp_demo.sql の内容を実行
echo.

pause
endlocal

