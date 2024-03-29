---
layout: default
title: 404
nav_exclude: true
---

# <img src="../logo.min.png" height="40" style="position:relative; top:7px;"/> Suica Reference Guide

[Suica](#suica) |
[Color](#color) |
[Point](#point) |
[Line](#line) |
[Square](#square) |
[Circle](#circle) |
[Polygon](#polygon) |
[Cube](#cube) |
[Sphere](#sphere) |
[Cylinder](#cylinder) |
[Prism](#prism) |
[Cone](#cone) |
[Pyramid](#pyramid) |
[Group](#group) |
[Tube](#tube) |
[Drawing](#drawing) |
[Events](#events) |
[Functions](#functions)

### [Suica](user-guide.md#suica-canvas)

```html
HTML:
<script src="suica.js"></script>
```

```html
HTML:
<suica id="𝑠𝑢𝑖𝑐𝑎" width="𝑤𝑖𝑑𝑡ℎ" height="ℎ𝑒𝑖𝑔ℎ𝑡" background="𝑐𝑜𝑙𝑜𝑟" orientation="𝑥𝑦𝑧">
<suica perspective="𝑛𝑒𝑎𝑟,𝑓𝑎𝑟,𝑓𝑜𝑣" orthographic="𝑛𝑒𝑎𝑟,𝑓𝑎𝑟" fullscreen fullwindow anaglyph="𝑑𝑖𝑠𝑡𝑎𝑛𝑐𝑒" stereo="𝑑𝑖𝑠𝑡𝑎𝑛𝑐𝑒" vr proactive>
<suica style="width:𝑤𝑖𝑑𝑡ℎ; height:ℎ𝑒𝑖𝑔ℎ𝑡; background:𝑐𝑜𝑙𝑜𝑟;">
<perspective near="𝑛𝑒𝑎𝑟" far="𝑓𝑎𝑟" fov="𝑓𝑜𝑣">
<orthographic near="𝑛𝑒𝑎𝑟" far="𝑓𝑎𝑟">
<lookat from="𝑓𝑟𝑜𝑚" to="𝑡𝑜" up="𝑢𝑝">
<fullscreen>
<fullwindow>
<stereo distance="𝑑𝑖𝑠𝑡𝑎𝑛𝑐𝑒">
<anaglyph distance="𝑑𝑖𝑠𝑡𝑎𝑛𝑐𝑒">
<vr>
<proactive>
<background color="𝑐𝑜𝑙𝑜𝑟">
<oxyz size="𝑠𝑖𝑧𝑒" color="𝑐𝑜𝑙𝑜𝑟">
<demo distance="𝑑𝑖𝑠𝑡𝑎𝑛𝑐𝑒" altitude="𝑎𝑙𝑡𝑖𝑡𝑢𝑑𝑒">
<clone id="𝑛𝑒𝑤𝑂𝑏𝑗𝑒𝑐𝑡" src="𝑜𝑏𝑗𝑒𝑐𝑡">
```
```css
CSS:
suica {
   width: 𝑤𝑖𝑑𝑡ℎ;
   height: ℎ𝑒𝑖𝑔ℎ𝑡;
   background: 𝑐𝑜𝑙𝑜𝑟;
}
```
```js
JS:
𝑠𝑢𝑖𝑐𝑎.perspective( 𝑛𝑒𝑎𝑟, 𝑓𝑎𝑟, 𝑓𝑜𝑣 );
𝑠𝑢𝑖𝑐𝑎.orthographic( 𝑛𝑒𝑎𝑟, 𝑓𝑎𝑟 );
𝑠𝑢𝑖𝑐𝑎.lookAt( 𝑓𝑟𝑜𝑚, 𝑡𝑜, 𝑢𝑝 );
𝑠𝑢𝑖𝑐𝑎.fullScreen( );
𝑠𝑢𝑖𝑐𝑎.fullWindow( );
𝑠𝑢𝑖𝑐𝑎.stereo( 𝑑𝑖𝑠𝑡𝑎𝑛𝑐𝑒 );
𝑠𝑢𝑖𝑐𝑎.anaglyph( 𝑑𝑖𝑠𝑡𝑎𝑛𝑐𝑒 );
𝑠𝑢𝑖𝑐𝑎.vr( );
𝑠𝑢𝑖𝑐𝑎.proactive( );
𝑠𝑢𝑖𝑐𝑎.background( 𝑐𝑜𝑙𝑜𝑟 );
𝑠𝑢𝑖𝑐𝑎.oxyz( 𝑠𝑖𝑧𝑒, 𝑐𝑜𝑙𝑜𝑟 );
𝑠𝑢𝑖𝑐𝑎.demo( 𝑑𝑖𝑠𝑡𝑎𝑛𝑐𝑒, 𝑎𝑙𝑡𝑖𝑡𝑢𝑑𝑒 );
𝑠𝑢𝑖𝑐𝑎.clone( 𝑜𝑏𝑗𝑒𝑐𝑡 );
𝑎𝑟𝑟𝑎𝑦 = 𝑠𝑢𝑖𝑐𝑎.allObjects( );

function 𝑓𝑢𝑛𝑐𝑡𝑖𝑜𝑛( t, dt )
{
   // code that sets objects properties 
   // depending on times t and dt
}

```

### [Color](user-guide.md#color)

```js
'𝑐𝑜𝑙𝑜𝑟-𝑛𝑎𝑚𝑒'
#𝐹𝐹𝐹𝐹𝐹𝐹                     // 000000..FFFFFF
0x𝐹𝐹𝐹𝐹𝐹𝐹                    // 000000..FFFFFF
'𝑟𝑒𝑑,𝑔𝑟𝑒𝑒𝑛,𝑏𝑙𝑢𝑒'             // 0..1
[𝑟𝑒𝑑,𝑔𝑟𝑒𝑒𝑛,𝑏𝑙𝑢𝑒]             // 0..1
rgb(𝑟𝑒𝑑,𝑔𝑟𝑒𝑒𝑛,𝑏𝑙𝑢𝑒)          // 0..255
hsl(ℎ𝑢𝑒,𝑠𝑎𝑡𝑢𝑟𝑎𝑡𝑖𝑜𝑛,𝑙𝑖𝑔ℎ𝑡𝑛𝑒𝑠𝑠)  // 0..360, 0..100, 0..100
```

### [Point](user-guide.md#point)

```html
HTML:
<point id="𝑜𝑏𝑗𝑒𝑐𝑡" center="𝑥,𝑦,𝑧" size="𝑠𝑖𝑧𝑒" color="𝑐𝑜𝑙𝑜𝑟">
<point x="𝑥" y="𝑦" z="𝑧">
<point image="𝑑𝑟𝑎𝑤𝑖𝑛𝑔" images="𝑥,𝑦">
<point image="𝑢𝑟𝑙" images="𝑥,𝑦">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑠𝑢𝑖𝑐𝑎.point( [𝑥,𝑦,𝑧], 𝑠𝑖𝑧𝑒, 𝑐𝑜𝑙𝑜𝑟 );
𝑜𝑏𝑗𝑒𝑐𝑡.center = [𝑥,𝑦,𝑧];
𝑜𝑏𝑗𝑒𝑐𝑡.x = 𝑥;
𝑜𝑏𝑗𝑒𝑐𝑡.y = 𝑦;
𝑜𝑏𝑗𝑒𝑐𝑡.z = 𝑧;
𝑜𝑏𝑗𝑒𝑐𝑡.size = 𝑠𝑖𝑧𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.color = 𝑐𝑜𝑙𝑜𝑟;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑑𝑟𝑎𝑤𝑖𝑛𝑔;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑖𝑚𝑎𝑔𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.image = '𝑢𝑟𝑙';
𝑜𝑏𝑗𝑒𝑐𝑡.images = 𝑥;
𝑜𝑏𝑗𝑒𝑐𝑡.images = [𝑥,𝑦];
𝑛𝑒𝑤𝑂𝑏𝑗𝑒𝑐𝑡 = 𝑜𝑏𝑗𝑒𝑐𝑡.clone;
𝑜𝑏𝑗𝑒𝑐𝑡.style({𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, 𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, …});
```


### [Line](user-guide.md#line)

```html
HTML:
<line id="𝑜𝑏𝑗𝑒𝑐𝑡" center="𝑥,𝑦,𝑧" to="𝑥,𝑦,𝑧" color="𝑐𝑜𝑙𝑜𝑟">
<line id="𝑜𝑏𝑗𝑒𝑐𝑡" from="𝑥,𝑦,𝑧" to="𝑥,𝑦,𝑧" color="𝑐𝑜𝑙𝑜𝑟">
<line image="𝑑𝑟𝑎𝑤𝑖𝑛𝑔" images="𝑥,𝑦">
<line image="𝑢𝑟𝑙" images="𝑥,𝑦">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑠𝑢𝑖𝑐𝑎.line( [𝑥,𝑦,𝑧], [𝑥,𝑦,𝑧], 𝑐𝑜𝑙𝑜𝑟 );
𝑜𝑏𝑗𝑒𝑐𝑡.center = [𝑥,𝑦,𝑧];
𝑜𝑏𝑗𝑒𝑐𝑡.from = [𝑥,𝑦,𝑧];
𝑜𝑏𝑗𝑒𝑐𝑡.to = [𝑥,𝑦,𝑧];
𝑜𝑏𝑗𝑒𝑐𝑡.color = 𝑐𝑜𝑙𝑜𝑟;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑑𝑟𝑎𝑤𝑖𝑛𝑔;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑖𝑚𝑎𝑔𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.image = '𝑢𝑟𝑙';
𝑜𝑏𝑗𝑒𝑐𝑡.images = 𝑥;
𝑜𝑏𝑗𝑒𝑐𝑡.images = [𝑥,𝑦];
𝑛𝑒𝑤𝑂𝑏𝑗𝑒𝑐𝑡 = 𝑜𝑏𝑗𝑒𝑐𝑡.clone;
𝑜𝑏𝑗𝑒𝑐𝑡.style({𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, 𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, …});
```


### [Square](user-guide.md#square)

```html
HTML:
<square id="𝑜𝑏𝑗𝑒𝑐𝑡" center="𝑥,𝑦,𝑧" size="𝑠𝑖𝑧𝑒" color="𝑐𝑜𝑙𝑜𝑟" wireframe="𝑡𝑟𝑢𝑒/𝑓𝑎𝑙𝑠𝑒" spin="𝑠𝑝𝑖𝑛ℎ,𝑠𝑝𝑖𝑛𝑣,𝑠𝑝𝑖𝑛𝑡">
<square x="𝑥" y="𝑦" z="𝑧">
<square size="𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡">
<square width="𝑤𝑖𝑑𝑡ℎ" height="ℎ𝑒𝑖𝑔ℎ𝑡">
<square image="𝑑𝑟𝑎𝑤𝑖𝑛𝑔" images="𝑥,𝑦">
<square image="𝑢𝑟𝑙" images="𝑥,𝑦">
<square spinh="𝑠𝑝𝑖𝑛ℎ" spinv="𝑠𝑝𝑖𝑛𝑣" spint="𝑠𝑝𝑖𝑛𝑡">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑠𝑢𝑖𝑐𝑎.square( [𝑥,𝑦,𝑧], 𝑠𝑖𝑧𝑒, 𝑐𝑜𝑙𝑜𝑟 );
𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑠𝑢𝑖𝑐𝑎.square( [𝑥,𝑦,𝑧], [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡], 𝑐𝑜𝑙𝑜𝑟 );
𝑜𝑏𝑗𝑒𝑐𝑡.center = [𝑥,𝑦,𝑧];
𝑜𝑏𝑗𝑒𝑐𝑡.x = 𝑥;
𝑜𝑏𝑗𝑒𝑐𝑡.y = 𝑦;
𝑜𝑏𝑗𝑒𝑐𝑡.z = 𝑧;
𝑜𝑏𝑗𝑒𝑐𝑡.size = 𝑠𝑖𝑧𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.size = [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡];
𝑜𝑏𝑗𝑒𝑐𝑡.width = 𝑤𝑖𝑑𝑡ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.height = ℎ𝑒𝑖𝑔ℎ𝑡;
𝑜𝑏𝑗𝑒𝑐𝑡.color = 𝑐𝑜𝑙𝑜𝑟;
𝑜𝑏𝑗𝑒𝑐𝑡.spin = 𝑠𝑝𝑖𝑛ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.spin = [𝑠𝑝𝑖𝑛ℎ,𝑠𝑝𝑖𝑛𝑣,𝑠𝑝𝑖𝑛𝑡];
𝑜𝑏𝑗𝑒𝑐𝑡.spinH = 𝑠𝑝𝑖𝑛ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.spinV = 𝑠𝑝𝑖𝑛𝑣;
𝑜𝑏𝑗𝑒𝑐𝑡.spinT = 𝑠𝑝𝑖𝑛𝑡;
𝑜𝑏𝑗𝑒𝑐𝑡.wireframe = 𝑡𝑟𝑢𝑒/𝑓𝑎𝑙𝑠𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑑𝑟𝑎𝑤𝑖𝑛𝑔;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑖𝑚𝑎𝑔𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.image = '𝑢𝑟𝑙';
𝑜𝑏𝑗𝑒𝑐𝑡.images = 𝑥;
𝑜𝑏𝑗𝑒𝑐𝑡.images = [𝑥,𝑦];
𝑛𝑒𝑤𝑂𝑏𝑗𝑒𝑐𝑡 = 𝑜𝑏𝑗𝑒𝑐𝑡.clone;
𝑜𝑏𝑗𝑒𝑐𝑡.style({𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, 𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, …});
```


### [Circle](user-guide.md#circle)

```html
HTML:
<circle id="𝑜𝑏𝑗𝑒𝑐𝑡" center="𝑥,𝑦,𝑧" size="𝑠𝑖𝑧𝑒" color="𝑐𝑜𝑙𝑜𝑟" wireframe="𝑡𝑟𝑢𝑒/𝑓𝑎𝑙𝑠𝑒" spin="𝑠𝑝𝑖𝑛ℎ,𝑠𝑝𝑖𝑛𝑣,𝑠𝑝𝑖𝑛𝑡">
<circle x="𝑥" y="𝑦" z="𝑧">
<circle size="𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡">
<circle width="𝑤𝑖𝑑𝑡ℎ" height="ℎ𝑒𝑖𝑔ℎ𝑡">
<circle image="𝑑𝑟𝑎𝑤𝑖𝑛𝑔" images="𝑥,𝑦">
<circle image="𝑢𝑟𝑙" images="𝑥,𝑦">
<circle spinh="𝑠𝑝𝑖𝑛ℎ" spinv="𝑠𝑝𝑖𝑛𝑣" spint="𝑠𝑝𝑖𝑛𝑡">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑠𝑢𝑖𝑐𝑎.circle( [𝑥,𝑦,𝑧], 𝑠𝑖𝑧𝑒, 𝑐𝑜𝑙𝑜𝑟 );
𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑠𝑢𝑖𝑐𝑎.circle( [𝑥,𝑦,𝑧], [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡], 𝑐𝑜𝑙𝑜𝑟 );
𝑜𝑏𝑗𝑒𝑐𝑡.center = [𝑥,𝑦,𝑧];
𝑜𝑏𝑗𝑒𝑐𝑡.x = 𝑥;
𝑜𝑏𝑗𝑒𝑐𝑡.y = 𝑦;
𝑜𝑏𝑗𝑒𝑐𝑡.z = 𝑧;
𝑜𝑏𝑗𝑒𝑐𝑡.size = 𝑠𝑖𝑧𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.size = [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡];
𝑜𝑏𝑗𝑒𝑐𝑡.width = 𝑤𝑖𝑑𝑡ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.height = ℎ𝑒𝑖𝑔ℎ𝑡;
𝑜𝑏𝑗𝑒𝑐𝑡.color = 𝑐𝑜𝑙𝑜𝑟;
𝑜𝑏𝑗𝑒𝑐𝑡.spin = 𝑠𝑝𝑖𝑛ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.spin = [𝑠𝑝𝑖𝑛ℎ,𝑠𝑝𝑖𝑛𝑣,𝑠𝑝𝑖𝑛𝑡];
𝑜𝑏𝑗𝑒𝑐𝑡.spinH = 𝑠𝑝𝑖𝑛ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.spinV = 𝑠𝑝𝑖𝑛𝑣;
𝑜𝑏𝑗𝑒𝑐𝑡.spinT = 𝑠𝑝𝑖𝑛𝑡;
𝑜𝑏𝑗𝑒𝑐𝑡.wireframe = 𝑡𝑟𝑢𝑒/𝑓𝑎𝑙𝑠𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑑𝑟𝑎𝑤𝑖𝑛𝑔;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑖𝑚𝑎𝑔𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.image = '𝑢𝑟𝑙';
𝑜𝑏𝑗𝑒𝑐𝑡.images = 𝑥;
𝑜𝑏𝑗𝑒𝑐𝑡.images = [𝑥,𝑦];
𝑛𝑒𝑤𝑂𝑏𝑗𝑒𝑐𝑡 = 𝑜𝑏𝑗𝑒𝑐𝑡.clone;
𝑜𝑏𝑗𝑒𝑐𝑡.style({𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, 𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, …});
```


### [Polygon](user-guide.md#polygon)

```html
HTML:
<polygon id="𝑜𝑏𝑗𝑒𝑐𝑡" count="𝑐𝑜𝑢𝑛𝑡" center="𝑥,𝑦,𝑧" size="𝑠𝑖𝑧𝑒" color="𝑐𝑜𝑙𝑜𝑟" wireframe="𝑡𝑟𝑢𝑒/𝑓𝑎𝑙𝑠𝑒" spin="𝑠𝑝𝑖𝑛ℎ,𝑠𝑝𝑖𝑛𝑣,𝑠𝑝𝑖𝑛𝑡">
<polygon x="𝑥" y="𝑦" z="𝑧">
<polygon size="𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡">
<polygon width="𝑤𝑖𝑑𝑡ℎ" height="ℎ𝑒𝑖𝑔ℎ𝑡">
<polygon image="𝑑𝑟𝑎𝑤𝑖𝑛𝑔" images="𝑥,𝑦">
<polygon image="𝑢𝑟𝑙" images="𝑥,𝑦">
<polygon spinh="𝑠𝑝𝑖𝑛ℎ" spinv="𝑠𝑝𝑖𝑛𝑣" spint="𝑠𝑝𝑖𝑛𝑡">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑠𝑢𝑖𝑐𝑎.polygon( 𝑐𝑜𝑢𝑛𝑡, [𝑥,𝑦,𝑧], 𝑠𝑖𝑧𝑒, 𝑐𝑜𝑙𝑜𝑟 );
𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑠𝑢𝑖𝑐𝑎.polygon( 𝑐𝑜𝑢𝑛𝑡, [𝑥,𝑦,𝑧], [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡], 𝑐𝑜𝑙𝑜𝑟 );
𝑜𝑏𝑗𝑒𝑐𝑡.count = 𝑐𝑜𝑢𝑛𝑡;
𝑜𝑏𝑗𝑒𝑐𝑡.center = [𝑥,𝑦,𝑧];
𝑜𝑏𝑗𝑒𝑐𝑡.x = 𝑥;
𝑜𝑏𝑗𝑒𝑐𝑡.y = 𝑦;
𝑜𝑏𝑗𝑒𝑐𝑡.z = 𝑧;
𝑜𝑏𝑗𝑒𝑐𝑡.size = 𝑠𝑖𝑧𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.size = [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡];
𝑜𝑏𝑗𝑒𝑐𝑡.width = 𝑤𝑖𝑑𝑡ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.height = ℎ𝑒𝑖𝑔ℎ𝑡;
𝑜𝑏𝑗𝑒𝑐𝑡.color = 𝑐𝑜𝑙𝑜𝑟;
𝑜𝑏𝑗𝑒𝑐𝑡.spin = 𝑠𝑝𝑖𝑛ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.spin = [𝑠𝑝𝑖𝑛ℎ,𝑠𝑝𝑖𝑛𝑣,𝑠𝑝𝑖𝑛𝑡];
𝑜𝑏𝑗𝑒𝑐𝑡.spinH = 𝑠𝑝𝑖𝑛ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.spinV = 𝑠𝑝𝑖𝑛𝑣;
𝑜𝑏𝑗𝑒𝑐𝑡.spinT = 𝑠𝑝𝑖𝑛𝑡;
𝑜𝑏𝑗𝑒𝑐𝑡.wireframe = 𝑡𝑟𝑢𝑒/𝑓𝑎𝑙𝑠𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑑𝑟𝑎𝑤𝑖𝑛𝑔;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑖𝑚𝑎𝑔𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.image = '𝑢𝑟𝑙';
𝑛𝑒𝑤𝑂𝑏𝑗𝑒𝑐𝑡 = 𝑜𝑏𝑗𝑒𝑐𝑡.clone;
𝑜𝑏𝑗𝑒𝑐𝑡.style({𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, 𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, …});
```


### [Cube](user-guide.md#cube)

```html
HTML:
<cube id="𝑜𝑏𝑗𝑒𝑐𝑡" center="𝑥,𝑦,𝑧" size="𝑠𝑖𝑧𝑒" color="𝑐𝑜𝑙𝑜𝑟" wireframe="𝑡𝑟𝑢𝑒/𝑓𝑎𝑙𝑠𝑒" spin="𝑠𝑝𝑖𝑛ℎ,𝑠𝑝𝑖𝑛𝑣,𝑠𝑝𝑖𝑛𝑡">
<cube x="𝑥" y="𝑦" z="𝑧">
<cube size="𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ">
<cube width="𝑤𝑖𝑑𝑡ℎ" height="ℎ𝑒𝑖𝑔ℎ𝑡" depth="𝑑𝑒𝑝𝑡ℎ">
<cube image="𝑑𝑟𝑎𝑤𝑖𝑛𝑔" images="𝑥,𝑦">
<cube image="𝑢𝑟𝑙" images="𝑥,𝑦">
<cube spinh="𝑠𝑝𝑖𝑛ℎ" spinv="𝑠𝑝𝑖𝑛𝑣" spint="𝑠𝑝𝑖𝑛𝑡">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑠𝑢𝑖𝑐𝑎.cube( [𝑥,𝑦,𝑧], 𝑠𝑖𝑧𝑒, 𝑐𝑜𝑙𝑜𝑟 );
𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑠𝑢𝑖𝑐𝑎.cube( [𝑥,𝑦,𝑧], [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ], 𝑐𝑜𝑙𝑜𝑟 );
𝑜𝑏𝑗𝑒𝑐𝑡.center = [𝑥,𝑦,𝑧];
𝑜𝑏𝑗𝑒𝑐𝑡.x = 𝑥;
𝑜𝑏𝑗𝑒𝑐𝑡.y = 𝑦;
𝑜𝑏𝑗𝑒𝑐𝑡.z = 𝑧;
𝑜𝑏𝑗𝑒𝑐𝑡.size = 𝑠𝑖𝑧𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.size = [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ];
𝑜𝑏𝑗𝑒𝑐𝑡.width = 𝑤𝑖𝑑𝑡ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.height = ℎ𝑒𝑖𝑔ℎ𝑡;
𝑜𝑏𝑗𝑒𝑐𝑡.depth = 𝑑𝑒𝑝𝑡ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.color = 𝑐𝑜𝑙𝑜𝑟;
𝑜𝑏𝑗𝑒𝑐𝑡.spin = 𝑠𝑝𝑖𝑛ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.spin = [𝑠𝑝𝑖𝑛ℎ,𝑠𝑝𝑖𝑛𝑣,𝑠𝑝𝑖𝑛𝑡];
𝑜𝑏𝑗𝑒𝑐𝑡.spinH = 𝑠𝑝𝑖𝑛ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.spinV = 𝑠𝑝𝑖𝑛𝑣;
𝑜𝑏𝑗𝑒𝑐𝑡.spinT = 𝑠𝑝𝑖𝑛𝑡;
𝑜𝑏𝑗𝑒𝑐𝑡.wireframe = 𝑡𝑟𝑢𝑒/𝑓𝑎𝑙𝑠𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑑𝑟𝑎𝑤𝑖𝑛𝑔;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑖𝑚𝑎𝑔𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.image = '𝑢𝑟𝑙';
𝑜𝑏𝑗𝑒𝑐𝑡.images = 𝑥;
𝑜𝑏𝑗𝑒𝑐𝑡.images = [𝑥,𝑦];
𝑛𝑒𝑤𝑂𝑏𝑗𝑒𝑐𝑡 = 𝑜𝑏𝑗𝑒𝑐𝑡.clone;
𝑜𝑏𝑗𝑒𝑐𝑡.style({𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, 𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, …});
```


### [Sphere](user-guide.md#sphere)

```html
HTML:
<sphere id="𝑜𝑏𝑗𝑒𝑐𝑡" center="𝑥,𝑦,𝑧" size="𝑠𝑖𝑧𝑒" color="𝑐𝑜𝑙𝑜𝑟" spin="𝑠𝑝𝑖𝑛ℎ,𝑠𝑝𝑖𝑛𝑣,𝑠𝑝𝑖𝑛𝑡">
<sphere x="𝑥" y="𝑦" z="𝑧">
<sphere size="𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ">
<sphere width="𝑤𝑖𝑑𝑡ℎ" height="ℎ𝑒𝑖𝑔ℎ𝑡" depth="𝑑𝑒𝑝𝑡ℎ">
<sphere image="𝑑𝑟𝑎𝑤𝑖𝑛𝑔" images="𝑥,𝑦">
<sphere image="𝑢𝑟𝑙" images="𝑥,𝑦">
<sphere spinh="𝑠𝑝𝑖𝑛ℎ" spinv="𝑠𝑝𝑖𝑛𝑣" spint="𝑠𝑝𝑖𝑛𝑡">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑠𝑢𝑖𝑐𝑎.sphere( [𝑥,𝑦,𝑧], 𝑠𝑖𝑧𝑒, 𝑐𝑜𝑙𝑜𝑟 );
𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑠𝑢𝑖𝑐𝑎.sphere( [𝑥,𝑦,𝑧], [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ], 𝑐𝑜𝑙𝑜𝑟 );
𝑜𝑏𝑗𝑒𝑐𝑡.center = [𝑥,𝑦,𝑧];
𝑜𝑏𝑗𝑒𝑐𝑡.x = 𝑥;
𝑜𝑏𝑗𝑒𝑐𝑡.y = 𝑦;
𝑜𝑏𝑗𝑒𝑐𝑡.z = 𝑧;
𝑜𝑏𝑗𝑒𝑐𝑡.size = 𝑠𝑖𝑧𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.size = [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ];
𝑜𝑏𝑗𝑒𝑐𝑡.width = 𝑤𝑖𝑑𝑡ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.height = ℎ𝑒𝑖𝑔ℎ𝑡;
𝑜𝑏𝑗𝑒𝑐𝑡.depth = 𝑑𝑒𝑝𝑡ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.color = 𝑐𝑜𝑙𝑜𝑟;
𝑜𝑏𝑗𝑒𝑐𝑡.spin = 𝑠𝑝𝑖𝑛ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.spin = [𝑠𝑝𝑖𝑛ℎ,𝑠𝑝𝑖𝑛𝑣,𝑠𝑝𝑖𝑛𝑡];
𝑜𝑏𝑗𝑒𝑐𝑡.spinH = 𝑠𝑝𝑖𝑛ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.spinV = 𝑠𝑝𝑖𝑛𝑣;
𝑜𝑏𝑗𝑒𝑐𝑡.spinT = 𝑠𝑝𝑖𝑛𝑡;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑑𝑟𝑎𝑤𝑖𝑛𝑔;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑖𝑚𝑎𝑔𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.image = '𝑢𝑟𝑙';
𝑜𝑏𝑗𝑒𝑐𝑡.images = 𝑥;
𝑜𝑏𝑗𝑒𝑐𝑡.images = [𝑥,𝑦];
𝑛𝑒𝑤𝑂𝑏𝑗𝑒𝑐𝑡 = 𝑜𝑏𝑗𝑒𝑐𝑡.clone;
𝑜𝑏𝑗𝑒𝑐𝑡.style({𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, 𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, …});
```

### [Cylinder](user-guide.md#cylinder)

```html
HTML:
<cylinder id="𝑜𝑏𝑗𝑒𝑐𝑡" center="𝑥,𝑦,𝑧" size="𝑠𝑖𝑧𝑒" color="𝑐𝑜𝑙𝑜𝑟" spin="𝑠𝑝𝑖𝑛ℎ,𝑠𝑝𝑖𝑛𝑣,𝑠𝑝𝑖𝑛𝑡">
<cylinder x="𝑥" y="𝑦" z="𝑧">
<cylinder size="𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ">
<cylinder width="𝑤𝑖𝑑𝑡ℎ" height="ℎ𝑒𝑖𝑔ℎ𝑡" depth="𝑑𝑒𝑝𝑡ℎ">
<cylinder image="𝑑𝑟𝑎𝑤𝑖𝑛𝑔" images="𝑥,𝑦">
<cylinder image="𝑢𝑟𝑙" images="𝑥,𝑦">
<cylinder spinh="𝑠𝑝𝑖𝑛ℎ" spinv="𝑠𝑝𝑖𝑛𝑣" spint="𝑠𝑝𝑖𝑛𝑡">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑠𝑢𝑖𝑐𝑎.cylinder( [𝑥,𝑦,𝑧], 𝑠𝑖𝑧𝑒, 𝑐𝑜𝑙𝑜𝑟 );
𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑠𝑢𝑖𝑐𝑎.cylinder( [𝑥,𝑦,𝑧], [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ], 𝑐𝑜𝑙𝑜𝑟 );
𝑜𝑏𝑗𝑒𝑐𝑡.center = [𝑥,𝑦,𝑧];
𝑜𝑏𝑗𝑒𝑐𝑡.x = 𝑥;
𝑜𝑏𝑗𝑒𝑐𝑡.y = 𝑦;
𝑜𝑏𝑗𝑒𝑐𝑡.z = 𝑧;
𝑜𝑏𝑗𝑒𝑐𝑡.size = 𝑠𝑖𝑧𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.size = [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ];
𝑜𝑏𝑗𝑒𝑐𝑡.width = 𝑤𝑖𝑑𝑡ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.height = ℎ𝑒𝑖𝑔ℎ𝑡;
𝑜𝑏𝑗𝑒𝑐𝑡.depth = 𝑑𝑒𝑝𝑡ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.color = 𝑐𝑜𝑙𝑜𝑟;
𝑜𝑏𝑗𝑒𝑐𝑡.spin = 𝑠𝑝𝑖𝑛ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.spin = [𝑠𝑝𝑖𝑛ℎ,𝑠𝑝𝑖𝑛𝑣,𝑠𝑝𝑖𝑛𝑡];
𝑜𝑏𝑗𝑒𝑐𝑡.spinH = 𝑠𝑝𝑖𝑛ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.spinV = 𝑠𝑝𝑖𝑛𝑣;
𝑜𝑏𝑗𝑒𝑐𝑡.spinT = 𝑠𝑝𝑖𝑛𝑡;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑑𝑟𝑎𝑤𝑖𝑛𝑔;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑖𝑚𝑎𝑔𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.image = '𝑢𝑟𝑙';
𝑜𝑏𝑗𝑒𝑐𝑡.images = 𝑥;
𝑜𝑏𝑗𝑒𝑐𝑡.images = [𝑥,𝑦];
𝑛𝑒𝑤𝑂𝑏𝑗𝑒𝑐𝑡 = 𝑜𝑏𝑗𝑒𝑐𝑡.clone;
𝑜𝑏𝑗𝑒𝑐𝑡.style({𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, 𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, …});
```

### [Prism](user-guide.md#prism)

```html
HTML:
<prism id="𝑜𝑏𝑗𝑒𝑐𝑡" count="𝑐𝑜𝑢𝑛𝑡" center="𝑥,𝑦,𝑧" size="𝑠𝑖𝑧𝑒" color="𝑐𝑜𝑙𝑜𝑟" wireframe="𝑡𝑟𝑢𝑒/𝑓𝑎𝑙𝑠𝑒" spin="𝑠𝑝𝑖𝑛ℎ,𝑠𝑝𝑖𝑛𝑣,𝑠𝑝𝑖𝑛𝑡">
<prism x="𝑥" y="𝑦" z="𝑧">
<prism size="𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ">
<prism width="𝑤𝑖𝑑𝑡ℎ" height="ℎ𝑒𝑖𝑔ℎ𝑡" depth="𝑑𝑒𝑝𝑡ℎ">
<prism image="𝑑𝑟𝑎𝑤𝑖𝑛𝑔" images="𝑥,𝑦">
<prism image="𝑢𝑟𝑙" images="𝑥,𝑦">
<prism spinh="𝑠𝑝𝑖𝑛ℎ" spinv="𝑠𝑝𝑖𝑛𝑣" spint="𝑠𝑝𝑖𝑛𝑡">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑠𝑢𝑖𝑐𝑎.prism( 𝑐𝑜𝑢𝑛𝑡, [𝑥,𝑦,𝑧], 𝑠𝑖𝑧𝑒, 𝑐𝑜𝑙𝑜𝑟 );
𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑠𝑢𝑖𝑐𝑎.prism( 𝑐𝑜𝑢𝑛𝑡, [𝑥,𝑦,𝑧], [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ], 𝑐𝑜𝑙𝑜𝑟 );
𝑜𝑏𝑗𝑒𝑐𝑡.count = 𝑐𝑜𝑢𝑛𝑡;
𝑜𝑏𝑗𝑒𝑐𝑡.center = [𝑥,𝑦,𝑧];
𝑜𝑏𝑗𝑒𝑐𝑡.x = 𝑥;
𝑜𝑏𝑗𝑒𝑐𝑡.y = 𝑦;
𝑜𝑏𝑗𝑒𝑐𝑡.z = 𝑧;
𝑜𝑏𝑗𝑒𝑐𝑡.size = 𝑠𝑖𝑧𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.size = [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ];
𝑜𝑏𝑗𝑒𝑐𝑡.width = 𝑤𝑖𝑑𝑡ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.height = ℎ𝑒𝑖𝑔ℎ𝑡;
𝑜𝑏𝑗𝑒𝑐𝑡.depth = 𝑑𝑒𝑝𝑡ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.color = 𝑐𝑜𝑙𝑜𝑟;
𝑜𝑏𝑗𝑒𝑐𝑡.spin = 𝑠𝑝𝑖𝑛ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.spin = [𝑠𝑝𝑖𝑛ℎ,𝑠𝑝𝑖𝑛𝑣,𝑠𝑝𝑖𝑛𝑡];
𝑜𝑏𝑗𝑒𝑐𝑡.spinH = 𝑠𝑝𝑖𝑛ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.spinV = 𝑠𝑝𝑖𝑛𝑣;
𝑜𝑏𝑗𝑒𝑐𝑡.spinT = 𝑠𝑝𝑖𝑛𝑡;
𝑜𝑏𝑗𝑒𝑐𝑡.wireframe = 𝑡𝑟𝑢𝑒/𝑓𝑎𝑙𝑠𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑑𝑟𝑎𝑤𝑖𝑛𝑔;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑖𝑚𝑎𝑔𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.image = '𝑢𝑟𝑙';
𝑜𝑏𝑗𝑒𝑐𝑡.images = 𝑥;
𝑜𝑏𝑗𝑒𝑐𝑡.images = [𝑥,𝑦];
𝑛𝑒𝑤𝑂𝑏𝑗𝑒𝑐𝑡 = 𝑜𝑏𝑗𝑒𝑐𝑡.clone;
𝑜𝑏𝑗𝑒𝑐𝑡.style({𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, 𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, …});
```

### [Cone](user-guide.md#cone)

```html
HTML:
<cone id="𝑜𝑏𝑗𝑒𝑐𝑡" center="𝑥,𝑦,𝑧" size="𝑠𝑖𝑧𝑒" color="𝑐𝑜𝑙𝑜𝑟" spin="𝑠𝑝𝑖𝑛ℎ,𝑠𝑝𝑖𝑛𝑣,𝑠𝑝𝑖𝑛𝑡">
<cone x="𝑥" y="𝑦" z="𝑧">
<cone size="𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ">
<cone width="𝑤𝑖𝑑𝑡ℎ" height="ℎ𝑒𝑖𝑔ℎ𝑡" depth="𝑑𝑒𝑝𝑡ℎ">
<cone image="𝑑𝑟𝑎𝑤𝑖𝑛𝑔" images="𝑥,𝑦">
<cone image="𝑢𝑟𝑙" images="𝑥,𝑦">
<cone spinh="𝑠𝑝𝑖𝑛ℎ" spinv="𝑠𝑝𝑖𝑛𝑣" spint="𝑠𝑝𝑖𝑛𝑡">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑠𝑢𝑖𝑐𝑎.cone( [𝑥,𝑦,𝑧], 𝑠𝑖𝑧𝑒, 𝑐𝑜𝑙𝑜𝑟 );
𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑠𝑢𝑖𝑐𝑎.cone( [𝑥,𝑦,𝑧], [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ], 𝑐𝑜𝑙𝑜𝑟 );
𝑜𝑏𝑗𝑒𝑐𝑡.center = [𝑥,𝑦,𝑧];
𝑜𝑏𝑗𝑒𝑐𝑡.x = 𝑥;
𝑜𝑏𝑗𝑒𝑐𝑡.y = 𝑦;
𝑜𝑏𝑗𝑒𝑐𝑡.z = 𝑧;
𝑜𝑏𝑗𝑒𝑐𝑡.size = 𝑠𝑖𝑧𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.size = [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ];
𝑜𝑏𝑗𝑒𝑐𝑡.width = 𝑤𝑖𝑑𝑡ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.height = ℎ𝑒𝑖𝑔ℎ𝑡;
𝑜𝑏𝑗𝑒𝑐𝑡.depth = 𝑑𝑒𝑝𝑡ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.color = 𝑐𝑜𝑙𝑜𝑟;
𝑜𝑏𝑗𝑒𝑐𝑡.spin = 𝑠𝑝𝑖𝑛ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.spin = [𝑠𝑝𝑖𝑛ℎ,𝑠𝑝𝑖𝑛𝑣,𝑠𝑝𝑖𝑛𝑡];
𝑜𝑏𝑗𝑒𝑐𝑡.spinH = 𝑠𝑝𝑖𝑛ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.spinV = 𝑠𝑝𝑖𝑛𝑣;
𝑜𝑏𝑗𝑒𝑐𝑡.spinT = 𝑠𝑝𝑖𝑛𝑡;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑑𝑟𝑎𝑤𝑖𝑛𝑔;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑖𝑚𝑎𝑔𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.image = '𝑢𝑟𝑙';
𝑜𝑏𝑗𝑒𝑐𝑡.images = 𝑥;
𝑜𝑏𝑗𝑒𝑐𝑡.images = [𝑥,𝑦];
𝑛𝑒𝑤𝑂𝑏𝑗𝑒𝑐𝑡 = 𝑜𝑏𝑗𝑒𝑐𝑡.clone;
𝑜𝑏𝑗𝑒𝑐𝑡.style({𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, 𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, …});
```

### [Pyramid](user-guide.md#pyramid)

```html
HTML:
<pyramid id="𝑜𝑏𝑗𝑒𝑐𝑡" count="𝑐𝑜𝑢𝑛𝑡" center="𝑥,𝑦,𝑧" size="𝑠𝑖𝑧𝑒" color="𝑐𝑜𝑙𝑜𝑟" wireframe="𝑡𝑟𝑢𝑒/𝑓𝑎𝑙𝑠𝑒" spin="𝑠𝑝𝑖𝑛ℎ,𝑠𝑝𝑖𝑛𝑣,𝑠𝑝𝑖𝑛𝑡">
<pyramid x="𝑥" y="𝑦" z="𝑧">
<pyramid size="𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ">
<pyramid width="𝑤𝑖𝑑𝑡ℎ" height="ℎ𝑒𝑖𝑔ℎ𝑡" depth="𝑑𝑒𝑝𝑡ℎ">
<pyramid image="𝑑𝑟𝑎𝑤𝑖𝑛𝑔" images="𝑥,𝑦">
<pyramid image="𝑢𝑟𝑙" images="𝑥,𝑦">
<pyramid spinh="𝑠𝑝𝑖𝑛ℎ" spinv="𝑠𝑝𝑖𝑛𝑣" spint="𝑠𝑝𝑖𝑛𝑡">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑠𝑢𝑖𝑐𝑎.pyramid( 𝑐𝑜𝑢𝑛𝑡, [𝑥,𝑦,𝑧], 𝑠𝑖𝑧𝑒, 𝑐𝑜𝑙𝑜𝑟 );
𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑠𝑢𝑖𝑐𝑎.pyramid( 𝑐𝑜𝑢𝑛𝑡, [𝑥,𝑦,𝑧], [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ], 𝑐𝑜𝑙𝑜𝑟 );
𝑜𝑏𝑗𝑒𝑐𝑡.count = 𝑐𝑜𝑢𝑛𝑡;
𝑜𝑏𝑗𝑒𝑐𝑡.center = [𝑥,𝑦,𝑧];
𝑜𝑏𝑗𝑒𝑐𝑡.x = 𝑥;
𝑜𝑏𝑗𝑒𝑐𝑡.y = 𝑦;
𝑜𝑏𝑗𝑒𝑐𝑡.z = 𝑧;
𝑜𝑏𝑗𝑒𝑐𝑡.size = 𝑠𝑖𝑧𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.size = [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ];
𝑜𝑏𝑗𝑒𝑐𝑡.width = 𝑤𝑖𝑑𝑡ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.height = ℎ𝑒𝑖𝑔ℎ𝑡;
𝑜𝑏𝑗𝑒𝑐𝑡.depth = 𝑑𝑒𝑝𝑡ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.color = 𝑐𝑜𝑙𝑜𝑟;
𝑜𝑏𝑗𝑒𝑐𝑡.spin = 𝑠𝑝𝑖𝑛ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.spin = [𝑠𝑝𝑖𝑛ℎ,𝑠𝑝𝑖𝑛𝑣,𝑠𝑝𝑖𝑛𝑡];
𝑜𝑏𝑗𝑒𝑐𝑡.spinH = 𝑠𝑝𝑖𝑛ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.spinV = 𝑠𝑝𝑖𝑛𝑣;
𝑜𝑏𝑗𝑒𝑐𝑡.spinT = 𝑠𝑝𝑖𝑛𝑡;
𝑜𝑏𝑗𝑒𝑐𝑡.wireframe = 𝑡𝑟𝑢𝑒/𝑓𝑎𝑙𝑠𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑑𝑟𝑎𝑤𝑖𝑛𝑔;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑖𝑚𝑎𝑔𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.image = '𝑢𝑟𝑙';
𝑜𝑏𝑗𝑒𝑐𝑡.images = 𝑥;
𝑜𝑏𝑗𝑒𝑐𝑡.images = [𝑥,𝑦];
𝑛𝑒𝑤𝑂𝑏𝑗𝑒𝑐𝑡 = 𝑜𝑏𝑗𝑒𝑐𝑡.clone;
𝑜𝑏𝑗𝑒𝑐𝑡.style({𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, 𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, …});
```


### [Group](user-guide.md#group)
```html
HTML:
<group id="𝑜𝑏𝑗𝑒𝑐𝑡" center="𝑥,𝑦,𝑧" size="𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ" color="𝑐𝑜𝑙𝑜𝑟" spin="𝑠𝑝𝑖𝑛ℎ,𝑠𝑝𝑖𝑛𝑣,𝑠𝑝𝑖𝑛𝑡">
  :
</group>

<group x="𝑥" y="𝑦" z="𝑧">
  :
</group>

<group width="𝑤𝑖𝑑𝑡ℎ" height="ℎ𝑒𝑖𝑔ℎ𝑡" depth="𝑑𝑒𝑝𝑡ℎ">
  :
</group>

<group spinh="𝑠𝑝𝑖𝑛ℎ" spinv="𝑠𝑝𝑖𝑛𝑣" spint="𝑠𝑝𝑖𝑛𝑡">
  :
</group>
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑠𝑢𝑖𝑐𝑎.group( 𝑜𝑏𝑗𝑒𝑐𝑡, 𝑜𝑏𝑗𝑒𝑐𝑡, ... );
𝑜𝑏𝑗𝑒𝑐𝑡.add( 𝑜𝑏𝑗𝑒𝑐𝑡, 𝑜𝑏𝑗𝑒𝑐𝑡, ... );
𝑜𝑏𝑗𝑒𝑐𝑡.center = [𝑥,𝑦,𝑧];
𝑜𝑏𝑗𝑒𝑐𝑡.x = 𝑥;
𝑜𝑏𝑗𝑒𝑐𝑡.y = 𝑦;
𝑜𝑏𝑗𝑒𝑐𝑡.z = 𝑧;
𝑜𝑏𝑗𝑒𝑐𝑡.size = 𝑠𝑖𝑧𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.size = [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ];
𝑜𝑏𝑗𝑒𝑐𝑡.width = 𝑤𝑖𝑑𝑡ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.height = ℎ𝑒𝑖𝑔ℎ𝑡;
𝑜𝑏𝑗𝑒𝑐𝑡.depth = 𝑑𝑒𝑝𝑡ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.color = 𝑐𝑜𝑙𝑜𝑟;
𝑜𝑏𝑗𝑒𝑐𝑡.spin = 𝑠𝑝𝑖𝑛ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.spin = [𝑠𝑝𝑖𝑛ℎ,𝑠𝑝𝑖𝑛𝑣,𝑠𝑝𝑖𝑛𝑡];
𝑜𝑏𝑗𝑒𝑐𝑡.spinH = 𝑠𝑝𝑖𝑛ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.spinV = 𝑠𝑝𝑖𝑛𝑣;
𝑜𝑏𝑗𝑒𝑐𝑡.spinT = 𝑠𝑝𝑖𝑛𝑡;
𝑛𝑒𝑤𝑂𝑏𝑗𝑒𝑐𝑡 = 𝑜𝑏𝑗𝑒𝑐𝑡.clone;
𝑜𝑏𝑗𝑒𝑐𝑡.style({𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, 𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, …});
```


### [Tube](user-guide.md#tube)

```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑠𝑢𝑖𝑐𝑎.tube( [𝑥,𝑦,𝑧], 𝑐𝑢𝑟𝑣𝑒, 𝑟𝑎𝑑𝑖𝑢𝑠, 𝑡𝑢𝑏𝑢𝑙𝑎𝑟, 𝑠𝑖𝑧𝑒, 𝑐𝑜𝑙𝑜𝑟 );
𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑠𝑢𝑖𝑐𝑎.tube( [𝑥,𝑦,𝑧], 𝑐𝑢𝑟𝑣𝑒, 𝑟𝑎𝑑𝑖𝑢𝑠, [𝑡𝑢𝑏𝑢𝑙𝑎𝑟,𝑟𝑎𝑑𝑖𝑎𝑙], [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ], 𝑐𝑜𝑙𝑜𝑟 );
𝑜𝑏𝑗𝑒𝑐𝑡.center = [𝑥,𝑦,𝑧];
𝑜𝑏𝑗𝑒𝑐𝑡.x = 𝑥;
𝑜𝑏𝑗𝑒𝑐𝑡.y = 𝑦;
𝑜𝑏𝑗𝑒𝑐𝑡.z = 𝑧;
𝑜𝑏𝑗𝑒𝑐𝑡.curve = 𝑠𝑝𝑙𝑖𝑛𝑒𝐹𝑢𝑛𝑐𝑡𝑖𝑜𝑛;
𝑜𝑏𝑗𝑒𝑐𝑡.curve = 𝑐𝑢𝑟𝑣𝑒𝐹𝑢𝑛𝑐𝑡𝑖𝑜𝑛;
𝑜𝑏𝑗𝑒𝑐𝑡.curve = [𝑝𝑜𝑖𝑛𝑡, 𝑝𝑜𝑖𝑛𝑡, ...];
𝑜𝑏𝑗𝑒𝑐𝑡.size = 𝑠𝑖𝑧𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.size = [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ];
𝑜𝑏𝑗𝑒𝑐𝑡.width = 𝑤𝑖𝑑𝑡ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.height = ℎ𝑒𝑖𝑔ℎ𝑡;
𝑜𝑏𝑗𝑒𝑐𝑡.depth = 𝑑𝑒𝑝𝑡ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.color = 𝑐𝑜𝑙𝑜𝑟;
𝑜𝑏𝑗𝑒𝑐𝑡.spin = 𝑠𝑝𝑖𝑛ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.spin = [𝑠𝑝𝑖𝑛ℎ,𝑠𝑝𝑖𝑛𝑣,𝑠𝑝𝑖𝑛𝑡];
𝑜𝑏𝑗𝑒𝑐𝑡.spinH = 𝑠𝑝𝑖𝑛ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.spinV = 𝑠𝑝𝑖𝑛𝑣;
𝑜𝑏𝑗𝑒𝑐𝑡.spinT = 𝑠𝑝𝑖𝑛𝑡;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑑𝑟𝑎𝑤𝑖𝑛𝑔;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑖𝑚𝑎𝑔𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.image = '𝑢𝑟𝑙';
𝑜𝑏𝑗𝑒𝑐𝑡.images = 𝑥;
𝑜𝑏𝑗𝑒𝑐𝑡.images = [𝑥,𝑦];
𝑛𝑒𝑤𝑂𝑏𝑗𝑒𝑐𝑡 = 𝑜𝑏𝑗𝑒𝑐𝑡.clone;
𝑜𝑏𝑗𝑒𝑐𝑡.style({𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, 𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, …});
```


### [Drawing](user-guide.md#drawing)
```html
HTML:
<drawing id="𝑑𝑟𝑎𝑤𝑖𝑛𝑔" width="𝑤𝑖𝑑𝑡ℎ" height="ℎ𝑒𝑖𝑔ℎ𝑡" color="𝑐𝑜𝑙𝑜𝑟">
<drawing id="𝑑𝑟𝑎𝑤𝑖𝑛𝑔" size="𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡" color="𝑐𝑜𝑙𝑜𝑟">
<drawing id="𝑑𝑟𝑎𝑤𝑖𝑛𝑔" size="𝑤𝑖𝑑𝑡ℎ" color="𝑐𝑜𝑙𝑜𝑟">
<moveto center="𝑥,𝑦" x="𝑥" y="𝑦">
<lineto center="𝑥,𝑦" x="𝑥" y="𝑦">
<curveto m="𝑚𝑥,𝑚𝑦" mx="𝑚𝑥" my="𝑚𝑦" center="𝑥,𝑦" x="𝑥" y="𝑦">
<arc center="𝑥,𝑦" x="𝑥" y="𝑦" radius="𝑟𝑎𝑑𝑖𝑢𝑠" from="𝑓𝑟𝑜𝑚" to="𝑡𝑜" cw cw="𝑐𝑤" ccw ccw="𝑐𝑐𝑤">
<stroke color="𝑐𝑜𝑙𝑜𝑟" width="𝑤𝑖𝑑𝑡ℎ" closed close="𝑐𝑙𝑜𝑠𝑒𝑑">
<fill color="𝑐𝑜𝑙𝑜𝑟">
<filltext center="𝑥,𝑦" x="𝑥" y="𝑦" text="𝑡𝑒𝑥𝑡" color="𝑐𝑜𝑙𝑜𝑟" font="𝑓𝑜𝑛𝑡">
<clear>
<clear color="𝑐𝑜𝑙𝑜𝑟">
```
```js
JS:
𝑑𝑟𝑎𝑤𝑖𝑛𝑔 = 𝑠𝑢𝑖𝑐𝑎.drawing( 𝑤𝑖𝑑𝑡ℎ, ℎ𝑒𝑖𝑔ℎ𝑡, 𝑐𝑜𝑙𝑜𝑟 );
𝑑𝑟𝑎𝑤𝑖𝑛𝑔.moveTo( 𝑥, 𝑦 );
𝑑𝑟𝑎𝑤𝑖𝑛𝑔.lineTo( 𝑥, 𝑦 );
𝑑𝑟𝑎𝑤𝑖𝑛𝑔.curveTo( 𝑚𝑥, 𝑚𝑦, 𝑥, 𝑦 );
𝑑𝑟𝑎𝑤𝑖𝑛𝑔.arc( 𝑥, 𝑦, 𝑟𝑎𝑑𝑖𝑢𝑠, 𝑓𝑟𝑜𝑚, 𝑡𝑜, 𝑐𝑤 );
𝑑𝑟𝑎𝑤𝑖𝑛𝑔.stroke( 𝑐𝑜𝑙𝑜𝑟, 𝑤𝑖𝑑𝑡ℎ, 𝑐𝑙𝑜𝑠𝑒 );
𝑑𝑟𝑎𝑤𝑖𝑛𝑔.fill( 𝑐𝑜𝑙𝑜𝑟 );
𝑑𝑟𝑎𝑤𝑖𝑛𝑔.fillText( 𝑥, 𝑦, 𝑡𝑒𝑥𝑡, 𝑐𝑜𝑙𝑜𝑟, 𝑓𝑜𝑛𝑡 );
𝑑𝑟𝑎𝑤𝑖𝑛𝑔.clear( );
𝑑𝑟𝑎𝑤𝑖𝑛𝑔.clear( 𝑐𝑜𝑙𝑜𝑟 );
```


### [Events](user-guide.md#events)
```
Events:
onMouseEnter, onMouseMove, onMouseLeave, onMouseDown, onClick, onMouseUp, onTime
```
```html
HTML:
<suica 𝑒𝑣𝑒𝑛𝑡𝑁𝑎𝑚𝑒="𝑒𝑣𝑒𝑛𝑡𝐻𝑎𝑛𝑑𝑙𝑒𝑟">
<suica 𝑜𝑛𝐸𝑣𝑒𝑛𝑡𝑁𝑎𝑚𝑒="𝑒𝑣𝑒𝑛𝑡𝐻𝑎𝑛𝑑𝑙𝑒𝑟">
<𝑜𝑏𝑗𝑒𝑐𝑡 𝑒𝑣𝑒𝑛𝑡𝑁𝑎𝑚𝑒="𝑒𝑣𝑒𝑛𝑡𝐻𝑎𝑛𝑑𝑙𝑒𝑟">
<𝑜𝑏𝑗𝑒𝑐𝑡 𝑜𝑛𝐸𝑣𝑒𝑛𝑡𝑁𝑎𝑚𝑒="𝑒𝑣𝑒𝑛𝑡𝐻𝑎𝑛𝑑𝑙𝑒𝑟">
<suica proactive>
<proactive>
```
```js
JS:
𝑠𝑢𝑖𝑐𝑎.𝑜𝑛𝑒𝑣𝑒𝑛𝑡𝑛𝑎𝑚𝑒 = 𝑒𝑣𝑒𝑛𝑡𝐻𝑎𝑛𝑑𝑙𝑒𝑟; // lowercase 𝑜𝑛𝑒𝑣𝑒𝑛𝑡𝑛𝑎𝑚𝑒
𝑜𝑏𝑗𝑒𝑐𝑡.𝑜𝑛𝑒𝑣𝑒𝑛𝑡𝑛𝑎𝑚𝑒 = 𝑒𝑣𝑒𝑛𝑡𝐻𝑎𝑛𝑑𝑙𝑒𝑟;
𝑠𝑢𝑖𝑐𝑎.𝑜𝑛𝑒𝑣𝑒𝑛𝑡𝑛𝑎𝑚𝑒 = null;
𝑜𝑏𝑗𝑒𝑐𝑡.𝑜𝑛𝑒𝑣𝑒𝑛𝑡𝑛𝑎𝑚𝑒 = null;

𝑠𝑢𝑖𝑐𝑎.addEventListener( 𝑒𝑣𝑒𝑛𝑡𝑁𝑎𝑚𝑒, 𝑒𝑣𝑒𝑛𝑡𝐻𝑎𝑛𝑑𝑙𝑒𝑟 );
𝑠𝑢𝑖𝑐𝑎.addEventListener( 𝑜𝑛𝐸𝑣𝑒𝑛𝑡𝑁𝑎𝑚𝑒, 𝑒𝑣𝑒𝑛𝑡𝐻𝑎𝑛𝑑𝑙𝑒𝑟 );
𝑜𝑏𝑗𝑒𝑐𝑡.addEventListener( 𝑒𝑣𝑒𝑛𝑡𝑁𝑎𝑚𝑒, 𝑒𝑣𝑒𝑛𝑡𝐻𝑎𝑛𝑑𝑙𝑒𝑟 );
𝑜𝑏𝑗𝑒𝑐𝑡.addEventListener( 𝑜𝑛𝐸𝑣𝑒𝑛𝑡𝑁𝑎𝑚𝑒, 𝑒𝑣𝑒𝑛𝑡𝐻𝑎𝑛𝑑𝑙𝑒𝑟 );

𝑠𝑢𝑖𝑐𝑎.removeEventListener( 𝑒𝑣𝑒𝑛𝑡𝑁𝑎𝑚𝑒 );
𝑠𝑢𝑖𝑐𝑎.removeEventListener( 𝑜𝑛𝐸𝑣𝑒𝑛𝑡𝑁𝑎𝑚𝑒 );
𝑜𝑏𝑗𝑒𝑐𝑡.removeEventListener( 𝑒𝑣𝑒𝑛𝑡𝑁𝑎𝑚𝑒 );
𝑜𝑏𝑗𝑒𝑐𝑡.removeEventListener( 𝑜𝑛𝐸𝑣𝑒𝑛𝑡𝑁𝑎𝑚𝑒 );

function 𝑒𝑣𝑒𝑛𝑡𝐻𝑎𝑛𝑑𝑙𝑒𝑟( 𝑒𝑣𝑒𝑛𝑡 )
{
   𝑝𝑜𝑠 = 𝑠𝑢𝑖𝑐𝑎.findPosition( 𝑒𝑣𝑒𝑛𝑡 );
   𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑠𝑢𝑖𝑐𝑎.findObject( 𝑒𝑣𝑒𝑛𝑡 );
   𝑜𝑏𝑗𝑒𝑐𝑡𝑠 = 𝑠𝑢𝑖𝑐𝑎.findObjects( 𝑒𝑣𝑒𝑛𝑡 );
}

function 𝑜𝑛𝑇𝑖𝑚𝑒𝐸𝑣𝑒𝑛𝑡𝐻𝑎𝑛𝑑𝑙𝑒𝑟( 𝑡, 𝑑𝑇 )
{
}

𝑠𝑢𝑖𝑐𝑎.proactive( );

```


### [Functions](user-guide.md#functions)
```html
HTML:
<spline src="𝑥,𝑦,𝑧;..." 𝑐𝑙𝑜𝑠𝑒𝑑 𝑐𝑙𝑜𝑠𝑒𝑑="..." 𝑜𝑝𝑒𝑛 𝑜𝑝𝑒𝑛="...">
<spline src="𝑥,𝑦,𝑧;..." 𝑖𝑛𝑡𝑒𝑟𝑝𝑜𝑙𝑎𝑡𝑖𝑛𝑔 𝑖𝑛𝑡𝑒𝑟𝑝𝑜𝑙𝑎𝑡𝑖𝑛𝑔="..." 𝑎𝑝𝑝𝑟𝑜𝑥𝑖𝑚𝑎𝑡𝑖𝑛𝑔 𝑎𝑝𝑝𝑟𝑜𝑥𝑖𝑚𝑎𝑡𝑖𝑛𝑔="...">
<spline src="𝑓𝑢𝑛𝑐𝑡𝑖𝑜𝑛𝑁𝑎𝑚𝑒">
```

```js
JS:
random( 𝑓𝑟𝑜𝑚, 𝑡𝑜 );
random( [𝑎, 𝑏, 𝑐, ...] );

radians( 𝑑𝑒𝑔𝑟𝑒𝑒𝑠 );
degrees( 𝑟𝑎𝑑𝑖𝑎𝑛𝑠 );

style( 𝑜𝑏𝑗𝑒𝑐𝑡, {𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, 𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, …} );

its.𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦 = 𝑣𝑎𝑙𝑢𝑒;

spline( [𝑝𝑜𝑖𝑛𝑡,𝑝𝑜𝑖𝑛𝑡,𝑝𝑜𝑖𝑛𝑡,...], 𝑐𝑙𝑜𝑠𝑒𝑑, 𝑖𝑛𝑡𝑒𝑟𝑝𝑜𝑙𝑎𝑡𝑖𝑛𝑔 );
spline( 𝑓𝑢𝑛𝑐𝑡𝑖𝑜𝑛𝑁𝑎𝑚𝑒, 𝑝𝑎𝑟𝑎𝑚1, 𝑝𝑎𝑟𝑎𝑚2 );
function 𝑓𝑢𝑛𝑐𝑡𝑖𝑜𝑛𝑁𝑎𝑚𝑒 (𝑢, 𝑝𝑎𝑟𝑎𝑚1, 𝑝𝑎𝑟𝑎𝑚2) {...}