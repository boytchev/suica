---
nav_order: 20
parent: Paths
grand_parent: Drawings
last_modified_date: May, 2022
---

# lineTo

Command. Adds a line segment to the path.

#### Syntax:
```html
HTML:
<lineTo center="𝑥,𝑦">
```
```js
JS:
lineTo( 𝑥, 𝑦 );
```

Command `lineTo` moves the virtual pen along a straight line from its current
location to (`x`,`y`) and adds that line to the current path. This is used to
define straight line section of the path. By default both `x` and `y` are
0. In HTML `center` can be split into individual parameters `x` and `y`.

#### Code Examples:
```html
HTML:
<lineTo center="10,0">
<lineTo x="10" y="0">
```
```js
JS:
lineTo( 10, 0 );
```

#### Demo:
[<kbd><img src="../../examples/snapshots/drawing-moveto-lineto.jpg" width="300"></kbd>](../../examples/drawing-moveto-lineto.html)
