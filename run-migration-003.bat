@echo off
echo ========================================
echo カスタムステータスの色対応マイグレーション
echo ========================================
echo.

REM .envファイルから環境変数を読み込む
for /f "usebackq tokens=1,* delims==" %%a in (".env") do (
    if not "%%b"=="" set %%a=%%b
)

echo Supabaseに接続してマイグレーションを実行します...
echo.

psql "%DATABASE_URL%" -f db\migrations\003_add_custom_status_colors.sql

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo マイグレーション完了！
    echo ========================================
) else (
    echo.
    echo ========================================
    echo マイグレーションに失敗しました。
    echo ========================================
)

pause

