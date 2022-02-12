 document.write( '<script src="three.min.js" onload="LoadSuica();"></script>' );﻿function LoadSuica(){ 
﻿//
// Suica 2.0
// CC-3.0-SA-NC
//
//	<suica width="..." height="..." style="..." orientation="..." background="...">
//		<background color="...">
//		<oxyz size="..." color="...">
//		<demo distance="..." altitude="...">
//		<ontime src="...">
//		<point id="..." center="..." x="" y="" z="" color="..." size="...">
//		<line id="..." center="..." from="" color="..." size="...">
//		<square id="..." center="..." x="" y="" z="" color="..." size="...">
//		<squareFrame id="..." center="..." x="" y="" z="" color="..." size="...">
//		<circle id="..." center="..." x="" y="" z="" color="..." size="...">
//		<circleFrame id="..." center="..." x="" y="" z="" color="..." size="...">
//		<polygon id="..." center="..." x="" y="" z="" color="..." size="...">
//		<polygonFrame id="..." center="..." x="" y="" z="" color="..." size="...">
//		<cube id="..." center="..." x="" y="" z="" color="..." size="...">
//		<cubeFrame id="..." center="..." x="" y="" z="" color="..." size="...">
//		<sphere id="..." center="..." x="" y="" z="" color="..." size="...">
//		<cylinder ...>
//		<prism ...>
//		<prismFrame ...>
//		<cone ...>
//		<pyramid ...>
//		<pyramidFrame ...>
//	</suica>
//
//	<script>
//		{suica.}background( color )
//		{suica.}oxyz( size, color )
//		{suica.}demo( distance, altitude )
//		{suica.}onTime( src )
//		{suica.}point( center, size, color )
//		{suica.}point( center/from, to, color )
//		{suica.}square( center, size, color )
//		{suica.}squareFrame( center, size, color )
//		{suica.}circle( center, size, color )
//		{suica.}circleFrame( center, size, color )
//		{suica.}polygon( count, center, size, color )
//		{suica.}polygonFrame( count, center, size, color )
//		{suica.}cube( center, size, color )
//		{suica.}cubeFrame( center, size, color )
//		{suica.}sphere( center, size, color )
//		{suica.}cylinder( center, size, color )
//		{suica.}prism( count, center, size, color )
//		{suica.}prismFrame( count, center, size, color )
//		{suica.}cone( center, size, color )
//		{suica.}pyramid( count, center, size, color )
//		{suica.}pyramidFrame( count, center, size, color )
//		
//		random( from, to )
//		random( array )
//		degrees( radians )
//		radians( degrees )
//
//	</script>
//
//		
//===================================================
//
// History
//	2.-1.00 (220118) initiation
//	2.-1.01 (220119) custom & nested tags, background, oxyz, animate
//	2.-1.02 (220120) point
//	2.-1.03 (220122) autoload js files, cube
//	2.-1.04 (220124) demo, examples, onTime
//	2.-1.05 (220126) random, drawing, lineTo, moveTo, stroke, fill, fillAndStroke
//	2.-1.06 (220128) build process, mesh, cubeFrame, arc, cube.image
//	2.-1.07 (220129) suica.orientation
//	2.-1.08 (220130) size[x,y,z]
//	2.-1.09 (220201) width, height, depth
//	2.-1.10 (220201) square
//	2.-1.11 (220203) attribute modification
//	2.-1.12 (220204) line
//	2.-1.13 (220205) object as position
//	2.-1.14 (220205) circle, circleFrame
//	2.-1.15 (220206) polygon, polygonFrame, sphere
//	2.-1.16 (220209) cylinder, prism, prismFrame, cone, pyramid, pyramidFrame
//	2.-1.17 (220212) radians degrees
//
//===================================================


// show suica version
console.log( `Suica 2.-1.16 (220209)` );


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

	// coordinate system orientations
	static ORIENTATIONS = {
			XYZ: {SCALE: new THREE.Vector3(1,1,1), UP: new THREE.Vector3(0,1,0)},
			XZY: {SCALE: new THREE.Vector3(-1,1,1), UP: new THREE.Vector3(0,0,1)},
			YXZ: {SCALE: new THREE.Vector3(1,-1,1), UP: new THREE.Vector3(1,0,0)},
			YZX: {SCALE: new THREE.Vector3(1,1,1), UP: new THREE.Vector3(0,0,1)},
			ZXY: {SCALE: new THREE.Vector3(1,1,1), UP: new THREE.Vector3(1,0,0)},
			ZYX: {SCALE: new THREE.Vector3(1,1,-1), UP: new THREE.Vector3(0,1,0)},
		}


	// default values for Suica commands
	static DEFAULT = {
		BACKGROUND: { COLOR: 'whitesmoke' },
		ORIENTATION: 'XYZ',
		SIZE: '30',
		OXYZ: { COLOR: 'black', SIZE: 30 },
		DEMO: { DISTANCE: 100, ALTITUDE: 30 },
		ONTIME: { SRC: null },
		POINT: { CENTER:[0,0,0], COLOR:'crimson', SIZE:7 },
		LINE: { CENTER:[0,0,0], COLOR:'black', TO:[0,30,0] },
		CUBE: { CENTER:[0,0,0], COLOR:'cornflowerblue', FRAMECOLOR:'black', SIZE:30 },
		SQUARE: { CENTER:[0,0,0], COLOR:'cornflowerblue', FRAMECOLOR:'black', SIZE:30 },
		CIRCLE: { CENTER:[0,0,0], COLOR:'cornflowerblue', FRAMECOLOR:'black', SIZE:30, COUNT:50 },
		POLYGON: { CENTER:[0,0,0], COLOR:'cornflowerblue', FRAMECOLOR:'black', SIZE:30, COUNT:3 },
		SPHERE: { CENTER:[0,0,0], COLOR:'cornflowerblue', SIZE:30, COUNT: 50 },
		CYLINDER: { CENTER:[0,0,0], COLOR:'cornflowerblue', SIZE:30, COUNT: 50, RATIO: 1 },
		CONE: { CENTER:[0,0,0], COLOR:'cornflowerblue', SIZE:30, COUNT: 50, RATIO: 0 },
		PRISM: { CENTER:[0,0,0], COLOR:'cornflowerblue', SIZE:30, COUNT: 6, RATIO: 1 },
		PYRAMID: { CENTER:[0,0,0], COLOR:'cornflowerblue', SIZE:30, COUNT: 6, RATIO: 0 },
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

		// get or invent id
		this.orientation = Suica.ORIENTATIONS[suicaTag.getAttribute('ORIENTATION')?.toUpperCase() || Suica.DEFAULT.ORIENTATION];
		
		// create and initialize <canvas>
		this.createCanvas( ); // creates this.canvas
		this.createRenderer( ); // creates this.rendered, this.scene, this.camera
		
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
		
		this.scene.scale.copy( this.orientation.SCALE );

		var color = getComputedStyle(this.suicaTag).backgroundColor;
		if( color == 'rgba(0, 0, 0, 0)' )
		{
			color = this.suicaTag.getAttribute('background') || Suica.DEFAULT.BACKGROUND.COLOR;
		}
		this.scene.background = Suica.parseColor( color );

		// default perspective camera
		this.camera = new THREE.PerspectiveCamera( 40, this.canvasAspect, 1, 1000 );
		this.camera.up.copy( this.orientation.UP );
		this.camera.position.set( 0, 0, 100 );
		this.camera.lookAt( this.scene.position );

		// default light
		this.light = new THREE.PointLight( 'white', 0.5 );
			this.light.position.set( 1000, 1500, 3000 );
		this.scene.add( this.light );
			
		// ambient light
		this.scene.add( new THREE.AmbientLight( 'white', 0.5 ) );
			
		// main animation loop
		var that = this;
		this.lastTime = 0;
		
		
		function loop( time )
		{
			time /= 1000; // convert miliseconds to seconds
			
			if( that.demoViewPoint )
			{
				var x = that.demoViewPoint.distance*Math.cos(time),
					y = that.demoViewPoint.altitude,
					z = that.demoViewPoint.distance*Math.sin(time),
					p = that.camera.position;
				
				switch( that.orientation )
				{
					case Suica.ORIENTATIONS.XYZ: p.set( x, y, -z ); break;
					case Suica.ORIENTATIONS.XZY: p.set( -x, -z, y ); break;
					case Suica.ORIENTATIONS.YXZ: p.set( y, -x, -z ); break;
					case Suica.ORIENTATIONS.YZX: p.set( -z, x, y ); break;
					case Suica.ORIENTATIONS.ZXY: p.set( y, -z, x ); break;
					case Suica.ORIENTATIONS.ZYX: p.set( -z, y, -x ); break;
					default: throw 'error: Unknown orientation in <suica>';
				};
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


	
	
	background( color=Suica.DEFAULT.BACKGROUND.COLOR )
	{
		this.parser?.parseTags();
		this.debugCall( 'background', color );
		
		this.scene.background = new THREE.Color( color );
	}
	
	
	oxyz( size=Suica.DEFAULT.OXYZ.SIZE, color=Suica.DEFAULT.OXYZ.COLOR )
	{
		this.parser?.parseTags();
		this.debugCall( 'oxyz', size, color );
		
		var axes = new THREE.AxesHelper( size )
			axes.setColors( color, color, color );
		this.scene.add( axes );
	}
	
	
	demo( distance=Suica.DEFAULT.DEMO.DISTANCE, altitude=Suica.DEFAULT.DEMO.ALTITUDE )
	{
		this.parser?.parseTags();
		this.debugCall( 'demo', distance, altitude );
		
		this.demoViewPoint = {distance:distance, altitude:altitude};
	}
	
	
	onTime( src=Suica.DEFAULT.ONTIME.SRC )
	{
		this.parser?.parseTags();
		this.debugCall( 'onTime', src );
				
		this.onTimeHandler = src;
	}
	
	
	static precheck()
	{
		if( !(Suica.current instanceof Suica) )
			throw 'error: No Suica instance is active';
	}
	
	
	debugCall( functionName, ...parameters )
	{
		if( !DEBUG_CALLS ) return;
		
		for( var i=0; i<parameters.length; i++ )
		{
			if( Array.isArray(parameters[i]) )
				parameters[i] = `[${parameters[i]}]`;
			else
			if( typeof parameters[i] === 'string' || parameters[i] instanceof String )
				parameters[i] = `'${parameters[i]}'`;
			else
				parameters[i] = ''+parameters[i];
		}

		console.info( `:: ${this.id}.${functionName}(${parameters.join(',')})` );
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
			
			// x,y,z
			if( center.indexOf(',') > 0 )
			{
				center = center.split(',').map(Number);
				return [Number(center[0]), Number(center[1]), Number(center[2]) ];
			}
			
			// object name - object exists and has center
			if( window[center] && window[center].center )
			{
				return window[center].center;
			}
		}

		return center;
	}
	
	
	static parseSize( size )
	{
		// size is string 'x,y,z'
		if( typeof size === 'string' || size instanceof String )
		{
			size = size.replaceAll(' ','');
			
			if( size.indexOf(',') > 0 )
			{
				return size.split(',').map(Number);
			}
		}

		return size;
	}
	
	
	static parseRadius( radius )
	{
		// radius is string 'x,y,z'
		if( typeof radius === 'string' || radius instanceof String )
		{
			radius = radius.replaceAll(' ','');
			
			if( radius.indexOf(',') > 0 )
			{
				return radius.split(',').map(Number);
			}
		}

		return radius;
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

		return new Point( this, center, size, color );
	}
	
	
	line( center=Suica.DEFAULT.LINE.CENTER, to=Suica.DEFAULT.LINE.TO, color=Suica.DEFAULT.LINE.COLOR )
	{
		this.parser?.parseTags();

		return new Line( this, center, to, color );
	}
	
	
	square( center=Suica.DEFAULT.SQUARE.CENTER, size=Suica.DEFAULT.SQUARE.SIZE, color=Suica.DEFAULT.SQUARE.COLOR )
	{
		this.parser?.parseTags();

		return new Square( this, center, size, color );
	}
	
	
	squareFrame( center=Suica.DEFAULT.SQUARE.CENTER, size=Suica.DEFAULT.SQUARE.SIZE, color=Suica.DEFAULT.SQUARE.FRAMECOLOR )
	{
		this.parser?.parseTags();

		return new SquareFrame( this, center, size, color );
	}
	
	
	cube( center=Suica.DEFAULT.CUBE.CENTER, size=Suica.DEFAULT.CUBE.SIZE, color=Suica.DEFAULT.CUBE.COLOR )
	{
		this.parser?.parseTags();

		return new Cube( this, center, size, color );
	}
	
	
	cubeFrame( center=Suica.DEFAULT.CUBE.CENTER, size=Suica.DEFAULT.CUBE.SIZE, color=Suica.DEFAULT.CUBE.FRAMECOLOR )
	{
		this.parser?.parseTags();

		return new CubeFrame( this, center, size, color );
	}

	circle( center=Suica.DEFAULT.CIRCLE.CENTER, size=Suica.DEFAULT.CIRCLE.SIZE, color=Suica.DEFAULT.CIRCLE.COLOR )
	{
		this.parser?.parseTags();

		return new Polygon( this, Suica.DEFAULT.CIRCLE.COUNT, center, size, color );
	}
	
	
	circleFrame( center=Suica.DEFAULT.CIRCLE.CENTER, size=Suica.DEFAULT.CIRCLE.SIZE, color=Suica.DEFAULT.CIRCLE.FRAMECOLOR )
	{
		this.parser?.parseTags();

		return new PolygonFrame( this, Suica.DEFAULT.CIRCLE.COUNT, center, size, color );
	}
	
	
	polygon( count = Suica.DEFAULT.POLYGON.COUNT, center=Suica.DEFAULT.POLYGON.CENTER, size=Suica.DEFAULT.POLYGON.SIZE, color=Suica.DEFAULT.CIRCLE.COLOR )
	{
		this.parser?.parseTags();

		return new Polygon( this, count, center, size, color );
	}
	
	
	polygonFrame( count = Suica.DEFAULT.POLYGON.COUNT, center=Suica.DEFAULT.CIRCLE.CENTER, size=Suica.DEFAULT.CIRCLE.SIZE, color=Suica.DEFAULT.CIRCLE.FRAMECOLOR )
	{
		this.parser?.parseTags();

		return new PolygonFrame( this, count, center, size, color );
	}
	
	sphere( center=Suica.DEFAULT.SPHERE.CENTER, size=Suica.DEFAULT.SPHERE.SIZE, color=Suica.DEFAULT.SPHERE.COLOR )
	{
		this.parser?.parseTags();

		return new Sphere( this, center, size, color );
	}

	cylinder( center=Suica.DEFAULT.CYLINDER.CENTER, size=Suica.DEFAULT.CYLINDER.SIZE, color=Suica.DEFAULT.CYLINDER.COLOR )
	{
		this.parser?.parseTags();

		return new Prism( this, Suica.DEFAULT.CYLINDER.COUNT, center, size, color, false );
	}

	prism( count=Suica.DEFAULT.PRISM.COUNT, center=Suica.DEFAULT.PRISM.CENTER, size=Suica.DEFAULT.PRISM.SIZE, color=Suica.DEFAULT.PRISM.COLOR )
	{
		this.parser?.parseTags();

		return new Prism( this, count, center, size, color, true );
	}

	prismFrame( count=Suica.DEFAULT.PRISM.COUNT, center=Suica.DEFAULT.PRISM.CENTER, size=Suica.DEFAULT.PRISM.SIZE, color=Suica.DEFAULT.PRISM.FRAMECOLOR )
	{
		this.parser?.parseTags();

		return new PrismFrame( this, count, center, size, color );
	}	

	cone( center=Suica.DEFAULT.CONE.CENTER, size=Suica.DEFAULT.CONE.SIZE, color=Suica.DEFAULT.CONE.COLOR )
	{
		this.parser?.parseTags();

		return new Pyramid( this, Suica.DEFAULT.CONE.COUNT, center, size, color, false );
	}

	pyramid( count=Suica.DEFAULT.PYRAMID.COUNT, center=Suica.DEFAULT.PYRAMID.CENTER, size=Suica.DEFAULT.PYRAMID.SIZE, color=Suica.DEFAULT.PYRAMID.COLOR )
	{
		this.parser?.parseTags();

		return new Pyramid( this, count, center, size, color, true );
	}

	pyramidFrame( count=Suica.DEFAULT.PYRAMID.COUNT, center=Suica.DEFAULT.PYRAMID.CENTER, size=Suica.DEFAULT.PYRAMID.SIZE, color=Suica.DEFAULT.PYRAMID.FRAMECOLOR )
	{
		this.parser?.parseTags();

		return new PyramidFrame( this, count, center, size, color );
	}	
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

window.element = function( id )
{
	return document.getElementById( id );
}


window.rgb = function( r, g, b )
{
	return new THREE.Color( r/255, g/255, b/255 );
}


window.hsl = function( h, s, l )
{
	return new THREE.Color( ).setHSL( h/360, s/100, l/100 );
}


window.random = function( a=0, b=1 )
{
	if( Array.isArray(a) )
	{
		return a[ THREE.Math.randInt(0,a.length-1) ];
	}
	
	return a+(b-a)*Math.random();
}


window.radians = function( degrees )
{
	return degrees * Math.PI/180;
}


window.degrees = function( radians )
{
	return radians * 180/Math.PI;
}





// monitor creation of tags, we are interested in creation of
// <script> because it might contain Suica tags; thus for each
// <script> try to prase all unparsed Suicas
//
// idea from https://github.com/jspenguin2017/Snippets/blob/master/onbeforescriptexecute.html
new MutationObserver( function( mutations )
	{
		for( var parentElem of mutations )
		{
			for( var childElem of parentElem.addedNodes) 
			{
				if( childElem?.tagName=='SCRIPT' )
					for( var suica of Suica.allSuicas )
						suica.parser?.parseTags();
				if( childElem?.tagName=='SUICA' )
					new Suica( childElem );
			}
			
			if( parentElem.type == 'attributes' && parentElem.target.suicaObject )
			{
				var name = parentElem.attributeName,
					value = parentElem.target.getAttribute(parentElem.attributeName);
				
				parentElem.target.suicaObject[name] = value;
			}
		}
	}).observe( document, {childList: true, subtree: true, attributes: true} );

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
// <line id="..." center="..." color="..." to="...">
// <square id="..." center="..." color="..." size="...">
// <squareFrame id="..." center="..." color="..." size="...">
// <cube id="..." center="..." color="..." size="...">
// <cubeFrame id="..." center="..." color="..." size="...">
// <circle id="..." center="..." color="..." size="...">
// <circleFrame id="..." center="..." color="..." size="...">
// <polygon id="..." center="..." color="..." size="..." count="...">
// <polygonFrame id="..." center="..." color="..." size="..." count="...">
// <sphere id="..." center="..." color="..." size="...">
// <cylinder ...>
// <prism ...>
// <prismFrame ...>
// <cone ...>
// <pyramid ...>
// <pyramidFrame ...>
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
		this.parseTag.LINE = this.parseTagLINE;
		this.parseTag.SQUARE = this.parseTagSQUARE;
		this.parseTag.SQUAREFRAME = this.parseTagSQUAREFRAME;
		this.parseTag.CUBE = this.parseTagCUBE;
		this.parseTag.CUBEFRAME = this.parseTagCUBEFRAME;
		this.parseTag.CIRCLE = this.parseTagCIRCLE;
		this.parseTag.CIRCLEFRAME = this.parseTagCIRCLEFRAME;
		this.parseTag.POLYGON = this.parseTagPOLYGON;
		this.parseTag.POLYGONFRAME = this.parseTagPOLYGONFRAME;
		this.parseTag.SPHERE = this.parseTagSPHERE;
		this.parseTag.CYLINDER = this.parseTagCYLINDER;
		this.parseTag.PRISM = this.parseTagPRISM;
		this.parseTag.PRISMFRAME = this.parseTagPRISMFRAME;
		this.parseTag.CONE = this.parseTagCONE;
		this.parseTag.PYRAMID = this.parseTagPYRAMID;
		this.parseTag.PYRAMIDFRAME = this.parseTagPYRAMIDFRAME;
		
		this.parseTag.BUTTON = this.skipTag;
		this.parseTag.CANVAS = this.skipTagSilently;
		this.parseTag.DIV = this.skipTag;
		this.parseTag.SPAN = this.skipTag;
		
	} // HTMLParser.constructor


	// executed once - parses <suica-canvas>
	parseTags( )
	{
		this.suica.debugCall( 'parseTags' );

		// unhook the parser
		this.suica.parser = null;
		this.suica.parserReadonly = this;

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
		

	// <some-unknown-tag> <div>
	skipTag( suica, elem )
	{
		suica.debugCall( 'skipTag', elem.tagName ); // skip this tag
	} // HTMLParser.skipTag
	
	
	// <canvas> <div>
	skipTagSilently( suica, elem )
	{
	} // HTMLParser.skipTagSIlently
	
	
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
	
	
	parseAttributes( elem, object, widthHeight, depth )
	{
		if( elem.hasAttribute('x') ) object.x = Number(elem.getAttribute('x')); 
		if( elem.hasAttribute('y') ) object.y = Number(elem.getAttribute('y')); 
		if( elem.hasAttribute('z') ) object.z = Number(elem.getAttribute('z')); 
		
		if( widthHeight )
		{
			if( elem.hasAttribute('width') ) p.width = Number(elem.getAttribute('width')); 
			if( elem.hasAttribute('height') ) p.height = Number(elem.getAttribute('height')); 
		}
		
		if( depth )
		{
			if( elem.hasAttribute('depth') ) p.depth = Number(elem.getAttribute('depth')); 
		}
		
		var id = elem.getAttribute('id');
		if( id ) window[id] = object;
	}
	
	
	// <point id="..." center="..." color="..." size="...">
	parseTagPOINT( suica, elem )
	{
		var p = suica.point(
			elem.getAttribute('center') || Suica.DEFAULT.POINT.CENTER,
			elem.getAttribute('size') || Suica.DEFAULT.POINT.SIZE,
			elem.getAttribute('color') || Suica.DEFAULT.POINT.COLOR
		);
		
		suica.parserReadonly.parseAttributes( elem, p );

		elem.suicaObject = p;
		
	} // HTMLParser.parseTagPOINT
	
	
	// <line id="..." center="..." color="..." to="...">
	parseTagLINE( suica, elem )
	{
		var p = suica.line(
			elem.getAttribute('center') || elem.getAttribute('from') || Suica.DEFAULT.LINE.CENTER,
			elem.getAttribute('to') || Suica.DEFAULT.LINE.TO,
			elem.getAttribute('color') || Suica.DEFAULT.LINE.COLOR
		);

		var id = elem.getAttribute('id');
		if( id ) window[id] = p;
		
		elem.suicaObject = p;
		
	} // HTMLParser.parseTagLINE
	
	
	// <square id="..." center="..." color="..." size="...">
	parseTagSQUARE( suica, elem )
	{
		var p = suica.square(
			elem.getAttribute('center') || Suica.DEFAULT.SQUARE.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.SQUARE.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.SQUARE.COLOR
		);
		
		suica.parserReadonly.parseAttributes( elem, p, true, false );

		elem.suicaObject = p;
		
	} // HTMLParser.parseTagSQUARE
	
	
	// <squareFrame id="..." center="..." color="..." size="...">
	parseTagSQUAREFRAME( suica, elem )
	{
		var p = suica.squareFrame(
			elem.getAttribute('center') || Suica.DEFAULT.SQUARE.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.SQUARE.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.SQUARE.COLORFRAME
		);
		
		suica.parserReadonly.parseAttributes( elem, p, true, false );

		elem.suicaObject = p;
		
	} // HTMLParser.parseTagSQUAREFRAME

	// <cube id="..." center="..." color="..." size="...">
	parseTagCUBE( suica, elem )
	{
		var p = suica.cube(
			elem.getAttribute('center') || Suica.DEFAULT.CUBE.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.CUBE.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.CUBE.COLOR
		);
		
		suica.parserReadonly.parseAttributes( elem, p, true, true );

		elem.suicaObject = p;
		
	} // HTMLParser.parseTagCUBE
	
	
	// <cubeFrame id="..." center="..." color="..." size="...">
	parseTagCUBEFRAME( suica, elem )
	{
		var p = suica.cubeFrame(
			elem.getAttribute('center') || Suica.DEFAULT.CUBE.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.CUBE.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.CUBE.COLORFRAME
		);
		
		suica.parserReadonly.parseAttributes( elem, p, true, true );

		elem.suicaObject = p;
		
	} // HTMLParser.parseTagCUBEFRAME
	
	
	// <circle id="..." center="..." color="..." size="...">
	parseTagCIRCLE( suica, elem )
	{
		var p = suica.circle(
			elem.getAttribute('center') || Suica.DEFAULT.CIRCLE.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.CIRCLE.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.CIRCLE.COLOR
		);
		
		suica.parserReadonly.parseAttributes( elem, p, true, false );

		elem.suicaObject = p;
		
	} // HTMLParser.parseTagCIRCLE
	
	
	// <squareFrame id="..." center="..." color="..." size="...">
	parseTagCIRCLEFRAME( suica, elem )
	{
		var p = suica.circleFrame(
			elem.getAttribute('center') || Suica.DEFAULT.CIRCLE.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.CIRCLE.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.CIRCLE.COLORFRAME
		);
		
		suica.parserReadonly.parseAttributes( elem, p, true, false );

		elem.suicaObject = p;
		
	} // HTMLParser.parseTagCIRCLEFRAME
	
	
	// <polygon id="..." center="..." color="..." size="..." count="...">
	parseTagPOLYGON( suica, elem )
	{
		var p = suica.polygon(
			elem.getAttribute('count') || Suica.DEFAULT.POLYGON.COUNT,
			elem.getAttribute('center') || Suica.DEFAULT.POLYGON.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.POLYGON.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.POLYGON.COLOR
		);
		
		suica.parserReadonly.parseAttributes( elem, p, true, false );

		elem.suicaObject = p;
		
	} // HTMLParser.parseTagPOLYGON
	
	
	// <squareFrame id="..." center="..." color="..." size="..." count="...">
	parseTagPOLYGONFRAME( suica, elem )
	{
		var p = suica.polygonFrame(
			elem.getAttribute('count') || Suica.DEFAULT.POLYGON.COUNT,
			elem.getAttribute('center') || Suica.DEFAULT.POLYGON.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.POLYGON.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.POLYGON.COLORFRAME
		);
		
		suica.parserReadonly.parseAttributes( elem, p, true, false );


		elem.suicaObject = p;
		
	} // HTMLParser.parseTagPOLYGONFRAME

	// <sphere id="..." center="..." color="..." size="...">
	parseTagSPHERE( suica, elem )
	{
		var p = suica.sphere(
			elem.getAttribute('center') || Suica.DEFAULT.SPHERE.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.SPHERE.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.SPHERE.COLOR
		);
		
		suica.parserReadonly.parseAttributes( elem, p, true, true );

		elem.suicaObject = p;
		
	} // HTMLParser.parseTagSPHERE
	
	// <cylinder id="..." center="..." color="..." size="...">
	parseTagCYLINDER( suica, elem )
	{
		var p = suica.cylinder(
			elem.getAttribute('center') || Suica.DEFAULT.CYLINDER.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.CYLINDER.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.CYLINDER.COLOR
		);
		
		suica.parserReadonly.parseAttributes( elem, p, true, true );

		elem.suicaObject = p;
		
	} // HTMLParser.parseTagCYLINDER
	
	// <prism id="..." center="..." color="..." size="..." count="...">
	parseTagPRISM( suica, elem )
	{
		var p = suica.prism(
			elem.getAttribute('count') || Suica.DEFAULT.PRISM.COUNT,
			elem.getAttribute('center') || Suica.DEFAULT.PRISM.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.PRISM.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.PRISM.COLOR
		);
		
		suica.parserReadonly.parseAttributes( elem, p, true, true );

		elem.suicaObject = p;
		
	} // HTMLParser.parseTagPRISM
	
	// <prismFrame id="..." center="..." color="..." size="..." count="...">
	parseTagPRISMFRAME( suica, elem )
	{
		var p = suica.prismFrame(
			elem.getAttribute('count') || Suica.DEFAULT.PRISM.COUNT,
			elem.getAttribute('center') || Suica.DEFAULT.PRISM.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.PRISM.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.PRISM.COLOR
		);
		
		suica.parserReadonly.parseAttributes( elem, p, true, true );

		elem.suicaObject = p;
		
	} // HTMLParser.parseTagPRISMFRAME
	
	// <cone id="..." center="..." color="..." size="...">
	parseTagCONE( suica, elem )
	{
		var p = suica.cone(
			elem.getAttribute('center') || Suica.DEFAULT.CONE.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.CONE.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.CONE.COLOR
		);
		
		suica.parserReadonly.parseAttributes( elem, p, true, true );

		elem.suicaObject = p;
		
	} // HTMLParser.parseTagCONE
	
	// <pyramid id="..." center="..." color="..." size="..." count="...">
	parseTagPYRAMID( suica, elem )
	{
		var p = suica.pyramid(
			elem.getAttribute('count') || Suica.DEFAULT.PYRAMID.COUNT,
			elem.getAttribute('center') || Suica.DEFAULT.PYRAMID.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.PYRAMID.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.PYRAMID.COLOR
		);
		
		suica.parserReadonly.parseAttributes( elem, p, true, true );

		elem.suicaObject = p;
		
	} // HTMLParser.parseTagPYRAMID
	
	// <pyramidFrame id="..." center="..." color="..." size="..." count="...">
	parseTagPYRAMIDFRAME( suica, elem )
	{
		var p = suica.pyramidFrame(
			elem.getAttribute('count') || Suica.DEFAULT.PYRAMID.COUNT,
			elem.getAttribute('center') || Suica.DEFAULT.PYRAMID.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.PYRAMID.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.PYRAMID.COLOR
		);
		
		suica.parserReadonly.parseAttributes( elem, p, true, true );

		elem.suicaObject = p;
		
	} // HTMLParser.parseTagPYRAMIDFRAME
	
	
} // HTMLParser

//
// Suica 2.0 Drawing
// CC-3.0-SA-NC
//
// drawing( width, height, color )
// moveTo( x, y )
// lineTo( x, y )
// curveTo( mx, my, x, y )
// arc( x, y, r, from, to )
// fillText( x, y, text, color, font )
// stroke( color, width )
// fill( color )
// fillAndStroke( fillColor, strokeColor, width )
//
//===================================================


class Drawing
{

	// current active Drawing instance
	static current;



		
	constructor( width=32, height=width, color=null )
	{
		this.canvas = document.createElement( 'canvas' );
		this.canvas.width = width;
		this.canvas.height = height;
		
		this.texture = null;
		
		this.context = this.canvas.getContext( '2d' );
		//this.context.scale( 1, -1 );
		//this.context.translate( 0, -height );
		this.context.clearRect( 0, 0, width, height );
		
		if( color )
		{
			this.context.fillStyle = color;
			this.context.fillRect( 0, 0, width, height );
		}
			
		this.context.beginPath( );
	} // Drawing.constructor




	moveTo( x = 0, y = 0 )
	{
		this.context.moveTo( x, this.canvas.height-y );
	} // Drawing.moveTo
	
	
	
	
	lineTo( x = 0, y = 0 )
	{
		this.context.lineTo( x, this.canvas.height-y );
	} // Drawing.lineTo
	
	
	
	
	curveTo( mx = 0, my = 0, x = 0, y = 0 )
	{
		this.context.quadraticCurveTo( mx, this.canvas.height-my, x, this.canvas.height-y );
	} // Drawing.curveTo
	
	
	

	arc( x = 0, y = 0, r = 10, from = 0, to = 360 )
	{
		this.context.arc( x, this.canvas.height-y, r, from*Math.PI/2, to*Math.PI/2 );
	} // Drawing.arc
	
	
	

	fillText( x = 0, y = 0, text = '', color = 'black', font = '20px Arial' )
	{
		this.context.fillStyle = color;
		this.context.font = font;
		this.context.fillText( text, x, this.canvas.height-y );
	} // Drawing.fillText
	
	
	

	stroke( color = 'black', width = 1 )
	{
		this.texture = null; // clear the texture
		
		this.context.strokeStyle = color;
		this.context.lineWidth = width;
		this.context.stroke( );

		this.context.beginPath( );
	} // Drawing.stroke
	
	
	
	
	fill( color = 'gray' )
	{
		this.texture = null; // clear the texture
		
		this.context.fillStyle = color;
		this.context.fill( );

		this.context.beginPath( );
	} // Drawing.fill
	
	
	

	fillAndStroke( fillColor = 'gray', strokeColor = 'black', width = 1 )
	{
		this.texture = null; // clear the texture
		
		this.context.strokeStyle = strokeColor;
		this.context.lineWidth = width;
		this.context.stroke( );
		
		this.context.fillStyle = fillColor;
		this.context.fill( );

		this.context.beginPath( );
	} // Drawing.fillAndStroke
	
	
	

	get image( )
	{
		if( !this.texture )
			this.texture = new THREE.CanvasTexture( this.canvas );
			
		return this.texture;
	} // Drawing.image
	
	

	
	static precheck()
	{
		if( !(Drawing.current instanceof Drawing) )
			throw 'error: No Drawing instance is active';
	} // Drawing.precheck

} // class Drawing




window.drawing = function ( width=32, height=width, color=null )
{
	Drawing.current = new Drawing( width, height, color );
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




window.arc = function ( x = 0, y = 0, r = 10, from = 0, to = 360 )
{
	Drawing.precheck();
	Drawing.current.arc( x, y, r, from, to );
}




window.fillText = function ( x = 0, y = 0, text = '', color = 'black', font = '20px Arial' )
{
	Drawing.precheck();
	Drawing.current.fillText( x, y, text, color, font );
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




window.image = function ( url = null, repeatX = 1, repeatY = 1 )
{
	Drawing.current = new THREE.TextureLoader().load( url );
	Drawing.current.wrapS = THREE.RepeatWrapping;
	Drawing.current.wrapT = THREE.RepeatWrapping;
	Drawing.current.magFilter = THREE.LinearFilter;
	Drawing.current.minFilter = THREE.LinearMipmapLinearFilter;
	Drawing.current.anisotropy = 16;
	Drawing.current.repeat.set( repeatX, repeatY );
	
	return Drawing.current;
}




﻿//
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
//	size		size / [height,width,depth]
//	image		drawing or texture -- only for Mesh
//
//===================================================


class Mesh
{
	constructor( suica, threejsClass, geometry, material )
	{
		this.suica = suica;
		this.threejs = new threejsClass( geometry, material );
		
		// [width, height, depth]
		this.meshSize = [null, null, null];
	}



	
	// create default materials for SUica objects
	static createMaterials( )
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

		Mesh.pointMaterial = new THREE.PointsMaterial( {
				color: 'white',
				size: 5,
				sizeAttenuation: true,
				map: new THREE.CanvasTexture( canvas ),
				transparent: true,
				alphaTest: 0.75,
			});

		// solid material
		Mesh.solidMaterial = new THREE.MeshStandardMaterial( {
				color: 'cornflowerblue',
				side: THREE.DoubleSide,
			});

		// solid flat material
		Mesh.flatMaterial = new THREE.MeshStandardMaterial( {
				color: 'cornflowerblue',
				side: THREE.DoubleSide,
				flatShading: true,
			});

		// line material
		CANVAS_SIZE = 4;
		var canvas2 = document.createElement('canvas');
			canvas2.width = CANVAS_SIZE;
			canvas2.height = 1;
			
		var context2 = canvas2.getContext('2d');
			context2.fillStyle = 'white';
			context2.fillRect( 0, 0, canvas2.width, canvas2.height );

		Mesh.lineMaterial = new THREE.MeshBasicMaterial( {
				color: 'black',
				transparent: true,
				map: new THREE.CanvasTexture( canvas2 ),
			});

		Mesh.lineMaterial.onBeforeCompile = shader => {
			shader.fragmentShader = shader.fragmentShader.replace(
				'#include <map_fragment>',
				`#ifdef USE_MAP
					vec4 texelColor = texture2D( map, vUv );
					diffuseColor *= texelColor;
				#endif`
			);
		}

	}




	get center()
	{
		this.suica.parser?.parseTags();

		return [this.threejs.position.x, this.threejs.position.y, this.threejs.position.z];
	}

	set center(center)
	{
		this.suica.parser?.parseTags();

		center = Suica.parseCenter( center );
		this.threejs.position.set( center[0], center[1], center[2] );
	}




	get x()
	{
		this.suica.parser?.parseTags();

		return this.threejs.position.x;
	}

	set x( x )
	{
		this.suica.parser?.parseTags();

		this.threejs.position.x = x;
	}




	get y()
	{
		this.suica.parser?.parseTags();

		return this.threejs.position.y;
	}

	set y( y )
	{
		this.suica.parser?.parseTags();

		this.threejs.position.y = y;
	}




	get z()
	{
		this.suica.parser?.parseTags();

		return this.threejs.position.z;
	}

	set z( z )
	{
		this.suica.parser?.parseTags();

		this.threejs.position.z = z;
	}




	get color()
	{
		this.suica.parser?.parseTags();
		
		var col = this.threejs.material.color;
		return [col.r, col.g, col.b];
	}

	set color( col )
	{
		this.suica.parser?.parseTags();

		this.threejs.material.color = Suica.parseColor(col);
		this.threejs.material.needsUpdate = true;
	}
	
	
	
	
	set image( drawing )
	{
		this.suica.parser?.parseTags();

		if (drawing instanceof Drawing)
		{
			this.threejs.material.map = drawing.image;
			this.threejs.material.transparent = true,
			this.threejs.material.needsUpdate = true;
			return;
		}

		if (drawing instanceof THREE.Texture)
		{
			this.threejs.material.map = drawing;
			this.threejs.material.transparent = true,
			this.threejs.material.needsUpdate = true;
			return;
		}

		throw 'error: Parameter of `image` is not a drawing';
	}
	
	
	
	
	updateScale( )
	{
		var width = this.meshSize[0];
		var height = this.meshSize[1];
		var depth = this.meshSize[2];
		
		if( height===null ) height = width;
		if( depth===null ) depth = width;
				
		switch( this.suica.orientation )
		{
			case Suica.ORIENTATIONS.YXZ:
					this.threejs.scale.set( height, width, depth );
					break;
			case Suica.ORIENTATIONS.ZYX:
					this.threejs.scale.set( depth, height, width );
					break;
			case Suica.ORIENTATIONS.XZY:
					this.threejs.scale.set( width, depth, height );
					break;

			case Suica.ORIENTATIONS.ZXY:
					this.threejs.scale.set( height, depth, width );
					break;
			case Suica.ORIENTATIONS.XYZ:
					this.threejs.scale.set( width, height, depth );
					break;
			case Suica.ORIENTATIONS.YZX:
					this.threejs.scale.set( depth, width, height );
					break;
			default: throw 'error: unknown orientation';
		}
	}

	get width( )
	{
		return this.meshSize[0];
	}

	set width( width )
	{
		this.meshSize[0] = width;
		this.updateScale();
	}
	


	
	get height( )
	{
		return (this.meshSize[1]!==null) ? this.meshSize[1] : this.meshSize[0];
	}

	set height( height )
	{
		this.meshSize[1] = height;
		this.updateScale();
	}
	


	
	get depth( )
	{
		return (this.meshSize[2]!==null) ? this.meshSize[2] : this.meshSize[0];
	}

	set depth( depth )
	{
		this.meshSize[2] = depth;
		this.updateScale();
	}
	


	
	get size( )
	{
		this.suica.parser?.parseTags();

		if( this.meshSize[2]===null )
		{
			if( this.meshSize[1]===null )
				return this.meshSize[0];
			else
				return [this.meshSize[0], this.meshSize[1]];
		}
			
		return [this.meshSize[0], this.meshSize[1], this.meshSize[2]];
	}

	set size( size )
	{
		this.suica.parser?.parseTags();
		
		if( Array.isArray(size) )
		{
			if( size.length==0 )
				this.meshSize = [null, null, null];
			else
			if( size.length==1 )
				this.meshSize = [size[0], null, null];
			else
			if( size.length==2 )
				this.meshSize = [size[0], size[1], null];
			else
				this.meshSize = [size[0], size[1], size[2]];
		}
		else
		{
			this.meshSize = [size, null, null];
		}
		
		this.updateScale();
	}




	
} // class Mesh


Mesh.createMaterials();﻿//
// Suica 2.0 Point
// CC-3.0-SA-NC
//
// point( center, size, color )
//
// <point id="" center="" size="" color="">
// <point x="" y="" z="">
//
// center	center [x,y,z]
// x		x coordinate of center
// y		y coordinate of center
// z		z coordinate of center
// size		visual size
// color	color [r,g,b]
// image	texture (drawing or canvas)
//
//===================================================


class Point extends Mesh
{

	// a static geometry shared by all points
	static geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3));


	constructor(suica, center, size, color)
	{
		suica.parser?.parseTags();
		suica.debugCall( 'point', center, size, color );


		super( suica, THREE.Points, Point.geometry, Mesh.pointMaterial.clone() );

		this.center = center;
		this.color = color;
		this.size = size;

		suica.scene.add( this.threejs );
		
	} // Point.constructor




	get size()
	{
		this.suica.parser?.parseTags();

		return this.threejs.material.size;
	}

	set size( size )
	{
		this.suica.parser?.parseTags();

		this.threejs.material.size = size;
		this.threejs.material.needsUpdate = true;
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
// Suica 2.0 Line
// CC-3.0-SA-NC
//
// line( center, to, color )
//
// <line id="" center="" to="" color="">
// <line x="" y="" z="">
//
// center	center [x,y,z]
// x		x coordinate of center
// y		y coordinate of center
// z		z coordinate of center
// to		second point of line
// size		visual size
// color	color [r,g,b]
//
//===================================================


class Line extends Mesh
{

	constructor(suica, center, to, color)
	{
		suica.parser?.parseTags();
		suica.debugCall( 'line', center, to, color );
			
		super( suica, THREE.LineSegments, Line.geometry.clone(), Mesh.lineMaterial.clone() );

		this.center = center;
		this.color = color;
		this.to = to;

		suica.scene.add( this.threejs );
	} // Line.constructor



	get center()
	{
		this.suica.parser?.parseTags();

		var pos = this.threejs.geometry.getAttribute( 'position' );
		return [pos.getX(0), pos.getY(0), pos.getZ(0)];
	}

	set center(center)
	{
		this.suica.parser?.parseTags();

		center = Suica.parseCenter( center );
		
		this.threejs.geometry.getAttribute( 'position' ).setXYZ( 0, center[0], center[1], center[2] );
		this.threejs.geometry.needsUpdate = true;
	}




	get from()
	{
		return this.center;
	}

	set from(from)
	{
		this.center = from;
	}




	get to()
	{
		this.suica.parser?.parseTags();

		var pos = this.threejs.geometry.getAttribute( 'position' );
		return [pos.getX(1), pos.getY(1), pos.getZ(1)];
	}

	set to(to)
	{
		this.suica.parser?.parseTags();

		to = Suica.parseCenter( to );
		
		this.threejs.geometry.getAttribute( 'position' ).setXYZ( 1, to[0], to[1], to[2] );
		this.threejs.geometry.needsUpdate = true;
	}





	get size()
	{
		throw 'error: size is not available for line';
	}

	set size( size )
	{
		throw 'error: size is not available for line';
	}
	
	get width()
	{
		throw 'error: width is not available for line';
	}

	set width( width )
	{
		throw 'error: width is not available for line';
	}
	
	get height()
	{
		throw 'error: height is not available for line';
	}

	set height( height )
	{
		throw 'error: height is not available for line';
	}
	
	get depth()
	{
		throw 'error: depth is not available for line';
	}

	set depth( depth )
	{
		throw 'error: depth is not available for line';
	}
	
	get x()
	{
		throw 'error: x is not available for line';
	}

	set x( x )
	{
		throw 'error: x is not available for line';
	}
	
	get y()
	{
		throw 'error: y is not available for line';
	}

	set y( y )
	{
		throw 'error: y is not available for line';
	}
	
	get z()
	{
		throw 'error: z is not available for line';
	}

	set z( z )
	{
		throw 'error: z is not available for line';
	}
	
} // class Line


Line.geometry = new THREE.BufferGeometry();
Line.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0, 0, 30, 0]), 3));
Line.geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([0, 0, 1, 0]), 2));


window.line = function(
					center = Suica.DEFAULT.LINE.CENTER,
					to     = Suica.DEFAULT.LINE.TO,
					color  = Suica.DEFAULT.LINE.COLOR )
{
	Suica.precheck();
	return Suica.current.line( center, to, color );
}﻿//
// Suica 2.0 Square
// CC-3.0-SA-NC
//
// square( center, size, color )
// squareFrame( center, size, color )
//
// <square id="" center="" size="" color="">
// <square x="" y="" z="">
// <square width="" height="">
// <squareFrame ...>
//
// center	center [x,y,z]
// x		x coordinate of center
// y		y coordinate of center
// z		z coordinate of center
// size		size(s) of edge
// width
// height
// color	color [r,g,b]
// image	texture (drawing or canvas)
//
//===================================================


class Square extends Mesh
{

	// a geometry shared by all squares
	static geometry = new THREE.PlaneGeometry( 1, 1 );
	
	constructor( suica, center, size, color )
	{
		suica.parser?.parseTags();
		suica.debugCall( 'square', center, size, color );
		
		super( suica, THREE.Mesh, Square.geometry, Mesh.solidMaterial.clone() );
		
		this.center = center;
		this.color = color;
		this.size = size;
		
		suica.scene.add( this.threejs );
	}

} // class Square




class SquareFrame extends Mesh
{
	
	constructor( suica, center, size, color )
	{
		suica.parser?.parseTags();
		suica.debugCall( 'squareFrame', center, size, color );
		
		super( suica, THREE.LineSegments, SquareFrame.geometry, Mesh.lineMaterial.clone() );
		
		this.center = center;
		this.color = color;
		this.size = size;
		
		suica.scene.add( this.threejs );
	}
	
} // class SquareFrame


SquareFrame.geometry = new THREE.BufferGeometry();
SquareFrame.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
	-0.5,-0.5,0, +0.5,-0.5,0, 
	+0.5,-0.5,0, +0.5,+0.5,0, 
	+0.5,+0.5,0, -0.5,+0.5,0, 
	-0.5,+0.5,0, -0.5,-0.5,0, 
]), 3));
SquareFrame.geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([
	0, 0,  1, 0,
	0, 0,  1, 0,
	0, 0,  1, 0,
	0, 0,  1, 0,
	]), 2));




window.square = function(
				center = Suica.DEFAULT.SQUARE.CENTER,
				size   = Suica.DEFAULT.SQUARE.SIZE,
				color  = Suica.DEFAULT.SQUARE.COLOR )
{
	Suica.precheck();
	return Suica.current.square( center, size, color );
}




window.squareFrame = function(
				center = Suica.DEFAULT.SQUARE.CENTER,
				size   = Suica.DEFAULT.SQUARE.SIZE,
				color  = Suica.DEFAULT.SQUARE.FRAMECOLOR )
{
	Suica.precheck();
	return Suica.current.squareFrame( center, size, color );
}﻿//
// Suica 2.0 Cube
// CC-3.0-SA-NC
//
// cube( center, size, color )
// cubeFrame( center, size, color )
//
// <cube id="" center="" size="" color="">
// <cube x="" y="" z="">
// <cube width="" height="" depth="">
// <cubeFrame ...>
//
// center	center [x,y,z]
// x		x coordinate of center
// y		y coordinate of center
// z		z coordinate of center
// size		size(s) of edge
// width
// height
// depth
// color	color [r,g,b]
// image	texture (drawing or canvas)
//
//===================================================


class Cube extends Mesh
{
	
	// a geometry shared by all cubes
	static geometry = new THREE.BoxGeometry( 1, 1, 1 );
	
	constructor( suica, center, size, color )
	{
		suica.parser?.parseTags();
		suica.debugCall( 'cube', center, size, color );
		
		super( suica, THREE.Mesh, Cube.geometry, Mesh.solidMaterial.clone() );
		
		this.center = center;
		this.color = color;
		this.size = size;
		
		suica.scene.add( this.threejs );
	}

} // class Cube




class CubeFrame extends Mesh
{
	
	constructor( suica, center, size, color )
	{
		suica.parser?.parseTags();
		suica.debugCall( 'cubeFrame', center, size, color );
		
		super( suica, THREE.LineSegments, CubeFrame.geometry, Mesh.lineMaterial.clone() );

		this.center = center;
		this.color = color;
		this.size = size;
		
		suica.scene.add( this.threejs );

	}
	
} // class CubeFrame


CubeFrame.geometry = new THREE.BufferGeometry();
CubeFrame.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
	// bottom ring
	-0.5,-0.5,-0.5, +0.5,-0.5,-0.5, 
	+0.5,-0.5,-0.5, +0.5,+0.5,-0.5, 
	+0.5,+0.5,-0.5, -0.5,+0.5,-0.5, 
	-0.5,+0.5,-0.5, -0.5,-0.5,-0.5, 
	// top ring
	-0.5,-0.5,+0.5, +0.5,-0.5,+0.5, 
	+0.5,-0.5,+0.5, +0.5,+0.5,+0.5, 
	+0.5,+0.5,+0.5, -0.5,+0.5,+0.5, 
	-0.5,+0.5,+0.5, -0.5,-0.5,+0.5, 
	// bottom to top
	-0.5,-0.5,-0.5, -0.5,-0.5,+0.5, 
	+0.5,-0.5,-0.5, +0.5,-0.5,+0.5, 
	+0.5,+0.5,-0.5, +0.5,+0.5,+0.5, 
	-0.5,+0.5,-0.5, -0.5,+0.5,+0.5, 
]), 3));
CubeFrame.geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([
	// bottom ring
	0, 0,  1, 0,
	0, 0,  1, 0,
	0, 0,  1, 0,
	0, 0,  1, 0,
	// top ring
	0, 0,  1, 0,
	0, 0,  1, 0,
	0, 0,  1, 0,
	0, 0,  1, 0,
	// bottom to top
	0, 0,  1, 0,
	0, 0,  1, 0,
	0, 0,  1, 0,
	0, 0,  1, 0,
	]), 2));




window.cube = function(
				center = Suica.DEFAULT.CUBE.CENTER,
				size   = Suica.DEFAULT.CUBE.SIZE,
				color  = Suica.DEFAULT.CUBE.COLOR )
{
	Suica.precheck();
	return Suica.current.cube( center, size, color );
}




window.cubeFrame = function(
				center = Suica.DEFAULT.CUBE.CENTER,
				size   = Suica.DEFAULT.CUBE.SIZE,
				color  = Suica.DEFAULT.CUBE.FRAMECOLOR )
{
	Suica.precheck();
	return Suica.current.cubeFrame( center, size, color );
}﻿//
// Suica 2.0 Circle
// CC-3.0-SA-NC
//
// circle( center, size, color )
// circleFrame( center, size, color )
//
// <circle id="" center="" size="" color="">
// <circle x="" y="" z="">
// <circle width="" height="">
// <circleFrame ...>
//
// center	center [x,y,z]
// x		x coordinate of center
// y		y coordinate of center
// z		z coordinate of center
// size		size(s) of edge
// width
// height
// color	color [r,g,b]
// image	texture (drawing or canvas)
//
//===================================================


class Polygon extends Mesh
{
	
	static geometry = []; // array of geometries for different number of sides
	
	constructor( suica, count, center, size, color )
	{
		suica.parser?.parseTags();
		if( count < Suica.DEFAULT.CIRCLE.COUNT )
			suica.debugCall( 'polygon', count, center, size, color );
		else
			suica.debugCall( 'circle', center, size, color );

	
		if( !Polygon.geometry[count] )
		{
			Polygon.geometry[count] = new THREE.CircleGeometry( 0.5, count, -Math.PI*(1/2-1/count) );
		}
		
		super( suica, THREE.Mesh, Polygon.geometry[count], Mesh.solidMaterial.clone() );
		
		this.center = center;
		this.color = color;
		this.size = size;
		this.n = count;
		
		suica.scene.add( this.threejs );
		
	} // Polygon.constructor


	get count()
	{
		this.suica.parser?.parseTags();

		return this.n;
	}
	
	
	set count( count )
	{
		this.suica.parser?.parseTags();

		if( count == this.n ) return; // same number of side, no need to regenerate
		
		if( !Polygon.geometry[count] )
		{
			Polygon.geometry[count] = new THREE.CircleGeometry( 0.5, count, -Math.PI*(1/2-1/count) );
		}
		
		this.threejs.geometry = Polygon.geometry[count];
	}
	
	
} // class Polygon




class PolygonFrame extends Mesh
{

	static geometry = []; // array of geometries for different number of sides

	constructor( suica, count, center, size, color )
	{
		suica.parser?.parseTags();
		if( count < Suica.DEFAULT.CIRCLE.COUNT )
			suica.debugCall( 'polygonFrame', count, center, size, color );
		else
			suica.debugCall( 'circleFrame', center, size, color );
		
		super( suica, THREE.Line, PolygonFrame.getGeometry( count ), Mesh.lineMaterial.clone() );
		
		this.center = center;
		this.color = color;
		this.size = size;
		this.n = count;
		
		suica.scene.add( this.threejs );
	}		
	
	


	get count()
	{
		this.suica.parser?.parseTags();

		return this.n;
	}
	

	static getGeometry( count )
	{
		if( !Polygon.geometry[count] )
		{
			PolygonFrame.geometry[count] = new THREE.BufferGeometry();

			let vertices = new Float32Array(3*count+3),
				uvs = new Float32Array(2*count+2);

			for( var i=0; i<=count; i++ )
			{
				var angle = 2*Math.PI * i/count - Math.PI*(1/2-1/count);
				
				vertices[3*i] = 0.5*Math.cos( angle ); 
				vertices[3*i+1] = 0.5*Math.sin( angle ); 
				
				// for up to octagons each side has uv from 0 to 1
				// above octagons each quarter of sides has uv from 0 to 1
				if( count > 8 )
					uvs[2*i] = 4*i/count;
				else
					uvs[2*i] = i;
			}
			PolygonFrame.geometry[count].setAttribute( 'position', new THREE.BufferAttribute(vertices,3) );
			PolygonFrame.geometry[count].setAttribute( 'uv', new THREE.BufferAttribute(uvs,2) );
		}
		
		return PolygonFrame.geometry[count];
	}
	
	
	set count( count )
	{
		this.suica.parser?.parseTags();

		if( count == this.n ) return; // same number of side, no need to regenerate
		
		this.threejs.geometry = PolygonFrame.getGeometry( count );
	}
	
} // class PolygonFrame



window.circle = function(
				center = Suica.DEFAULT.CIRCLE.CENTER,
				size   = Suica.DEFAULT.CIRCLE.SIZE,
				color  = Suica.DEFAULT.CIRCLE.COLOR )
{
	Suica.precheck();
	return Suica.current.circle( center, size, color );
}




window.circleFrame = function(
				center = Suica.DEFAULT.CIRCLE.CENTER,
				size   = Suica.DEFAULT.CIRCLE.SIZE,
				color  = Suica.DEFAULT.CIRCLE.FRAMECOLOR )
{
	Suica.precheck();
	return Suica.current.circleFrame( center, size, color );
}




window.polygon = function(
				count = Suica.DEFAULT.POLYGON.COUNT,
				center = Suica.DEFAULT.POLYGON.CENTER,
				size   = Suica.DEFAULT.POLYGON.SIZE,
				color  = Suica.DEFAULT.POLYGON.COLOR )
{
	Suica.precheck();
	return Suica.current.polygon( count, center, size, color );
}




window.polygonFrame = function(
				count = Suica.DEFAULT.POLYGON.COUNT,
				center = Suica.DEFAULT.POLYGON.CENTER,
				size   = Suica.DEFAULT.POLYGON.SIZE,
				color  = Suica.DEFAULT.POLYGON.FRAMECOLOR )
{
	Suica.precheck();
	return Suica.current.polygonFrame( count, center, size, color );
}﻿//
// Suica 2.0 Sphere
// CC-3.0-SA-NC
//
// sphere( center, size, color )
//
// <sphere id="" center="" size="" color="">
// <sphere x="" y="" z="">
// <sphere width="" height="" depth="">
//
// center	center [x,y,z]
// x		x coordinate of center
// y		y coordinate of center
// z		z coordinate of center
// size		size(s) of edge
// width
// height
// depth
// color	color [r,g,b]
// image	texture (drawing or canvas)
//
//===================================================


class Sphere extends Mesh
{
	
	// a geometry shared by all cubes
	static geometry;
	
	constructor( suica, center, size, color )
	{
		suica.parser?.parseTags();
		suica.debugCall( 'sphere', center, size, color );
		
		if( !Sphere.geometry )
		{
			Sphere.geometry = new THREE.SphereGeometry( 0.5, Suica.DEFAULT.SPHERE.COUNT, Math.round(Suica.DEFAULT.SPHERE.COUNT/2) );
		}
		
		super( suica, THREE.Mesh, Sphere.geometry, Mesh.solidMaterial.clone() );
		
		this.center = center;
		this.color = color;
		this.size = size;
		
		suica.scene.add( this.threejs );
	}

} // class Sphere




window.sphere = function(
				center = Suica.DEFAULT.SPHERE.CENTER,
				size   = Suica.DEFAULT.SPHERE.SIZE,
				color  = Suica.DEFAULT.SPHERE.COLOR )
{
	Suica.precheck();
	return Suica.current.sphere( center, size, color );
}
﻿//
// Suica 2.0 Cylinder
// CC-3.0-SA-NC
//
// cylinder( center, size, color )
// prism( center, size, color )
// prismFrame( center, size, color )
//
// <cylinder id="" center="" size="" color="">
// <prism id="" center="" size="" color="">
// <prismFrame id="" center="" size="" color="">
//
// center	center [x,y,z]
// x		x coordinate of center
// y		y coordinate of center
// z		z coordinate of center
// size		size(s)
// width
// height
// depth
// color	color [r,g,b]
// image	texture (drawing or canvas)
//
//===================================================


class Prism extends Mesh
{
	
	static geometry = []; // array of geometries for different number of sides
	
	constructor( suica, count, center, size, color, flatShading )
	{
		suica.parser?.parseTags();
		if( count < Suica.DEFAULT.CYLINDER.COUNT )
			suica.debugCall( 'prism', count, center, size, color );
		else
			suica.debugCall( 'cylinder', center, size, color );
	
		if( !Prism.geometry[count] )
		{
			Prism.geometry[count] = new THREE.CylinderGeometry( 0.5, 0.5, 1, count, 1, false ).translate(0,0.5,0);
		}
		
		super( suica, THREE.Mesh, Prism.geometry[count], flatShading ? Mesh.flatMaterial.clone() : Mesh.solidMaterial.clone() );
		
		this.center = center;
		this.color = color;
		this.size = size;
		this.n = count;
		
		suica.scene.add( this.threejs );
		
	} // Prism.constructor


	get count()
	{
		this.suica.parser?.parseTags();

		return this.n;
	}
	
	
	set count( count )
	{
		this.suica.parser?.parseTags();

		if( count == this.n ) return; // same number of side, no need to regenerate
		
		if( !Prism.geometry[count] )
		{
			Prism.geometry[count] = new THREE.CylinderGeometry( 0.5, 0.5, 1, count, 1, false ).translate(0,0.5,0);
		}
		
		this.threejs.geometry = Prism.geometry[count];
	}
	
	
} // class Prism




class PrismFrame extends Mesh
{

	static geometry = []; // array of geometries for different number of sides

	constructor( suica, count, center, size, color )
	{
		suica.parser?.parseTags();
		suica.debugCall( 'prismFrame', count, center, size, color );
		
		super( suica, THREE.LineSegments, PrismFrame.getGeometry( count ), Mesh.lineMaterial.clone() );
		
		this.center = center;
		this.color = color;
		this.size = size;
		this.n = count;
		
		suica.scene.add( this.threejs );
	}		
	
	


	get count()
	{
		this.suica.parser?.parseTags();

		return this.n;
	}
	

	static getGeometry( count )
	{
		if( !Prism.geometry[count] )
		{
			PrismFrame.geometry[count] = new THREE.BufferGeometry();

			// count segments at bottom, at top, at sides
			// 2 vertices for each segment, 3 numbers for each vertex; uvs has 2 numbers per vertex
			let vertices = new Float32Array(3*2*3*count),
				uvs = new Float32Array(2*2*3*count);

			for( var i=0; i<count; i++ )
			{
				var angle1 = 2*Math.PI * i/count - Math.PI*(1/2-1/count),
					sin1 = 0.5*Math.sin( angle1 ),
					cos1 = 0.5*Math.cos( angle1 );
				var angle2 = 2*Math.PI * (i+1)/count - Math.PI*(1/2-1/count),
					sin2 = 0.5*Math.sin( angle2 ),
					cos2 = 0.5*Math.cos( angle2 );
				
				// horizontal bottom 
				vertices[18*i] = cos1;
				vertices[18*i+1] = 0; 
				vertices[18*i+2] = sin1; 
				vertices[18*i+3] = cos2;
				vertices[18*i+4] = 0; 
				vertices[18*i+5] = sin2; 
				
				// horizontal top
				vertices[18*i+6] = cos1;
				vertices[18*i+7] = 1; 
				vertices[18*i+8] = sin1; 
				vertices[18*i+9] = cos2;
				vertices[18*i+10] = 1; 
				vertices[18*i+11] = sin2; 
				
				// vertical
				vertices[18*i+12] = cos1;
				vertices[18*i+13] = 0; 
				vertices[18*i+14] = sin1; 
				vertices[18*i+15] = cos1;
				vertices[18*i+16] = 1; 
				vertices[18*i+17] = sin1; 
				
				// for up to octagons each side has uv from 0 to 1
				// above octagons each quarter of sides has uv from 0 to 1
				console.assert( uvs[2*i+1] == 0 );
				var u1,u2;
				if( count > 8 )
				{
					u1 = 4*i/count;
					u2 = 4*(i+1)/count;
				}
				else
				{
					u1 = i;
					u2 = i+1;
				}

				// horizontal bottom 
				uvs[12*i] = u1;
				uvs[12*i+2] = u2;

				// horizontal top
				uvs[12*i+4] = u1;
				uvs[12*i+6] = u2;

				// vertical
				uvs[12*i+8] = 0;
				uvs[12*i+10] = 1;
			}
			PrismFrame.geometry[count].setAttribute( 'position', new THREE.BufferAttribute(vertices,3) );
			PrismFrame.geometry[count].setAttribute( 'uv', new THREE.BufferAttribute(uvs,2) );
		}
		
		return PrismFrame.geometry[count];
	}
	
	
	set count( count )
	{
		this.suica.parser?.parseTags();

		if( count == this.n ) return; // same number of side, no need to regenerate
		
		this.threejs.geometry = PrismFrame.getGeometry( count );
	}
	
} // class PrismFrame



window.cylinder = function(
				center = Suica.DEFAULT.CYLINDER.CENTER,
				size   = Suica.DEFAULT.CYLINDER.SIZE,
				color  = Suica.DEFAULT.CYLINDER.COLOR )
{
	Suica.precheck();
	return Suica.current.cylnder( center, size, color );
}



window.prism = function(
				count = Suica.DEFAULT.PRISM.COUNT,
				center = Suica.DEFAULT.PRISM.CENTER,
				size   = Suica.DEFAULT.PRISM.SIZE,
				color  = Suica.DEFAULT.PRISM.COLOR )
{
	Suica.precheck();
	return Suica.current.prism( count, center, size, color );
}




window.prismFrame = function(
				count = Suica.DEFAULT.PRISM.COUNT,
				center = Suica.DEFAULT.PRISM.CENTER,
				size   = Suica.DEFAULT.PRISM.SIZE,
				color  = Suica.DEFAULT.PRISM.FRAMECOLOR )
{
	Suica.precheck();
	return Suica.current.prismFrame( count, center, size, color );
}﻿//
// Suica 2.0 Cone
// CC-3.0-SA-NC
//
// cone( center, size, color )
// pyramid( center, size, color )
// pyramidFrame( center, size, color )
//
// <cone id="" center="" size="" color="">
// <pyramid id="" center="" size="" color="">
// <pyramidFrame id="" center="" size="" color="">
//
// center	center [x,y,z]
// x		x coordinate of center
// y		y coordinate of center
// z		z coordinate of center
// size		size(s)
// width
// height
// depth
// color	color [r,g,b]
// image	texture (drawing or canvas)
//
//===================================================


class Pyramid extends Mesh
{
	
	static geometry = []; // array of geometries for different number of sides
	
	constructor( suica, count, center, size, color, flatShading )
	{
		suica.parser?.parseTags();
		if( count < Suica.DEFAULT.CONE.COUNT )
			suica.debugCall( 'pyramid', count, center, size, color );
		else
			suica.debugCall( 'cone', center, size, color );
	
		if( !Prism.geometry[count] )
		{
			Prism.geometry[count] = new THREE.ConeGeometry( 0.5, 1, count, 1, false ).translate(0,0.5,0);
		}
		
		super( suica, THREE.Mesh, Prism.geometry[count], flatShading ? Mesh.flatMaterial.clone() : Mesh.solidMaterial.clone() );
		
		this.center = center;
		this.color = color;
		this.size = size;
		this.n = count;
		
		suica.scene.add( this.threejs );
		
	} // Pyramid.constructor


	get count()
	{
		this.suica.parser?.parseTags();

		return this.n;
	}
	
	
	set count( count )
	{
		this.suica.parser?.parseTags();

		if( count == this.n ) return; // same number of side, no need to regenerate
		
		if( !Pyramid.geometry[count] )
		{
			Pyramid.geometry[count] = new THREE.ConeGeometry( 0.5, 1, count, 1, false ).translate(0,0.5,0);
		}
		
		this.threejs.geometry = Pyramid.geometry[count];
	}
	
	
} // class Pyramid




class PyramidFrame extends Mesh
{

	static geometry = []; // array of geometries for different number of sides

	constructor( suica, count, center, size, color )
	{
		suica.parser?.parseTags();
		suica.debugCall( 'pyramidFrame', count, center, size, color );
		
		super( suica, THREE.LineSegments, PyramidFrame.getGeometry( count ), Mesh.lineMaterial.clone() );
		
		this.center = center;
		this.color = color;
		this.size = size;
		this.n = count;
		
		suica.scene.add( this.threejs );
	}		
	
	


	get count()
	{
		this.suica.parser?.parseTags();

		return this.n;
	}
	

	static getGeometry( count )
	{
		if( !Pyramid.geometry[count] )
		{
			PyramidFrame.geometry[count] = new THREE.BufferGeometry();

			// count segments at bottom and at sides
			// 2 vertices for each segment, 3 numbers for each vertex; uvs has 2 numbers per vertex
			let vertices = new Float32Array(3*2*2*count),
				uvs = new Float32Array(2*2*2*count);

			for( var i=0; i<count; i++ )
			{
				var angle1 = 2*Math.PI * i/count - Math.PI*(1/2-1/count),
					sin1 = 0.5*Math.sin( angle1 ),
					cos1 = 0.5*Math.cos( angle1 );
				var angle2 = 2*Math.PI * (i+1)/count - Math.PI*(1/2-1/count),
					sin2 = 0.5*Math.sin( angle2 ),
					cos2 = 0.5*Math.cos( angle2 );
				
				// horizontal bottom (skipping 0 values)
				vertices[12*i] = cos1;
				vertices[12*i+1] = 0; 
				vertices[12*i+2] = sin1; 
				vertices[12*i+3] = cos2;
				vertices[12*i+4] = 0; 
				vertices[12*i+5] = sin2; 
				
				// vertical
				vertices[12*i+6] = cos1;
				vertices[12*i+7] = 0; 
				vertices[12*i+8] = sin1; 
				vertices[12*i+9] = 0;
				vertices[12*i+10] = 1; 
				vertices[12*i+11] = 0; 
				
				// for up to octagons each side has uv from 0 to 1
				// above octagons each quarter of sides has uv from 0 to 1
				console.assert( uvs[2*i+1] == 0 );
				var u1,u2;
				if( count > 8 )
				{
					u1 = 4*i/count;
					u2 = 4*(i+1)/count;
				}
				else
				{
					u1 = i;
					u2 = i+1;
				}

				// horizontal bottom 
				uvs[8*i] = u1;
				uvs[8*i+2] = u2;

				// vertical
				uvs[8*i+4] = 0;
				uvs[8*i+6] = 1;
			}
			PyramidFrame.geometry[count].setAttribute( 'position', new THREE.BufferAttribute(vertices,3) );
			PyramidFrame.geometry[count].setAttribute( 'uv', new THREE.BufferAttribute(uvs,2) );
		}
		
		return PyramidFrame.geometry[count];
	}
	
	
	set count( count )
	{
		this.suica.parser?.parseTags();

		if( count == this.n ) return; // same number of side, no need to regenerate
		
		this.threejs.geometry = PyramidFrame.getGeometry( count );
	}
	
} // class PyramidFrame



window.cone = function(
				center = Suica.DEFAULT.CONE.CENTER,
				size   = Suica.DEFAULT.CONE.SIZE,
				color  = Suica.DEFAULT.CONE.COLOR )
{
	Suica.precheck();
	return Suica.current.cone( center, size, color );
}



window.pyramid = function(
				count = Suica.DEFAULT.PYRAMID.COUNT,
				center = Suica.DEFAULT.PYRAMID.CENTER,
				size   = Suica.DEFAULT.PYRAMID.SIZE,
				color  = Suica.DEFAULT.PYRAMID.COLOR )
{
	Suica.precheck();
	return Suica.current.pyramid( count, center, size, color );
}




window.pyramidFrame = function(
				count = Suica.DEFAULT.PYRAMID.COUNT,
				center = Suica.DEFAULT.PYRAMID.CENTER,
				size   = Suica.DEFAULT.PYRAMID.SIZE,
				color  = Suica.DEFAULT.PYRAMID.FRAMECOLOR )
{
	Suica.precheck();
	return Suica.current.pyramidFrame( count, center, size, color );
}} // LoadSuica 
