@ECHO OFF


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
