---
title: Suica Drawings
description: [Drawings that could be stamped onto objects]
---
##### [About](#about) &middot; [Suica canvas](#suica-canvas) &middot; [Objects](#objects) &middot; **Drawings** &middot; [Events](#events) &middot; [Functions](#functions) &middot; [References](#references)

**Suica drawings** are 2D images generated directly in Suica, instead of being loaded from JPEG or PNG files. Usually drawings are stamped onto 2D and 3D objects as [textures](https://en.wikipedia.org/wiki/Texture_mapping). Suica drawings are based on a simplified subset of [Canvas2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) commands. 

## Table of contents
- [Introduction](#introduction)
	- <small>[Creating drawings](#creating-drawings)</small>
	- <small>[Working with drawings](#working-with-drawings)</small>
	- <small>[Using drawings](#using-drawings)</small>
- [Drawing shapes](#drawing-shapes)
	- <small>[Defining shapes](#defining-shapes): [```moveTo```](#moveto), [```lineTo```](#lineto), [```curveTo```](#curveto), [```arc```](#arc)  </small>
	- <small>[Outlined shapes](#oulined-shapes): [```stroke```](#stroke)</small>
	- <small>[Solid shapes](#solid-shapes): [```fill```](#fill)</small>
- [Drawing texts](#drawing-texts): <small>[```fillText```](#fill-text)</small>

	- <small>[Resetting the canvas](#resetting-the-canvas)</small>


# Introduction

Suica drawings are created on a rectangular drawing canvas. The origin of the coordinate system of a drawing i.e. point (0,0) is at the bottom left corner of the canvas. The X axis extends to the right, Y extends to the top. All coordinates are measured in pixels.

<img src="images/drawing-coordinates.png">

Following the main pricipals of Suica, a drawing can be created entirely in HTML or entirely in JavaScript. Usually HTML is used for static drawings, while JavaSCript is used for both static and dynamic drawings. The following two examples demonstrate the same drawing generated in HTML and in JavaScript.

[<kbd><img src="../examples/snapshots/drawing-html.jpg" width="300"></kbd>](../examples/drawing-html.html)
[<kbd><img src="../examples/snapshots/drawing-js.jpg" width="300"></kbd>](../examples/drawing-js.html)

Using drawings in Suica is fairly straighforward process:

1. Create a drawing canvas
2. Draw objects with pen or text
3. Map the drawing onto an object


# Creating drawings


#### drawing
```html
HTML:
<drawing id="𝘯𝘢𝘮𝘦" size="𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡" color="𝑐𝑜𝑙𝑜𝑟">
```
```js
JS:
𝘯𝘢𝘮𝘦 = drawing( 𝑤𝑖𝑑𝑡ℎ, ℎ𝑒𝑖𝑔ℎ𝑡, 𝑐𝑜𝑙𝑜𝑟 );
```

Command. Creates a 2D drawing canvas. Parameters `width` and `height` set the
drawings canvas size in pixels. By default it is 32&times;32 pixels. If `height`
is omitted, its is the same as `width`. Parameter `color` sets the background
color of the canvas. If `color` is omitted, the background is transparent
&ndash; i.e. when the drawing is mapped onto an objects, the background areas
will be transparent.

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

[<kbd><img src="../examples/snapshots/drawing-transparent.jpg" width="300"></kbd>](../examples/drawing-transparent.html)
[<kbd><img src="../examples/snapshots/drawing-opaque.jpg" width="300"></kbd>](../examples/drawing-opaque.html)

## Working with a drawing

When a drawing is given a name via attribute `ID` in HTML or when a drawing is
initialized and stored in a variable, this variable has commands for drawing on
the canvas.

```html
HTML:
<drawing id="a">
```
```js
JS:
a.moveTo( 10, 10 );
a.lineTo( 20, 20 );
a.stroke( 'crimson' );
```

A drawing is applied to an object via the [image](#image) property and can be
updated both before and after this assignment. The scale of
a drawing is managed by the [images](#images) property. 

[<kbd><img src="../examples/snapshots/dynamic-drawing.jpg" width="300"></kbd>](../examples/dynamic-drawing.html)


Drawings can be applied to points and lines. For points the drawings act like
sprites &ndash; they are not subject to orientation and they always face the
screen. For lines drawings are used to created dot-and-dash patterns.

[<kbd><img src="../examples/snapshots/drawing-custom-point.jpg" width="300"></kbd>](../examples/drawing-custom-point.html)
[<kbd><img src="../examples/snapshots/drawing-dotted-lines.jpg" width="300"></kbd>](../examples/drawing-dotted-lines.html)

## Using a drawing






# Drawing shapes

The basic way to draw objects in a drawing is to draw outlined or solid shapes. The boundary of these shapes are defined as *paths*.



## Defining shapes

A shape is defined with a virtual pen moved along the boundary of the shape. The simplest way to define a shape is to move the virtual pen to the starting point of the shape and then move the pen along its boundary.

<img src="images/moveto-lineto.png">

Shapes are define with the following commands:
- [```moveTo```](#moveto) &ndash; moves the pen
- [```lineTo```](#lineto) &ndash; adds a line segment
- [```curveTo```](#curveto) &ndash; adds a curved segment
- [```arc```](#arc) &ndash; adds a circular arc




#### moveTo
```html
HTML:
<moveTo center="𝑥,𝑦">
<moveTo x="𝑥" y="𝑦">
```
```js
JS:
moveTo( 𝑥, 𝑦 );
```

Command. Sets the position of the virtual pen. This command moves the pen from its current location to (`x`,`y`) without generating a shape segment. This is used to set the starting point of a shape boundary. By default both *x* and *y* are 0. In HTML `center` can be split into individual parameters `x` and `y`.

```html
HTML:
<moveTo center="10,0">
<moveTo x="10" y="0">
```
```js
JS:
moveTo( 10, 0 );
```



	
#### lineTo
```html
HTML:
<lineTo center="𝑥,𝑦">
<lineTo x="𝑥" y="𝑦">
```
```js
JS:
lineTo( 𝑥, 𝑦 );
```

Command. Adds a line segment to the shape. This command moves the pen along a line from its current location to (`x`,`y`) and adds that line to the shape boundary. This is used to define straignt segments of the shape. By default both *x* and *y* are 0. In HTML `center` can be split into individual parameters `x` and `y`.

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




#### curveTo
```html
HTML:
<curveTo m="𝑚𝑥,𝑚𝑦" center="𝑥,𝑦">
<curveTo mx="𝑚𝑥" mt="𝑚𝑦" x="𝑥" y="𝑦">
```
```js
JS:
𝑑𝑟𝑎𝑤𝑖𝑛𝑔.curveTo( 𝑚𝑥, 𝑚𝑦, 𝑥, 𝑦 );
```

Command. Adds a curved segment to the shape. This command moves the pen along a curved line from its current location to (`x`,`y`) and adds that curve to the shape boundary. The line is [quadratic curve](https://mathworld.wolfram.com/QuadraticCurve.html) and is attracted towards point (`mx`, `my`), which is defined by the first pair of parameters of *curveTo*. By default all coordinates *mx*, *my*, *x* and *y* are 0. In HTML `center` can be split into individual parameters `x` and `y`; and `m` can be split into `mx` and `my`.

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

Complex shapes can be constructed by joining individual curves. The shape of a heart in the following example is composed of 6 connected curves.

<img src="images/drawing-heart.png">

[<kbd><img src="../examples/snapshots/drawing-heart-point.jpg" width="300"></kbd>](../examples/drawing-heart-point.html)




#### arc
```html
HTML:
<arc center="𝑥,𝑦" radius="𝑛𝑢𝑚𝑏𝑒𝑟">
<arc center="𝑥,𝑦" radius="𝑛𝑢𝑚𝑏𝑒𝑟" from="𝑓𝑟𝑜𝑚𝐴𝑛𝑔𝑙𝑒" to="𝑡𝑜𝐴𝑛𝑔𝑙𝑒" cw="𝑡𝑟𝑢𝑒/𝑓𝑎𝑙𝑠𝑒">
```
```js
JS:
arc( 𝑥, 𝑦, 𝑟𝑎𝑑𝑖𝑢𝑠 );
arc( 𝑥, 𝑦, 𝑟𝑎𝑑𝑖𝑢𝑠, 𝑓𝑟𝑜𝑚𝐴𝑛𝑔𝑙𝑒, 𝑡𝑜𝐴𝑛𝑔𝑙𝑒, 𝑐𝑤 );
```

Command. Adds a circular arc to the shape. This command creates an arc of a circle with center (`x`,`y`) and given `radius`. The arc stars from angle `from` and ends at angle `to`, both measured in degrees, by default 0 and 360. Parameter `cw` sets the direction of the arc &ndash; either clockwise (if `cw` is true, this is by default) or counterclockwise (if `cw` is false). If the angles are omitted, a full circle is generated. 

<img src="images/drawing-arc.png">


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


[<kbd><img src="../examples/snapshots/drawing-arc.jpg" width="300"></kbd>](../examples/drawing-arc.html)

In HTML `center` can be split into individual parameters `x` and `y`. Also in HTML the `cw` attribute has antagonist attribute `ccw`. If the values of `cw` or `ccw` are omitted, they are assumed to be *true*. The following commands are equivalent:

```html
HTML:
<arc x="10" y="0" radius="5" cw>
<arc x="10" y="0" radius="5" cw="true">
<arc x="10" y="0" radius="5" ccw="false">
```





## Outlined shapes

The outline of a shape is drawn with ```stroke```. 

#### stroke
```html
HTML:
<stroke color="𝑐𝑜𝑙𝑜𝑟" width="𝑤𝑖𝑑𝑡ℎ" close="𝑐𝑙𝑜𝑠𝑒">
```
```js
JS:
stroke( 𝑐𝑜𝑙𝑜𝑟, 𝑤𝑖𝑑𝑡ℎ, 𝑐𝑙𝑜𝑠𝑒 );
```

Command. Draws a line around a shape. The line has given `color` and `width` (in pixels). If the `close` parameter is *true*, then a line is closed &ndash; its end is connected to its beginning. A ```stroke``` immediately after another ```stroke``` or [```fill```](#fill) reuses the same shape.

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
	
	
	
	
## Solid shapes

Solid shapes are drawn by ```fill```.

#### fill
```html
HTML:
<fill color="𝑐𝑜𝑙𝑜𝑟">
```
```js
JS:
fill( 𝑐𝑜𝑙𝑜𝑟 );
```

Command. Fills a shape with the given `color`.  A ```fill``` immediately after another ```fill``` or [```stroke```](#stroke) reuses the same shape.

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




# Drawing texts

Drawing texts is done with the `fillText` command.

#### fillText
```html
HTML:
<fillText center="𝑥,𝑦" text="𝑡𝑒𝑥𝑡" color="𝑐𝑜𝑙𝑜𝑟" font="𝑓𝑜𝑛𝑡">
<fillText x="𝑥" y="𝑦" text="𝑡𝑒𝑥𝑡" color="𝑐𝑜𝑙𝑜𝑟" font="𝑓𝑜𝑛𝑡">
```
```js
JS:
𝑑𝑟𝑎𝑤𝑖𝑛𝑔.fillText( 𝑥, 𝑦, 𝑡𝑒𝑥𝑡, 𝑐𝑜𝑙𝑜𝑟, 𝑓𝑜𝑛𝑡 );
```

Command. Draws a text. The `text` is drawn at given coordinates (`x`,`y`) with
given `color` and `font` style &ndash; a string with a [CSS font](https://developer.mozilla.org/en-US/docs/Web/CSS/font) description (the default font is ```'20px Arial'```). In HTML `center` can be split into individual parameters `x` and `y`.

```html
HTML:
<fillText center="10,5" text="Sample text" color="crimson" font="bold 20px Courier">
```
```js
JS:
fillText( 10, 5, 'Sample text', 'crimson', 'bold 20px Courier' );
```	
	
[<kbd><img src="../examples/snapshots/drawing-filltext.jpg" width="300"></kbd>](../examples/drawing-filltext.html)
	
	
	
	
	
#### Clear

Command. Clears a drawing canvas. The drawing canvas is filled with the given
`color` if it is provided, or is cleared to transparent if it is not provided.
Next commands after *clear* start a new path.

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