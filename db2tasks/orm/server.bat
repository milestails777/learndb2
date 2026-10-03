docker compose up -d 
if errorlevel 1 exit /b %errorlevel%
echo PostgreSQL: localhost:5432