@echo off
setlocal

echo ========================================
echo マイグレーション002を適用
echo （グループごとのステータス機能）
echo ========================================
echo.

set SQL_FILE=db/migrations/002_add_organization_to_status.sql

if not exist %SQL_FILE% (
    echo Error: SQLファイルが見つかりません: %SQL_FILE%
    exit /b 1
)

echo Supabaseダッシュボードで以下のSQLを実行してください:
echo.
echo 1. Supabaseダッシュボード ^> SQL Editor を開く
echo 2. 以下の内容をコピーして実行
echo.
echo ----------------------------------------
type %SQL_FILE%
echo ----------------------------------------
echo.
echo.
echo 実行後、アプリケーションを再起動してください。
echo.

pause
endlocal
