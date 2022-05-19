---
title: Suica Object Properties
description: [The common properties of Suica objects]
---
##### [Suica](suica.md) &middot; [Objects](objects.md) &middot; **Properties** &middot; [Drawings](drawings.md) &middot; [Events](events.md) &middot; [References](references.md)

By design Suica attempts to use the same properties for all objects as much as it is reasonable. This document describes the properties that are common to many objects. 

# Table of contents

- [Introduction](#introduction)
	- <small>[Setting properties](#setting-properties)</small>
	- <small>[Multiple properties](#multiple-properties): [`style`](#style)</small>
- [Geometrical properties](#geometrical-properties)
	- <small>[Position](#position): [`center`](#center), [`x`](#x-y-z), [`y`](#x-y-z), [`z`](#x-y-z)</small>
	- <small>[Size](#size): [`size`](#size-1), [`width`](#width-height-depth), [`height`](#width-height-depth), [`depth`](#width-height-depth)</small>
	- <small>[Orientation](#orientation): [`spin`](#spin), [`spinH`](#spinh-spinv-spint), [`spinV`](#spinh-spinv-spint), [`spinT`](#spinh-spinv-spint)</small>
- [Material properties](#material-properties)
	- <small>[Color](#color): [`color`](#color)</small>
	- <small>[Texture](#texture): [`image`](#image), [`images`](#images)</small>
	- <small>[Wire-frame](#wire-frame): [`wireframe`](#wireframe-1)</small>





# Introduction

Suica objects have properties, like size and color, that specify how they are created and how they are shown on the screen. All properties of Suica objects are optional. When a property is not set, Suica uses its default value. Properties can be defined in several ways:

## Setting properties

In HTML all properties are set as tag attributes. The names of the properties are case-insensitive. The order of attributes is arbitrary. A property set in HTML cannot be changed with another HTML tag.
```html
HTML:
<cube center="20,0,5" color="crimson">
<cube color="blue" center="10,30,15">
```

In JavaScript all properties are set as properties of JavaScript objects, i.e. using the dot notation. The order of setting properties is arbitrary. The names of the properties are case-sensitive.
```js
JS:
a = cube();
a.center = [20,0,5];
a.color = 'crimson';
b = cube();
b.color = 'blue';
b.center = [10,30,15];
```

Some properties are use so often, that they are included as parameters of the functions that create objects. In this case the names of the properties are not used, but the order of parameters is fixed. Only the trailing parameters can be omitted.

In the next example the value 100 is the `size` of the cube. It is included in the code, because the creation  of a cube is done with function [`cube(𝘤𝘦𝘯𝘵𝘦𝘳,𝑠𝑖𝑧𝑒,𝑐𝑜𝑙𝑜𝑟)`](objects.md#cube).

```js
JS:
cube( [20,0,5], 100, 'crimson' );
cube( [10,30,15], 100, 'blue' );
```


## Multiple properties

In JavaScript a group of properties can be represented as a JavaScript object. They can be applied to an object with the `style` method.

#### Style
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡𝘕𝘢𝘮𝘦.style({𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, 𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, …});
```
Method. Sets a group of properties of an object. The properties are defined as a set of *name:value* pairs. New, custom user-defined properties are allowed. As `style` returns the same object, styling can be chained.

```js
JS:
sphere().style( {x:15, size:20, color:'peachpuff'} );
sphere().style( {x:15} ).style( {size:20} ).style( {color:'peachpuff'} );
```

[<kbd><img src="../examples/snapshots/style.jpg" width="300"></kbd>](../examples/style.html)

`style` can also be used as function [`style`](suica.md#style).




# Geometrical properties

The geometrical properties of Suica objects define their relation with the 3D space &ndash; i.e. their position, size and orientation. These three properties correspond to the fundamental geometrical transformations: [translation](https://en.wikipedia.org/wiki/Translation_(geometry)), [scaling](https://en.wikipedia.org/wiki/Scaling_(geometry)) and [rotation](https://en.wikipedia.org/wiki/Rotation_(mathematics)).


## Position

All Suica objects are placed in 3D space. The position is defined by a special central point of the object, called `center`, which is not necessarily the geometrical center. This point serves as a handle. When it is moved, the whole object is moved. Properties `x`, `y` and `z` provide access to individual coordinates of `center`.

<img src="images/center.png">

An exceptional object is the [`line`](#line) &ndash; it has no central point, because it is defined by two points.


#### center
```html
HTML:
<𝑜𝑏𝑗𝑒𝑐𝑡 center="𝘹,𝘺,𝘻">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡( ..., [𝘹,𝘺,𝘻], ... );
𝑜𝑏𝑗𝑒𝑐𝑡𝘕𝘢𝘮𝘦.center = [𝘹,𝘺,𝘻];
```
Property. Defines object position in 3D space. Property `center` is an array of three numbers [`x`, `y`, `z`] for the x, y and z coordinates (in this order). The actual visual position depends on the orientation of the [coordinate system](#coordinate-system). All coordinates are optional. Default values are 0.

```html
HTML:
<point center="25,0,15">
```
```js
JS:
point( [25,0,15] );

p = point( );
p.center = [25, 0, 15];
```

An object can be used as a center of another object. 

```html
HTML:
<cube id="a" x="-20">
<cube id="b" x="20">
<line from="a" to="b">
```
```js
JS:
a = cube( [20,0,0] );
b = cube( [-20,0,0] );
line( a, b );
```
[<kbd><img src="../examples/snapshots/object-as-position.jpg" width="300"></kbd>](../examples/object-as-position.html)


#### x, y, z
```html
HTML:
<𝑜𝑏𝑗𝑒𝑐𝑡 x="𝘹" y="𝘺" z="𝘻">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡𝘕𝘢𝘮𝘦.x = 𝘹;
𝑜𝑏𝑗𝑒𝑐𝑡𝘕𝘢𝘮𝘦.y = 𝘺;
𝑜𝑏𝑗𝑒𝑐𝑡𝘕𝘢𝘮𝘦.z = 𝘻;
```
Properties. The individual x, y or z coordinates of the object position in 3D space. These properties provide an alternative access to object `center`. They are often use to modify one of the coordinates keeping the other two unchanged.

```html
HTML:
<point x="25" y="10" z="15">
```
```js
JS:
p = point( );
p.x = 25;
p.y = 10;
p.z = 15;
```




## Size

All objects in Suica have size. It determines the visual appearance of the object &ndash; how big or small it is. In 3D space the size is also 3D and it defines the width, height and depth of the object. When the depth of an object is not set, it is assumed to be the same as the width.

There are several exceptional objects: [`line`](#line) has no size; [`point`](#point) has a single size; all flat objects, like [`square`](#square), have two sizes &ndash; width and height, but no depth; [`group`](#group) uses its size as a scale factor, not as an actual size.  


#### size
```html
HTML:
<𝑜𝑏𝑗𝑒𝑐𝑡 size="𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡( ..., 𝑤𝑖𝑑𝑡ℎ, ... );
𝑜𝑏𝑗𝑒𝑐𝑡( ..., [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ], ... );
𝑜𝑏𝑗𝑒𝑐𝑡𝘕𝘢𝘮𝘦.size = 𝑤𝑖𝑑𝑡ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡𝘕𝘢𝘮𝘦.size = [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ];
```
Property. The size of a Suica object. Property `size` that defines how big is the objects along its dimensions. If `size` is a single number, then the object is uniformly sized. Generally, `size` is an array of at least one and up to three numbers for object's width, height and depth. Their order does not depend on the orientation of [the coordinate system](#coordinate-system). Thus, height corresponds to the axis that is upwards.

<img src="images/sizes.png">


```html
HTML:
<cube size="25">
<cube size="25,10">
<cube size="25,10,15">
```
```js
JS:
cube( pos, 25 );
cube( pos, [25] );
cube( pos, [25,10] );
cube( pos, [25,10,15] );
```


[<kbd><img src="../examples/snapshots/sizes.jpg" width="300"></kbd>](../examples/sizes.html)
[<kbd><img src="../examples/snapshots/sizes-orientation.jpg" width="300"></kbd>](../examples/sizes-orientation.html)


#### width, height, depth
```html
HTML:
<𝑜𝑏𝑗𝑒𝑐𝑡 width="𝘸𝘪𝘥𝘵𝘩" height="𝘩𝘦𝘪𝘨𝘩𝘵" depth="𝘥𝘦𝘱𝘵𝘩">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡𝘕𝘢𝘮𝘦.width = 𝘸𝘪𝘥𝘵𝘩;
𝑜𝑏𝑗𝑒𝑐𝑡𝘕𝘢𝘮𝘦.height = 𝘩𝘦𝘪𝘨𝘩𝘵;
𝑜𝑏𝑗𝑒𝑐𝑡𝘕𝘢𝘮𝘦.depth = 𝘥𝘦𝘱𝘵𝘩;
```
Properties. The individual width, height and depth of an object. These properties provide an alternative access to object `size`. 

```html
HTML:
<cube width="3" height="15" depth="40">
```
```js
JS:
a = cube( );
a.width = 3;
a.height = 15;
a.depth = 40;
```





## Orientation

The orientation of objects in Suica refers to their rotation. Like positions in 3D, rotations in 3D can be represented by three numbers &ndash; rotation angles around three axes that pass through the object `center`.

There is a significant difference between handling positions and orientations. The order of rotations is important as different order will produce different final orientation. Suica adopts one specific order, which is close to how people would describe the individual rotations.

The property for orientation is `spin`. Individual rotations are in properties `spinH`, `spinV` and `spinT`.

Angle `spinH` (*H* from *horizontal*) defines horizontal rotation around the global vertical axis. Angle `spinV` (*V* from *vertical*) define vertical rotation away from the vertical axis. Angle `spinT` (*T* from *torsion*) defines rotation of the object around it own vertical axis.

<img src="images/spin.png">


#### spin
```html
HTML:
<𝑜𝑏𝑗𝑒𝑐𝑡 spin="𝘴𝘱𝘪𝘯𝘏">
<𝑜𝑏𝑗𝑒𝑐𝑡 spin="𝘴𝘱𝘪𝘯𝘏,𝘴𝘱𝘪𝘯𝘝,𝘴𝘱𝘪𝘯𝘛">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡𝘕𝘢𝘮𝘦.spin = 𝘴𝘱𝘪𝘯𝘏;
𝑜𝑏𝑗𝑒𝑐𝑡𝘕𝘢𝘮𝘦.spin = [𝘴𝘱𝘪𝘯𝘏,𝘴𝘱𝘪𝘯𝘝,𝘴𝘱𝘪𝘯𝘛];
```
Property. Defines the rotation of an object in respect to its own axes. The value of `spin` is either an angle or an array of up to three angles [`spinH`, `spinV`, `spinT`]. All angles are measured in degrees.

```html
HTML:
<cube spin="45,90,180">
```
```js
JS:
a = cube( );
a.spin = [45,90,180];
```


The spin is independent on the orientation of [the coordinate system](#coordinate-system). However, due to the default orientation of flat and non-flat objects, orientation along coordinate system axes differ. For example, if a square has a spin [&alpha;, &beta;, &gamma;], a pyramid on that square should have spin [&alpha;, &beta;+90, &gamma;].

[<kbd><img src="../examples/snapshots/spin.jpg" width="300"></kbd>](../examples/spin.html)
[<kbd><img src="../examples/snapshots/spin-orientation.jpg" width="300"></kbd>](../examples/spin-orientation.html)


#### spinH, spinV, spinT
```html
HTML:
<𝑜𝑏𝑗𝑒𝑐𝑡 spinH="𝘴𝘱𝘪𝘯𝘏" spinV="𝘴𝘱𝘪𝘯𝘝" spinT="𝘴𝘱𝘪𝘯𝘛">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡𝘕𝘢𝘮𝘦.spinH = 𝘴𝘱𝘪𝘯𝘏;
𝑜𝑏𝑗𝑒𝑐𝑡𝘕𝘢𝘮𝘦.spinV = 𝘴𝘱𝘪𝘯𝘝;
𝑜𝑏𝑗𝑒𝑐𝑡𝘕𝘢𝘮𝘦.spinT = 𝘴𝘱𝘪𝘯𝘛;
```
Properties. The individual rotation angles of an object. These properties provide an alternative access to object `spin`. The order of application of rotation is fixed and does not depend on the order of setting individual angles.

```html
HTML:
<cube spinH="45" spinV="90" spinT="180">
```
```js
JS:
a = cube( );
a.spinH = 45;
a.spinV = 90;
a.spinT = 180;
```

[<kbd><img src="../examples/snapshots/spin-angles.jpg" width="300"></kbd>](../examples/spin-angles.html)





# Material properties

The material properties of Suica objects define their visual styling, like colors and textures. These properties are used to give the feeling of object being made of specific material.




#### color
```html
HTML:
<𝑜𝑏𝑗𝑒𝑐𝑡 color="𝑐𝑜𝑙𝑜𝑟">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡( ..., 𝑐𝑜𝑙𝑜𝑟, ... );
𝑜𝑏𝑗𝑒𝑐𝑡𝘕𝘢𝘮𝘦.color = 𝑐𝑜𝑙𝑜𝑟;
```

Property. Defines the color of a graphical object. Color in Suica can be expressed in a variety of ways. The [RGB scheme](https://www.w3schools.com/colors/colors_rgb.asp) represents colors as three components *red*, *green* and *blue*, while the [HSL scheme](https://www.w3schools.com/colors/colors_hsl.asp) components are
*hue*, *saturation* and *lightness*.
```js
'𝑐𝑜𝑙𝑜𝑟𝘕𝑎𝑚𝑒'
#𝐹𝐹𝐹𝐹𝐹𝐹                     // 000000..FFFFFF
0x𝐹𝐹𝐹𝐹𝐹𝐹                    // 000000..FFFFFF
'𝑟𝑒𝑑,𝑔𝑟𝑒𝑒𝑛,𝑏𝑙𝑢𝑒'             // 0..1
[𝑟𝑒𝑑,𝑔𝑟𝑒𝑒𝑛,𝑏𝑙𝑢𝑒]             // 0..1
rgb(𝑟𝑒𝑑,𝑔𝑟𝑒𝑒𝑛,𝑏𝑙𝑢𝑒)          // 0..255
hsl(ℎ𝑢𝑒,𝑠𝑎𝑡𝑢𝑟𝑎𝑡𝑖𝑜𝑛,𝑙𝑖𝑔ℎ𝑡𝑛𝑒𝑠𝑠)  // 0..360, 0..100, 0..100
```

The following table elaborates how colors are set in HTML, CSS and JavaScript values.

| Context | Descriptive<br>name | Hexadecimal<br>number | Normalized<br>RGB array | RGB<br>function | HSL<br>function |
|---|:---:|:---:|:---:|:---:|:---:|
| | <small>[List of color names](https://www.w3schools.com/colors/colors_names.asp)</small>| *RRGGBB*<br><small>*RR*,*GG*,*BB* &isin; [00,FF]</small> | *r*,*g*,*b*<br><small>*r*,*g*,*b* &isin; [0,1]</small> | rgb(*r*,*g*,*b*)<br><small>*r*,*g*,*b* &isin; [0,255] | hsl(*h*,*s*,*l*)<br><small>*h* &isin; [0,360], *s*,*l* &isin; [0,100]</small> |
| Tag<br>attribute | <small>[crimson](https://www.color-name.com/crimson.color)</small> | <small>0xDC143C</small> | <small>0.86,&nbsp;0.08,&nbsp;0.24</small> | <small>rgb(&nbsp;220,&nbsp;20,&nbsp;60&nbsp;)</small> | <small>hsl(&nbsp;348,&nbsp;91,&nbsp;86&nbsp;)</small> |
| CSS<br>property | <small>crimson</small> | <small>#DC143C</small> | | <small>rgb( 220, 20, 60 )</small> | <small>hsl( 348, 91, 86 )</small> |
| JS<br>code | <small>"crimson"</small> | <small>0xDC143C</small> | <small>[0.86,&nbsp;0.08,&nbsp;0.24]</small> | <small>rgb(&nbsp;220,&nbsp;20,&nbsp;60)</small> | <small>hsl(&nbsp;348,&nbsp;91,&nbsp;86&nbsp;)</small> |

Setting the `color` of a [group](#group) sets it to all its objects.



## Texture

[Textures](https://en.wikipedia.org/wiki/Texture_mapping) are 2D images that are applied onto 2D and 3D objects. Textures are generally used to decorate objects with visual details. Suica supports two sources for textures &ndash; external image files and [drawings](drawings.md) generated with Suica. The properties that implement textures in Suica are `image` and `images`.

#### image
```html
HTML:
<𝑜𝑏𝑗𝑒𝑐𝑡 image="𝑑𝑟𝑎𝑤𝑖𝑛𝑔">
<𝑜𝑏𝑗𝑒𝑐𝑡 image="𝑢𝑟𝑙">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡𝘕𝘢𝘮𝘦.image = 𝑑𝑟𝑎𝑤𝑖𝑛𝑔;
𝑜𝑏𝑗𝑒𝑐𝑡𝘕𝘢𝘮𝘦.image = 𝑖𝑚𝑎𝑔𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡𝘕𝘢𝘮𝘦.image = '𝑢𝑟𝑙';
```
Property. Decorates object surface with an image. Images can be stamped onto Suica object via the property `image`. The property accepts a drawing or a texture image. For examples of how to use drawings see chapter [Drawings](drawings.md). 

```html
HTML:
<cube id="a" image="https://boytchev.github.io/suica/textures/flower.jpg">
```
```js
JS:
a.image = 'https://boytchev.github.io/suica/textures/flower.jpg';
a.image = image( 'https://boytchev.github.io/suica/textures/flower.jpg' );
```

[<kbd><img src="../examples/snapshots/image-file.jpg" width="300"></kbd>](../examples/image-file.html)
[<kbd><img src="../examples/snapshots/image-datauri.jpg" width="300"></kbd>](../examples/image-datauri.html)


When an object has both `color` and `image`, the resulting color is the product of the RGB normalized colors (i.e. components r,g,b&isin;[0,1]) of the color and the image pixels. If the object color is [R,G,B] and the image color is [r,g,b], then the combined color is [R,G,B]&times;[r,g,b] = [R&times;r,G&times;g,B&times;b].
The following table shows some combinations of colors:

| Object color | Image color | Resulting color |
|---|---|---|
| White<br><small>[1,1,1]</small> | Any<br><small>[r,g,b]</small> | Image color<br><small>[1,1,1]&times;[r,g,b] = [r,g,b]</small> |
| Black<br><small>[0,0,0]</small> | Any<br><small>[r,g,b]</small> | Black<br><small>[0,0,0]&times;[r,g,b] = [0,0,0]</small> |
| Any<br><small>[R,G,B]</small> | White<br><small>[1,1,1]</small> | Object color<br><small>[R,G,B]&times;[1,1,1] = [R,G,B]</small> |
| Any<br><small>[R,G,B]</small> | Black<br><small>[0,0,0]</small> | Black<br><small>[R,G,B]&times;[0,0,0] = [0,0,0]</small> |
| Red<br><small>[R,0,0]</small> | Any<br><small>[r,g,b]</small> | Only the red component of the image color<br><small>[1,0,0]&times;[r,g,b] = [r,0,0]</small> |
| Yellow<br><small>[1,1,0]</small> | Cyan<br><small>[0,1,1]</small> | Green<br><small>[1,1,0]&times;[0,1,1] = [0,1,0]</small> |

Due to a security mechanism in browsers &ndash; [Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) (SOP) and [Cross-origin resource sharing](https://developer.mozilla.org/en-US/docs/Glossary/CORS) (CORS), a file can be used as image only if it is located in the same online domain; or the image host allows cross-origin requests. An image file can be used in these cases:

- the image file is in the same domain as the Suica file and is accessed by
`http://` or `https://` protocols
- the image file is hosted on a server that allows anonymous access to images
- the image file is accessed through a [local host](https://en.wikipedia.org/wiki/Localhost) from `http://localhost`
- the image is encoded in the URL itself as [Data URI/URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) from `data:` scheme
- CORS is disabled in the browser configuration (not recommended)
- an old SOP-less and CORS-less browser is used (not recommended)





#### images
```html
HTML:
<𝑜𝑏𝑗𝑒𝑐𝑡 images="𝘤𝘰𝘶𝘯𝘵">
<𝑜𝑏𝑗𝑒𝑐𝑡 images="𝘤𝘰𝘶𝘯𝘵𝘟,𝘤𝘰𝘶𝘯𝘵𝘠">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡𝘕𝘢𝘮𝘦.images = 𝘤𝘰𝘶𝘯𝘵;
𝑜𝑏𝑗𝑒𝑐𝑡𝘕𝘢𝘮𝘦.images = [𝘤𝘰𝘶𝘯𝘵𝘟, 𝘤𝘰𝘶𝘯𝘵𝘠];
```
Property. Defines the number of copies of a drawing or image across the surface
of an object. If the value of *images* is a number, it defines the number of copies in both
horizontal and vertical direction. If the value is an array, the first element
if for the horizontal direction and the second is for the vertical direction.

```html
HTML:
<cube id="a" images="2">
<cube id="b" images="2,3">
```
```js
JS:
a.images = 2;
a.images = [2,3];
```

[<kbd><img src="../examples/snapshots/images.jpg" width="300"></kbd>](../examples/images.html)




## Wire-frame

A [wire-frame model](https://en.wikipedia.org/wiki/Wire-frame_model) is an object which is visualized with lines. These lines are most often edges of the object's shape. Suica implements wire-frame models as a mode &ndash; i.e. an object can be switched to wire-frame mode with the `wireframe` property.

Only objects with edges have wireframe mode &ndash; [`square`](objects.md#square), [`circle`](objects.md#circle), [`polygon`](objects.md#polygon), [`cube`](objects.md#cube), [`prism`](objects.md#prism) and [`pyramid`](objects.md#pyramid).

#### wireframe
```html
HTML:
<𝑜𝑏𝑗𝑒𝑐𝑡 wireframe>
<𝑜𝑏𝑗𝑒𝑐𝑡 wireframe="𝑡𝑟𝑢𝑒/𝑓𝑎𝑙𝑠𝑒">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡𝘕𝘢𝘮𝘦.wireframe = 𝑡𝑟𝑢𝑒/𝑓𝑎𝑙𝑠𝑒;
```

Property. Defines whether to visualize an object as wireframe. By default, objects in Suica are drawn with solid surfaces. The property `wireframe` is used to change surface visualization into wireframe mode &ndash; i.e. only edges are drawn. Values *yes* and *1* are considered `true`, values *no* and *0* are considered `false`. In HTML the value of `wireframe` can be omitted and this assumes it is `true`.

```html
HTML:
<cube size="30" wireframe>
<cube size="30" wireframe="true">
```
```js
JS:
a = cube( [0,0,0], 30);
a.wireframe = true;
```


---

May, 2022