@echo off
title Sistema de Gestion DTLL - Desarrollo
echo Iniciando Sistema Donde Te Llevo (DTLL) en modo desarrollo...
echo.

echo [1/2] Levantando Base de Datos y Backend (Spring Boot)...
cd backend
start "Backend DTLL" cmd /c "mvnw spring-boot:run"
cd ..

echo [2/2] Iniciando Interfaz (React)...
cd frontend
start "Frontend DTLL" cmd /c "npm run dev"
cd ..

echo.
echo El sistema se esta iniciando.
echo Abriendo el navegador en unos segundos...
timeout /t 5 /nobreak
start http://localhost:5173
echo Listo!
