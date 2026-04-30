@echo off
title Sistema de Gestion DTLL
color 0A

echo ===================================================
echo   SISTEMA DE GESTION LOCAL - DONDE TE LLEVO (DTLL)
echo ===================================================
echo.
echo [1/3] Verificando requisitos del sistema...

:: Verificar si Java esta instalado
java -version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo ERROR: No se ha detectado Java en este equipo.
    echo El sistema requiere Java 17 o superior para funcionar.
    echo Por favor, instale Java desde https://adoptium.net y vuelva a intentarlo.
    pause
    exit /b
)

echo - Java detectado correctamente.
timeout /t 2 /nobreak > NUL

echo.
echo [2/3] Verificando integridad de los archivos...
if not exist "DTLL.jar" (
    color 0C
    echo ERROR: No se encontro el archivo principal "DTLL.jar".
    echo Asegurese de no haber borrado o movido los archivos del sistema.
    pause
    exit /b
)
echo - Archivo principal (DTLL.jar) encontrado.
timeout /t 2 /nobreak > NUL

echo.
echo [3/3] Iniciando la base de datos y el motor de la aplicacion...
echo.
echo -------------------------------------------------------------------
echo   IMPORTANTE: Por favor, NO CIERRE esta ventana mientras este 
echo   usando el sistema. Para apagar el sistema, simplemente 
echo   cierre esta ventana negra.
echo -------------------------------------------------------------------
echo.
echo Preparando el navegador web...

:: Abrir el navegador en 5 segundos de forma asincrona para que el servidor tenga tiempo de arrancar
start "" cmd /c "timeout /t 6 /nobreak >nul & start http://localhost:8080"

echo Arrancando el servidor local...
echo.

:: Ejecutar el servidor bloqueando esta ventana para que el usuario vea los logs y no necesite 2 ventanas
java -jar DTLL.jar

pause
