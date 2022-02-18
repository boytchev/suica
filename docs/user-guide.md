# <img src="../logo.min.png" height="40" style="position:relative; top:7px;"/> Suica User Guide

## Table of contents

- [About](#about) [<small> [Home](../README.md) | [License](../LICENSE) </small>] 
- [Suica canvas](#suica-canvas) [<small> [&lt;suica&gt;](#tag-suica) | [background](#background) | [orientation](#orientation) | [onTime](#ontime) </small>] 
    - [Helpers](#helpers) [<small> [oxyz](#oxyz) | [demo](#demo) </small>]
    - [Cameras](#cameras) [<small> [perspective](#perspective-camera) | [orthographic](#orthographic-camera) | [stereo](#stereo-camera) | [anaglyph](#anaglyph-camera) </small>] 
- [Objects](#objects)
    - [Definition](#definition) [<small> [position](#position-center-x-y-z) | [size](#size-size-width-height-depth) | [orientation](#orientation-1) | [color](#color) | [wireframe](#wireframe) | [image](#image) | [clone](#clone)  | [style](#style) </small>] 
	- [Common 2D objects](#common-2d-objects) [<small> [point](#point) | [line](#line) | [square](#square) | [circle](#circle) | [polygon](#polygon) </small>]
	- [Common 3D objects](#common-3d-objects) [<small> [cube](#cube) | [sphere](#sphere) | [cylinder](#cylinder) | [prism](#prism) | [cone](#cone) | [pyramid](#pyramid) </small>]
- [Images and drawings](#images-and-drawings)
- [Functions](#functions) [<small> [radians](#radians) | [degrees](#degrees) | [random](#random) | [style](#style-1) </small>]
- [References](#references) [<small> [reference](reference-guide.md) | [examples](examples.md) | [libraries](#external-libraries) | [Q&A](#questions-and-answers) </small>] 


## About

**Suica is a JavaScript library** that provides a minimalistic approach to
mobile 3D graphics. Here is a minimal example of a rotating cube in the browser
(*click on the image to run the example*):

[<kbd><img src="../examples/snapshots/minimal-example.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/minimal-example.html)

The complete code of this example is:

```html
<!DOCTYPE html>
<script src="suica.js"></script>
<suica>
	<cube>
	<demo>
</suica>
```


Suica is built upon these principles:

- **MINIMAL**<br>Less is more ([details](https://en.wikipedia.org/wiki/Minimalism_(computing))). 

- **DUAL**<br>Objects can be defined as HTML tags or in JS code, and their
properties are defined as tag attributes or function parameters. Using HTML is
a declarative create-and-forget approach, while JS is more suitable for scenes
that require continuous changes.

- **OPTIONAL**<br>All object properties are optional and may be skipped. Due to the
nature of the HTML syntax tag attributes may have any order. However, the order
of function parameters is fixed and only the trailing parameters may be skipped.

- **UNIFORM**<br>Properties are consistent across all objects that share
them. For example, object color is defined and changed in the same way for
points, cubes and spheres.

Browsers have a standard way of reaction on non-standard web pages (e.g. missing
closing tags, unregistered custom tags, etc). This is heavily used in all Suica
examples. Tools that validate HTML pages may complain about Suica HTML code.

_**Note.** Three.js and other libraries are included in this repository to safeguard
against incompatibilities with future versions. They are not a part of Suica._


## Suica canvas

Suica is distributed as `suica.js` or `suica.min.js` file and is loaded via the
`<script>` tag. Once loaded, the library will look for HTML tags `<suica>` and
use them as drawing canvases for 3D graphics. Suica does not use JS modules in
order to allow easy local development.


### Tag &lt;suica&gt;

Tag. Defines a 3D drawing canvas. `<suica>` is the main Suica tag is . All other
Suica-specific HTML tags are recognized only if used between `<suica>` and
`</suica>`

```html
<suica>
   <!-- all other Suica tags appear here-->
</suica>
```

The size of the canvas is set via attributes `width` and `height`. Sizes are
measured in pixels. The default size is 500&times;300 pixels. Alternatively,
sizes can be set as CSS properties (either inlined or not), which may use any
CSS unit.

Example of creating drawing canvases with different sizes:

```html
<suica width="400" height="300">
<suica style="width:15em; height:300px;">
```
[<kbd><img src="../examples/snapshots/tag-suica.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/tag-suica.html)

The orientation of the coordinate system is set via attribute `orientation`.
More information is available in section [Coordinate system](#coordinate-system).


### Background

Property and command. Defines the background color of the
Suica canvas. It can be set as HTML attribute, CSS style (both inlined and
non-inlined), HTML tag and JS function. By default the background color is
[white smoke](https://www.color-hex.com/color/f5f5f5).

```html
HTML/CSS:
<suica background="linen">
<suica style="background: linen;">
<background color="linen">
```
```js
JS:
background( 'linen' );
```

[<kbd><img src="../examples/snapshots/background.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/background.html)




### Orientation

Property. Controls how objects [positions](#position) and [sizes](#size) are
defined. Suica uses Cartesian 3D coordinate system. The tag `<suica>` accepts
attribute `orientation` with values `XYZ`, `XZY`, `YXZ`, `YZX`, `ZXY` and `ZYX`
(these are all possible permutations of the letters *X*, *Y* and *Z*. Each
orientation defines a coordinate system in the following manner:

- the first axis points to the right
- the second axis points upwards
- the third axis point towards the viewer

<img src="../examples/images/coordinate-system-orientation.png">

The default orientation in Suica is *XYZ*. All examples in this user guide use
this orientation, unless explicitely stated that other orientations are used.

```html
HTML:
<suica orientation="xyz">
```
[<kbd><img src="../examples/snapshots/suica-orientation.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/suica-orientation.html)




### onTime

Command. Supports frame-based animation. The animation approach of
Suica is to react every time when the browser is ready to update the image on
the canvas. The command `onTime` registers a user-defined JS function that
adjusts the 3D scene whenever a new frame is required. 

```html
HTML:
<ontime src="loop">
```
```js
JS:
onTime( loop ); // register a new ontime function
onTime( );      // unregister the current ontime function
```

This user-defined function has two parameters &ndash; elapsed times since the
start of Suica *t* and since the previous frame *td*. Both times are measured in
seconds.

```js
JS:
function loop( t, dt )
{
   // code that sets objects properties 
   // depending on times t and dt
}
```

[<kbd><img src="../examples/snapshots/ontime.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/ontime.html)




### Helpers

Helpers are functions that provide supplimentary functionality. They are
supposed to aid fast prototyping.


#### Oxyz

Command. Vizualizes the coordinate system. The coordinate system is an abstract
object and it has no graphical representation. The command `oxyz`, however,
visualizes the system as three segments with custom size and color. By default
the size is 30 and the color is [black](https://www.color-hex.com/color/000000).

```html
HTML:
<oxyz size="30" color="black">
```
```js
JS:
oxyz( 30, 'black' );
```

[<kbd><img src="../examples/snapshots/oxyz.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/oxyz.html)



### Demo

Command. Turns on *demo mode* &ndash; atomatic scene rotation. The
parameters define the viewpoint position as distance from the origin of the
the coordinate system and altitude. By default the distance is 100 and the
altitude is 30.

```html
HTML:
<demo distance="100" altitude="30">
```
```js
JS:
demo( 100, 30 );
```

[<kbd><img src="../examples/snapshots/demo.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/demo.html)





### Cameras

#### Perspective camera

Property and command. Sets a perspective camera projection. Objects further
away appear smaller. The perspective is defined by three numbers &ndash; *near*
distance , *far* distance  and *field of view* angle.

The *near* and *far* distances (by default 1 and 1000) define the depth span of
the viewing area. Objects and part of objects outside this area are not drawn.
If *near* and *far* are too close, this may truncate some objects; it they are
too far away, this may reduce the precision of overlapping distant objects.

The *field of view* angle is measured in degrees (by default 40&deg;) and
defines the vertical span of the viewing area. Smaller angles make objects
appear bigger and reduce the perspective effect; larger angles make objects
appear smaller and increases the perspective effect.

A valid perspective requires that 0<*near*<*far* and 0&deg;<*field of view*<180&deg;.

```html
HTML:
<suica perspective>
<suica perspective="1,1000,40">
```
```js
JS:
perspective( );
perspective( 1, 1000, 40 );
```

[<kbd><img src="../examples/snapshots/camera-perspective.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/camera-perspective.html)



#### Orthographic camera

Property and command. Sets an orthographic camera projection. Objects do not
change their visual size depending on how close or distant they are. The
orthographic camera is defined by two numbers &ndash; *near* and *far* distances.
By default they are 0 and 1000; and rhey define the depth span of the viewing
area. Objects and part of objects outside this area are not drawn. If *near* and
*far* are too close, this may truncate some objects; it they are too far away,
this may reduce the precision of overlapping distant objects.

A valid orthographic projection requires that 0&leq;*near*<*far*.

```html
HTML:
<suica orthographic>
<suica orthographic="0,1000">
```
```js
JS:
orthographic( );
orthographic( 0, 1000 );
```

[<kbd><img src="../examples/snapshots/camera-orthographic.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/camera-orthographic.html)



#### Stereo camera

Property and command. Sets a stereo camera projection. The scene is projected
twice &ndash; side-by-side, once for each of the eyes. The stereo effect is
controlled by *distance* parameter, which determines the simulated distance
between the eyes. By default it is 5. Values closer to 0 will decrease the
stereo effect.

Both positive and negative distances are allowed. Positive distances correspond
to wall-eyed viewing or vewing with a smartphone and low-end stereoscopic
glasses. Negative distances swap left and right images and correspond to
cross-eyed viewing.

```html
HTML:
<suica stereo>
<suica stereo="1">
<suica stereo="-1">
```
```js
JS:
stereo( );
stereo( 1 ); // wall-eyed
stereo( -1 ); // cross-eyed
```

[<kbd><img src="../examples/snapshots/camera-stereo-wall-eyed.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/camera-stereo-wall-eyed.html)
[<kbd><img src="../examples/snapshots/camera-stereo-cross-eyed.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/camera-stereo-cross-eyed.html)



#### Anaglyph camera

Property and command. Sets an [anaglyph](https://en.wikipedia.org/wiki/Anaglyph_3D)
camera projection. The scene is projected twice with different colors, suited for
red-cyan glasses. The anaglyph effect is controlled by *distance* parameter,
which determines the focal distance. By default it is 5. Smaller values will
increase the anaglyphic effect, larger values will decrease it.

```html
HTML:
<suica anaglyph>
<suica anaglyph="5">
```
```js
JS:
anaglyph( );
anaglyph( 5 );
```

[<kbd><img src="../examples/snapshots/camera-anaglyph.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/camera-anaglyph.html)







## Objects

This section describes the graphical objects in Suica.


### Definition

In Suica object may be created as HTML tag or via JavaScript function. Each
object has properties, however, they are all optional. In HTML the properties
are provided as tag attributes in no specific order. In JavaScript the
properties are provided as function parameters and the order is fixed.

```html
HTML:
<object attribute1="value1" properties2="value2" ...>
```
```js
JS:
object( value1, value2, ... );
```

Objects with names are created as JavaScript variables. In HTML the name is
taken from the `id` attribute. 

```html
HTML:
<point id="p" center="25,0,15">
```
```js
JS:
p = point( [25,0,15] );
```

[<kbd><img src="../examples/snapshots/object-html.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/object-html.html)
[<kbd><img src="../examples/snapshots/object-js.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/object-js.html)

Most Suica objects share the same basic properties, like position, orientation,
size, color and so on. Some objects have specific properties

#### Position (center, x, y, z)

Properties. Define the position of a Suica object in 3D space. Propery `center`
is an array of three numbers [*x*, *y*, *z*] for the *x*, *y* and *z*
coordinates (in this order). The actual visual position depends on the
orientation of the (coordinate system](#coordinate-system). All coordinates are
optional. Default values are 0.

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

There are alternative properties `x`, `y` and `z` that provide individual access
to the elements of the position. 

```html
HTML:
<point x="25">
```
```js
JS:
p = point( );
p.x = 25;
```

_**Note**: The object [line](#line) is an exception. It has `from` as synonym of
`center`, and it has no `x`, `y` and `z`._

An object as be passed as a center of another object. In this case its center
is used. 

```html
HTML:
<cubeFrame id="a" x="-20">
<cubeFrame id="b" x="20">
<line from="a" to="b">
```
```js
JS:
a = cubeFrame( [20,0,0] );
b = cubeFrame( [-20,0,0] );
line( a, b );
```
[<kbd><img src="../examples/snapshots/object-as-position.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/object-as-position.html)

#### Size (size, width, height, depth)

Properties. The size of a Suica object in 3D space is maintained via the
property `size` that defines how big is the objects along its dimensions. If
size is a single number, that the object if uniformly big. If object's size
varies than the property is an array of three numbers for object's *width*,
*height* and *depth*. The order *width*, *height* and *depth* is fixed and does
not depend on the [orientation of the coordinate system](#coordinate-system).
Thus height corresponds to the axis that is upwards.

<img src="../examples/images/sizes.png">

Flat objects like squares and circles have no depth.

_**Note <small><sup>1</sup></small>**: Omitting the depth property of a 3D object makes its depth the same
as its width. This maintains uniform horizontal size._

_**Note <small><sup>2</sup></small>**: The object [line](#line) has no size,
width, height and depth._

```html
HTML:
<cube size="25">
<cube size="25,10">
<cube size="25,10,15">
```
```js
JS:
cube( [0,0,0], 25 );
cube( [0,0,0], [25,10] );
cube( [0,0,0], [25,10,15] );
```


[<kbd><img src="../examples/snapshots/sizes.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/sizes.html)
[<kbd><img src="../examples/snapshots/sizes-orientation.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/sizes-orientation.html)


Alternative access to the size is with the properties `width`, `height` and
`depth`. 

```html
<cube size="3,15,40">
<cube width="3" height="15" depth="40">
```
```js
cube( [0,0,0], [3,15,40] );
a = cube( [0,0,0] );
a.width = 3;
a.height = 15;
a.depth = 40;
```

#### Orientation

TBD


#### Color

Property. Defines the color of a graphical object. Color in Suica can be
expressed in a variety of ways. The [RGB scheme](https://www.w3schools.com/colors/colors_rgb.asp) represents colors as three
components *red*, *green* and *blue*, while the
[HSL scheme](https://www.w3schools.com/colors/colors_hsl.asp) components are
*hue*, *saturation* and *lightness*.


| Context | Descriptive<br>name | Hexadecimal<br>number | Normalized<br>RGB array | RGB<br>function | HSL<br>function |
|---|:---:|:---:|:---:|:---:|:---:|
| | <small>[List of color names](https://www.w3schools.com/colors/colors_names.asp)</small>| *RRGGBB*<br><small>*RR*,*GG*,*BB* &isin; [00,FF]</small> | *r*,*g*,*b*<br><small>*r*,*g*,*b* &isin; [0,1]</small> | rgb(*r*,*g*,*b*)<br><small>*r*,*g*,*b* &isin; [0,255] | hsl(*h*,*s*,*l*)<br><small>*h* &isin; [0,360], *s*,*l* &isin; [0,100]</small> |
| Tag<br>attribute | [crimson](https://www.color-name.com/crimson.color) | 0xDC143C | 0.86,&nbsp;0.08,&nbsp;0.24 | rgb(&nbsp;220,&nbsp;20,&nbsp;60&nbsp;) | hsl(&nbsp;348,&nbsp;91,&nbsp;86&nbsp;) |
| CSS<br>property | crimson | #DC143C | | rgb( 220, 20, 60 ) | hsl( 348, 91, 86 ) |
| JS<br>code | "crimson" | 0xDC143C | [0.86,&nbsp;0.08,&nbsp;0.24] | rgb(&nbsp;220,&nbsp;20,&nbsp;60) | hsl(&nbsp;348,&nbsp;91,&nbsp;86) |


#### Wireframe

Property. Defines whether to visualize objects as wireframes. By default objects
in Suica are drawn with solid surfaces. The property `wireframe` is used to
change switch surface visualization into wireframe mode &ndash; i.e. only edges
are drawn.

To turn on wireframe mode set the property to `true`, `yes` or `1`. When used as
HTML attributes, the value may be omitted. To turn off wireframe mode set the
property to `false`, `no` or `0`.

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

_**Note**. Not all objects have wireframe mode._


#### Image

Property. Decorates object surface with an image. Images can be stamped onto
Suica object via the property `image`. The property accepts a drawing or a
texture image. For more information of how to generate a drawing or use an image
see section [Images and drawings](#images-and-drawings).

When an object has both `color` and `image`, the resulting color is the product
of the RGB normalized colors (i.e. components r,g,b&isin;[0,1]) of the color and
the image pixels. If the object color is [R,G,B] and the image color is [r,g,b],
then the combined color is [R,G,B]&times;[r,g,b] = [R&times;r,G&times;g,B&times;b].
The following tabel shows some combinations of colors:

| Object color | Image color | Resulting color |
|---|---|---|
| White<br><small>[1,1,1]</small> | Any<br><small>[r,g,b]</small> | Image color<br><small>[1,1,1]&times;[r,g,b] = [r,g,b]</small> |
| Black<br><small>[0,0,0]</small> | Any<br><small>[r,g,b]</small> | Black<br><small>[0,0,0]&times;[r,g,b] = [0,0,0]</small> |
| Any<br><small>[R,G,B]</small> | White<br><small>[1,1,1]</small> | Object color<br><small>[R,G,B]&times;[1,1,1] = [R,G,B]</small> |
| Any<br><small>[R,G,B]</small> | Black<br><small>[0,0,0]</small> | Black<br><small>[R,G,B]&times;[0,0,0] = [0,0,0]</small> |
| Red<br><small>[R,0,0]</small> | Any<br><small>[r,g,b]</small> | Only the red component of the image color<br><small>[1,0,0]&times;[r,g,b] = [r,0,0]</small> |
| Yellow<br><small>[1,1,0]</small> | Cyan<br><small>[0,1,1]</small> | Green<br><small>[1,1,0]&times;[0,1,1] = [0,1,0]</small> |

#### Clone

Readonly property. Generates a clone of the object. Whenever the value of `clone`
is retrieved, it is a clone of the object. Cloning is used to generate objects
from a single object-template.

```js
JS:
a = cube( [0,0,0], 25 );
b = a.clone;
```

[<kbd><img src="../examples/snapshots/clone.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/clone.html)

#### Style

Method. Sets a group of properties of an object. The properties are defined as a
set of *name:value* pairs. New, custom user-defined properties are allowed. 
As `style` return the same object, styling can be chained.

```js
JS:
sphere().style( {x:15, size:20, color:'peachpuff'} );
sphere().style( {x:15} ).style( {size:20} ).style( {color:'peachpuff'} );
```

[<kbd><img src="../examples/snapshots/style.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/style.html)

_**Note**. Style can also be used as a [function](#style-1)._




## Common 2D objects

The common 2D objects represents flat 1D and 2D shapes, like points, squares,
circles and so on. Their constructions requires to set just a few properties.
Some of the objects have framed variants, where only their edges are drawn with
lines.

_**Note:** The width of the lines is 1 pixel and this limitation is set in the
underlying technology._


### Point

Object. Represents a point. Its properties are `center` (or `x`, `y` and `z`),
`size`, `color`, `image` and `clone`. By default a point is drawn as a small cirlce, but
it can be changed with custom [drawing](#images-and-drawings).

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

[<kbd><img src="../examples/snapshots/point.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/point.html)&emsp;[<kbd><img src="../examples/snapshots/point-cloud.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/point-cloud.html)


### Line

Object. Represents a straight segment. Its properties are `center` (or `from`),
`to`, `color`, `image` and `clone`. The properties `center` and `from` are synonyms and
they set the starting point of the segment, while `to` sets the ending point. By
default a line is drawn as a solid line, but it can be changed with custom
[drawing](#images-and-drawings).

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

[<kbd><img src="../examples/snapshots/line.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/line.html)

_**Note**: Lines have no properties x, y, z, size, width, height and depth._


### Square

Object. Represents a regular square or a rectangle. Its properties are
`center` (or `x`, `y` and `z`), `size` (or `width` and `height`), `color`,
`wireframe`, `image` and `clone`. 

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

[<kbd><img src="../examples/snapshots/square.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/square.html)
[<kbd><img src="../examples/snapshots/square-rectangle.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/square-rectangle.html)



### Circle

Object. Represents a circle or an ellipse. Its properties are `center` (or `x`,
`y` and `z`), `size` (or `width` and `height`), `color`, `wireframe`, `image` and `clone`. 

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

[<kbd><img src="../examples/snapshots/circle.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/circle.html)
[<kbd><img src="../examples/snapshots/circle-ellipse.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/circle-ellipse.html)



### Polygon

Object. Represents a regular polygon or an elliptical polygon. Its properties
are `count`, `center` (or `x`, `y` and `z`), `size` (or `width` and `height`),
`color`, `wireframe`, `image` and `clone`. The property `count` defines the number of
sides of the polygon.

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

[<kbd><img src="../examples/snapshots/polygon.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/polygon.html)

_**Note:** Properties size, width and height refer to the polygon circumscribed
circle, rather than the polygon itself._




## Common 3D objects

The common 3D objects represents shapes, like cubes, spheres, and so on. Their
constructions requires to set just a few properties. Some of the objects have
framed variants, where only their edges are drawn with lines.

_**Note:** The width of the lines is 1 pixel and this limitation is set in the
underlying technology._

### Cube

Object. Represents a regular cube or a deformed cube (called *cuboid*).
Its properties are `center` (or `x`, `y` and `z`), `size` (or `width`, `height`
and `depth`), `color`, `wireframe`, `image` and `clone`. 

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

[<kbd><img src="../examples/snapshots/cube.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/cube.html)
[<kbd><img src="../examples/snapshots/cube-cuboid.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/cube-cuboid.html)



### Sphere

Object. Represents a regular sphere or a deformed sphere (spheroid). Its properties are `center` (or `x`, `y` and `z`), `size` (or `width`, `height`
and `depth`), `color`, `image` and `clone`. 

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

[<kbd><img src="../examples/snapshots/sphere.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/sphere.html)
[<kbd><img src="../examples/snapshots/sphere-spheroid.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/sphere-spheroid.html)



### Cylinder

Object. Represents a regular cylinder or a cylindroid (an elliptical cylinder).
Its properties are `center` (or `x`, `y` and `z`), `size` (or `width`, `height`
and `depth`), `color`, `image` and `clone`. 

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

[<kbd><img src="../examples/snapshots/cylinder.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/cylinder.html)
[<kbd><img src="../examples/snapshots/cylinder-cylindroid.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/cylinder-cylindroid.html)



### Prism

Object. Represents a regular prism or prismoid (an elliptical prism). Its
properties are `count`, `center` (or `x`, `y` and `z`), `size` (or `width`,
`height` and `depth`), `color`, `wireframe`, `image` and `clone`. The property `count`
defines the number of sides of the prism.

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

[<kbd><img src="../examples/snapshots/prism.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/prism.html)



### Cone

Object. Represents a regilar cone or conoid (an elliptical cone). Its properties
are `center` (or `x`, `y` and `z`), `size` (or `width`, `height` and `depth`),
`color`, `image` and `clone`. 

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

[<kbd><img src="../examples/snapshots/cone.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/cone.html)
[<kbd><img src="../examples/snapshots/cone-conoid.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/cone-conoid.html)



### Pyramid

Object. Represents a regular pyramid or a pyramoid (an elliptical pyramid). Its
properties are `count`, `center` (or `x`, `y` and `z`), `size` (or `width`,
`height` and `depth`), `color`, `wireframe`, `image` and `clone`. The property `count`
defines the number of sides of the pyramid.

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

[<kbd><img src="../examples/snapshots/pyramid.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/pyramid.html)




## Images and drawings

TBD

[<kbd><img src="../examples/snapshots/point-image.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/point-image.html)&emsp;[<kbd><img src="../examples/snapshots/cube-image.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/cube-image.html)



## Functions

### Radians

Function. Converts degrees into radians.

```js
JS:
rad = radians( 120 );
```

### Degrees

Function. Converts radians into degrees.

```js
JS:
deg = degrees( 3.14159 );
```

### Random

Function. Generates a pseudo-random floating-point number in a range or picks a random value from an array of values.

```js
JS:
a = random( 5, 10 ); // from 5 to 10
a = random( [1, 2, 3, 4] ); // from the list
```

### Style

Function. Sets a group of properties of an object. 

```js
JS:
style( sphere(), {x:15, size:20, color:'peachpuff'} );
```




## References

### Reference guide

A reference guide and code templates are collected [here](reference-guide.md)

### List of examples

All examples are collected in a single page [here](examples.md)

### External libraries

Suica uses several external libraries.

- [**Three.js** &ndash; JavaScript 3D Library](https://threejs.org/) provides the graphical backbone of Suica. It
is used at runtime, so `three.min.js` file must be present alongside `suica.js`
or `suica.min.js`.

- [**JSMin** &ndash; JavaScript Minification Filter](https://github.com/douglascrockford/JSMin) is
used in the development process to generate minified `suica.min.js` from the
original `suica.js` file. 


### Questions and answers

#### How to change the attribute of an object created in HTML?

The prefered way is to create the object with a name in attribute `id`. Suica
will create a global variable with that name, which can be modified. The
alternative way is to modify the attribute itself with a string value.

```html
HTML:
<cube id="a">
```
```js
JS:
// using object properties
a.size = 10;

// using tag attributes
cube = document.getElementsByTagName( 'cube' )[0];
cube.setAttribute( 'size', 10 );
```

[<kbd><img src="../examples/snapshots/qa-property-modification.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/qa-property-modification.html)
[<kbd><img src="../examples/snapshots/qa-attribute-modification.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/qa-attribute-modification.html)
[<kbd><img src="../examples/snapshots/qa-attribute-modification-button.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/qa-attribute-modification-button.html)


---

February, 2022