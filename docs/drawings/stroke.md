---
]nav_order: 10
parent: Paths
grand_parent: Painting
---

# stroke

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

[<kbd><img src="../../examples/snapshots/drawing-stroke.jpg" width="300"></kbd>](../../examples/drawing-stroke.html)
