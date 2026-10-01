@echo off
title Maddy Campus Wellness Companion
echo ========================================================
echo   Starting Maddy: Campus Mental Wellness Companion
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/2] Starting FastAPI Backend on http://localhost:8000...
start "Maddy Backend API" cmd /k "cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/2] Starting Vite Frontend on http://localhost:5173...
start "Maddy Frontend UI" cmd /k "cd frontend && npm run dev"

timeout /t 3 /nobreak >nul
echo Opening Maddy in your browser...
start http://localhost:5173

echo.
echo ========================================================
echo   Maddy is running!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo ========================================================
