---
nav_order: 10
parent: Paths
grand_parent: Drawings
---

# moveTo

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

<img src="../images/moveto-lineto.png">

```html
HTML:
<moveTo center="10,0">
<moveTo x="10" y="0">
```
```js
JS:
moveTo( 10, 0 );
```
