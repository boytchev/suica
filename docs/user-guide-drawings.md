---
layout: default
title: 404
nav_exclude: true
---

# <img src="../logo.min.png" height="40" style="position:relative; top:7px;"/>Suica Drawings

<small>[Suica](user-guide-suica.md) | [Properties](user-guide-properties.md) | [Objects](user-guide-objects.md) | Drawings | [Events](user-guide-events.md) | [Functions](user-guide-functions.md) | [References](user-guide-references.md)</small>

- [**Drawing**](#drawings)
	- [drawing](#drawing)
- [**Paths**](#paths)
	- [moveTo](#moveto)
	- [lineTo](#lineto)
	- [curveTo](#curveto)
	- [arc](#arc)
- [**Strokes and fills**](#strokes-and-fills)
	- [stroke](#stroke)
	- [fill](#fill)
	- [fillText](#filltext)
	- [clear](#clear)






# Drawings

Suica drawings are 2D images generated in Suica (instead of being loaded from
JPEG or PNG files) that can be stamped onto 2D and 3D objects. Suica
drawings are based on [Canvas2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D). 






## Drawing

Command. Defines a 2D drawing canvas. 

```html
HTML:
<drawing id="𝘯𝘢𝘮𝘦" size="𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡" color="𝑐𝑜𝑙𝑜𝑟">
```
```js
JS:
𝘯𝘢𝘮𝘦 = drawing( 𝑤𝑖𝑑𝑡ℎ, ℎ𝑒𝑖𝑔ℎ𝑡, 𝑐𝑜𝑙𝑜𝑟 );
```

Parameter `id` sets the name of the canvas (and also the name of the variable
that holds the canvas). This name is used when the drawing is applied to the
surface of an object's [image](user-guide-properties.md#image) or when the
drawing is updated.

Parameter `size` sets the canvas size in pixels. If `height` is not provided, it
is assumed to be the same as `width`. By default the drawing canvas is
32&times;32 pixels. In HTML `size` can be split into individual parameters
`width` and `height`.

Parameter `color` sets the initial background color of the canvas. If `colour`
is set, the background of the canvas is filled with this color; otherwise it is
kept transparent.

```html
HTML:
<drawing id="a">
<drawing id="b" size="32,48">
<drawing id="c" width="32" height="48">
```
```js
JS:
a = drawing( );
b = drawing( 32 );
c = drawing( 32, 48, 'crimson' );
```

A drawing can be constructed in HTML or in JavaScript. Modifications of existing
drawing can be done only in JavaScript.

[<kbd><img src="../examples/snapshots/drawing-html.jpg" width="300"></kbd>](../examples/drawing-html.html)
[<kbd><img src="../examples/snapshots/drawing-js.jpg" width="300"></kbd>](../examples/drawing-js.html)

The transparancy of a drawing is used when it is applied to an object. Areas of
the object surface are transparent if they correspond to transparent areas of
the drawing.

[<kbd><img src="../examples/snapshots/drawing-transparent.jpg" width="300"></kbd>](../examples/drawing-transparent.html)
[<kbd><img src="../examples/snapshots/drawing-opaque.jpg" width="300"></kbd>](../examples/drawing-opaque.html)

Apart from 2D and 3D objects drawings can be applied to points and lines. For
points the drawings act like [sprites](https://en.wikipedia.org/wiki/Sprite_(computer_graphics))
&ndash; they are not subject to orientation and they always face the screen. For
lines the drawings are used to create dot-and-dash patterns.

[<kbd><img src="../examples/snapshots/drawing-custom-point.jpg" width="300"></kbd>](../examples/drawing-custom-point.html)
[<kbd><img src="../examples/snapshots/drawing-dotted-lines.jpg" width="300"></kbd>](../examples/drawing-dotted-lines.html)

A drawing is applied to an object via the [image](user-guide-properties.md#image) property and can be
updated both before and after this assignment. The scale of
a drawing is managed by the [images](user-guide-properties.md#images) property. 

[<kbd><img src="../examples/snapshots/dynamic-drawing.jpg" width="300"></kbd>](../examples/dynamic-drawing.html)

The rest of this document describes the drawing commands. When they are used
without prefix, they refer to the latest drawing. Otherwise, they refer to the
drawing in the prefix.

```js
var pic1 = drawing();
clear( 'crimson' ); // clears pic1

var pic2 = drawing();
clear( 'linen' ); // clears pic2

pic1.clear( 'gray' ); // clears pic1
```






# Paths

Suica drawings are based on [Canvas2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
and are made of stroked lines and filled areas. A virtual pen defines a path on
the canvas. This path can be *stroked* by drawing a line over it; or its
contents can be *filled* with a color.

The coordinate system of a drawing canvas has origin (0,0) at the bottom left
side of the canvas. The X axis extends to the right, Y extends to the top.

<img src="images/drawing-coordinates.png">






## MoveTo

Command. Sets the position of the virtual pen.

```html
HTML:
<moveto center="𝑥,𝑦">
```
```js
JS:
moveTo( 𝑥, 𝑦 );
```

The `moveTo` command moves the virtual pen from its current location to (`x`,`y`)
without generating a path. This is used to set the starting point of a line or
to start a new line, that is not connected to the current line. By default the
both `x` and *y* are 0. In HTML `center` can be split into individual parameters
`x` and `y`.

<img src="images/moveto-lineto.png">

```html
HTML:
<moveTo center="10,0">
<moveTo x="10" y="0">
```
```js
JS:
moveTo( 10, 0 );
```





	
## LineTo

Command. Adds a line segment to the path.

```html
HTML:
<lineTo center="𝑥,𝑦">
```
```js
JS:
lineTo( 𝑥, 𝑦 );
```

The `lineTo` command moves the virtual pen along a straight line from its current
location to (`x`,`y`) and adds that line to the current path. This is used to
define straignt line sections of the path. By default the both `x` and `y` are
0. In HTML `center` can be split into individual parameters `x` and `y`.

```html
HTML:
<lineTo center="10,0">
<lineTo x="10" y="0">
```
```js
JS:
lineTo( 10, 0 );
```

[<kbd><img src="../examples/snapshots/drawing-moveto-lineto.jpg" width="300"></kbd>](../examples/drawing-moveto-lineto.html)
		
		
		
		
		
		
## CurveTo

Command. Adds a curved segment to the path.

```html
HTML:
<curveTo m="𝑚𝑥,𝑚𝑦" center="𝑥,𝑦">
```
```js
JS:
𝑑𝑟𝑎𝑤𝑖𝑛𝑔.curveTo( 𝑚𝑥, 𝑚𝑦, 𝑥, 𝑦 );
```

The `curveTo` command moves the virtual pen along a curved line from its current
location to (`x`,`y`) and adds that curve to the current path. The line is
quadratic curve and is attracted towards point (`mx`, `my`). By default all
coordinates `mx`, `my`, `x` and `y` are 0. In HTML `center` can be split into
individual parameters `x` and `y`, and `m` can be split into `mx` and `my`.

<img src="images/curveto.png">

```html
HTML:
<curveTo m="10,0" center="20,15">
<curveTo mx="10" my="0" x="20" y="15">
```
```js
JS:
curveTo( 10, 0, 20, 15 );
```

[<kbd><img src="../examples/snapshots/drawing-curveto.jpg" width="300"></kbd>](../examples/drawing-curveto.html)

A more complex curve can be constructed by joining individual curves. The shape
of a heart, for examples, can be constructed by 6 connected curves.

<img src="images/drawing-heart.png">

[<kbd><img src="../examples/snapshots/drawing-heart-point.jpg" width="300"></kbd>](../examples/drawing-heart-point.html)






## Arc

Command. Adds a circle оr a circular arc to the path.

```html
HTML:
<arc center="𝑥,𝑦" radius="𝑟𝑎𝑑𝑖𝑢𝑠" from="𝑓𝑟𝑜𝑚" to="𝑡𝑜" cw="𝑐𝑤">
```
```js
JS:
𝑑𝑟𝑎𝑤𝑖𝑛𝑔.arc( 𝑥, 𝑦, 𝑟𝑎𝑑𝑖𝑢𝑠, 𝑓𝑟𝑜𝑚, 𝑡𝑜, 𝑐𝑤 );
```

The `arc` command creates an arc from a circle with center (`x`,`y`) and given
`radius`. The arc stars from angle `from` and ends at angle `to`. The direction
of drawing `cw` is either clockwise (`cw` is *true*) or counter-clockwise (`cw`
is *false*). Coordinates and radius are measured in pixels, angles are measured
in degrees. If the angles are not provided, a full circle is generated. In HTML `center` can be split into individual parameters `x` and `y`.

```html
HTML:
<arc center="10,0" radius="5">
<arc x="10" y="0" radius="5" from="0" to="180" ccw>
```
```js
JS:
arc( 10, 0, 5);
arc( 10, 0, 5, 0, 180, false);
```

<img src="images/drawing-arc.png">

[<kbd><img src="../examples/snapshots/drawing-arc.jpg" width="300"></kbd>](../examples/drawing-arc.html)

In HTML the direction of drawing is set by attribute `cw` or its antagonistic
attribute `ccw`. Their values are either *true* or *false*. If any of the
attributes is present, but has no value, it is assumed to be *true*. The
following commands are equivalent:

```html
HTML:
<arc x="10" y="0" radius="5" cw>
<arc x="10" y="0" radius="5" cw="true">
<arc x="10" y="0" radius="5" ccw="false">
```

In JS the direction of drawing is set only by `cw` and by default it is *true*.






# Strokes and fills

A path in a drawing is an invisible entity. To visualize a path it mist be
stroked and/or filled.

<img src="images/stroked-and-filled.png">


## Stroke

Command. Draws a line over the current path.

```html
HTML:
<stroke color="𝑐𝑜𝑙𝑜𝑟" width="𝑤𝑖𝑑𝑡ℎ" close="𝑐𝑙𝑜𝑠𝑒">
```
```js
JS:
stroke( 𝑐𝑜𝑙𝑜𝑟, 𝑤𝑖𝑑𝑡ℎ, 𝑐𝑙𝑜𝑠𝑒 );
```

The command `stroke` draws a solid line over the current path with given `color`
and `width` (in pixels). If the `close` parameter is *true*, then the end of the stroked line is conneted to its beginning. A `stroke` immediately after another `stroke` or `fill` reuses the same path.

```html
HTML:
<stroke color="crimson">
<stroke color="crimson" width="10" close>
<stroke color="crimson" width="10" close="true">
```
```js
JS:
stroke( 'crimson' );
stroke( 'crimson', 10, true );
```

[<kbd><img src="../examples/snapshots/drawing-stroke.jpg" width="300"></kbd>](../examples/drawing-stroke.html)
	
	
	
	
	
	
## Fill

Command. Fills the area defined by a path.

```html
HTML:
<fill color="𝑐𝑜𝑙𝑜𝑟">
```
```js
JS:
fill( 𝑐𝑜𝑙𝑜𝑟 );
```

The command `fill` fills the area defined by a boundary path with the given
`color`.  A `fill` immediately after another `stroke` or `fill` reuses the
same path. 

```html
HTML:
<fill color="crimson">
```
```js
JS:
fill( 'crimson' );
```
	
[<kbd><img src="../examples/snapshots/drawing-fill.jpg" width="300"></kbd>](../examples/drawing-fill.html)
[<kbd><img src="../examples/snapshots/drawing-fill-and-stroke.jpg" width="300"></kbd>](../examples/drawing-fill-and-stroke.html)






## FillText

Command. Draws a text.

```html
HTML:
<fillText center="𝑥,𝑦" text="𝑡𝑒𝑥𝑡" color="𝑐𝑜𝑙𝑜𝑟" font="𝑓𝑜𝑛𝑡">
```
```js
JS:
𝑑𝑟𝑎𝑤𝑖𝑛𝑔.fillText( 𝑥, 𝑦, 𝑡𝑒𝑥𝑡, 𝑐𝑜𝑙𝑜𝑟, 𝑓𝑜𝑛𝑡 );
```

The command `fillText` renders the text in `text` at given coordinates (`x`,`y`),
with given `color` and `font` style. The `font` parameter is a string with a
[CSS font](https://developer.mozilla.org/en-US/docs/Web/CSS/font) description.
In HTML `center` can be split into individual parameters `x` and `y`.

```html
HTML:
<fillText center="10,5" text="Sample text" color="crimson" font="bold 20px Courier">
```
```js
JS:
fillText( 10, 5, 'Sample text', 'crimson', 'bold 20px Courier' );
```	
	
[<kbd><img src="../examples/snapshots/drawing-filltext.jpg" width="300"></kbd>](../examples/drawing-filltext.html)
	
	
	
	
	
	
## Clear

Command. Clears a drawing canvas.

```html
HTML:
<clear color="𝑐𝑜𝑙𝑜𝑟">
```
```js
JS:
clear( 𝑐𝑜𝑙𝑜𝑟 );
```

The command `clear` fills the drawing canvas with the given `color`, if it is provided; otherwise it clears the canvas to transparent.

```html
HTML:
<clear>
<clear color="crimson">
<clear background="crimson">
```
```js
JS:
clear( 'crimson' );
```
	
[<kbd><img src="../examples/snapshots/drawing-clear.jpg" width="300"></kbd>](../examples/drawing-clear.html)

---

May, 2022