 document.write( '<script src="three.min.js" onload="LoadSuica();"></script>' );﻿function LoadSuica(){ 
﻿//
// Suica 2.0
// CC-3.0-SA-NC
//
//	<suica width="..." height="..." style="...">
//		<background color="...">
//		<oxyz size="..." color="...">
//		<demo distance="..." altitude="...">
//		<ontime src="...">
//		<point id="..." center="..." color="..." size="...">
//	</suica>
//
//	<script>
//		{suica.}background( color )
//		{suica.}oxyz( size, color )
//		{suica.}demo( distance, altitude )
//		{suica.}onTime( src )
//		{suica.}point( center, size, color )
//		
//		random( from, to )
//		random( array )
//	</script>
//
//		
//===================================================
//
// History
//	2.0.00 (220118)	initiation
//	2.0.01 (220119)	custom & nested tags, background, oxyz, animate
//	2.0.02 (220120) point
//	2.0.03 (220122) autoload js files, cube
//	2.0.04 (220124) demo, examples, onTime
//	2.0.05 (220126) random, drawing, lineTo, moveTo, stroke, fill, fillAndStroke
//	2.0.06 (220128) build process
//
//===================================================


// show suica version
console.log( `Suica 2.0.3 (220122)` );


// control flags
const DEBUG_CALLS = !false;





//========================================================================
//
// class Suica
//
// Implements custom tag <suica> and creates a tag <canvas> inside it
//
//========================================================================

class Suica
{
	// current active Suica instance
	static current;
	
	// array of all Suicas
	static allSuicas = [];
	
	// default values for Suica commands
	static DEFAULT = {
		BACKGROUND: { COLOR: 'whitesmoke' },
		OXYZ: { COLOR: 'black', SIZE: 30 },
		DEMO: { DISTANCE: 100, ALTITUDE: 30 },
		ONTIME: { SRC: null },
		POINT: { CENTER:[0,0,0], COLOR:'crimson', SIZE:7 },
		CUBE: { CENTER:[0,0,0], COLOR:'cornflowerblue', SIZE:30 },
	} // Suica.DEFAULT
	
	
	constructor( suicaTag )
	{
		// fix styling of <suica>
		suicaTag.style.display = 'inline-block';
		suicaTag.style.boxSizing = 'border-box';
		
		// get or invent id
		this.id = suicaTag.getAttribute('id') || `suica${Suica.allSuicas.length}`
		if( DEBUG_CALLS ) console.log(`Suica :: ${this.id}`);
		
		this.suicaTag = suicaTag;

		// create and initialize <canvas>
		this.createCanvas( ); // creates this.canvas
		this.createRenderer( ); // creates this.rendered, this.scene, this.camera
		this.createMaterials( );
		
		// define parsers for suica tags inside <suica>
		this.parser = new HTMLParser( this );
		
		// frame-based animation
		this.onTimeHandler = null;
		
		// automatic rotation
		this.demoViewPoint = null;
		
		// register this suica instance
		Suica.current = this; // as current Suica
		Suica.allSuicas.push( this ); // as one of all Suicas
		window[this.id] = this; // as global variable
		
	} // Suica.constructor
	
	
	// create canvas element inside <suica>
	createCanvas()
	{
		// calculates size - if size is not defined in CSS,
		// than use <suica> attributes, or default values
		if( this.suicaTag.clientWidth < 1 )
			this.suicaTag.style.width = (this.suicaTag.getAttribute('width') || 500) + 'px';

		if( this.suicaTag.clientHeight < 1 )
			this.suicaTag.style.height = (this.suicaTag.getAttribute('height') || 300) + 'px';

		// create canvas elements
		this.canvas = document.createElement( 'canvas' );
		this.canvas.width = this.suicaTag.clientWidth;
		this.canvas.height = this.suicaTag.clientHeight;
		this.canvas.style = `	border: solid 1px gray;
								width: 100%;
								height: 100%;
								box-sizing: border-box;`;
		this.suicaTag.appendChild( this.canvas );
		
	} // Suica.createCanvas
	

	// pseudo-element to calculates the canvas aspect
	get canvasAspect( )
	{
		return this.canvas.width / this.canvas.height;
		
	} // Suica.canvasAspect
	
	
	// render the current scene
	render( )
	{
		this.renderer.render( this.scene, this.camera );
		
	} // Suica.render
	
	
	// create Three.js renderer bound to <canvas>
	createRenderer( )
	{
		// renderer with antialias and alpha
		this.renderer = new THREE.WebGLRenderer( {
							canvas: this.canvas,
							alpha: true,
							antialias: true
						} );

		// scene with background from <suica>'s CSS
		this.scene = new THREE.Scene();

		var color = getComputedStyle(this.suicaTag).backgroundColor;
		if( color == 'rgba(0, 0, 0, 0)' )
		{
			color = this.suicaTag.getAttribute('background') || Suica.DEFAULT.BACKGROUND.COLOR;
		}
		this.scene.background = Suica.parseColor( color );

		// default perspective camera
		this.camera = new THREE.PerspectiveCamera( 40, this.canvasAspect, 1, 1000 );
		this.camera.position.set( 0, 0, 100 );
		this.camera.lookAt( this.scene.position );

		// default light
		this.light = new THREE.PointLight( 'white', 1 );
		this.light.position.set( 100, 150, 300 );
		this.scene.add( this.light );
			
		// main animation loop
		var that = this;
		this.lastTime = 0;
		
		function loop( time )
		{
			time /= 1000; // convert miliseconds to seconds
			
			if( that.demoViewPoint )
			{
				that.camera.position.setFromCylindricalCoords( that.demoViewPoint.distance, time, that.demoViewPoint.altitude );
				that.camera.lookAt( that.scene.position );
				
				that.light.position.copy( that.camera.position );
			}
			
			if( that.onTimeHandler )
			{
				// OMG, I have never expected to use eval() in actual code, but here I am
				if (typeof that.onTimeHandler === 'string' || that.onTimeHandler instanceof String)
					that.onTimeHandler = window[that.onTimeHandler];
				
				that.onTimeHandler( time, time-that.lastTime );
			}
			
			that.render( );

			that.lastTime = time;
			
		} // Suica.createRenderer.loop
		
		this.renderer.setAnimationLoop( loop );

	} // Suica.createRenderer


	
	// create default materials for SUica objects
	createMaterials( )
	{
		// point material
		var CANVAS_SIZE = 64;
		var canvas = document.createElement('canvas');
			canvas.width = CANVAS_SIZE;
			canvas.height = CANVAS_SIZE;
			
		var context = canvas.getContext('2d');
			context.fillStyle = 'white';
			context.beginPath( );
			context.arc( CANVAS_SIZE/2, CANVAS_SIZE/2, CANVAS_SIZE/2-1, 0, 2*Math.PI );
			context.fill( );

		Suica.pointMaterial = new THREE.PointsMaterial( {
				color: 'white',
				size: 5,
				sizeAttenuation: false,
				map: new THREE.CanvasTexture( canvas ),
				transparent: true,
				alphaTest: 0.75,
			});

		Suica.solidMaterial = new THREE.MeshStandardMaterial( {
				color: 'cornflowerblue',
			});
	}
	
	
	
	background( color=Suica.DEFAULT.BACKGROUND.COLOR )
	{
		this.parser?.parseTags();
		if( DEBUG_CALLS ) console.log(`:: ${this.id}.background( ${color} )`);
		
		this.scene.background = new THREE.Color( color );
	}
	
	
	oxyz( size=Suica.DEFAULT.OXYZ.SIZE, color=Suica.DEFAULT.OXYZ.COLOR )
	{
		this.parser?.parseTags();
		if( DEBUG_CALLS ) console.log(`:: ${this.id}.oxyz( ${size}, ${color} )`);
		
		var axes = new THREE.AxesHelper( size )
			axes.setColors( color, color, color );
		this.scene.add( axes );
	}
	
	
	demo( distance=Suica.DEFAULT.DEMO.DISTANCE, altitude=Suica.DEFAULT.DEMO.ALTITUDE )
	{
		this.parser?.parseTags();
		if( DEBUG_CALLS ) console.log(`:: ${this.id}.demo( ${distance}, ${altitude} )`);
		
		this.demoViewPoint = {distance:distance, altitude:altitude};
	}
	
	
	onTime( src=Suica.DEFAULT.ONTIME.SRC )
	{
		this.parser?.parseTags();
		if( DEBUG_CALLS ) console.log(`:: ${this.id}.onTime( ${src} )`);
		
		this.onTimeHandler = src;
	}
	
	
	static precheck()
	{
		if( !(Suica.current instanceof Suica) )
			throw 'error: No Suica instance is active';
	}
	

	static parseColor( color )
	{
		if( color instanceof THREE.Color )
			return color;

		if( Array.isArray(color) )
			return new THREE.Color( color[0], color[1]||0, color[2]||0 );

		if( typeof color === 'string' || color instanceof String )
		{
			color = color.toLowerCase().replaceAll(' ','');
			
			// 0x
			if( color[0]=='0' && color[1]=='x' )
				return new THREE.Color( Number(color) );

			// rgb
			if( color[0]=='r' && color[1]=='g' && color[2]=='b' )
				return new THREE.Color( color );

			// hsl
			if( color[0]=='h' && color[1]=='s' && color[2]=='l' )
			{
				// hsl without %
				color = color.substring(4).split(',');
				return hsl( parseFloat(color[0]), parseFloat(color[1]), parseFloat(color[2]));
			}
			
			// r,g,b
			if( color.indexOf(',') > 0 )
			{
				color = color.split(',');
				return new THREE.Color( Number(color[0]), Number(color[1]), Number(color[2]) );
			}
		}

		return new THREE.Color( color || 'white' );
	}
	
	
	static parseCenter( center )
	{
		// center is object with center
		if( center.center )
			return center.center;

		// center is array [x,y,z]
		if( Array.isArray(center) )
			return center;

		// center is string 'x,y,z'
		if( typeof center === 'string' || center instanceof String )
		{
			center = center.replaceAll(' ','');
			
			if( center.indexOf(',') > 0 )
			{
				center = center.split(',');
				return [Number(center[0]), Number(center[1]), Number(center[2]) ];
			}
		}

		return center;
	}
	
	
	static parseColorTest( )
	{
		function test( color )
		{
			var parsedColor = Suica.parseColor( color );
			
			if( parsedColor.r==1 && parsedColor.g==0 && parsedColor.b==0 )
				return null;
			
			return color;
		}
		
		var testValues = [
				'red',
				'Red',
				'RED',
				
				0xFF0000,
				0XFF0000,
				'0XFF0000',
				'0xFF0000',
				'0xff0000',
				'0Xff0000',
				
				[1, 0, 0],
				'1,0,0',
				'1, 0, 0',
				
				'rgb(255,0,0)',
				'rgb( 255, 0, 0)',
				' rgb ( 255 , 0 , 0 ) ',
				'RGB( 255, 0, 0 )',
				rgb( 255, 0, 0 ),
				
				'hsl(0,100,50)',
				'hsl( 0, 100, 50 )',
				' hsl ( 0 , 100 , 50 ) ',
				'HSL( 0, 100, 50 )',
				hsl( 0, 100, 50 ),		
				
				new THREE.Color('red')
			]
			
		var summary = [];
		for( var value of testValues )
		{
			var result = test( value );
			if( result ) summary.push( result );
		}
		
		if( summary.length )
			console.log( `Suica::parseColorTest() - failed at: \n\t|${summary.join('|\n\t|')}|` );
		else
			console.log( `Suica::parseColorTest() - passed OK` );
	}
	
	
	
	point( center=Suica.DEFAULT.POINT.CENTER, size=Suica.DEFAULT.POINT.SIZE, color=Suica.DEFAULT.POINT.COLOR )
	{
		this.parser?.parseTags();
		if( DEBUG_CALLS ) console.log(`:: ${this.id}.point( [${center}], ${size}, ${color} )`);

		return new Point( this, center, size, color );
	}
	
	
	cube( center=Suica.DEFAULT.CUBE.CENTER, size=Suica.DEFAULT.CUBE.SIZE, color=Suica.DEFAULT.CUBE.COLOR )
	{
		this.parser?.parseTags();
		if( DEBUG_CALLS ) console.log(`:: ${this.id}.cube( [${center}], ${size}, ${color} )`);

		return new Cube( this, center, size, color );
	}

}



class Drawing
{
	// current active Drawing instance
	static current;
		
	constructor( width=32, height=width )
	{
		this.canvas = document.createElement( 'canvas' );
		this.canvas.width = width;
		this.canvas.height = height;
		
		this.texture = null;
		
		this.context = this.canvas.getContext( '2d' );
		this.context.scale( 1, -1 );
		this.context.translate( 0, -height );
		this.context.clearRect( 0, 0, width, height );
		this.context.beginPath( );
	}

	moveTo( x = 0, y = 0 )
	{
		this.context.moveTo( x, y );
	}
	
	lineTo( x = 0, y = 0 )
	{
		this.context.lineTo( x, y );
	}
	
	curveTo( mx = 0, my = 0, x = 0, y = 0 )
	{
		this.context.quadraticCurveTo( mx, my, x, y );
	}

	stroke( color = 'black', width = 1 )
	{
		this.texture = null; // clear the texture
		
		this.context.strokeStyle = color;
		this.context.lineWidth = width;
		this.context.stroke( );

		this.context.beginPath( );
	}
	
	fill( color = 'gray' )
	{
		this.texture = null; // clear the texture
		
		this.context.fillStyle = color;
		this.context.fill( );

		this.context.beginPath( );
	}

	fillAndStroke( fillColor = 'gray', strokeColor = 'black', width = 1 )
	{
		this.texture = null; // clear the texture
		
		this.context.strokeStyle = strokeColor;
		this.context.lineWidth = width;
		this.context.stroke( );
		
		this.context.fillStyle = fillColor;
		this.context.fill( );

		this.context.beginPath( );
	}

	get image( )
	{
		if( !this.texture )
			this.texture = new THREE.CanvasTexture( this.canvas );
			
		return this.texture;
	}

	
	static precheck()
	{
		if( !(Drawing.current instanceof Drawing) )
			throw 'error: No Drawing instance is active';
	}

} // class Drawing

window.drawing = function ( width=32, height=width )
{
	Drawing.current = new Drawing( width, height );
	return Drawing.current;
}

window.moveTo = function ( x = 0, y = 0 )
{
	Drawing.precheck();
	Drawing.current.moveTo( x, y );
}
	
window.lineTo = function ( x = 0, y = 0 )
{
	Drawing.precheck();
	Drawing.current.lineTo( x, y );
}

window.curveTo = function ( mx = 0, my = 0, x = 0, y = 0 )
{
	Drawing.precheck();
	Drawing.current.curveTo( mx, my, x, y );
}

window.stroke = function ( color = 'black', width = 1 )
{
	Drawing.precheck();
	Drawing.current.stroke( color, width );
}
	
window.fill = function ( color = 'gray' )
{
	Drawing.precheck();
	Drawing.current.fill( color );
}

window.fillAndStroke = function ( fillColor = 'gray', strokeColor = 'black', width = 1 )
{
	Drawing.precheck();
	Drawing.current.fillAndStroke( fillColor, strokeColor, width );
}




window.background = function ( color=Suica.DEFAULT.BACKGROUND.COLOR )
{
	Suica.precheck();
	Suica.current.background( color );
}

window.oxyz = function oxyz( size=Suica.DEFAULT.OXYZ.SIZE, color=Suica.DEFAULT.OXYZ.COLOR )
{
	Suica.precheck();
	Suica.current.oxyz( size, color );
}

window.demo = function ( distance=Suica.DEFAULT.DEMO.DISTANCE, altitude=Suica.DEFAULT.DEMO.ALTITUDE )
{
	Suica.precheck();
	Suica.current.demo( distance, altitude );
}

window.onTime = function ( src=Suica.DEFAULT.ONTIME.SRC )
{
	Suica.precheck();
	Suica.current.onTime( src );
}

window.element = function ( id )
{
	return document.getElementById( id );
}


window.rgb = function ( r, g, b )
{
	return new THREE.Color( r/255, g/255, b/255 );
}


window.hsl = function hsl( h, s, l )
{
	return new THREE.Color( ).setHSL( h/360, s/100, l/100 );
}


window.random = function random( a=0, b=1 )
{
	if( Array.isArray(a) )
	{
		return a[ THREE.Math.randInt(0,a.length-1) ];
	}
	
	return a+(b-a)*Math.random();
}






// monitor creation of tags, we are interested in creation of
// <script> because it might contain Suica tags; thus for each
// <script> try to prase all unparsed Suicas
//
// idea from https://github.com/jspenguin2017/Snippets/blob/master/onbeforescriptexecute.html
new MutationObserver( function( mutations )
	{
		for( var parentElem of mutations )
			for( var childElem of parentElem.addedNodes) 
			{
				if( childElem?.tagName=='SCRIPT' )
					for( var suica of Suica.allSuicas )
						suica.parser?.parseTags();
				if( childElem?.tagName=='SUICA' )
					new Suica( childElem );
			}
	}).observe( document, {childList: true, subtree: true} );

window.addEventListener( 'load', function()
	{
		for( var suica of Suica.allSuicas )
			suica.parser?.parseTags();
	}
);﻿//
// Suica 2.0 Parser
//
// Parses custom tags inside <suica-canvas>.
//
// <background color="...">
// <oxyz size="..." color="...">
// <ontime src="...">
// <point id="..." center="..." color="..." size="...">
//



//========================================================================
//
// class HTMLParser( suica )
//
//========================================================================

class HTMLParser
{
	
	constructor( suica )
	{
		this.suica = suica;

		this.parseTag = {};
		this.parseTag.OXYZ = this.parseTagOXYZ;
		this.parseTag.DEMO = this.parseTagDEMO;
		this.parseTag.BACKGROUND = this.parseTagBACKGROUND;
		this.parseTag.ONTIME = this.parseTagONTIME;
		this.parseTag.POINT = this.parseTagPOINT;
		this.parseTag.CUBE = this.parseTagCUBE;
		
		this.parseTag.BUTTON = this.skipTag;
		this.parseTag.CANVAS = this.skipTag;
		this.parseTag.DIV = this.skipTag;
		this.parseTag.SPAN = this.skipTag;
		
	} // HTMLParser.constructor


	// executed once - parses <suica-canvas>
	parseTags( )
	{
		if( DEBUG_CALLS ) console.log(`:: ${this.suica.id}.parseTag( )`);

		// unhook the parser
		this.suica.parser = null;

		this.parseTagsInElement( this.suica, this.suica.suicaTag );
		this.suica.render( );
		
	} // HTMLParser.parseTags


	// recursive parser
	parseTagsInElement( that, elem )
	{
		for( var i = 0; i<elem.children.length; i++ )
		{
			// execute tag
			var tagName = elem.children[i].tagName;
			if( this.parseTag[tagName] )
				this.parseTag[tagName]( this.suica, elem.children[i] );
			else
				throw `error: unknown tag <${tagName}> in <${that.tagName}>`;

			// recurse into subtags
			this.parseTagsInElement( this.suica, elem.children[i] );
		}
	} // HTMLParser.parseTagsInElement
		

	// <canvas> <div>
	skipTag( suica, elem )
	{
		if( DEBUG_CALLS ) console.log(`:: ${suica.id}.skipTag( ${elem.tagName } )`);
		// skip this tag
	} // HTMLParser.skipTag
	
	
	// <oxyz size="..." color="...">
	parseTagOXYZ( suica, elem )
	{
		suica.oxyz(
			elem.getAttribute('size') || Suica.DEFAULT.OXYZ.SIZE,
			elem.getAttribute('color') || Suica.DEFAULT.OXYZ.COLOR
		);
	} // HTMLParser.parseTagOXYZ
	
	
	// <demo distance="..." altitude="...">
	parseTagDEMO( suica, elem )
	{
		suica.demo(
			elem.getAttribute('distance') || Suica.DEFAULT.DEMO.DISTANCE,
			elem.getAttribute('altitude') || Suica.DEFAULT.DEMO.ALTITUDE
		);
	} // HTMLParser.parseTagDEMO
	
	
	// <background color="...">
	parseTagBACKGROUND( suica, elem )
	{
		suica.background(
			elem.getAttribute('color') || Suica.DEFAULT.BACKGROUND.COLOR
		);
	} // HTMLParser.parseTagBACKGROUND
	
	
	// <ontime src="...">
	parseTagONTIME( suica, elem )
	{
		suica.onTime( elem.getAttribute('src') || Suica.DEFAULT.ONTIME.SRC );
	} // HTMLParser.parseTagONTIME
	
	
	// <point id="..." center="..." color="..." size="...">
	parseTagPOINT( suica, elem )
	{
		var p = suica.point(
			elem.getAttribute('center') || Suica.DEFAULT.POINT.CENTER,
			elem.getAttribute('size') || Suica.DEFAULT.POINT.SIZE,
			elem.getAttribute('color') || Suica.DEFAULT.POINT.COLOR
		);
		
		if( elem.hasAttribute('x') ) p.x = Number(elem.getAttribute('x')); 
		if( elem.hasAttribute('y') ) p.y = Number(elem.getAttribute('y')); 
		if( elem.hasAttribute('z') ) p.z = Number(elem.getAttribute('z')); 

		var id = elem.getAttribute('id');
		if( id ) window[id] = p;
		
	} // HTMLParser.parseTagPOINT
	
	
	// <cube id="..." center="..." color="..." size="...">
	parseTagCUBE( suica, elem )
	{
		var p = suica.cube(
			elem.getAttribute('center') || Suica.DEFAULT.CUBE.CENTER,
			elem.getAttribute('size') || Suica.DEFAULT.CUBE.SIZE,
			elem.getAttribute('color') || Suica.DEFAULT.CUBE.COLOR
		);
		
		if( elem.hasAttribute('x') ) p.x = Number(elem.getAttribute('x')); 
		if( elem.hasAttribute('y') ) p.y = Number(elem.getAttribute('y')); 
		if( elem.hasAttribute('z') ) p.z = Number(elem.getAttribute('z')); 
			
		var id = elem.getAttribute('id');
		if( id ) window[id] = p;
		
	} // HTMLParser.parseTagCUBE
	
	
} // HTMLParser

﻿//
// Suica 2.0 Point
// CC-3.0-SA-NC
//
// point( center, size, color )
//
// <point id="" center="" x="" y="" z="" size="" color="">
//
//	center		center [x,y,z]
//	x			x coordinate of center
//	y			y coordinate of center
//	z			z coordinate of center
//	size		visual size
//	color		color [r,g,b]
//	image		texture (drawing or canvas)
//
//===================================================


class Point extends THREE.Points
{

	// a static geometry shared by all points
	static geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3));




	constructor(suica, center, size, color)
	{
		suica.parser?.parseTags();
		if (DEBUG_CALLS) console.log(`:: ${suica.id}.point(${center},${size},${color})`);

		super( Point.geometry, Suica.pointMaterial.clone() );

		this.suica = suica;
		this.center = center;
		this.color = color;
		this.size = size;

		suica.scene.add(this);
		
	} // Point.constructor




	get center()
	{
		this.suica.parser?.parseTags();

		return [this.position.x, this.position.y, this.position.z];
	}

	set center(center)
	{
		this.suica.parser?.parseTags();

		center = Suica.parseCenter(center);
		this.position.set(center[0], center[1], center[2]);
	}




	get x()
	{
		this.suica.parser?.parseTags();

		return this.position.x;
	}

	set x( x )
	{
		this.suica.parser?.parseTags();

		this.position.x = x;
	}




	get y()
	{
		this.suica.parser?.parseTags();

		return this.position.y;
	}

	set y( y )
	{
		this.suica.parser?.parseTags();

		this.position.y = y;
	}




	get z()
	{
		this.suica.parser?.parseTags();

		return this.position.z;
	}

	set z( z )
	{
		this.suica.parser?.parseTags();

		this.position.z = z;
	}




	get size()
	{
		this.suica.parser?.parseTags();

		return this.material.size;
	}

	set size( size )
	{
		this.suica.parser?.parseTags();

		this.material.size = size;
		this.material.needsUpdate = true;
	}




	get color()
	{
		this.suica.parser?.parseTags();
		
		var col = this.material.color;
		return [col.r, col.g, col.b];
	}

	set color( col )
	{
		this.suica.parser?.parseTags();

		this.material.color = Suica.parseColor(col);
		this.material.needsUpdate = true;
	}




	set image(drawing)
	{
		this.suica.parser?.parseTags();

		if (drawing instanceof Drawing)
		{
			this.material.map = drawing.image;
			return;
		}

		throw 'error: Parameter of `image` is not a drawing';
	}
	
} // class Point




window.point = function(
					center = Suica.DEFAULT.POINT.CENTER,
					size   = Suica.DEFAULT.POINT.SIZE,
					color  = Suica.DEFAULT.POINT.COLOR )
{
	Suica.precheck();
	return Suica.current.point( center, size, color );
}﻿//
// Suica 2.0 Mesh
// CC-3.0-SA-NC
//
// new Mesh( suica, geometry, material, center, color )
//
//
//	center		center [x,y,z]
//	x			x coordinate of center
//	y			y coordinate of center
//	z			z coordinate of center
//	color		color [r,g,b]
//	image		texture (drawing or canvas)
//
//===================================================


class Mesh extends THREE.Mesh
{

	constructor( /*suica,*/ geometry, material/*, center, color*/ )
	{
		super( geometry, material );
		
/*		this.suica = suica;
		this.center = center;
		this.color = color;*/
	}



	
	get center()
	{
		this.suica.parser?.parseTags();

		return [this.position.x, this.position.y, this.position.z];
	}

	set center(center)
	{
		this.suica.parser?.parseTags();

		center = Suica.parseCenter(center);
		this.position.set(center[0], center[1], center[2]);
	}




	get x()
	{
		this.suica.parser?.parseTags();

		return this.position.x;
	}

	set x( x )
	{
		this.suica.parser?.parseTags();

		this.position.x = x;
	}




	get y()
	{
		this.suica.parser?.parseTags();

		return this.position.y;
	}

	set y( y )
	{
		this.suica.parser?.parseTags();

		this.position.y = y;
	}




	get z()
	{
		this.suica.parser?.parseTags();

		return this.position.z;
	}

	set z( z )
	{
		this.suica.parser?.parseTags();

		this.position.z = z;
	}




	get color()
	{
		this.suica.parser?.parseTags();
		
		var col = this.material.color;
		return [col.r, col.g, col.b];
	}

	set color( col )
	{
		this.suica.parser?.parseTags();

		this.material.color = Suica.parseColor(col);
		this.material.needsUpdate = true;
	}




	set image(drawing)
	{
		this.suica.parser?.parseTags();

		if (drawing instanceof Drawing)
		{
			this.material.map = drawing.image;
			return;
		}

		throw 'error: Parameter of `image` is not a drawing';
	}
	
} // class Mesh﻿//
// Suica 2.0 Cube
// CC-3.0-SA-NC
//
// cube( center, size, color )
//
// <cube id="" center="" x="" y="" z="" size="" color="">
//
//	center		center [x,y,z]
//	x			x coordinate of center
//	y			y coordinate of center
//	z			z coordinate of center
//	size		size of edge
//	color		color [r,g,b]
//	image		texture (drawing or canvas)
//
//===================================================


class Cube extends Mesh
{
	
	
	// a geometry shared by all cubes
	static geometry = new THREE.BoxGeometry( 1, 1, 1 );
	
	
	
	
	constructor( suica, center, size, color )
	{
		suica.parser?.parseTags();
		if (DEBUG_CALLS) console.log(`:: ${suica.id}.cube(${center},${size},${color})`);
		super( Cube.geometry, Suica.solidMaterial.clone() );
		
		this.suica = suica;
		this.center = center;
		this.color = color;
		this.size = size;
		
		suica.scene.add( this );
	}
	
	
	
	
	get size( )
	{
		this.suica.parser?.parseTags();
		
		return this.scale.x;
	}

	set size( size )
	{
		this.suica.parser?.parseTags();
		
		this.scale.set( size, size, size );
	}

} // class Cube




window.cube = function(
				center = Suica.DEFAULT.CUBE.CENTER,
				size   = Suica.DEFAULT.CUBE.SIZE,
				color  = Suica.DEFAULT.CUBE.COLOR )
{
	Suica.precheck();
	return Suica.current.cube( center, size, color );
}} // LoadSuica 
