---
layout: default
title: 404
nav_exclude: true
---

# <img src="../logo.min.png" height="40" style="position:relative; top:7px;"/> Suica References

<small>[Suica](user-guide-suica.md) | [Properties](user-guide-properties.md) | [Objects](user-guide-objects.md) | [Drawings](user-guide-drawings.md) | [Events](user-guide-events.md) | [Functions](user-guide-functions.md) | References</small>

- [**References**](#references)
	- [Visual tester](#visual-tester) <small>([direct link](../test/test.html))</small>
	- [Available images](#available-images)
	- [External libraries](#external-libraries)






# References

Suica is a relatively new software environment, so almost all available
documentation is the one found here.

- [**User Guide**](user-guide.md) describes Suica and how to use it.
- [**Reference Guide**](reference-guide.md) contains Suica code templates.
- [**Examples**](examples.md) is a collection of all Suica examples.
- [**Suica 1.0**](https://github.com/boytchev/Suica-1) is the first WebGL-based
implementation of Suica, which is not maintained any more.







## Visual tester

A rudimentery tester for Suica is availble [here](../test/test.html).
It runs predefined test cases and compares the produced images. It reports the
percentage of match:

- A match of **90% or more** is considered normal.
- A match between **70% and 90%** is most likely due to some rendering fluctuations
and a visual inspection is recommended.
- A match **below 70%** most likely indicates a problem and a visual inspection is
required.

Because timings cannot be set absolutely, some test cases may not produce the
expected result. In this case the tester should be run another time to check
whether the result is consistent.






### Available images

This is a list of available images in Suica. They can be accessed from URL
`https://boytchev.github.io/suica/textures/` e.g. `https://boytchev.github.io/suica/textures/flower.jpg`.

<kbd>
	<img width="128" src="../textures/flower.jpg">
	<br>
	flower.jpg
</kbd>
<kbd>
	<img width="128" src="../textures/blobs.jpg">
	<br>
	blobs.jpg
</kbd>
<kbd>
	<img width="128" src="../textures/tile.png">
	<br>
	tile.png
</kbd>
<kbd>
	<img width="128" src="../textures/grid.png">
	<br>
	grid.png
</kbd>






### External libraries

Suica uses several external libraries.

- [**Three.js**](https://threejs.org/) &ndash; JavaScript 3D Library that is the
graphical backbone of Suica. It is used at runtime, so `three.min.js` file must
be present alongside `suica.js` or `suica.min.js`.

- [**JSMin**](https://github.com/douglascrockford/JSMin) &ndash; this JavaScript
Minification Filter is used in the development process to generate minified
`suica.min.js` from the original `suica.js` file. 

- [**YayText**](https://yaytext.com/bold-italic/) &ndash; an online tool to
generate styled (italics) texts is the [Reference Guide](reference-guide.md).






---

May, 2022