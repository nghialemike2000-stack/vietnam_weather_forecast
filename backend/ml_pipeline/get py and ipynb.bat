@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

:: =========================
:: CONFIG
:: =========================
set "ROOT_DIR=%~dp0"
set "OUTPUT_FILE=all_code_output.txt"

:: Xóa file cũ nếu tồn tại
if exist "%OUTPUT_FILE%" del "%OUTPUT_FILE%"

echo ============================================== >> "%OUTPUT_FILE%"
echo PROJECT SOURCE EXPORT >> "%OUTPUT_FILE%"
echo ROOT: %ROOT_DIR% >> "%OUTPUT_FILE%"
echo ============================================== >> "%OUTPUT_FILE%"
echo. >> "%OUTPUT_FILE%"

:: =========================
:: READ ALL .py AND .ipynb
:: =========================
for /r "%ROOT_DIR%" %%F in (*.py *.ipynb) do (

    echo ================================================== >> "%OUTPUT_FILE%"
    echo FILE: %%F >> "%OUTPUT_FILE%"
    echo ================================================== >> "%OUTPUT_FILE%"
    echo. >> "%OUTPUT_FILE%"

    type "%%F" >> "%OUTPUT_FILE%"

    echo. >> "%OUTPUT_FILE%"
    echo. >> "%OUTPUT_FILE%"
)

echo Done!
echo Output saved to:
echo %ROOT_DIR%%OUTPUT_FILE%

pause