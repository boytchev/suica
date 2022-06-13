
REM PREPARE CSG --------------------------------------------

cd misc\csg
copy /b BSPNode.js+CSGCuttingPlane.js+CSGPolygon.js+CSGVertex.js+CSG.js __all__
..\jsmin\jsmin <__all__ >__min__


REM PREPARE THREE ------------------------------------------

cd ..\threejs
copy /b three.min.js+ConvexHull.js+ConvexGeometry.js+AnaglyphEffect.js+StereoEffect.js+VRButton.js+GLTFExporter.js+GLTFLoader.js+FontLoader.js+TextGeometry.js __all__
..\jsmin\jsmin <__all__ >__min__


REM PREPARE CCAPTURE ---------------------------------------

cd ..\CCapture
copy /b CCapture.all.worker.min.js __all__
..\jsmin\jsmin <__all__ >__min__


REM PREPARE SUICA ---------------------------------------

cd ..\..\src
copy /b suica-main.js+suica-vr.js+suica-parser.js+suica-drawing.js+suica-mesh.js+suica-point.js+suica-line.js+suica-square.js+suica-cube.js+suica-circle.js+suica-sphere.js+suica-cylinder.js+suica-cone.js+suica-group.js+suica-tube.js+suica-convex.js+suica-model.js+suica-construct.js+suica-scorm.js+suica-text3d.js+suica-capture.js __all__



cd ..



rem copy /b misc\threejs\__min__+ misc\csg\__min__ + misc\CCapture\__min__ bin\three.min.js

rem Create suica.js prefix
rem IMPORTANT: Between "echo" and "document: there are invisible
rem characters for UTF-8 BOM. If you delete these characters,
rem they can be recovered in this way:
rem		1. type EF BB BF between "echo" and "document"
rem		2. use NotePad++ 
rem		3. select EF BB BF
rem		4. Plugins|Convert| HEX to ASCI
rem		5. the text EF BB BF collapses into invisible characters
rem alternative: the same chars are between these quotes:    "﻿"

rem echo ﻿ document.write( '^<script src^="three.min.js" onload^="LoadSuica();"^>^</script^>' );﻿function LoadSuica(){ > bin\suica.js

copy /b misc\threejs\__min__+ misc\csg\__min__ + misc\CCapture\__min__ + src\__all__ bin\__all__
echo ﻿ // Suica 2.0 >bin\suica.js
misc\jsmin\jsmin <bin\__all__ >>bin\suica.js



rem Create suica.js postfix
rem echo } // LoadSuica >> bin\suica.js


copy bin\suica.js examples

del misc\csg\__???__
del misc\threejs\__all__
del misc\CCapture\__???__
del src\__???__
del bin\__???__
