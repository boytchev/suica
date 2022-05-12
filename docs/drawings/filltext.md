---
nav_order: 30
parent: Paths
grand_parent: Painting
---

# fillText

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
	
[<kbd><img src="../../examples/snapshots/drawing-filltext.jpg" width="300"></kbd>](../../examples/drawing-filltext.html)