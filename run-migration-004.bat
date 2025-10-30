@echo off
setlocal

echo ========================================
echo マイグレーション004を適用
echo （ステータス初期化時刻設定機能）
echo ========================================
echo.

set SQL_FILE=db/migrations/004_add_reset_time_to_organizations.sql

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

