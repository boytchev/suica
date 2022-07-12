---
title: Suica Internals
description: Additional internal information for developers and software masochists
tag: userguide test github
---

&nbsp;

# Table of contents

- [Testing Suica](#testing-suica)
- [Using Three.js](#using-threejs)


# Testing-suica

There is a rudimentary automatic [Suica tester](../test/test.html). It runs predefined test cases and compares the produced images. It reports the percentage of match:

- A match of 90% or more is considered normal.
- A match between 70% and 90% is most likely due to some rendering fluctuations
and a visual inspection is recommended.
- A match below 70% most likely indicates a problem and a visual inspection is
required.

Because timings cannot be set absolutely, some test cases may not produce the expected result. In this case run the tester another time to check whether the result is consistent.

To test only part of the test cases, a string template is given as a parameter to the tester. The following code [`test.html?convex`](../test/test.html?convex) will test all test cases with the substring *convex* in their names.

Browsers have a standard way of reaction on non-standard web pages (e.g. missing closing tags, unregistered custom tags, etc). This is heavily used in all Suica
examples. Tools that validate HTML pages may complain about Suica HTML code.


# Using Three.js

This version of Suica is based on Three.js. Programs that use Suica should include `suica.js`. Apart from Suica itself, `suica.js` contains:

- The original [Three.js](https://github.com/mrdoob/three.js/) file:
	- <small>build/</small><b>three.min.js</b>
- Minified versions of original [Three.js](https://github.com/mrdoob/three.js/) files:
	- <small>examples/js/effects/</small><b>StereoEffect.js</b>
	- <small>examples/js/exporters/</small><b>GLTFExporter.js</b>
	- <small>examples/js/geometries/</small><b>ConvexGeometry.js</b>
	- <small>examples/js/geometries/</small><b>TextGeometry.js</b>
	- <small>examples/js/loaders/</small><b>GLTFLoader.js</b>
	- <small>examples/js/loaders/</small><b>FontLoader.js</b>
	- <small>examples/js/math/</small><b>ConvexHull.js</b>
- Modified and minified versions of [Three.js](https://github.com/mrdoob/three.js/) files:
	- <small>examples/js/effects/</small><b>AnaglyphEffect.js</b> &ndash; color matrices are set to color identities
	- <small>examples/jsm/webxr/</small><b>VRButton.js</b> &ndash; converted to non-module
- Modified and minified versions of [CSG.js](https://github.com/looeee/threejs-csg) files:
	- <small>src/CSG/</small><b>CSG.js</b> &ndash; converted to non-module
	- <small>src/CSG/components/</small><b>BSPNode.js</b> &ndash; converted to non-module
	- <small>src/CSG/components/</small><b>CSGCuttingPlane.js</b> &ndash; converted to non-module
	- <small>src/CSG/components/</small><b>CSGPolygon.js</b> &ndash; converted to non-module
	- <small>src/CSG/components/</small><b>CSGVertex.js</b> &ndash; converted to non-module
- Modified and minified version of [CCapture.js](https://github.com/spite/ccapture.js) files:
	- <small>build/</small><b>CCapture.all.min.js</b> &ndash; contains `src/gif.worker.js`; renamed to `CCapture.all.worker.min.js`
