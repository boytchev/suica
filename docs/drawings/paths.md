---
layout: default
nav_order: 20
title: Paths
parent: Drawings
has_children: false
---

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
