@echo off
echo ===================================================
echo Starting IoT Predictive Maintenance Dashboard Setup
echo ===================================================

echo.
echo [1/3] Setting up Backend...
cd backend
python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt
start cmd /k "title Backend Server && call venv\Scripts\activate.bat && python main.py"
cd ..

echo.
echo [Optional] To use PostgreSQL instead of SQLite, run:
echo docker-compose up -d
echo.
echo.
echo [2/3] Setting up Frontend...
cd frontend
call npm install
start cmd /k "title Frontend Server && npm run dev"
cd ..

echo.
echo ===================================================
echo Both servers are starting up!
echo Backend will be at: http://localhost:8000
echo Frontend will be at: http://localhost:5173
echo ===================================================
pause
