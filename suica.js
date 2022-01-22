//
// Suica 2.0
// CC-3.0-SA-NC
//
//	<suica width="..." height="..." style="...">
//		<background color="...">
//		<oxyz size="..." color="...">
//		<demo distance="..." altitude="...">
//		<animate src="...">
//		<point id="..." center="..." color="..." size="...">
//	</suica>
//
//	<script>
//		{suica.}background( color= )
//		{suica.}oxyz( size, color )
//		{suica.}demo( distance, altitude )
//		{suica.}animate( src )
//		{suica.}point( center, size, color )
//	</script>
//
//		
//===================================================
//
// History
//	2.0.00 (220118)	initiation
//	2.0.01 (220119)	custom tags, nested tags, background, oxyz, animate
//	2.0.02 (220120) point
//	2.0.03 (220122) autoload js files, cube
//
//===================================================

			
			
document.write( '<script src="three.min.js"></script>' );
document.write( '<script src="suica-parser.js"></script>' );
document.write( '<script src="suica-point.js"></script>' );
document.write( '<script src="suica-cube.js"></script>' );


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
		BACKGROUND: { COLOR: 'white' },
		OXYZ: { COLOR: 'black', SIZE: 30 },
		DEMO: { DISTANCE: 100, ALTITUDE: 30 },
		ANIMATE: { SRC: null },
		POINT: { CENTER:[0,0,0], COLOR:'crimson', SIZE:5 },
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
		this.nextFrame = null;
		
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
		this.canvas.style = `	border: none;
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

		var color = this.suicaTag.getAttribute('background') || this.suicaTag.style.backgroundColor;
		if( !color )
		{
			color = getComputedStyle(this.suicaTag).backgroundColor;
			if( color == 'rgba(0, 0, 0, 0)' ) color = 'white';
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
			
			if( that.nextFrame )
			{
				// OMG, I have never expected to use eval() in actual code, but here I am
				if (typeof that.nextFrame === 'string' || that.nextFrame instanceof String)
					that.nextFrame = window[that.nextFrame];
				
				that.nextFrame( time, time-that.lastTime );
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
				transparent: !true,
				alphaTest: 0.8,
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
	
	
	animate( src=Suica.DEFAULT.ANIMATE.SRC )
	{
		this.parser?.parseTags();
		if( DEBUG_CALLS ) console.log(`:: ${this.id}.animate( ${src} )`);
		
		this.nextFrame = src;
	}
	
	
	static precheck()
	{
		if( !(Suica.current instanceof Suica) )
			throw 'error: No Suica instance is active';
	}
	

	static parseColor( color )
	{
		if( Array.isArray(color) )
			return new THREE.Color( color[0], color[1]||0, color[2]||0 );
		else
			return new THREE.Color( color || 'white' );
	}
	
	
	point( center=Suica.DEFAULT.POINT.CENTER, size=Suica.DEFAULT.POINT.SIZE, color=Suica.DEFAULT.POINT.COLOR )
	{
		this.parser?.parseTags();
		if( DEBUG_CALLS ) console.log(`:: ${this.id}.point( [${center}], ${color}, ${size} )`);

		return new Point( this, center, size, color );
	}
	
	
	cube( center=Suica.DEFAULT.CUBE.CENTER, size=Suica.DEFAULT.CUBE.SIZE, color=Suica.DEFAULT.CUBE.COLOR )
	{
		this.parser?.parseTags();
		if( DEBUG_CALLS ) console.log(`:: ${this.id}.cube( [${center}], ${color}, ${size} )`);

		return new Cube( this, center, size, color );
	}

}



function background( color=Suica.DEFAULT.BACKGROUND.COLOR )
{
	Suica.precheck();
	Suica.current.background( color );
}

function oxyz( size=Suica.DEFAULT.OXYZ.SIZE, color=Suica.DEFAULT.OXYZ.COLOR )
{
	Suica.precheck();
	Suica.current.oxyz( size, color );
}

function demo( distance=Suica.DEFAULT.DEMO.DISTANCE, altitude=Suica.DEFAULT.DEMO.ALTITUDE )
{
	Suica.precheck();
	Suica.current.demo( distance, altitude );
}

function animate( src=Suica.DEFAULT.ANIMATE.SRC )
{
	Suica.precheck();
	Suica.current.animate( src );
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
);