# <img src="../logo.min.png" height="40" style="position:relative; top:7px;"/> Suica Reference Guide

[Suica](#suica) [Color](#color) [Point](#point) [Line](#line) [Square](#square) [Circle](#circle) [Polygon](#polygon) [Cube](#cube) [Sphere](#sphere) [Cylinder](#cylinder) [Prism](#prism) [Cone](#cone) [Pyramid](#pyramid) [Functions](#functions)

### [Suica](user-guide.md#suica-canvas)

```html
HTML:
<script src="suica.js"></script>
<script src="suica.min.js"></script>
```

```html
HTML:
<suica id="𝑠𝑢𝑖𝑐𝑎" width="𝑤𝑖𝑑𝑡ℎ" height="ℎ𝑒𝑖𝑔ℎ𝑡" background="𝑐𝑜𝑙𝑜𝑟" orientation="𝑥𝑦𝑧">
<suica perspective="𝑛𝑒𝑎𝑟,𝑓𝑎𝑟,𝑓𝑜𝑣" orthographic="𝑛𝑒𝑎𝑟,𝑓𝑎𝑟" fullscreen fullwindow anaglyph="𝑑𝑖𝑠𝑡𝑎𝑛𝑐𝑒" stereo="𝑑𝑖𝑠𝑡𝑎𝑛𝑐𝑒" vr>
<suica style="width:𝑤𝑖𝑑𝑡ℎ; height:ℎ𝑒𝑖𝑔ℎ𝑡; background:𝑐𝑜𝑙𝑜𝑟;">
<perspective near="𝑛𝑒𝑎𝑟" far="𝑓𝑎𝑟" fov="𝑓𝑜𝑣">
<orthographic near="𝑛𝑒𝑎𝑟" far="𝑓𝑎𝑟">
<lookat from="𝑓𝑟𝑜𝑚" to="𝑡𝑜" up="𝑢𝑝">
<fullscreen>
<fullwindow>
<stereo distance="𝑑𝑖𝑠𝑡𝑎𝑛𝑐𝑒">
<anaglyph distance="𝑑𝑖𝑠𝑡𝑎𝑛𝑐𝑒">
<vr>
<background color="𝑐𝑜𝑙𝑜𝑟">
<oxyz size="𝑠𝑖𝑧𝑒" color="𝑐𝑜𝑙𝑜𝑟">
<demo distance="𝑑𝑖𝑠𝑡𝑎𝑛𝑐𝑒" altitude="𝑎𝑙𝑡𝑖𝑡𝑢𝑑𝑒">
<ontime src="𝑓𝑢𝑛𝑐𝑡𝑖𝑜𝑛">
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
𝑠𝑢𝑖𝑐𝑎.background( 𝑐𝑜𝑙𝑜𝑟 );
𝑠𝑢𝑖𝑐𝑎.oxyz( 𝑠𝑖𝑧𝑒, 𝑐𝑜𝑙𝑜𝑟 );
𝑠𝑢𝑖𝑐𝑎.demo( 𝑑𝑖𝑠𝑡𝑎𝑛𝑐𝑒, 𝑎𝑙𝑡𝑖𝑡𝑢𝑑𝑒 );
𝑠𝑢𝑖𝑐𝑎.onTime( 𝑓𝑢𝑛𝑐𝑡𝑖𝑜𝑛 );
𝑠𝑢𝑖𝑐𝑎.onTime( );

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
𝑛𝑒𝑤𝑂𝑏𝑗𝑒𝑐𝑡 = 𝑜𝑏𝑗𝑒𝑐𝑡.clone;
𝑜𝑏𝑗𝑒𝑐𝑡.style({𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, 𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, …});
```


### [Line](user-guide.md#line)

```html
HTML:
<line id="𝑜𝑏𝑗𝑒𝑐𝑡" center="𝑥,𝑦,𝑧" to="𝑥,𝑦,𝑧" color="𝑐𝑜𝑙𝑜𝑟">
<line id="𝑜𝑏𝑗𝑒𝑐𝑡" from="𝑥,𝑦,𝑧" to="𝑥,𝑦,𝑧" color="𝑐𝑜𝑙𝑜𝑟">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑠𝑢𝑖𝑐𝑎.line( [𝑥,𝑦,𝑧], [𝑥,𝑦,𝑧], 𝑐𝑜𝑙𝑜𝑟 );
𝑜𝑏𝑗𝑒𝑐𝑡.center = [𝑥,𝑦,𝑧];
𝑜𝑏𝑗𝑒𝑐𝑡.from = [𝑥,𝑦,𝑧];
𝑜𝑏𝑗𝑒𝑐𝑡.to = [𝑥,𝑦,𝑧];
𝑜𝑏𝑗𝑒𝑐𝑡.color = 𝑐𝑜𝑙𝑜𝑟;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑑𝑟𝑎𝑤𝑖𝑛𝑔;
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
𝑜𝑏𝑗𝑒𝑐𝑡.wireframe = 𝑡𝑟𝑢𝑒/𝑓𝑎𝑙𝑠𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑑𝑟𝑎𝑤𝑖𝑛𝑔;
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
𝑜𝑏𝑗𝑒𝑐𝑡.wireframe = 𝑡𝑟𝑢𝑒/𝑓𝑎𝑙𝑠𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑑𝑟𝑎𝑤𝑖𝑛𝑔;
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
𝑜𝑏𝑗𝑒𝑐𝑡.wireframe = 𝑡𝑟𝑢𝑒/𝑓𝑎𝑙𝑠𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑑𝑟𝑎𝑤𝑖𝑛𝑔;
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
𝑜𝑏𝑗𝑒𝑐𝑡.wireframe = 𝑡𝑟𝑢𝑒/𝑓𝑎𝑙𝑠𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑑𝑟𝑎𝑤𝑖𝑛𝑔;
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
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑑𝑟𝑎𝑤𝑖𝑛𝑔;
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
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑑𝑟𝑎𝑤𝑖𝑛𝑔;
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
𝑜𝑏𝑗𝑒𝑐𝑡.wireframe = 𝑡𝑟𝑢𝑒/𝑓𝑎𝑙𝑠𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑑𝑟𝑎𝑤𝑖𝑛𝑔;
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
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑑𝑟𝑎𝑤𝑖𝑛𝑔;
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
𝑜𝑏𝑗𝑒𝑐𝑡.wireframe = 𝑡𝑟𝑢𝑒/𝑓𝑎𝑙𝑠𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑑𝑟𝑎𝑤𝑖𝑛𝑔;
𝑛𝑒𝑤𝑂𝑏𝑗𝑒𝑐𝑡 = 𝑜𝑏𝑗𝑒𝑐𝑡.clone;
𝑜𝑏𝑗𝑒𝑐𝑡.style({𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, 𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, …});
```


### [Functions](user-guide.md#functions)
```js
JS:
random( 𝑓𝑟𝑜𝑚, 𝑡𝑜 );
random( [𝑎, 𝑏, 𝑐, ...] );
radians( 𝑑𝑒𝑔𝑟𝑒𝑒𝑠 );
degrees( 𝑟𝑎𝑑𝑖𝑎𝑛𝑠 );
style( 𝑜𝑏𝑗𝑒𝑐𝑡, {𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, 𝑝𝑟𝑜𝑝𝑒𝑟𝑡𝑦:𝑣𝑎𝑙𝑢𝑒, …} );
```


---

February, 2022