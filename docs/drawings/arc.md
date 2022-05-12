---
nav_order: 40
parent: Paths
grand_parent: Drawings
last_modified_date: May, 2022
---

# arc

Command. Adds a circle оr a circular arc to the current path.


#### Syntax:
```html
HTML:
<arc center="𝑥,𝑦" radius="𝑛𝑢𝑚𝑏𝑒𝑟">
<arc center="𝑥,𝑦" radius="𝑛𝑢𝑚𝑏𝑒𝑟" from="𝑓𝑟𝑜𝑚𝐴𝑛𝑔𝑙𝑒" to="𝑡𝑜𝐴𝑛𝑔𝑙𝑒" cw="𝑡𝑟𝑢𝑒/𝑓𝑎𝑙𝑠𝑒">
```
```js
JS:
arc( 𝑥, 𝑦, 𝑟𝑎𝑑𝑖𝑢𝑠 );
arc( 𝑥, 𝑦, 𝑟𝑎𝑑𝑖𝑢𝑠, 𝑓𝑟𝑜𝑚𝐴𝑛𝑔𝑙𝑒, 𝑡𝑜𝐴𝑛𝑔𝑙𝑒, 𝑐𝑤 );
```


Command `arc` creates a circle with center (`x`,`y`) and given `radius`.
Parameters `from` and `to` (by default 0 and 360) are used to create a circular
arc instead of a full circle. The direction of arcs is `cw`. By default it is
*true*, i.e. clockwise direction.


<img src="../images/drawing-arc.png">


Coordinates and radius are measured in pixels, angles are measured in degrees.
The default radius is 10, angles are 0 and 360, and direction is clockwise.

In HTML `center` can be split into individual parameters `x` and `y`; and the
direction can be set by an oppposite attribute `ccw`.

#### Code Examples:
```html
HTML:
<arc center="10,0" radius="5">
<arc x="10" y="0" radius="5" from="0" to="180" ccw>
```
```js
JS:
arc( 10, 0, 5 );
arc( 10, 0, 5, 0, 180, false );
```

#### Demo:
[<kbd><img src="../../examples/snapshots/drawing-arc.jpg" width="300"></kbd>](../../examples/drawing-arc.html)
