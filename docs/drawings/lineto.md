---
layout: default
nav_order: 20
title: lineTo
parent: Paths
grand_parent: Drawings
has_children: false
---

# lineTo

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

[<kbd><img src="../../examples/snapshots/drawing-moveto-lineto.jpg" width="300"></kbd>](../../examples/drawing-moveto-lineto.html)
