
REM Prepare CSG.JS files -----------------------------------

cd misc\csg
copy /b BSPNode.js+CSGCuttingPlane.js+CSGPolygon.js+CSGVertex.js+CSG.js __all__
..\jsmin\jsmin <__all__ >__min__
cd ..\..




REM Prepare THREE.JS files ---------------------------------

cd misc\threejs
copy /b three.min.js+ConvexHull.js+ConvexGeometry.js+AnaglyphEffect.js+StereoEffect.js+VRButton.js+GLTFExporter.js+GLTFLoader.js+FontLoader.js+TextGeometry.js __all__
..\jsmin\jsmin <__all__ >__min__
cd ..\..




REM Prepare CCAPTURE.JS files ------------------------------

cd misc\CCapture
copy /b CCapture.all.worker.min.js __all__
..\jsmin\jsmin <__all__ >__min__
cd ..\..




REM Preare SUICA.JS files-----------------------------------

cd src
copy /b suica-main.js+suica-vr.js+suica-parser.js+suica-drawing.js+suica-mesh.js+suica-point.js+suica-line.js+suica-square.js+suica-cube.js+suica-circle.js+suica-sphere.js+suica-cylinder.js+suica-cone.js+suica-group.js+suica-tube.js+suica-convex.js+suica-model.js+suica-construct.js+suica-scorm.js+suica-text3d.js+suica-capture.js __all__
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

copy /b misc\threejs\__min__+misc\csg\__min__+misc\CCapture\__min__+src\__all__ __all__
echo ﻿ // Suica 2.0 >bin\suica.js
misc\jsmin\jsmin <__all__ >>bin\suica.js
copy bin\suica.js examples




REM Clean up all __ files

del misc\csg\__???__
del misc\threejs\__all__
del misc\CCapture\__???__
del src\__???__
del __???__
