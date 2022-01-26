# Suica User Guide

## Table of contents

- [About](#about)
- [Activating Suica](#activating-suica)
	- [Tag &lt;suica&gt;](#tag-suica)
	- [Background color](#background-color)
	- [Coordinate system](#coordinate-system)
	- [Demo mode](#demo-mode)
	- [Animation loop](#animation-loop)
- [Geometrical Objects](#geometrical-objects)
	- [Point](#point)
- [References](#reference-table)
	- [Colors](#colors)
	- [Code templates](#code-templates)
	- [Cross-table](#cross-table)
	- [List of examples](examples/EXAMPLES.md)


## About

**Suica is a JavaScript library** that provides a minimalistic approach to
mobile 3D graphics. Although Suica uses a limited set of 3D functionality, it is
a quick and easy way to make 3D scenes and animations. Here is a minimal example
of a rotating cube in the browser (*click on the image to run the example*):

[<kbd><img src="examples/snapshots/minimal-example.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/minimal-example.html)

The complete code of this example is:

```html
<!DOCTYPE html>
<script src="suica.js"></script>
<suica>
	<cube>
	<demo>
</suica>
```

where `DOCTYPE` defines that the web page contains HTML5, `script` loads
Suica, `suica` creates the drawing canvas, `cube` adds a cube in it and
`demo` activates the continuous rotation.

_**Note**: Tools that check the validity of HTML in web pages should complain
about Suica examples, as the minimalistic approach requires a non-standard use
of HTML tags._




## Activating Suica

Suica is distributed as `suica.js` or `suica.min.js` file and is loaded via the
`<script>` tag. Once loaded, the library will look for the HTML tag `<suica>`
and use it as a drawing canvas for 3D graphics. 




### Tag &lt;suica&gt;

The tag `<suica>` is the main Suica tag. It defines the drawing canvas. All
other Suica-specific HTML tags are recognized only if used between `<suica>` and
`</suica>`

```html
<suica>
   :
</suica>
```

The size of the canvas is set via attributes `width` and `height`. Sizes are
measured in pixels. The default size is 500&times;300 pixels.

```html
<suica width="400" height="300">
```

Alternatively, sizes can be set as CSS properties (either inlined or not),
which may use any CSS unit:

```html
<suica style="width:15em; height:300px;">
```

Example of creating drawing canvases with different sizes.

[<kbd><img src="examples/snapshots/tag-suica.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/tag-suica.html)




### Background color

The background color of the drawing canvas can be set in many ways and the
color value itself can be represented in many ways ([see here for details](#colors)).
By default the background color is [WhiteSmoke](https://www.color-hex.com/color/f5f5f5).
When the canvas is created, its background color can be set via the attribute `background`:

```html
<suica background="linen">
```

Alternatively, CSS style can be used &ndash; via the property `background-color`
or just `background`:

```html
<suica style="background: linen;">

<suica style="background-color: linen;">
```

The background color can be set via the custom tag `<background>`:

```html
<background color="linen">
```

Finally, the background color can be set via the function `background`:

```html
background( 'linen' );
```

Example of setting the background color. The last canvas uses Javascript to
change dynamically the background color.

[<kbd><img src="examples/snapshots/background.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/background.html)




### Coordinate system

Suica uses Cartesian 3D coordinate system. The command *oxyz* draws the
coordinate system as a group of three segments. The parameters are *size* and
*color* of the segments. The default size is 30 and the default color is black.
The command is available as tag and function:

```html
<oxyz size="40" color="navy">
```

```javascript
oxyz( 40, 'navy' );
```

Example of drawing default and custom coordinate systems.

[<kbd><img src="examples/snapshots/oxyz.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/oxyz.html)




### Demo mode

The command `demo` turns on *demo mode*. In this mode the scene rotates
continuously. The parameters define the position of the viewer &ndash;
*distance* from the origin of the coordinate system and *altitude*. The default
distance is 100 and the default altitude is 30. The command is available as tag
and function:

```html
<demo distance="120">
```

```javascript
demo( 100, 0 );
```

Example of turning on demo mode &ndash; i.e. automatic rotation of the 3D scene.

[<kbd><img src="examples/snapshots/demo.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/demo.html)



### Animation loop

The animation approach of Suica is to react every time when the browser is ready
to update the image on the canvas. The command `onTime` registers a user-defined
function that adjust the 3D scene whenever a new frame is required.

The user-defined function may have two parameters &ndash; total elapsed time *t*
(since the start of Suica); and elapsed time since the previous frame *td*. Both
parameters provide time values measured in seconds.

The `onTime` command is available as tag and function:

```html
<ontime src="loop">
```

```javascript
onTime( loop );

function loop( t, dt ) {...}
```

_**Note**: To remove already registered function use the function without a
parameter: `ontime()`._

The following example uses `onTime` to show the elapsed time *t* and *&Delta;t*:

[<kbd><img src="examples/snapshots/ontime.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/ontime.html)






## Suica Objects

This section describes the graphical objects in Suica. All objects can be
created via HTML tags or withh Javascript function. The parameters of all
objects are optional &ndash; some default values are used when parameters
are not provided.

In HTML an object is created with:
```html
   <𝑜𝑏𝑗𝑒𝑐𝑡 𝑝𝑎𝑟𝑎𝑚1="𝑣𝑎𝑙𝑢𝑒1" 𝑝𝑎𝑟𝑎𝑚2="𝑣𝑎𝑙𝑢𝑒2" ...>
```

In Javascript the same objects is created with:

```js
   𝑜𝑏𝑗𝑒𝑐𝑡( 𝑣𝑎𝑙𝑢𝑒1, 𝑣𝑎𝑙𝑢𝑒2, ...);
```

When an HTML-ly created object is referenced, for example its properties are
modified in the animation loop, its name is given in the `id` property. Thus:

```html
   <point id="p" center="25,0,15">
```

is equivalent to:

```js
   p = point( [25,0,15] );
```



### Point

A *point* is a geometrical Suica object, which is drawn as a small cirlce. Its
main properties are:

- `center` &ndash; array of three numbers, coordinates in 3D space
- `x`, `y` and `z` &ndash; numbers for individual coordinates, used as alternative to *center*
- `size` &ndash; number, visual size of the point
- `color` &ndash; color of the point (see [colors](#colors))

The command `point` creates a point. 

In HTML a point is constructed by two alternative forms. Examples:

```html
   <point center="25,0,15" size="10" color="red">
   <point x="25" y="0" z="15" size="10" color="red">
```

In Javascript the same point is constructed by:

```js
   point( [25,0,15], 10, 'red' );
```

These are examples of creating a few points and a cloud of many points:

[<kbd><img src="examples/snapshots/point.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/point.html) [<kbd><img src="examples/snapshots/point-cloud.jpg" width="300"></kbd>](https://boytchev.github.io/suica/examples/point-cloud.html)


The additional properties of a point are:

- `visible` &ndash; *true* or *false* whether the point is drawn
- `image` &ndash; custom image that is used instead of the default circular shape

These properties can be set only in Javascript.



## Reference table


### Colors

Colors in Suica can be expressed in a variety of ways. The [RGB scheme](https://www.w3schools.com/colors/colors_rgb.asp) represents colors as three components *red*, *green* and *blue*, while the
[HSL scheme](https://www.w3schools.com/colors/colors_hsl.asp) components are
*hue*, *saturation* and *lightness*.


| Context | Descriptive<br>name | Hexadecimal<br>number | Normalized<br>RGB array | RGB<br>function | HSL<br>function |
|---|:---:|:---:|:---:|:---:|:---:|
| | <small>[List of color names](https://www.w3schools.com/colors/colors_names.asp)</small>| <small>𝑅𝑅,𝐺𝐺,𝐵𝐵 &isin; [00,FF]</small> | <small>𝑟,𝑔,𝑏 &isin; [0,1]</small> | <small>𝑟,𝑔,𝑏 &isin; [0,255] | <small>ℎ &isin; [0,360], 𝑠,𝑙 &isin; [0,100]</small> |
| Tag attribute | 𝑛𝑎𝑚𝑒 | 0x𝑅𝑅𝐺𝐺𝐵𝐵 | 𝑟,𝑔,𝑏 | rgb(𝑟,𝑔,𝑏) | hsl(ℎ,𝑠,𝑙) |
| CSS property | 𝑛𝑎𝑚𝑒 | #𝑅𝑅𝐺𝐺𝐵𝐵 | | rgb(𝑟,𝑔,𝑏) | hsl(ℎ,𝑠,𝑙)<br>hsl(ℎ,𝑠%,𝑙%) |
| JS code | '𝑛𝑎𝑚𝑒'<br>"𝑛𝑎𝑚𝑒" | 0x𝑅𝑅𝐺𝐺𝐵𝐵<br>'0x𝑅𝑅𝐺𝐺𝐵𝐵'<br>"0x𝑅𝑅𝐺𝐺𝐵𝐵" | [𝑟,𝑔,𝑏]<br>'𝑟,𝑔,𝑏'<br>"𝑟,𝑔,𝑏" | rgb(𝑟,𝑔,𝑏)<br>'rgb(𝑟,𝑔,𝑏)'<br>"rgb(𝑟,𝑔,𝑏)" | hsl(ℎ,𝑠,𝑙)<br>'hsl(ℎ,𝑠,𝑙)'<br>"hsl(ℎ,𝑠,𝑙)"<br>'hsl(ℎ,𝑠%,𝑙%)'<br>"hsl(ℎ,𝑠%,𝑙%)" |



### Code templates

**Tag &lt;suica&gt;** with attributes and inline style:

```html
<suica id="𝑠𝑡𝑟𝑖𝑛𝑔" width="𝑛𝑢𝑚𝑏𝑒𝑟" height="𝑛𝑢𝑚𝑏𝑒𝑟" background="𝑐𝑜𝑙𝑜𝑟">

<suica id="𝑠𝑡𝑟𝑖𝑛𝑔" style="width: 𝑐𝑠𝑠-𝑛𝑢𝑚𝑏𝑒𝑟; height: 𝑐𝑠𝑠-𝑛𝑢𝑚𝑏𝑒𝑟; background: 𝑐𝑜𝑙𝑜𝑟;">
```


**Background color** as attribute, inline style, normal style and function:
```html
<suica background="𝑐𝑜𝑙𝑜𝑟">

<suica style="background: 𝑐𝑜𝑙𝑜𝑟;">

<style>
   suica { background: 𝑐𝑜𝑙𝑜𝑟; }
</style>
<suica>
```
```js
background( 𝑐𝑜𝑙𝑜𝑟 );
```


**Coordinate system** as tag and function:
```html
<oxyz size="𝑛𝑢𝑚𝑏𝑒𝑟" color="𝑐𝑜𝑙𝑜𝑟">
```
```js
oxyz( 𝑠𝑖𝑧𝑒, 𝑐𝑜𝑙𝑜𝑟 );
```


**Demo mode** as tag and function:
```html
<demo distance="𝑛𝑢𝑚𝑏𝑒𝑟" altitude="𝑛𝑢𝑚𝑏𝑒𝑟">
```
```js
demo( 𝑑𝑖𝑠𝑡𝑎𝑛𝑐𝑒, 𝑎𝑙𝑡𝑖𝑡𝑢𝑑𝑒 );
```



**Animation loop** as tag and function:
```html
<ontime src="𝑛𝑎𝑚𝑒">
```
```js
onTime( 𝑛𝑎𝑚𝑒 );
```



**Animation loop function**:
```js
𝑛𝑎𝑚𝑒( 𝑡, 𝑑𝑡 );
```


**Point** as tag and function:
```html
<point id="𝑛𝑎𝑚𝑒" center="𝑥,𝑦,𝑧" size="𝑠𝑖𝑧𝑒" color="𝑐𝑜𝑙𝑜𝑟">
<point id="𝑛𝑎𝑚𝑒" x="𝑥" y="𝑦" z="𝑧" size="𝑠𝑖𝑧𝑒" color="𝑐𝑜𝑙𝑜𝑟">
```
```js
point(  [𝑥,𝑦,𝑧], 𝑠𝑖𝑧𝑒, 𝑐𝑜𝑙𝑜𝑟 );
```



### Cross-table

The cross-table elaborates the possible ways to set or modify given Suica element.

| Element | HTML Tag | HTML Attribute | CSS Property | JS Function |
|---|:---:|:---:|:---:|:---:|
| Suica canvas | yes | | | |
| &emsp; &ndash; name | | yes | | |
| &emsp; &ndash; width | | yes | yes | |
| &emsp; &ndash; height | | yes | yes | |
| Background color | yes | yes | yes | yes |
| Coordinate system | yes | | | yes |
| Demo mode | yes | | | yes |
| Animation loop | yes | | | yes |
| Animation loop function | | | | yes |
| Point | yes | | | yes |
| &emsp; &ndash; name | yes | | | |
| &emsp; &ndash; position | yes | | | yes |
| &emsp; &ndash; size | yes | | | yes |
| &emsp; &ndash; color | yes | | | yes |
| &emsp; &ndash; visibility | | | | yes |
| &emsp; &ndash; image | | | | yes |


### List of examples

All examples are collected in a single page [here](examples/EXAMPLES.md)
---

January, 2022