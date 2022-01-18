# Suica
Mobile 3D made simple

# Table of contents

- [About](#about)
- [Initialization](#initialization)


# About
[**Suica.js**](https://github.com/boytchev/suica) is a library that allows easy programming
of mobile 3D graphics in JavaScript. The first version of Suica, now archieved, uses directly
WebGL. The second version is based on [Three.js](https://threejs.org). 

Initially Suica is created to support the course *Educational Languages and Environment* for
undergraduate students from the [Faculty of Mathematics and Informatics](https://www.fmi.uni-sofia.bg/en)
at [Sofia University](https://www.uni-sofia.bg/index.php/eng).


Suica is licensed under **GPL-3.0**. Latest complete version is **1.0.12** from October 2015.

Three.js and other libraries will be included in this repository to safeguard against incompatibilities
with future versions. They are not a part of Suica, but since version 2 they will be esential for it.

# Initialization

To use Suica its code must be included `<script src="suica.js"></script>`. Suica will wait for at most 10 seconds for the web page to load. When the web page is loaded, Suica will scan for all `<suica>` tags which are converted to `<canvas>` tags keeping their `id`, `width`, `height` and `style` attributes.

---

January, 2022