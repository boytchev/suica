# <img src="../logo.min.png" height="40" style="position:relative; top:7px;"/> Suica Reference Guide

[Suica](#suica) | [Color](#color) | [Point](#point) | [Line](#line) | [Square](#square) | [SquareFrame](#squareframe) | [Cube](#cube) | [CubeFrame](#cubeframe)

### Suica

```html
HTML:
<script src="suica.js"></script>
<script src="suica.min.js"></script>
```

```html
HTML:
<suica id="𝑠𝑢𝑖𝑐𝑎" width="𝑤𝑖𝑑𝑡ℎ" height="ℎ𝑒𝑖𝑔ℎ𝑡" background="𝑐𝑜𝑙𝑜𝑟" orientation="">
<suica style="width:𝑤𝑖𝑑𝑡ℎ; height:ℎ𝑒𝑖𝑔ℎ𝑡; background:𝑐𝑜𝑙𝑜𝑟;">
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

### Color

```js
'𝑐𝑜𝑙𝑜𝑟-𝑛𝑎𝑚𝑒'
#𝐹𝐹𝐹𝐹𝐹𝐹                     // 000000..FFFFFF
0x𝐹𝐹𝐹𝐹𝐹𝐹                    // 000000..FFFFFF
'𝑟𝑒𝑑,𝑔𝑟𝑒𝑒𝑛,𝑏𝑙𝑢𝑒'             // 0..1
[𝑟𝑒𝑑,𝑔𝑟𝑒𝑒𝑛,𝑏𝑙𝑢𝑒]             // 0..1
rgb(𝑟𝑒𝑑,𝑔𝑟𝑒𝑒𝑛,𝑏𝑙𝑢𝑒)          // 0..255
hsl(ℎ𝑢𝑒,𝑠𝑎𝑡𝑢𝑟𝑎𝑡𝑖𝑜𝑛,𝑙𝑖𝑔ℎ𝑡𝑛𝑒𝑠𝑠)  // 0..360, 0..100, 0..100
```

### Point

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
```


### Line

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
```


### Square

```html
HTML:
<square id="𝑜𝑏𝑗𝑒𝑐𝑡" center="𝑥,𝑦,𝑧" size="𝑠𝑖𝑧𝑒" color="𝑐𝑜𝑙𝑜𝑟">
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
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑑𝑟𝑎𝑤𝑖𝑛𝑔;
```


### SquareFrame

```html
HTML:
<squareframe id="𝑜𝑏𝑗𝑒𝑐𝑡" center="𝑥,𝑦,𝑧" size="𝑠𝑖𝑧𝑒" color="𝑐𝑜𝑙𝑜𝑟">
<squareframe x="𝑥" y="𝑦" z="𝑧">
<squareframe size="𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡">
<squareframe width="𝑤𝑖𝑑𝑡ℎ" height="ℎ𝑒𝑖𝑔ℎ𝑡">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑠𝑢𝑖𝑐𝑎.squareFrame( [𝑥,𝑦,𝑧], 𝑠𝑖𝑧𝑒, 𝑐𝑜𝑙𝑜𝑟 );
𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑠𝑢𝑖𝑐𝑎.squareFrame( [𝑥,𝑦,𝑧], [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡], 𝑐𝑜𝑙𝑜𝑟 );
𝑜𝑏𝑗𝑒𝑐𝑡.center = [𝑥,𝑦,𝑧];
𝑜𝑏𝑗𝑒𝑐𝑡.x = 𝑥;
𝑜𝑏𝑗𝑒𝑐𝑡.y = 𝑦;
𝑜𝑏𝑗𝑒𝑐𝑡.z = 𝑧;
𝑜𝑏𝑗𝑒𝑐𝑡.size = 𝑠𝑖𝑧𝑒;
𝑜𝑏𝑗𝑒𝑐𝑡.size = [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ];
𝑜𝑏𝑗𝑒𝑐𝑡.width = 𝑤𝑖𝑑𝑡ℎ;
𝑜𝑏𝑗𝑒𝑐𝑡.height = ℎ𝑒𝑖𝑔ℎ𝑡;
𝑜𝑏𝑗𝑒𝑐𝑡.color = 𝑐𝑜𝑙𝑜𝑟;
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑑𝑟𝑎𝑤𝑖𝑛𝑔;
```


### Cube

```html
HTML:
<cube id="𝑜𝑏𝑗𝑒𝑐𝑡" center="𝑥,𝑦,𝑧" size="𝑠𝑖𝑧𝑒" color="𝑐𝑜𝑙𝑜𝑟">
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
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑑𝑟𝑎𝑤𝑖𝑛𝑔;
```


### CubeFrame

```html
HTML:
<cubeframe id="𝑜𝑏𝑗𝑒𝑐𝑡" center="𝑥,𝑦,𝑧" size="𝑠𝑖𝑧𝑒" color="𝑐𝑜𝑙𝑜𝑟">
<cubeframe x="𝑥" y="𝑦" z="𝑧">
<cubeframe size="𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ">
<cubeframe width="𝑤𝑖𝑑𝑡ℎ" height="ℎ𝑒𝑖𝑔ℎ𝑡" depth="𝑑𝑒𝑝𝑡ℎ">
```
```js
JS:
𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑠𝑢𝑖𝑐𝑎.cubeFrame( [𝑥,𝑦,𝑧], 𝑠𝑖𝑧𝑒, 𝑐𝑜𝑙𝑜𝑟 );
𝑜𝑏𝑗𝑒𝑐𝑡 = 𝑠𝑢𝑖𝑐𝑎.cubeFrame( [𝑥,𝑦,𝑧], [𝑤𝑖𝑑𝑡ℎ,ℎ𝑒𝑖𝑔ℎ𝑡,𝑑𝑒𝑝𝑡ℎ], 𝑐𝑜𝑙𝑜𝑟 );
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
𝑜𝑏𝑗𝑒𝑐𝑡.image = 𝑑𝑟𝑎𝑤𝑖𝑛𝑔;
```


---

February, 2022