@echo off
REM Activar el entorno virtual y arrancar el backend

cd /d "%~dp0Backend"
call .venv\Scripts\activate
start "Django Backend" cmd /k "python manage.py runserver 8000"

REM Ahora lanzamos el frontend

cd /d "%~dp0car-dealership-frontend"
start "Next.js Frontend" cmd /k "pnpm run dev"
