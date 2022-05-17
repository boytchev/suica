---
title: Suica Objects
description: [The core of Suica &ndash; from point to sphere]
---
##### [About](#about) &middot; [Suica canvas](#suica-canvas) &middot; **Objects** &middot; [Properties](user-guide-properties.md) &middot; [Drawings](user-guide-drawings.md) &middot; [Events](user-guide-events.md) &middot; [References](#references)

**Suica objects** are the core functionality of Suica. They are the elements that are used to construct 3D scenes. These object are designed to provide a foundation for a diverse mobile computer graphics visualizations.

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

Most Suica objects share the same basic properties for position, orientation, color and so on. More information about properties are in chapter [Suica properties](user-guide-properties.md). Properties related to events are described in chapter [Suica events](user-guide-events.md).

## Objects and variables

Suica keeps track of all created objects. They are created as JavaScript variables and stored in an internal Suica list of objects [`allObjects`](user-guide-suica.md#allobjects). When an object is created with a name, this object is also created as a global JavaScript variable. This allows to reuse or to reference the object later on.

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
Object. Represents a point. Its properties are [`center`](user-guide-properties.md#center) (or [`x`](user-guide-properties.md#x-y-z), [`y`](user-guide-properties.md#x-y-z) and [`z`](user-guide-properties.md#x-y-z)), [`size`](user-guide-properties.md#size), [`color`](user-guide-properties.md#color), [`image`](user-guide-properties.md#image), [`images`](user-guide-properties.md#images) and [`clone`](user-guide-properties.md#clone). By default a point is drawn as a small cirlce, but it can be changed with a custom [drawing](#user-guide-drawings.md). In HTML all properties can be included in the `<point>` tag.

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
Object. Represents a straight segment. Its properties are `from` (or [`center`](user-guide-properties.md#center)), `to`, [`color`](user-guide-properties.md#color), [`image`](user-guide-properties.md#image), [`images`](user-guide-properties.md#images) and [`clone`](user-guide-properties.md#clone). The properties `center` and `from` are synonyms and they set the starting point of the segment, while `to` sets the ending point. By default a line is drawn as a solid line, but it can be changed with custom [drawing](#user-guide-drawings.md). In HTML all properties can be included in the `<line>` tag.

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
[`center`](user-guide-properties.md#center) (or [`x`](user-guide-properties.md#x-y-z), [`y`](user-guide-properties.md#x-y-z) and [`z`](user-guide-properties.md#x-y-z)), [`size`](user-guide-properties.md#size) (or [`width`](user-guide-properties.md#width-height-depth) and [`height`](user-guide-properties.md#width-height-depth)), [`color`](user-guide-properties.md#color), [`spin`](user-guide-properties.md#spin) (or [`spinH`](user-guide-properties.md#spinh-spinv-spint), [`spinV`](user-guide-properties.md#spinh-spinv-spint) and [`spinT`](user-guide-properties.md#spinh-spinv-spint)), [`wireframe`](user-guide-properties.md#wireframe), [`image`](user-guide-properties.md#image), [`images`](user-guide-properties.md#images) and [`clone`](user-guide-properties.md#clone). In HTML all properties can be included in the `<square>` tag.

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
Object. Represents a circle or an ellipse. Its properties are [`center`](user-guide-properties.md#center) (or [`x`](user-guide-properties.md#x-y-z), [`y`](user-guide-properties.md#x-y-z) and [`z`](user-guide-properties.md#x-y-z)), [`size`](user-guide-properties.md#size) (or [`width`](user-guide-properties.md#width-height-depth) and [`height`](user-guide-properties.md#width-height-depth)), [`color`](user-guide-properties.md#color), [`spin`](user-guide-properties.md#spin) (or [`spinH`](user-guide-properties.md#spinh-spinv-spint), [`spinV`](user-guide-properties.md#spinh-spinv-spint) and [`spinT`](user-guide-properties.md#spinh-spinv-spint)), [`wireframe`](user-guide-properties.md#wireframe),
[`image`](user-guide-properties.md#image), [`images`](user-guide-properties.md#images) and [`clone`](user-guide-properties.md#clone). In HTML all properties can be included in the `<circle>` tag.

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
Object. Represents a regular polygon or an elliptical polygon. Its properties are `count`, [`center`](user-guide-properties.md#center) (or [`x`](user-guide-properties.md#x-y-z), [`y`](user-guide-properties.md#x-y-z) and [`z`](user-guide-properties.md#x-y-z)), [`size`](user-guide-properties.md#size) (or [`width`](user-guide-properties.md#width-height-depth) and [`height`](user-guide-properties.md#width-height-depth)), [`color`](user-guide-properties.md#color), [`spin`](user-guide-properties.md#spin) (or [`spinH`](user-guide-properties.md#spinh-spinv-spint), [`spinV`](user-guide-properties.md#spinh-spinv-spint) and [`spinT`](user-guide-properties.md#spinh-spinv-spint)), [`wireframe`](user-guide-properties.md#wireframe), [`image`](user-guide-properties.md#image), [`images`](user-guide-properties.md#images) and [`clone`](user-guide-properties.md#clone). The property `count` defines
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





## Common 3D objects

The common 3D objects represents shapes, like cubes, spheres, and so on. Their
constructions requires to set just a few properties. Some of the objects have
framed variants, where only their edges are drawn with lines.

_**Note:** The width of the lines is 1 pixel and this limitation is set in the
underlying technology._

### Cube

Object. Represents a regular cube or a deformed cube (called *cuboid*).
Its properties are `center` (or `x`, `y` and `z`), `size` (or `width`, `height`
and `depth`), `color`, `spin`, `wireframe`, `image`, `images` and `clone`. 

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



### Sphere

Object. Represents a regular sphere or a deformed sphere (spheroid). Its
properties are `center` (or `x`, `y` and `z`), `size` (or `width`, `height`
and `depth`), `color`, `spin`, `image`, `images` and `clone`. 

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



### Cylinder

Object. Represents a regular cylinder or a cylindroid (an elliptical cylinder).
Its properties are `center` (or `x`, `y` and `z`), `size` (or `width`, `height`
and `depth`), `color`, `spin`, `image`, `images` and `clone`. 

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



### Prism

Object. Represents a regular prism or prismoid (an elliptical prism). Its
properties are `count`, `center` (or `x`, `y` and `z`), `size` (or `width`,
`height` and `depth`), `color`, `spin`, `wireframe`, `image`, `images` and `clone`. The
property `count` defines the number of sides of the prism.

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



### Cone

Object. Represents a regular cone or conoid (an elliptical cone). Its properties
are `center` (or `x`, `y` and `z`), `size` (or `width`, `height` and `depth`),
`color`, `spin`, `image`, `images` and `clone`. 

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



### Pyramid

Object. Represents a regular pyramid or a pyramoid (an elliptical pyramid). Its
properties are `count`, `center` (or `x`, `y` and `z`), `size` (or `width`,
`height` and `depth`), `color`, `spin`, `wireframe`, `image`, `images` and `clone`. The
property `count` defines the number of sides of the pyramid.

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

The advanced objects are constructed from other objects. They provide more complex shapes.


## Group

Object. Represents a collection of objects grouped into a single object. A group
can be positioned, scaled, rotated and colored as other objects. Its properties
are `center` (or `x`, `y` and `z`), `size` (or `width`, `height` and `depth`),
`color`, `spin` and `clone`; it has method `add`.

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

A group is a special objects, and some aspects of group management are:
- A group has own center, size and spin. Values of `size` of a group are scale
factors, not sizes. Centers and spins of objects in a group are relative to the
group's center and spin.
- Group objects are defined between `<group>` and `</group>` tags or as
parameters to `group(...)`. A group can be extended with new objects with
`add(...)`.
- Cloning a group will also clone all its objects, setting `color` of a group
sets it to all its objects overwriting their individual colors.



### Tube

Object. Represents a tubular object along a straight or a curved line. Its
properties are `center` (or `x`, `y` and `z`), `curve`, `radius`, `count`,
`size` (or `width`, `height` and `depth`), `color`, `spin` and `clone`. Tubes
can also model [solids of revolution](https://en.wikipedia.org/wiki/Solid_of_revolution), also known as lathe shapes.

<img src="images/tube.png">

The curve is a [spline](#spline) function but can also be an array of points or
user-defined function *f(u)* on which spline is automatically constructed:

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


The `radius` of a tube is the third parameter. It is used in case there is no
radius encoded in the spline curve itself:

- if the spline points are 3D, then the *radius* parameter is used as a constant radius of the whole tube

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

- if the spline points are 4D, then the 4th coordinate is used as radius and the *radius* parameter is ignored

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


The *count* parameter defines the granularity of the tube. It is either a number
for the number of segments along the tube (i.e. tubular segments) or an array of
two numbers for the number of tubural and radial segments. Higher number of
segments results in smoother curve, but takes more memory space and processing
time. By default the tubural segments are 60 and the radial segments are 20.

<img src="images/tube-segments.png">

The tube adheres to the other properties of splines &ndash; whether they are
open or closed; and interpolating or approximating.

[<kbd><img src="../examples/snapshots/tube-open-closed.jpg" width="300"></kbd>](../examples/tube-open-closed.html)
[<kbd><img src="../examples/snapshots/tube-variations.jpg" width="300"></kbd>](../examples/tube-variations.html)

[<kbd><img src="../examples/snapshots/tube-spline.jpg" width="300"></kbd>](../examples/tube-spline.html)
[<kbd><img src="../examples/snapshots/tube-spline-explicit.jpg" width="300"></kbd>](../examples/tube-spline-explicit.html)

Tubes allow dynamic change of their curve and curve radius. This is performance
intensive operation, as it recalculates all vertices of the tube. Recalculation
is done whenever the *curve* or *radius* property of a tube is assigned a value.

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


#### Clone

Readonly property. Generates a clone of the object. Whenever the value of `clone`
is retrieved, it is a clone of the object. Cloning is used to generate objects
from a single object-template.

```html
HTML:
<cube id="a" size="15">
<clone id="b" src="a">
```
```js
JS:
a = cube( [0,0,0], 25 );
b = a.clone;
```

[<kbd><img src="../examples/snapshots/clone.jpg" width="300"></kbd>](../examples/clone.html)
[<kbd><img src="../examples/snapshots/clone-tag.jpg" width="300"></kbd>](../examples/clone-tag.html)

_**Note**: Cloning an object [group](#group) also clones all its objects._



---

May, 2022