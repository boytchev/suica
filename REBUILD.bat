


rem Minify CSG.js and its files
misc\jsmin\jsmin <misc\csg\BSPNode.js >misc\csg\BSPNode.min.js
misc\jsmin\jsmin <misc\csg\CSG.js >misc\csg\CSG.min.js
misc\jsmin\jsmin <misc\csg\CSGCuttingPlane.js >misc\csg\CSGCuttingPlane.min.js
misc\jsmin\jsmin <misc\csg\CSGPolygon.js >misc\csg\CSGPolygon.min.js
misc\jsmin\jsmin <misc\csg\CSGVertex.js >misc\csg\CSGVertex.min.js


rem Minify Three.js and its libraries
misc\jsmin\jsmin <misc\threejs\ConvexHull.js >misc\threejs\ConvexHull.min.js
misc\jsmin\jsmin <misc\threejs\ConvexGeometry.js >misc\threejs\ConvexGeometry.min.js
misc\jsmin\jsmin <misc\threejs\AnaglyphEffect.js >misc\threejs\AnaglyphEffect.min.js
misc\jsmin\jsmin <misc\threejs\StereoEffect.js >misc\threejs\StereoEffect.min.js
misc\jsmin\jsmin <misc\threejs\VRButton.js >misc\threejs\VRButton.min.js
misc\jsmin\jsmin <misc\threejs\GLTFExporter.js >misc\threejs\GLTFExporter.min.js
misc\jsmin\jsmin <misc\threejs\GLTFLoader.js >misc\threejs\GLTFLoader.min.js
misc\jsmin\jsmin <misc\threejs\FontLoader.js >misc\threejs\FontLoader.min.js
misc\jsmin\jsmin <misc\threejs\TextGeometry.js >misc\threejs\TextGeometry.min.js

copy /b misc\threejs\three.min.js + misc\threejs\ConvexHull.min.js + misc\threejs\ConvexGeometry.min.js + misc\threejs\AnaglyphEffect.min.js + misc\threejs\StereoEffect.min.js + misc\threejs\VRButton.min.js + misc\threejs\GLTFExporter.min.js + misc\threejs\GLTFLoader.min.js + misc\threejs\FontLoader.min.js + misc\threejs\TextGeometry.min.js + misc\csg\BSPNode.min.js + misc\csg\CSGCuttingPlane.min.js + misc\csg\CSGPolygon.min.js + misc\csg\CSGVertex.min.js + misc\csg\CSG.min.js +misc\CCapture\CCapture.all.worker.min.js bin\three.min.js

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

echo ﻿ document.write( '^<script src^="three.min.js" onload^="LoadSuica();"^>^</script^>' );﻿function LoadSuica(){ > bin\suica.js

rem Copy Suica files one by one
copy /b bin\suica.js + src\suica-main.js + src\suica-vr.js + src\suica-parser.js + src\suica-drawing.js + src\suica-mesh.js + src\suica-point.js + src\suica-line.js + src\suica-square.js + src\suica-cube.js + src\suica-circle.js + src\suica-sphere.js + src\suica-cylinder.js + src\suica-cone.js + src\suica-group.js + src\suica-tube.js + src\suica-convex.js + src\suica-model.js + src\suica-construct.js + src\suica-scorm.js + src\suica-text3d.js + src\suica-capture.js bin\suica.js


rem Create suica.js postfix
echo } // LoadSuica >> bin\suica.js

misc\jsmin\jsmin <bin\suica.js >bin\suica.min.js "Suica 2.0"

copy bin\three.min.js .
copy bin\three.min.js examples
copy bin\three.min.js test
copy bin\three.min.js test\cases

copy bin\suica.js examples

