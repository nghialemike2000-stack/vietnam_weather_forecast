@echo off
type nul > tsx.txt

for /r %%F in (*.tsx) do (
    echo ======================================== >> tsx.txt
    echo FILE: %%F >> tsx.txt
    echo ======================================== >> tsx.txt

    type "%%F" >> tsx.txt

    echo. >> tsx.txt
    echo. >> tsx.txt
)

echo TSX collection complete.
pause