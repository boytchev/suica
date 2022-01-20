//
// Suica 2.0
// CC-3.0-SA-NC
//
//	<suica-canvas width="..." height="..." style="...">
//		<background color="...">
//		<oxyz size="..." color="...">
//		<animate src="...">
//		<point id="..." center="..." color="..." size="...">
//	</suica-canvas>
//
//	<script>
//		{suica.}background( color= )
//		{suica.}oxyz( size, color )
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
//
//===================================================




// check prerequisites
if( typeof THREE === 'undefined' ) throw 'error: Three.js must be loaded before Suica.js';


// show suica version
console.log( `Suica 2.0.0 (220118) :: r${THREE.REVISION}` );


// control flags
const DEBUG_CALLS = !false;




//========================================================================
//
// class Suica
//
// Implements custom tag <suica-canvas> and creates a tag <canvas> inside it
//
//========================================================================

class Suica extends HTMLElement
{
	// current active Suica instance
	static current;
	
	// array of all Suicas
	static allSuicas = [];
	
	// default values for Suica commands
	static DEFAULT = {
		BACKGROUND: { COLOR: 'white' },
		OXYZ: { COLOR: 'black', SIZE: 30 },
		ANIMATE: { SRC: null },
		POINT: { CENTER:[0,0,0], COLOR:'crimson', SIZE:5 },
	} // Suica.DEFAULT
	
	
	constructor( )
	{
		super( );
	} // Suica.constructor

	
	// activated whenever <suica-canvas> is attached to DOM
	connectedCallback( )
	{
		// fix styling of <suica-canvas>
		this.style.display = 'inline-block';
		this.style.boxSizing = 'border-box';
		
		// get or invent id
		this.id = this.getAttribute('id') || `suica${Suica.allSuicas.length}`
		
		// create and initialize <canvas>
		this.createCanvas( ); // creates this.canvas
		this.createRenderer( ); // creates this.rendered, this.scene, this.camera
		
		// define parsers for suica tags inside <suica-canvas>
		this.parser = new HTMLParser( this );
		
		// frame-based animation
		this.nextFrame = null;
		
		// register this suica instance
		Suica.current = this; // as current Suica
		Suica.allSuicas.push( this ); // as one of all Suicas
		window[this.id] = this; // as global variable
		
	} // Suica.connectedCallback
	
	
	// create canvas element inside <suica-canvas>
	createCanvas()
	{
		// create a shadow root
		this.attachShadow({mode: 'open'}); // creates this.shadowRoot

		// calculates size - if size is not defined in CSS,
		// than use <suica-canvas> attributes, or default values
		if( this.clientWidth < 1 )
			this.style.width = (this.getAttribute('width') || 500) + 'px';

		if( this.clientHeight < 1 )
			this.style.height = (this.getAttribute('height') || 300) + 'px';

		// create canvas elements
		this.canvas = document.createElement( 'canvas' );
		this.canvas.width = this.clientWidth;
		this.canvas.height = this.clientHeight;

		// create some CSS to apply to <canvas> in shadow dom's 
		var style = document.createElement( 'style' );
			style.textContent = `canvas {
				border: none;
				width: 100%;
				height: 100%;
				box-sizing: border-box;
			}`;

		// attach the created elements to the shadow DOM
		this.shadowRoot.append( style, this.canvas );
		
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

		// scene with background from <suica-canvas>'s CSS
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color( getComputedStyle(this).backgroundColor );

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
			
			if( that.nextFrame )
				that.nextFrame( time, time-that.lastTime );
			
			that.render( );

			that.lastTime = time;
			
		} // Suica.createRenderer.loop
		
		this.renderer.setAnimationLoop( loop );

	} // Suica.createRenderer


	
	background( color=Suica.DEFAULT.BACKGROUND.COLOR )
	{
		this.parser?.parseTags();
		if( DEBUG_CALLS ) console.log(`:: ${this.getAttribute('id')}.background( ${color} )`);
		
		this.scene.background = new THREE.Color( color );
	}
	
	
	oxyz( size=Suica.DEFAULT.OXYZ.SIZE, color=Suica.DEFAULT.OXYZ.COLOR )
	{
		this.parser?.parseTags();
		if( DEBUG_CALLS ) console.log(`:: ${this.getAttribute('id')}.oxyz( ${size}, ${color} )`);
		
		var axes = new THREE.AxesHelper( size )
			axes.setColors( color, color, color );
		this.scene.add( axes );
	}
	
	
	animate( src=Suica.DEFAULT.ANIMATE.SRC )
	{
		this.parser?.parseTags();
		if( DEBUG_CALLS ) console.log(`:: ${this.getAttribute('id')}.animate( ${src} )`);
		
		this.nextFrame = src;
	}
	
	
	static precheck()
	{
		if( !(Suica.current instanceof Suica) )
			throw 'error: No Suica instance is active';
	}
	
	
	point( center=Suica.DEFAULT.POINT.CENTER, size=Suica.DEFAULT.POINT.SIZE, color=Suica.DEFAULT.POINT.COLOR )
	{
		this.parser?.parseTags();
		if( DEBUG_CALLS ) console.log(`:: ${this.getAttribute('id')}.point( [${center}], ${color}, ${size} )`);

		return new Point( this, center, size, color );
	}
}

customElements.define('suica-canvas', Suica);


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

function animate( src=Suica.DEFAULT.ANIMATE.SRC )
{
	Suica.precheck();
	Suica.current.animate( src );
}

window.addEventListener( 'load', function()
	{
		for( var suica of Suica.allSuicas )
			suica.parser?.parseTags();
	}
);
