@echo off
type nul > py.txt

for /r %%F in (*.py) do (
    echo ======================================== >> py.txt
    echo FILE: %%F >> py.txt
    echo ======================================== >> py.txt

    type "%%F" >> py.txt

    echo. >> py.txt
    echo. >> py.txt
)

echo Python collection complete.
pause