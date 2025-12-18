@echo off
rem -------------------------------------------------
rem  VizSprints – start backend (Flask) + frontend (Vite)
rem -------------------------------------------------

rem ---- 1️⃣ Start the Flask backend in its own window ----
start "VizSprints Backend" cmd /k ^
  cd /d "C:\Sham\VizSprints\backend" ^& ^
  venv\Scripts\python.exe -m pip install -r requirements.txt ^& ^
  venv\Scripts\python.exe app.py

rem ---- 2️⃣ Start the React/Vite dev server in its own window ----
start "VizSprints Frontend" cmd /k ^
  cd /d "C:\Sham\VizSprints\frontend" ^& ^
  npm.cmd install ^& ^
  npm.cmd run dev

rem ---- 3️⃣ Open the browser automatically (optional) ----
timeout /t 5 >nul
start "" "http://localhost:5173"

echo.
echo =========================================================
echo   VizSprints is starting…
echo   - Backend: http://localhost:5000/api
echo   - Frontend: http://localhost:5173 (or 5174 if busy)
echo   Close the two console windows to stop the services.
echo =========================================================
pause
