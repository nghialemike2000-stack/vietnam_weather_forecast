@echo off
type nul > ipynb.txt

for /r %%F in (*.ipynb) do (
    echo ======================================== >> ipynb.txt
    echo FILE: %%F >> ipynb.txt
    echo ======================================== >> ipynb.txt

    type "%%F" >> ipynb.txt

    echo. >> ipynb.txt
    echo. >> ipynb.txt
)

echo Jupyter Notebook collection complete.
pause