# PowerShell Launcher for Maddy
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   Starting Maddy: Campus Mental Wellness Companion" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "`n[1/2] Starting FastAPI Backend on http://localhost:8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root/backend'; python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

Write-Host "[2/2] Starting Vite Frontend on http://localhost:5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root/frontend'; npm run dev"

Start-Sleep -Seconds 3
Write-Host "`nOpening Maddy in default browser..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "   Maddy is running!" -ForegroundColor Green
Write-Host "   Frontend: http://localhost:5173"
Write-Host "   Backend:  http://localhost:8000"
Write-Host "   API Docs: http://localhost:8000/docs"
Write-Host "========================================================" -ForegroundColor Cyan
