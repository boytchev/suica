---
layout: default
nav_order: 30
title: Strokes and fills
parent: Drawings
has_children: false
---

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
