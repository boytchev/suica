---
title: Suica User Guide
description: [A short guide through Suica features]
---
# Table of contents

- [About](#about) [<small> [Home](../README.md) | [License](../LICENSE) </small>] 
- [Suica canvas](#suica-canvas) [<small> [&lt;suica&gt;](#tag-suica) | [background](#background) | [orientation](#orientation) | [proactive](#proactive) </small>] 
    - [Helpers](#helpers) [<small> [oxyz](#oxyz) | [demo](#demo) | [allObjects](#allobjects) </small>]
    - [Cameras](#cameras) [<small> [perspective](#perspective-camera) | [orthographic](#orthographic-camera) | [full screen](#full-screen-camera) | [full window](#full-window-camera)  | [stereo](#stereo-camera) | [anaglyph](#anaglyph-camera) | [vr](#vr-camera) | [lookAt](#lookat) </small>] 
- [Objects](#objects)
    - [Definition](#definition) [<small> [position](#position-center-x-y-z) | [size](#size-size-width-height-depth) | [spin](#spin) | [color](#color) | [wireframe](#wireframe) | [image](#image) | [images](#images) | [clone](#clone) | [style](#style) </small>] 
	- [Common 2D objects](#common-2d-objects) [<small> [point](#point) | [line](#line) | [square](#square) | [circle](#circle) | [polygon](#polygon) </small>]
	- [Common 3D objects](#common-3d-objects) [<small> [cube](#cube) | [sphere](#sphere) | [cylinder](#cylinder) | [prism](#prism) | [cone](#cone) | [pyramid](#pyramid) </small>]
	- [Advanced 3D objects](#advanced-3d-objects) [<small> [group](#group) | [tube](#tube) </small>]
- [Drawings](user-guide-drawings.md)
- [Events](user-guide-events.md)
    - [Event workflow](#event-workflow) [<small> [listeners](#event-listeners) | [handlers](#event-handlers) | [proactive](#proactive-events) </small> ]
	- [Event data](#event-data) [<small> [findPosition](#findposition) | [findObject](#findobject) | [findObjects](#findobjects) </small>]
- [Functions](#functions) [<small> [radians](#radians) | [degrees](#degrees) | [random](#random) | [style](#style-1) | [spline](#spline) </small>]
- [References](#references) [<small> [reference](reference-guide.md) | [examples](examples.md) | [images](#available-images) | [libraries](#external-libraries) | [Suica 1](#suica-1)  | [tester](#tester) | [Q&A](#questions-and-answers) </small>] 


## About

**Suica is a JavaScript library** that provides a minimalistic approach to
mobile 3D graphics. Here is a minimal example of a rotating cube in the browser
(*click on the image to run the example*):

[<kbd><img src="../examples/snapshots/minimal-example.jpg" width="300"></kbd>](../examples/minimal-example.html)

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

Tag and variable. Defines a 3D drawing canvas. `<suica>` is the main Suica tag.
All other Suica-specific HTML tags are recognized only if used between `<suica>`
and `</suica>`

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
[<kbd><img src="../examples/snapshots/tag-suica.jpg" width="300"></kbd>](../examples/tag-suica.html)

The orientation of the coordinate system is set via attribute `orientation`.
More information is available in section [Coordinate system](#coordinate-system).

The global variable `suica` is set to reference the last created Suica instance.
It is used to access the Suica canvas if it has no name.



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

[<kbd><img src="../examples/snapshots/background.jpg" width="300"></kbd>](../examples/background.html)




### Orientation

Property. Controls how objects [positions](#position) and [sizes](#size) are
defined. Suica uses Cartesian 3D coordinate system. The tag `<suica>` accepts
attribute `orientation` with values `XYZ`, `XZY`, `YXZ`, `YZX`, `ZXY` and `ZYX`
(these are all possible permutations of the letters *X*, *Y* and *Z*. Each
orientation defines a coordinate system in the following manner:

- the first axis points to the right
- the second axis points upwards
- the third axis point towards the viewer

<img src="images/coordinate-system-orientation.png">

The default orientation in Suica is *XYZ*. All examples in this user guide use
this orientation, unless explicitely stated that other orientations are used.

```html
HTML:
<suica orientation="xyz">
```
[<kbd><img src="../examples/snapshots/suica-orientation.jpg" width="300"></kbd>](../examples/suica-orientation.html)




### Proactive

Property and command. Turns on proactive mode for mouse motion events. These
events occur when the mouse pointer is moved over an object, or when an object
is moved under the mouse pointer. For details see section [Proactive events](#proactive-events).




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

[<kbd><img src="../examples/snapshots/oxyz.jpg" width="300"></kbd>](../examples/oxyz.html)



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

[<kbd><img src="../examples/snapshots/demo.jpg" width="300"></kbd>](../examples/demo.html)



### allObjects

Function. Get a list of all graphical objects in a Suica canvas. The result of
the function is an array of these objects.

```js
JS:
list = allObjects( );
```

[<kbd><img src="../examples/snapshots/allobjects.jpg" width="300"></kbd>](../examples/allobjects.html)





### Cameras

A camera in Suica is a colelctive term that refers to how a scene is visualized
on the screen. A camera may define a projection (perspective or orthographic),
canvas span (normal span, full-window or full-screen) and stereoscopic mode
(mono, stereo, anaglyph and vr). Some cameras can be combined, others are
mutually exclusive. The following illustration shows available camera
combinations.

<img src="images/cameras.png">




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

[<kbd><img src="../examples/snapshots/camera-perspective.jpg" width="300"></kbd>](../examples/camera-perspective.html)



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

[<kbd><img src="../examples/snapshots/camera-orthographic.jpg" width="300"></kbd>](../examples/camera-orthographic.html)



#### Full screen camera

Property and command. Allows Suica to go into full screen mode. Using full
screen camera adds a button at the bottom of the canvas. If the button says
`[ENTER FULLSCREEN]` the user must click it to enter full screen mode. If full
screen is not supported, the button says `[FULLSCREEN NOT SUPPORTED]`. 

```html
HTML:
<suica fullscreen>
```
```js
JS:
fullScreen( );
```

[<kbd><img src="../examples/snapshots/camera-fullscreen.jpg" width="300"></kbd>](../examples/camera-fullscreen.html)

_**Note.** To exit full screen mode press `Esc` or follow the browser's
instructions._



#### Full window camera

Property and command. Allows Suica to go into full window mode. 

```html
HTML:
<suica fullwindow>
```
```js
JS:
fullWindow( );
```

[<kbd><img src="../examples/snapshots/camera-fullwindow.jpg" width="300"></kbd>](../examples/camera-fullwindow.html)




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

[<kbd><img src="../examples/snapshots/camera-stereo-wall-eyed.jpg" width="300"></kbd>](../examples/camera-stereo-wall-eyed.html)
[<kbd><img src="../examples/snapshots/camera-stereo-cross-eyed.jpg" width="300"></kbd>](../examples/camera-stereo-cross-eyed.html)



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

[<kbd><img src="../examples/snapshots/camera-anaglyph.jpg" width="300"></kbd>](../examples/camera-anaglyph.html)




#### VR camera

Property and command. Allows Suica to go into emmersive 3D environment. Using a
VR camera adds a button at the bottom of the canvas. If the button says
`[ENTER VR]` the user must click it to enter VR mode. If VR is not supported,
the button says `[VR NOT SUPPORTED]`. 

```html
HTML:
<suica vr>
```
```js
JS:
vr( );
```

[<kbd><img src="../examples/snapshots/camera-vr.jpg" width="300"></kbd>](../examples/camera-vr.html)

_**Note.** Currently the VR camera does not provide access to the controllers._

_**Note.** VR mode is not supported in local HTML files._




#### lookAt

Command. Defines the viewing position and orientation. LookAt takes three
parameters: *from* is a 3D location for the viewing position (i.e. the camera is
placed there), *to* is a 3D position of the viewing target (i.e. the came is
facing it), and *up* is a vector defining the head orientation (i.e. the
direction that is considered upwards). By default the target position is (0,0,0)
and the up direction corresponds to the up axis of the coordinate system.

```html
HTML:
<lookat from="100,10,50">
<lookat from="100,10,50" to="0,0,10" up="1,0,0">
```
```js
JS:
lookAt( [100,10,50] );
lookAt( [100,10,50], [0,0,10], [1,0,0] );
```

[<kbd><img src="../examples/snapshots/lookat.jpg" width="300"></kbd>](../examples/lookat.html)

The command [demo](#demo) can be simulated and enriched by *lookAt* &ndash; i.e.
adding dynamic change of distance and elevation to the default rotation.

[<kbd><img src="../examples/snapshots/lookat-demo.jpg" width="300"></kbd>](../examples/lookat-demo.html)


To implement a navigation (walking or flying) in a 3D scene the viewing position
must be modified in the animation loop.

[<kbd><img src="../examples/snapshots/lookat-navigation.jpg" width="300"></kbd>](../examples/lookat-navigation.html)
[<kbd><img src="../examples/snapshots/lookat-navigation-vr.jpg" width="300"></kbd>](../examples/lookat-navigation-vr.html)





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

[<kbd><img src="../examples/snapshots/object-html.jpg" width="300"></kbd>](../examples/object-html.html)
[<kbd><img src="../examples/snapshots/object-js.jpg" width="300"></kbd>](../examples/object-js.html)

Most Suica objects share the same basic properties, like position, orientation,
size, color and so on. Some objects have specific properties.

Properties related to events are described in section [Events](#events).


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
[<kbd><img src="../examples/snapshots/object-as-position.jpg" width="300"></kbd>](../examples/object-as-position.html)

#### Size (size, width, height, depth)

Properties. The size of a Suica object in 3D space is maintained via the
property `size` that defines how big is the objects along its dimensions. If
size is a single number, that the object if uniformly big. If object's size
varies than the property is an array of three numbers for object's *width*,
*height* and *depth*. The order *width*, *height* and *depth* is fixed and does
not depend on the [orientation of the coordinate system](#coordinate-system).
Thus height corresponds to the axis that is upwards.

<img src="images/sizes.png">

Flat objects like squares and circles have no depth.

_**Note <small><sup>1</sup></small>**: Omitting the depth property of a 3D object makes its depth the same
as its width. This maintains uniform horizontal size._

_**Note <small><sup>2</sup></small>**: The object [line](#line) has no size,
width, height and depth._

_**Note <small><sup>3</sup></small>**: The object [group](#group) uses size as
a scale factor, npt as an actual size._

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


[<kbd><img src="../examples/snapshots/sizes.jpg" width="300"></kbd>](../examples/sizes.html)
[<kbd><img src="../examples/snapshots/sizes-orientation.jpg" width="300"></kbd>](../examples/sizes-orientation.html)


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

#### Spin

Property. Defines the rotation of an object in respect to its own axes. The
value of `spin` is either an angle or an array of up to three angles [`spinH`, `spinV`, `spinT`].
All angles are measured in degrees.

Angle *spinH* (*H* from *horizontal*) defines horizontal rotation around the
global vertical axis. Angle *spinV* (*V* from *vertical*) define vertical
rotation away from the vertical axis. Angle *spinT* (*T* from *torsion*) defines
rotation of the object around it own vertical axis..

<img src="images/spin.png">

The spin is independent on the orientation of the coordinate system. However,
due to the default orientation of flat and non-flat objects, orientation along
coordinate system axes differ. For example, if a square has a spin [&alpha;, &beta;, &gamma;],
a pyramid on that square should have spin [&alpha;, &beta;+90, &gamma;].

[<kbd><img src="../examples/snapshots/spin.jpg" width="300"></kbd>](../examples/spin.html)
[<kbd><img src="../examples/snapshots/spin-angles.jpg" width="300"></kbd>](../examples/spin-angles.html)

[<kbd><img src="../examples/snapshots/spin-orientation.jpg" width="300"></kbd>](../examples/spin-orientation.html)


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

_**Note**: Setting the color of object [group](#group) sets it to all its objects._


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
texture image. For more information of how to generate a drawing instead of
loading an image file see section [Drawings](#drawings). 

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

Due to a security mechanism in browsers &ndash; [Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)
(SOP) and [Cross-origin resource sharing](https://developer.mozilla.org/en-US/docs/Glossary/CORS) (CORS),
a file can be used as image only if it is located in the same online domain;
or the image host allows cross-origin requests. An image file can be used in
these cases:

- the image file is in the same domain as the Suica file and is accessed by
`http://` or `https://` protocols
- the image file is hosted on a server that allows anonymous access to images
- the image file is accessed through a [local host](https://en.wikipedia.org/wiki/Localhost) from `http://localhost`
- the image is encoded in the URL itself as [Data URI/URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) from `data:` scheme
- CORS is disabled in the browser configuration (not recommended)
- an old SOP-less and CORS-less browser is used (not recommended)

For online tools to generate Data URI from images see section
[External libraries](#external-libraries).

#### Images

Property. Defines the number of copies of a drawing or image across the surface
of an object. For more information of how to generate a drawing or use an image
see section [Drawings](#idrawings).

If the value of *images* is a number, it defines the number of copies in both
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



#### Style

Method. Sets a group of properties of an object. The properties are defined as a
set of *name:value* pairs. New, custom user-defined properties are allowed. 
As `style` return the same object, styling can be chained.

```js
JS:
sphere().style( {x:15, size:20, color:'peachpuff'} );
sphere().style( {x:15} ).style( {size:20} ).style( {color:'peachpuff'} );
```

[<kbd><img src="../examples/snapshots/style.jpg" width="300"></kbd>](../examples/style.html)

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
`size`, `color`, `image`, `images` and `clone`. By default a point is drawn as a small cirlce, but
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

[<kbd><img src="../examples/snapshots/point.jpg" width="300"></kbd>](../examples/point.html)&emsp;[<kbd><img src="../examples/snapshots/point-cloud.jpg" width="300"></kbd>](../examples/point-cloud.html)


### Line

Object. Represents a straight segment. Its properties are `center` (or `from`),
`to`, `color`, `image`, `images` and `clone`. The properties `center` and `from` are synonyms and
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

[<kbd><img src="../examples/snapshots/line.jpg" width="300"></kbd>](../examples/line.html)

_**Note**: Lines have no properties x, y, z, size, width, height and depth._


### Square

Object. Represents a regular square or a rectangle. Its properties are
`center` (or `x`, `y` and `z`), `size` (or `width` and `height`), `color`, `spin`, 
`wireframe`, `image`, `images` and `clone`. 

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



### Circle

Object. Represents a circle or an ellipse. Its properties are `center` (or `x`,
`y` and `z`), `size` (or `width` and `height`), `color`, `spin`, `wireframe`,
`image`, `images` and `clone`. 

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



### Polygon

Object. Represents a regular polygon or an elliptical polygon. Its properties
are `count`, `center` (or `x`, `y` and `z`), `size` (or `width` and `height`),
`color`, `spin`, `wireframe`, `image`, `images` and `clone`. The property `count` defines
the number of sides of the polygon.

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




## Advanced 3D objects

The advanced 3D objects are constructed from other objects.


### Group

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

Function. Sets a group of properties of an object. The properties are note
necessarily Suica properties.

```js
JS:
style( sphere(), {x:15, size:20, color:'peachpuff'} );
```

### Spline

Function. Implements [splines](https://en.wikipedia.org/wiki/Spline_(mathematics))
by defining a function that for generating smoothly varying values. The first
parameter of `spline` is an array of points. The result is a function *f(u)* 
where *u* &isin; [0,1]. The result of *f(u)* is a point along the curve where
*u*=0 corresponds to the beginning of the curve, *u*=1 corresponds to the end
of the curve and intermediate values of *u* correspond to intermediate points
on the curve.

<img src="images/spline.png">

```html
HTML:
<spline id="s" src="0,0,0; 100,0,0; 0,100,0">
```

```js
JS:
s = spline( [[0,0,0], [100,0,0], [0,100,0]] );

a = s(0);   // beginning
b = s(0.5); // middle
c = s(1);   // end
```

[<kbd><img src="../examples/snapshots/spline.jpg" width="300"></kbd>](../examples/spline.html)

Typically a spline is used to define a curve in the space and get coordinates of
points on this curve. However, in Suica splines can be used to smooth any set of
numerical values, like colors or sizes.

[<kbd><img src="../examples/snapshots/spline-color.jpg" width="300"></kbd>](../examples/spline-color.html)
[<kbd><img src="../examples/snapshots/spline-size.jpg" width="300"></kbd>](../examples/spline-size.html)

Splines have two additional parameters &ndash; `closed` and `interpolating`.

If parameter *closed* is *true* the spline curve is closed, i.e. the last point is
connected back to the first point. This is used to define smooth loops. If
*closed* is *false*, then the line is not closed. By default *closed* is *false*.

When a spline is defined in HTML, *close* can be set either by `close` attribute,
or by `open` attribute. If the attribute *close* exist without value, or if its
value is *yes*, *true* or *1*, the spline is closed. If the attribute *open*
exist without value, or if its value is *yes*, *true* or *1*, the spline is open.

```js
JS:
s = spline( [...], true );
```

```html
HTML:
<spline id="s" src="..." closed>
<spline id="s" src="..." closed="true">
<spline id="s" src="..." open="false">
```

The parameter *interpolating* defines the style of the curve. If it is *true*,
the spline curve goes through the points (i.e. it interpolates them). If it is
*false*, the spline curve goes near the points as if it is pulled by them (i.e.
it approximates the points). Approximation splines tend to appear smaller and
smoother.

When a spline is defined in HTML, *interpolating* can be set either by
`interpolating` attribute, or by `apploximating` attribute, similar to how
attributes *closed* and *open* are used.

```js
JS:
s = spline( [...], true, true );
```

```html
HTML:
<spline id="s" src="..." interpolating>
<spline id="s" src="..." interpolating="true">
<spline id="s" src="..." apploximating="false">
```

[<kbd><img src="../examples/snapshots/spline-interpolating.jpg" width="300"></kbd>](../examples/spline-interpolating.html)
[<kbd><img src="../examples/snapshots/spline-approximating.jpg" width="300"></kbd>](../examples/spline-approximating.html)


Instead of an array of points, `spline` can also accept a function, although
technically it is not a spline any more. This function should have 1, 2 or 3
parameters. The first parameter is compusory and it *u* &isin; [0,1]. The other
two parameters are optional and they are function-specific. The result of this
function must be an array of 3 or 4 values, corresponding to a point along the
curve defined by this function.

```js
JS:
function flower( u, k=3, n=2 )
{
	u = n*Math.PI*u;
	return [
		Math.cos(u) + Math.cos(k*u), // x
		Math.sin(u) - Math.sin(k*u), // y
		0                            // z
	];
}

s = spline( flower, 2 );
```
	
If a function is passed to a spline in HTML form, it is with only one patameter:

```html
HTML:
<spline id="s" src="flower">
```
	
[<kbd><img src="../examples/snapshots/spline-function.jpg" width="300"></kbd>](../examples/spline-function.html)
[<kbd><img src="../examples/snapshots/spline-html.jpg" width="300"></kbd>](../examples/spline-html.html)






## References

### Reference guide

A reference guide and code templates are collected [here](reference-guide.md)

### List of examples

All examples are collected in a single page [here](examples.md)

### Available images

This is a list of available images in Suica. They can be accessed from URL
`https://boytchev.github.io/suica/textures/` e.g. `https://boytchev.github.io/suica/textures/flower.jpg`.

<kbd>
	<img width="128" src="../textures/flower.jpg">
	<br>
	flower.jpg
</kbd>
<kbd>
	<img width="128" src="../textures/blobs.jpg">
	<br>
	blobs.jpg
</kbd>
<kbd>
	<img width="128" src="../textures/tile.png">
	<br>
	tile.png
</kbd>
<kbd>
	<img width="128" src="../textures/grid.png">
	<br>
	grid.png
</kbd>

### External libraries

Suica uses several external libraries.

- [**Three.js** &ndash; JavaScript 3D Library](https://threejs.org/) provides the graphical backbone of Suica. It
is used at runtime, so `three.min.js` file must be present alongside `suica.js`
or `suica.min.js`.

- [**JSMin** &ndash; JavaScript Minification Filter](https://github.com/douglascrockford/JSMin) is
used in the development process to generate minified `suica.min.js` from the
original `suica.js` file. 

Other tools and site that might be usful to Suica users:

- [**EasyGIF** &ndash; Image to Data URI converter](https://ezgif.com/image-to-datauri)
can convert image to Data URI in order to avoid SOP and CORS issues. There are
many other web services for such conversion, like [Site24x7](https://www.site24x7.com/tools/image-to-datauri.html),
[Online Image Tools](https://onlineimagetools.com/convert-image-to-data-uri),
[Online JPG Tools](https://onlinejpgtools.com/convert-jpg-to-data-uri),
[webSemantics](https://websemantics.uk/tools/image-to-data-uri-converter/),
[Base64 Image](https://www.base64-image.de/) and others.

### Tester

A rudimentery tester for Suica is availble [here](../test/test.html).
It runs predefined test cases and compares the produced images.

It reports the percentage of match:

- A match of 90% or more is considered normal.
- A match between 70% and 90% is most likely due to some rendering fluctuations
and a visual inspection is recommended.
- A match below 70% most likely indicates a problem and a visula inspection is
required.

Because timings cannot be set absolutely, some test cases may not produce the
expected result. In this case run the tester another time to check whether the
result is consistent.




### Suica 1

The previous version of Suica is [Suica 1](https://github.com/boytchev/Suica-1).
It uses WebGL directly (i.e. without Three.js). It is made available as a legacy.
The latest version is Suica 1.12. Suica 1 is not maintained any more.


### Questions and answers
- [How to change the attribute of an object created in HTML?](#how-to-change-the-attribute-of-an-object-created-in-html)
- [How to change the center of an object in respect to the object?](#how-to-change-the-center-of-an-object-in-respect-to-the-object)

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

[<kbd><img src="../examples/snapshots/qa-property-modification.jpg" width="300"></kbd>](../examples/qa-property-modification.html)
[<kbd><img src="../examples/snapshots/qa-attribute-modification.jpg" width="300"></kbd>](../examples/qa-attribute-modification.html)
[<kbd><img src="../examples/snapshots/qa-attribute-modification-button.jpg" width="300"></kbd>](../examples/qa-attribute-modification-button.html)



#### How to change the center of an object in respect to the object?

The center of an object is important point as translation, scaling and rotation
is done in respect to the center. To define a custom center of an object it can
be put in a group. Then the center of the group can be used instead of a custom
object center.

<img src="images/custom-center.png">

```js
JS:
p = group( pyramid([0,0,30]) );
p.spin = [0,45];
```

[<kbd><img src="../examples/snapshots/qa-custom-center.jpg" width="300"></kbd>](../examples/qa-custom-center.html)


---

May, 2022