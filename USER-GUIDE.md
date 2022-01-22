# Suica
Mobile 3D made simple

# Table of contents

- [Initialization](#initialization)
- [General methods](#general-methods)
	- [background](#background)
	- [oxyz](#oxyz)
	- [animate](#animate)
- [Properties](#properties)
	- [Colors](#colors)


# Initialization

Suica generates 3D images and animations only inside the HTML tag `<suica>`.
The properties of the canvas can be defined either as tag attributes or
as CSS style.

### Attributes

- `id` &ndash; string for the name of the canvas
- `width` &ndash; number for the width of the canvas (in pixels)
- `height` &ndash; number for the height of the canvas (in pixels)
- `background` &ndash; string for the background color ([details](#colors))

```html
<suica id="a" width="500" height="300" background="lightgray">
	:
</suica>
```


Supported attributes are `width` and `height` of the canvas (in pixels),
`style` with CSS formating, and `id`.

The CSS rules
, which is created as global variable.

(`background` is used for canvas background, `width` and `height` can overwrite the `width` and `height` attributes)

```html
<suica-canvas id="..." width="..." height="..." style="background:...; width:...; height:...;">
  :
</suica-canvas>
```


# General methods

### background

Sets the background color of a Suica canvas.

```html
<suica-canvas style="background:white;">
  :
</suica-canvas>
```

```html
<background color="white">
```

```javascript
background( 'white' );
```

### oxyz

Draws the coordinate systems with specific length and color of axes.

```javascript
oxyz( );
oxyz( 30 );
oxyz( 30, 'black' );
```

```html
<oxyz>
<oxyz size="30">
<oxyz color="black">
<oxyz size="30" color="black">
```

### animate

Sets the animation user-defined function. This function is called every frame and has two parameters &ndash; total elapsed time `t` and elapsed time since previous frame `td`, bith measured in seconds.

```html
<animate src="loop">
```

```javascript
animate( loop );

function loop( t, dt ) {...}
```

# Properties
TBD

### Colors
TBD


---

January, 2022