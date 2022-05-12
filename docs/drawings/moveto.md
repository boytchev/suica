---
nav_order: 10
parent: Paths
grand_parent: Drawings
last_modified_date: May, 2022
---

# moveTo

Command. Sets the position of the virtual pen.

#### Syntax:
```html
HTML:
<moveto center="𝑥,𝑦">
```
```js
JS:
moveTo( 𝑥, 𝑦 );
```

Command `moveTo` moves the virtual pen from its current location to (`x`,`y`)
without generating a path. This is used to set the starting point of a line or
to start a new line, that is not connected to the current line. By default 
both `x` and `y` are 0. In HTML `center` can be split into individual parameters
`x` and `y`.

<img src="../images/moveto-lineto.png">

#### Code Examples:
```html
HTML:
<moveTo center="10,0">
<moveTo x="10" y="0">
```
```js
JS:
moveTo( 10, 0 );
```
