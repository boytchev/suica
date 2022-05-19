---
title: Suica Objects
description: [The core of Suica &ndash; from point to sphere]
---
##### [Suica](suica.md) &middot; **Objects** &middot; [Properties](properties.md) &middot; [Drawings](drawings.md) &middot; [Events](events.md) &middot; [References](references.md)

**Suica objects** are the core functionality of Suica. They are the elements that are used to construct 3D scenes. These objects are designed to provide a foundation for a diverse mobile computer graphics visualizations.

# Table of contents

- [Creating an object](#creating-an-object)
	-  <small>[Objects and variables](#objects-and-variables): [`id`](#id)</small>
- [Objects](#objects)
	- <small>[Flat objects](#flat-objects): [`point`](#point), [`line`](#line), [`square`](#square), [`circle`](#circle), [`polygon`](#polygon)</small>
	- <small>[Spatial objects](#spatial-objects): [`cube`](#cube), [`sphere`](#sphere), [`cylinder`](#cylinder), [`prism`](#prism), [`cone`](#cone), [`pyramid`](#pyramid)</small>
	- <small>[Advanced objects](#advanced-objects): [`clone`](#clone), [`group`](#group), [`tube`](#tube)</small>





# Creating an object

In Suica object is created via HTML tag or via JavaScript function. Each object has properties. In HTML the properties are provided as tag attributes in no specific order. In JavaScript the properties are provided as function parameters and the order is fixed. 

```html
HTML:
<𝘰𝘣𝘫𝘦𝘤𝘵 𝘱𝘳𝘰𝘱𝘦𝘳𝘵𝘺𝘕𝘢𝘮𝘦="𝘷𝘢𝘭𝘶𝘦" 𝘱𝘳𝘰𝘱𝘦𝘳𝘵𝘺𝘕𝘢𝘮𝘦="𝘷𝘢𝘭𝘶𝘦" ...>
```
```js
JS:
𝘰𝘣𝘫𝘦𝘤𝘵( 𝘷𝘢𝘭𝘶𝘦, 𝘷𝘢𝘭𝘶𝘦, ...);
```

The following examples show the same 3D scene created in HTML and in JavaScript.

[<kbd><img src="../examples/snapshots/object-html.jpg" width="300"></kbd>](../examples/object-html.html)
[<kbd><img src="../examples/snapshots/object-js.jpg" width="300"></kbd>](../examples/object-js.html)

Most Suica objects share the same basic properties for position, orientation, color and so on. More information about properties are in chapter [Suica properties](properties.md). Properties related to events are described in chapter [Suica events](events.md).

## Objects and variables

Suica keeps track of all created objects. They are created as JavaScript variables and stored in an internal Suica list of objects [`allObjects`](suica.md#allobjects). When an object is created with a name, this object is also created as a global JavaScript variable. This allows to reuse or to reference the object later on.

#### id
```html
HTML:
<𝘰𝘣𝘫𝘦𝘤𝘵𝘕𝘢𝘮𝘦 id="𝘷𝘢𝘳𝘪𝘢𝘣𝘭𝘦𝘕𝘢𝘮𝘦">
```
```js
JS:
𝘷𝘢𝘳𝘪𝘢𝘣𝘭𝘦𝘕𝘢𝘮𝘦 = 𝘰𝘣𝘫𝘦𝘤𝘵𝘕𝘢𝘮𝘦( ... );
```

In HTML the name of an object is set in the `id` attribute. If the `id` is omitted, the object is created without a name. In JavaScript the name of an object is set by using the JavaScript way of creating variable.

Examples of named objects:
```html
HTML:
<point id="p" center="25,0,15">
```
```js
JS:
p = point( [25,0,15] );
```

Examples of anonymous objects:
```html
HTML:
<point center="25,0,15">
```
```js
JS:
point( [25,0,15] );
```







# Objects

## Flat objects

Flat objects are all objects that can exist in a plane. These objects have at most two [dimensions](https://en.wikipedia.org/wiki/Dimension). [`point`](#point), [`line`](#line), [`square`](#square), [`circle`](#circle) and [`polygon`](#polygon).




### Point
```html
HTML:
<point id="𝑜𝑏𝑗𝑒𝑐𝑡" center="𝑥,𝑦,𝑧" size="𝑠𝑖𝑧𝑒" color="𝑐𝑜𝑙𝑜𝑟">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡 = point( [𝑥,𝑦,𝑧], 𝑠𝑖𝑧𝑒, 𝑐𝑜𝑙𝑜𝑟 );
```
Object. Represents a point. Its properties are [`center`](properties.md#center) (or [`x`](properties.md#x-y-z), [`y`](properties.md#x-y-z) and [`z`](properties.md#x-y-z)), [`size`](properties.md#size), [`color`](properties.md#color), [`image`](properties.md#image), [`images`](properties.md#images) and [`clone`](properties.md#clone). By default, a point is drawn as a small circle, but it can be changed with a custom [drawing](#drawings.md). In HTML all properties can be included in the `<point>` tag.

```html
HTML:
<point center="25,0,15">
<point center="25,0,15" size="10" color="crimson">
```
```js
JS:
point( [25,0,15] );
point( [25,0,15], 10, 'crimson' );
```

[<kbd><img src="../examples/snapshots/point.jpg" width="300"></kbd>](../examples/point.html)&emsp;[<kbd><img src="../examples/snapshots/point-cloud.jpg" width="300"></kbd>](../examples/point-cloud.html)


#### line
```html
HTML:
<line id="𝑜𝑏𝑗𝑒𝑐𝑡" from="𝑥,𝑦,𝑧" to="𝑥,𝑦,𝑧" color="𝑐𝑜𝑙𝑜𝑟">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡 = line( [𝑥,𝑦,𝑧], [𝑥,𝑦,𝑧], 𝑐𝑜𝑙𝑜𝑟 );
```
Object. Represents a straight segment. Its properties are `from` (or [`center`](properties.md#center)), `to`, [`color`](properties.md#color), [`image`](properties.md#image), [`images`](properties.md#images) and [`clone`](properties.md#clone). The properties `center` and `from` are synonyms and they set the starting point of the segment, while `to` sets the ending point. By default, a line is drawn as a solid line, but it can be changed with custom [drawing](#drawings.md). In HTML all properties can be included in the `<line>` tag.

```html
HTML:
<line center="25,0,15" to="100,-20,35">
<line from="25,0,15" to="100,-20,35">
```
```js
JS:
line( [25,0,15], [100,-20,35] );
point( [25,0,15], [100,-20,35], 'red' );
```

[<kbd><img src="../examples/snapshots/line.jpg" width="300"></kbd>](../examples/line.html)



#### square
```html
HTML:
<square id="𝑜𝑏𝑗𝑒𝑐𝑡" center="𝑥,𝑦,𝑧" size="𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡" color="𝑐𝑜𝑙𝑜𝑟">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑠𝑢𝑖𝑐𝑎.square( [𝑥,𝑦,𝑧], [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡], 𝑐𝑜𝑙𝑜𝑟 );
```
Object. Represents a regular square or a rectangle. Its properties are
[`center`](properties.md#center) (or [`x`](properties.md#x-y-z), [`y`](properties.md#x-y-z) and [`z`](properties.md#x-y-z)), [`size`](properties.md#size) (or [`width`](properties.md#width-height-depth) and [`height`](properties.md#width-height-depth)), [`color`](properties.md#color), [`spin`](properties.md#spin) (or [`spinH`](properties.md#spinh-spinv-spint), [`spinV`](properties.md#spinh-spinv-spint) and [`spinT`](properties.md#spinh-spinv-spint)), [`wireframe`](properties.md#wireframe), [`image`](properties.md#image), [`images`](properties.md#images) and [`clone`](properties.md#clone). In HTML all properties can be included in the `<square>` tag.

```html
HTML:
<square center="25,0,15">
<square size="10" color="crimson">
```
```js
JS:
square( [25,0,15] );
square( [0,0,0], 10, 'crimson' );
```

[<kbd><img src="../examples/snapshots/square.jpg" width="300"></kbd>](../examples/square.html)
[<kbd><img src="../examples/snapshots/square-rectangle.jpg" width="300"></kbd>](../examples/square-rectangle.html)



#### circle
```html
HTML:
<circle id="𝑜𝑏𝑗𝑒𝑐𝑡" center="𝑥,𝑦,𝑧" size="𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡" color="𝑐𝑜𝑙𝑜𝑟">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡 = circle( [𝑥,𝑦,𝑧], [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡], 𝑐𝑜𝑙𝑜𝑟 );
```
Object. Represents a circle or an ellipse. Its properties are [`center`](properties.md#center) (or [`x`](properties.md#x-y-z), [`y`](properties.md#x-y-z) and [`z`](properties.md#x-y-z)), [`size`](properties.md#size) (or [`width`](properties.md#width-height-depth) and [`height`](properties.md#width-height-depth)), [`color`](properties.md#color), [`spin`](properties.md#spin) (or [`spinH`](properties.md#spinh-spinv-spint), [`spinV`](properties.md#spinh-spinv-spint) and [`spinT`](properties.md#spinh-spinv-spint)), [`wireframe`](properties.md#wireframe),
[`image`](properties.md#image), [`images`](properties.md#images) and [`clone`](properties.md#clone). In HTML all properties can be included in the `<circle>` tag.

```html
HTML:
<circle center="25,0,15">
<circle size="10" color="crimson">
```
```js
JS:
circle( [25,0,15] );
circle( [0,0,0], 10, 'crimson' );
```

[<kbd><img src="../examples/snapshots/circle.jpg" width="300"></kbd>](../examples/circle.html)
[<kbd><img src="../examples/snapshots/circle-ellipse.jpg" width="300"></kbd>](../examples/circle-ellipse.html)



#### polygon
```html
HTML:
<polygon id="𝑜𝑏𝑗𝑒𝑐𝑡" count="𝑐𝑜𝑢𝑛𝑡" center="𝑥,𝑦,𝑧" size="𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡" color="𝑐𝑜𝑙𝑜𝑟">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡 = polygon( 𝑐𝑜𝑢𝑛𝑡, [𝑥,𝑦,𝑧], [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡], 𝑐𝑜𝑙𝑜𝑟 );
```
Object. Represents a regular polygon or an elliptical polygon. Its properties are `count`, [`center`](properties.md#center) (or [`x`](properties.md#x-y-z), [`y`](properties.md#x-y-z) and [`z`](properties.md#x-y-z)), [`size`](properties.md#size) (or [`width`](properties.md#width-height-depth) and [`height`](properties.md#width-height-depth)), [`color`](properties.md#color), [`spin`](properties.md#spin) (or [`spinH`](properties.md#spinh-spinv-spint), [`spinV`](properties.md#spinh-spinv-spint) and [`spinT`](properties.md#spinh-spinv-spint)), [`wireframe`](properties.md#wireframe), [`image`](properties.md#image), [`images`](properties.md#images) and [`clone`](properties.md#clone). The property `count` defines
the number of sides of the polygon. The properties `size`, `width` and `height` refer to the polygon circumscribed circle, rather than the polygon itself. In HTML all properties can be included in the `<polygon>` tag.

```html
HTML:
<polygon count="3" center="25,0,15">
<polygon count="5" size="10" color="crimson">
```
```js
JS:
polygon( 3, [25,0,15] ); // triangle
polygon( 5, [0,0,0], 10, 'crimson' ); // pentagon
```

[<kbd><img src="../examples/snapshots/polygon.jpg" width="300"></kbd>](../examples/polygon.html)





# Spatial objects

The spatial objects represent common 3D geometrical shapes: [`cube`](#cube), [`sphere`](#sphere), [`cylinder`](#cylinder), [`prism`](#prism), [`cone`](#cone) and [`pyramid`](#pyramid). 

#### cube
```html
HTML:
<cube id="𝑜𝑏𝑗𝑒𝑐𝑡" center="𝑥,𝑦,𝑧" size="𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ" color="𝑐𝑜𝑙𝑜𝑟">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡 = cube( [𝑥,𝑦,𝑧], [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ], 𝑐𝑜𝑙𝑜𝑟 );
```
Object. Represents a regular cube or a deformed cube (called *cuboid*). Its properties are [`center`](properties.md#center) (or [`x`](properties.md#x-y-z), [`y`](properties.md#x-y-z) and [`z`](properties.md#x-y-z)), [`size`](properties.md#size) (or [`width`](properties.md#width-height-depth), [`height`](properties.md#width-height-depth) and [`depth`](properties.md#width-height-depth)), [`color`](properties.md#color), [`spin`](properties.md#spin) (or [`spinH`](properties.md#spinh-spinv-spint), [`spinV`](properties.md#spinh-spinv-spint) and [`spinT`](properties.md#spinh-spinv-spint)), [`wireframe`](properties.md#wireframe), [`image`](properties.md#image), [`images`](properties.md#images) and [`clone`](properties.md#clone). In HTML all properties can be included in the `<cube>` tag.

```html
HTML:
<cube center="25,0,15">
<cube size="10" color="crimson">
```
```js
JS:
cube( [25,0,15] );
cube( [0,0,0], 10, 'crimson' );
```

[<kbd><img src="../examples/snapshots/cube.jpg" width="300"></kbd>](../examples/cube.html)
[<kbd><img src="../examples/snapshots/cube-cuboid.jpg" width="300"></kbd>](../examples/cube-cuboid.html)



#### sphere
```html
HTML:
<sphere id="𝑜𝑏𝑗𝑒𝑐𝑡" center="𝑥,𝑦,𝑧" size="𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ" color="𝑐𝑜𝑙𝑜𝑟">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡 = sphere( [𝑥,𝑦,𝑧], [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ], 𝑐𝑜𝑙𝑜𝑟 );
```
Object. Represents a regular sphere or a deformed sphere (spheroid). Its properties are [`center`](properties.md#center) (or [`x`](properties.md#x-y-z), [`y`](properties.md#x-y-z) and [`z`](properties.md#x-y-z)), [`size`](properties.md#size) (or [`width`](properties.md#width-height-depth), [`height`](properties.md#width-height-depth) and [`depth`](properties.md#width-height-depth)), [`color`](properties.md#color), [`spin`](properties.md#spin) (or [`spinH`](properties.md#spinh-spinv-spint), [`spinV`](properties.md#spinh-spinv-spint) and [`spinT`](properties.md#spinh-spinv-spint)), [`image`](properties.md#image), [`images`](properties.md#images) and [`clone`](properties.md#clone). In HTML all properties can be included in the `<sphere>` tag. 

```html
HTML:
<sphere center="25,0,15">
<sphere size="10" color="crimson">
```
```js
JS:
sphere( [25,0,15] );
sphere( [0,0,0], 10, 'crimson' );
```

[<kbd><img src="../examples/snapshots/sphere.jpg" width="300"></kbd>](../examples/sphere.html)
[<kbd><img src="../examples/snapshots/sphere-spheroid.jpg" width="300"></kbd>](../examples/sphere-spheroid.html)



#### cylinder
```html
HTML:
<cylinder id="𝑜𝑏𝑗𝑒𝑐𝑡" center="𝑥,𝑦,𝑧" size="𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ" color="𝑐𝑜𝑙𝑜𝑟">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡 = cylinder( [𝑥,𝑦,𝑧], [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ], 𝑐𝑜𝑙𝑜𝑟 );
```
Object. Represents a regular cylinder or a cylindroid (an elliptical cylinder). Its properties are [`center`](properties.md#center) (or [`x`](properties.md#x-y-z), [`y`](properties.md#x-y-z) and [`z`](properties.md#x-y-z)), [`size`](properties.md#size) (or [`width`](properties.md#width-height-depth), [`height`](properties.md#width-height-depth) and [`depth`](properties.md#width-height-depth)), [`color`](properties.md#color), [`spin`](properties.md#spin) (or [`spinH`](properties.md#spinh-spinv-spint), [`spinV`](properties.md#spinh-spinv-spint) and [`spinT`](properties.md#spinh-spinv-spint)), [`image`](properties.md#image), [`images`](properties.md#images) and [`clone`](properties.md#clone). In HTML all properties can be included in the `<cylinder>` tag.

```html
HTML:
<cylinder center="25,0,15">
<cylinder size="10" color="crimson">
```
```js
JS:
cylinder( [25,0,15] );
cylinder( [0,0,0], 10, 'crimson' );
```

[<kbd><img src="../examples/snapshots/cylinder.jpg" width="300"></kbd>](../examples/cylinder.html)
[<kbd><img src="../examples/snapshots/cylinder-cylindroid.jpg" width="300"></kbd>](../examples/cylinder-cylindroid.html)



#### prism
```html
HTML:
<prism id="𝑜𝑏𝑗𝑒𝑐𝑡" count="𝑐𝑜𝑢𝑛𝑡" center="𝑥,𝑦,𝑧" size="𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ" color="𝑐𝑜𝑙𝑜𝑟">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡 = prism( 𝑐𝑜𝑢𝑛𝑡, [𝑥,𝑦,𝑧], [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ], 𝑐𝑜𝑙𝑜𝑟 );
```
Object. Represents a regular prism or prismoid (an elliptical prism). Its
properties are `count`, [`center`](properties.md#center) (or [`x`](properties.md#x-y-z), [`y`](properties.md#x-y-z) and [`z`](properties.md#x-y-z)), [`size`](properties.md#size) (or [`width`](properties.md#width-height-depth), [`height`](properties.md#width-height-depth) and [`depth`](properties.md#width-height-depth)), [`color`](properties.md#color), [`spin`](properties.md#spin) (or [`spinH`](properties.md#spinh-spinv-spint), [`spinV`](properties.md#spinh-spinv-spint) and [`spinT`](properties.md#spinh-spinv-spint)), [`wireframe`](properties.md#wireframe), [`image`](properties.md#image), [`images`](properties.md#images) and [`clone`](properties.md#clone). The property `count` defines the number of sides of the prism. In HTML all properties can be included in the `<prism>` tag.

```html
HTML:
<prism count="6" center="25,0,15">
<prism count="3" size="10" color="crimson">
```
```js
JS:
prism( 6, [25,0,15] );
prism( 3, [0,0,0], 10, 'crimson' );
```

[<kbd><img src="../examples/snapshots/prism.jpg" width="300"></kbd>](../examples/prism.html)



#### cone
```html
HTML:
<cone id="𝑜𝑏𝑗𝑒𝑐𝑡" center="𝑥,𝑦,𝑧" size="𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ" color="𝑐𝑜𝑙𝑜𝑟">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡 = cone( [𝑥,𝑦,𝑧], [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ], 𝑐𝑜𝑙𝑜𝑟 );
```
Object. Represents a regular cone or conoid (an elliptical cone). Its properties are [`center`](properties.md#center) (or [`x`](properties.md#x-y-z), [`y`](properties.md#x-y-z) and [`z`](properties.md#x-y-z)), [`size`](properties.md#size) (or [`width`](properties.md#width-height-depth), [`height`](properties.md#width-height-depth) and [`depth`](properties.md#width-height-depth)), [`color`](properties.md#color), [`spin`](properties.md#spin) (or [`spinH`](properties.md#spinh-spinv-spint), [`spinV`](properties.md#spinh-spinv-spint) and [`spinT`](properties.md#spinh-spinv-spint)), [`image`](properties.md#image), [`images`](properties.md#images) and [`clone`](properties.md#clone). In HTML all properties can be included in the `<cone>` tag.

```html
HTML:
<cone center="25,0,15">
<cone size="10" color="crimson">
```
```js
JS:
cone( [25,0,15] );
cone( [0,0,0], 10, 'crimson' );
```

[<kbd><img src="../examples/snapshots/cone.jpg" width="300"></kbd>](../examples/cone.html)
[<kbd><img src="../examples/snapshots/cone-conoid.jpg" width="300"></kbd>](../examples/cone-conoid.html)



#### pyramid
```html
HTML:
<pyramid id="𝑜𝑏𝑗𝑒𝑐𝑡" count="𝑐𝑜𝑢𝑛𝑡" center="𝑥,𝑦,𝑧" size="𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ" color="𝑐𝑜𝑙𝑜𝑟">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡 = pyramid( 𝑐𝑜𝑢𝑛𝑡, [𝑥,𝑦,𝑧], [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ], 𝑐𝑜𝑙𝑜𝑟 );
```
Object. Represents a regular pyramid or a pyramoid (an elliptical pyramid). Its properties are `count`, [`center`](properties.md#center) (or [`x`](properties.md#x-y-z), [`y`](properties.md#x-y-z) and [`z`](properties.md#x-y-z)), [`size`](properties.md#size) (or [`width`](properties.md#width-height-depth), [`height`](properties.md#width-height-depth) and [`depth`](properties.md#width-height-depth)), [`color`](properties.md#color), [`spin`](properties.md#spin) (or [`spinH`](properties.md#spinh-spinv-spint), [`spinV`](properties.md#spinh-spinv-spint) and [`spinT`](properties.md#spinh-spinv-spint)), [`wireframe`](properties.md#wireframe), [`image`](properties.md#image), [`images`](properties.md#images) and [`clone`](properties.md#clone). The property `count` defines the number of sides of the pyramid. In HTML all properties can be included in the `<pyramid>` tag.

```html
HTML:
<pyramid count="6" center="25,0,15">
<pyramid count="3" size="10" color="crimson">
```
```js
JS:
pyramid( 6, [25,0,15] );
pyramid( 3, [0,0,0], 10, 'crimson' );
```

[<kbd><img src="../examples/snapshots/pyramid.jpg" width="300"></kbd>](../examples/pyramid.html)




# Advanced objects

The advanced objects are constructed from other objects. They provide either a way to create more complex shapes, or a way to create objects in a different way.


#### clone
```html
HTML:
<clone id="𝑜𝑏𝑗𝑒𝑐𝑡" src="𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒𝑂𝑏𝑗𝑒𝑐𝑡" center="𝑥,𝑦,𝑧"
       size="𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ" color="𝑐𝑜𝑙𝑜𝑟" spin="𝘴𝘱𝘪𝘯𝘏,𝘴𝘱𝘪𝘯𝘝,𝘴𝘱𝘪𝘯𝘛">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑡𝑒𝑚𝑝𝑙𝑎𝑡𝑒𝑂𝑏𝑗𝑒𝑐𝑡.clone;
```
Object and read-only property. Generates a clone of the object. Cloning is used to generate objects from another template object by copying all its properties. In HTML the properties are `src`, [`center`](properties.md#center) (or [`x`](properties.md#x-y-z), [`y`](properties.md#x-y-z) and [`z`](properties.md#x-y-z)), [`size`](properties.md#size) (or [`width`](properties.md#width-height-depth), [`height`](properties.md#width-height-depth) and [`depth`](properties.md#width-height-depth)), [`color`](properties.md#color) and [`spin`](properties.md#spin) (or [`spinH`](properties.md#spinh-spinv-spint), [`spinV`](properties.md#spinh-spinv-spint) and [`spinT`](properties.md#spinh-spinv-spint)). The value of `src` is the name of the template object. If not omitted, the other properties override the properties copied from the template object.
```html
HTML:
<cube id="a" size="15">
<clone id="b" src="a">
```

In JavaScript `clone` is a read-only property. When it is read, it creates a clone of the object.
```js
JS:
a = cube( [0,0,0], 25 );
b = a.clone;
```

[<kbd><img src="../examples/snapshots/clone.jpg" width="300"></kbd>](../examples/clone.html)
[<kbd><img src="../examples/snapshots/clone-tag.jpg" width="300"></kbd>](../examples/clone-tag.html)

Cloning a [group](#group) also clones all its objects.




#### group
```html
HTML:
<group id="𝘨𝘳𝘰𝘶𝘱𝘖𝘣𝘫𝘦𝘤𝘵" center="𝑥,𝑦,𝑧" size="𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ" color="𝑐𝑜𝑙𝑜𝑟" spin="𝘴𝘱𝘪𝘯𝘏,𝘴𝘱𝘪𝘯𝘝,𝘴𝘱𝘪𝘯𝘛">
   <𝘤𝘩𝘪𝘭𝘥𝘖𝘣𝘫𝘦𝘤𝘵 ...>
   <𝘤𝘩𝘪𝘭𝘥𝘖𝘣𝘫𝘦𝘤𝘵 ...>
   :
</group>
```
```js
JS:
𝘨𝘳𝘰𝘶𝘱𝘖𝘣𝘫𝘦𝘤𝘵 = group( 𝘤𝘩𝘪𝘭𝘥𝘖𝘣𝘫𝘦𝘤𝘵, 𝘤𝘩𝘪𝘭𝘥𝘖𝘣𝘫𝘦𝘤𝘵, ... );
𝘨𝘳𝘰𝘶𝘱𝘖𝘣𝘫𝘦𝘤𝘵.add( 𝘤𝘩𝘪𝘭𝘥𝘖𝘣𝘫𝘦𝘤𝘵, 𝘤𝘩𝘪𝘭𝘥𝘖𝘣𝘫𝘦𝘤𝘵, ... );
```
Object. Represents a collection of objects grouped into a single object. A group can be positioned, scaled, rotated and colored as other objects. In HTML its properties are [`center`](properties.md#center) (or [`x`](properties.md#x-y-z), [`y`](properties.md#x-y-z) and [`z`](properties.md#x-y-z)), [`size`](properties.md#size) (or [`width`](properties.md#width-height-depth), [`height`](properties.md#width-height-depth) and [`depth`](properties.md#width-height-depth)), [`color`](properties.md#color), [`spin`](properties.md#spin) (or [`spinH`](properties.md#spinh-spinv-spint), [`spinV`](properties.md#spinh-spinv-spint) and [`spinT`](properties.md#spinh-spinv-spint)) and [`clone`](properties.md#clone). The child objects are defined as tags within the `<group>` tag. In JavaScript the child objects are provided are parameters or added with the method `add`. 

```html
HTML:
<group center="0,-10,0">
   <sphere y="25" size="10">
   <cone size="12,25">
</group>
```
```js
JS:
group(
   sphere( [0,25,0], 10 ),
   cone( [0,0,0], [12,25] )
);
```

[<kbd><img src="../examples/snapshots/group.jpg" width="300"></kbd>](../examples/group.html)
[<kbd><img src="../examples/snapshots/group-tag.jpg" width="300"></kbd>](../examples/group-tag.html)

A group is a special object, and some aspects of group management are:
- A group has own [`center`](properties.md#center), [`size`](properties.md#size) and [`spin`](properties.md#spin). Values of `size` of a group are scale factors, not sizes. Centers and spins of objects in a group are relative to the group's `center` and `spin`.
- A group can be extended with new objects with the method `add`.
- Cloning a group will also clone all its objects, setting `color` of a group sets it to all its objects overwriting their individual colors.



#### tube
```html
HTML:
<tube id="𝑜𝑏𝑗𝑒𝑐𝑡" center="𝑥,𝑦,𝑧" curve="𝑐𝑢𝑟𝑣𝑒" radius="𝑟𝑎𝑑𝑖𝑢𝑠" count="𝑡𝑢𝑏𝑢𝑙𝑎𝑟,𝑟𝑎𝑑𝑖𝑎𝑙"
      size="𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ" color="𝑐𝑜𝑙𝑜𝑟">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡 = tube( [𝑥,𝑦,𝑧], 𝑐𝑢𝑟𝑣𝑒, 𝑟𝑎𝑑𝑖𝑢𝑠, 𝘤𝘰𝘶𝘯𝘵, [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ], 𝑐𝑜𝑙𝑜𝑟 );
```
Object. Represents a tubular object along a straight or a curved line. Its properties are [`center`](properties.md#center) (or [`x`](properties.md#x-y-z), [`y`](properties.md#x-y-z) and [`z`](properties.md#x-y-z)), `curve`, `radius`, `count`, [`size`](properties.md#size) (or [`width`](properties.md#width-height-depth), [`height`](properties.md#width-height-depth) and [`depth`](properties.md#width-height-depth)), [`color`](properties.md#color), [`spin`](properties.md#spin) (or [`spinH`](properties.md#spinh-spinv-spint), [`spinV`](properties.md#spinh-spinv-spint) and [`spinT`](properties.md#spinh-spinv-spint)), [`image`](properties.md#image), [`images`](properties.md#images) and [`clone`](properties.md#clone). In HTML all properties can be included in the `<tube>` tag.

Tubes can also model [solids of revolution](https://en.wikipedia.org/wiki/Solid_of_revolution), also known as lathe shapes.

<img src="images/tube.png">

Parameter `curve` is a [`spline`](suica.md#spline) function but can also be an array of points or user-defined function *f(u)* on which spline is automatically constructed:

```html
HTML:
<tube curve="knot" radius="4" count="300">
```
```js
JS:
tube( [0,0,0], [[50,0,0], [-50,0,0]], 5, 2 );
```

[<kbd><img src="../examples/snapshots/tube.jpg" width="300"></kbd>](../examples/tube.html)
[<kbd><img src="../examples/snapshots/tube-lathe.jpg" width="300"></kbd>](../examples/tube-lathe.html)
[<kbd><img src="../examples/snapshots/tube-html.jpg" width="300"></kbd>](../examples/tube-html.html)


Parameter `radius` defines the radius of a tube. It is used in case there is no radius encoded in the spline curve itself. If the spline points are 3D, then the `radius` parameter is used as a constant radius of the whole tube

```js
JS:
function curve3D( u )
{
   return [
      10*u, // x
      0,    // y
      0     // z
	];
}
tube( [0,0,0], curve3D, 5 ); // radius=5, taken from tube
```

If the spline points are 4D, then the 4th coordinate is used as radius and the `radius` parameter is ignored.

```js
JS:
function curve4D( u )
{
   return [
      10*u, // x
      0,    // y
      0,    // z
      1     // radius
	];
}
tube( [0,0,0], curve4D, 5 ); // radius=1, taken from curve4D
```


Parameter `count` defines the granularity of the tube. It is either a number for the number of segments along the tube (i.e. *tubular* segments) or an array of two numbers for the number of *tubular* and *radial* segments. Higher number of segments results in a smoother curve, but it takes more memory space and processing time. By default, the tubular segments are 60 and the radial segments are 20.

<img src="images/tube-segments.png">

Tubes adhere to the other properties of splines &ndash; whether they are open or closed; and interpolating or approximating.

[<kbd><img src="../examples/snapshots/tube-open-closed.jpg" width="300"></kbd>](../examples/tube-open-closed.html)
[<kbd><img src="../examples/snapshots/tube-variations.jpg" width="300"></kbd>](../examples/tube-variations.html)

[<kbd><img src="../examples/snapshots/tube-spline.jpg" width="300"></kbd>](../examples/tube-spline.html)
[<kbd><img src="../examples/snapshots/tube-spline-explicit.jpg" width="300"></kbd>](../examples/tube-spline-explicit.html)

Tubes support dynamic change of their curve and curve radius. This is performance intensive operation, as it recalculates all vertices of the tube. Recalculation is done whenever the properties `curve` or `radius` are changed.

```js
JS:
spiral = tube( [0,0,0], curve, 1 );
		
suica.ontime = function( t )
{
   spiral.radius = 3+2.8*Math.sin(4*t);
}
```
		
[<kbd><img src="../examples/snapshots/tube-dynamic-radius.jpg" width="300"></kbd>](../examples/tube-dynamic-radius.html)
[<kbd><img src="../examples/snapshots/tube-dynamic-spline-radius.jpg" width="300"></kbd>](../examples/tube-dynamic-spline-radius.html)

[<kbd><img src="../examples/snapshots/tube-dynamic.jpg" width="300"></kbd>](../examples/tube-dynamic.html)


---

May, 2022