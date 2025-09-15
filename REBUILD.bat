@ECHO OFF


REM Get Suica build number, build time and build date

for /f "tokens=1-3 delims=/-" %%a in ('date /t') do (set SUICA_DATE=%%a-%%b-%%c)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set SUICA_TIME=%%a:%%b)
(set /P SUICA_BUILD=<BUILD.NUMBER)2>nul || set SUICA_BUILD=0
REM set /A SUICA_BUILD+=1
echo:%SUICA_BUILD%>BUILD.NUMBER


CALL npm run build

@REM @misc\jsmin\jsmin <dist\suica.js >dist\suica.min.js
@REM @copy dist\suica.min.js examples\suica.js
@copy dist\suica.min.js examples\suica.js

@echo.
@echo.


@cd dist
@echo --------------------------------------
SETLOCAL enabledelayedexpansion
Set "MyFile=*.js"
for %%A in ("%MyFile%") do (
	set "Size=%%~zA"
	echo !size!	%%A	
)
@echo --------------------------------------
@echo.
@echo.
@cd ..

pause
