copy three.min.js bin


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
copy /b bin\suica.js + suica-main.js + suica-vr.js + suica-parser.js + suica-drawing.js + suica-mesh.js + suica-point.js + suica-line.js + suica-square.js + suica-cube.js + suica-circle.js + suica-sphere.js + suica-cylinder.js + suica-cone.js + suica-group.js + suica-spline.js + suica-tube.js bin\suica.js


rem Create suica.js postfix
echo } // LoadSuica >> bin\suica.js

misc\jsmin\jsmin <bin\suica.js >bin\suica.min.js "Suica 2.0"

copy bin\three.min.js examples
copy bin\suica.js examples

