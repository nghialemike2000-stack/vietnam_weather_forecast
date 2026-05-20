@echo off
type nul > ts.txt

for /r %%F in (*.ts) do (
    echo ======================================== >> ts.txt
    echo FILE: %%F >> ts.txt
    echo ======================================== >> ts.txt

    type "%%F" >> ts.txt

    echo. >> ts.txt
    echo. >> ts.txt
)

echo TypeScript collection complete.
pause