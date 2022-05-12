---
nav_order: 10
parent: Drawings
has_children: false
---

# Drawing

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
