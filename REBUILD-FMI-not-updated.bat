
REM Prepare CSG.JS files -----------------------------------

cd misc\csg
copy /b BSPNode.js+CSGCuttingPlane.js+CSGPolygon.js+CSGVertex.js+CSG.js __all__
..\jsmin\jsmin <__all__ >__min__
cd ..\..




REM Prepare THREE.JS files ---------------------------------

cd misc\threejs
copy /b three.min.js+ConvexHull.js+ConvexGeometry.js+AnaglyphEffect.js+StereoEffect.js+VRButton.js+GLTFExporter.js+GLTFLoader.js+FontLoader.js+TextGeometry.js+OrbitControls.js+TrackballControls.js __all__
..\jsmin\jsmin <__all__ >__min__
cd ..\..




REM Prepare CCAPTURE.JS files ------------------------------

cd misc\CCapture
copy /b CCapture.all.worker.min.js __all__
..\jsmin\jsmin <__all__ >__min__
cd ..\..




REM Preare SUICA.JS files-----------------------------------

cd src
copy /b suica-main.js+suica-vr.js+suica-parser.js+suica-drawing.js+suica-fmi.js+suica-shape.js+suica-mesh.js+suica-point.js+suica-line.js+suica-square.js+suica-cube.js+suica-circle.js+suica-sphere.js+suica-cylinder.js+suica-cone.js+suica-group.js+suica-tube.js+suica-surface.js+suica-convex.js+suica-extrude.js+suica-model.js+suica-construct.js+suica-scorm.js+suica-device.js+suica-text3d.js+suica-capture.js __all__
cd ..




REM Generate SUICA.JS --------------------------------------

REM IMPORTANT: Between "echo " and "//" there are invisible
REM characters for UTF-8 BOM. If you delete these characters,
REM they can be recovered in this way:
REM		1. type EF BB BF between "echo " and "//"
REM		2. use NotePad++ 
REM		3. select EF BB BF
REM		4. Plugins|Convert| HEX to ASCI
REM		5. the text EF BB BF collapses into invisible
REM			characters alternative: the same chars are
REM			between these quotes:    "﻿"

echo ﻿// Suica 2.0 >bin\suica.fmi.js

REM Get Suica build number, build time and build date

for /f "tokens=1-3 delims=/-" %%a in ('date /t') do (set SUICA_DATE=%%a-%%b-%%c)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set SUICA_TIME=%%a:%%b)
(set /P SUICA_BUILD=<BUILD.NUMBER)2>nul || set SUICA_BUILD=0
REM set /A SUICA_BUILD+=1
echo:%SUICA_BUILD%>BUILD.NUMBER

REM Create JavaScript variables for Suica version and date

echo SUICA_VERSION = '2.0.%SUICA_BUILD%'; >>bin\suica.fmi.js
echo SUICA_DATE = '%SUICA_DATE%%SUICA_TIME%'; >>bin\suica.fmi.js

REM Minify Suica code and append it to suica.js

copy /b misc\threejs\__min__+misc\csg\__min__+misc\CCapture\__min__+src\__all__ __all__
misc\jsmin\jsmin <__all__ >>bin\suica.fmi.js




REM Clean up all __ files

del misc\csg\__???__
del misc\threejs\__all__
del misc\CCapture\__???__
del src\__???__
del __???__