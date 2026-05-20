@echo off
type nul > css.txt

for /r %%F in (*.css) do (
    echo ======================================== >> css.txt
    echo FILE: %%F >> css.txt
    echo ======================================== >> css.txt

    type "%%F" >> css.txt

    echo. >> css.txt
    echo. >> css.txt
)

echo CSS collection complete.
pause