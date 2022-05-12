---
nav_order: 40
parent: Painting
grand_parent: Drawings
---

# clear

Command. Clears the drawing canvas.

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
	
[<kbd><img src="../../examples/snapshots/drawing-clear.jpg" width="300"></kbd>](../../examples/drawing-clear.html)
