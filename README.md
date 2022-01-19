# Suica
Mobile 3D made simple

# Table of contents

- [About](#about)
- [Initialization](#initialization)
- [General methods](#general-methods)
	- [background](#background)
	- [oxyz](#oxyz)


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

Suica generates 3D images and animations in special tag `<suica-canvas>`. Supported attributes are `width` and `height` of the canvas (in pixels), `style` with CSS formating (`background` is used for canvas background, `width` and `height` can overwrite the `width` and `height` attributes), and `id`, which is created as global variable.

```html
<suica-canvas id="..." width="..." height="..." style="background:...; width:...; height:...;">
  :
</suica-canvas>
```


# General properties

### animate

Sets the animation user-defined function. This function is called every frame and has two parameters &ndash; total elapsed time `t` and elapsed time since previous frame `td`, bith measured in seconds.

```html
<animate src="loop">
```

```javascript
animate( loop );

function loop( t, dt )
{
   :
}
```


# General methods

### background

Sets the background color of a Suica canvas.

```html
<suica-canvas style="background:white;">
  :
</suica-canvas>
```

```html
<background color="white">
```

```javascript
background( 'white' );
```

### oxyz

Draws the coordinate systems with specific length and color of axes.

```javascript
oxyz( );
oxyz( 30 );
oxyz( 30, 'black' );
```

```html
<oxyz>
<oxyz size="30">
<oxyz color="black">
<oxyz size="30" color="black">
```


---

January, 2022