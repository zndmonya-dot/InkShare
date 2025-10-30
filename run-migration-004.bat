@echo off
echo ========================================
echo Migration 004: Add reset_time to organizations
echo ========================================
echo.

REM .env.localから環境変数を読み込む
for /f "usebackq tokens=1,* delims==" %%a in (".env.local") do (
    set "%%a=%%b"
)

REM DATABASE_URLが設定されているか確認
if "%DATABASE_URL%"=="" (
    echo ERROR: DATABASE_URL not found in .env.local
    pause
    exit /b 1
)

echo Executing migration 004...
psql "%DATABASE_URL%" -f "db\migrations\004_add_reset_time_to_organizations.sql"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Migration 004 completed successfully!
    echo ========================================
) else (
    echo.
    echo ERROR: Migration failed!
    pause
    exit /b 1
)

pause

