@echo off
echo ========================================
echo PostgreSQL Database Setup
echo ========================================
echo.

REM PostgreSQLのパスワードを入力してください
set /p PGPASSWORD="PostgreSQL password for user 'postgres': "

echo.
echo Creating database 'presence_app'...
psql -U postgres -c "CREATE DATABASE presence_app;"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Database might already exist or password is incorrect.
    echo Continuing to table creation...
)

echo.
echo Creating tables...
psql -U postgres -d presence_app -f db/schema.sql

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Database: presence_app
echo Tables: organizations, users, user_status, notifications
echo.
pause

