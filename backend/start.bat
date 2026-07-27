@echo off
echo Installing backend dependencies...
call npm install
echo.
echo Starting backend server...
call npm run dev
pause

