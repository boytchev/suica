@ECHO.
@ECHO Copying the original files from Three.js to here
@ECHO.
@ECHO Open REBUILD.bat and comment the EXIT command
@ECHO.
@ECHO Note that files AnaglyphEffect.js and VRButton.js are changed
@ECHO If you execute REBUILD the changes will be reverted
@ECHO.
@PAUSE
@EXIT

@set THREE=D:\Install\Three.js\three.js-master-r145\three.js-master

@copy %THREE%\build\three.min.js .
@copy %THREE%\examples\js\controls\OrbitControls.js .
@copy %THREE%\examples\js\effects\AnaglyphEffect.js .
@copy %THREE%\examples\js\effects\StereoEffect.js .
@copy %THREE%\examples\js\geometries\ConvexGeometry.js .
@copy %THREE%\examples\js\geometries\TextGeometry.js .
@copy %THREE%\examples\js\loaders\FontLoader.js .
@copy %THREE%\examples\js\loaders\GLTFLoader.js .
@copy %THREE%\examples\js\exporters\GLTFExporter.js .
@copy %THREE%\examples\jsm\webxr\VRButton.js .
@copy %THREE%\examples\js\math\ConvexHull.js .
@pause