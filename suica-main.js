//
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
);