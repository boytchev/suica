
// Suica 2.0
// CC-3.0-SA-NC
//
//	<suica-canvas width="..." height="..." style="...">
//		<background color="...">
//		<oxyz size="..." color="...">
//	</suica-canvas>
//
//	<script>
//		{suica.}background( color )
//		{suica.}oxyz( length=30, color='black' )
//	</script>
//
//		
//===================================================
//
// History
//	2.0.00 (220118)	initiation
//	2.0.01 (220119)	custom tags, nested tags, background, oxyz, animate
//
//===================================================


if( typeof THREE === 'undefined' ) throw 'error: Three.js must be loaded before Suica.js';

console.log( `Suica 2.0.0 (220118) :: r${THREE.REVISION}` );


const DEBUG_CALLS = !false;


class Suica extends HTMLElement
{
	static current;
	static allSuicas = [];
	static DEFAULT = {
		BACKGROUND: { COLOR: 'white' },
		OXYZ: { COLOR: 'black', SIZE: 30 },
		ANIMATE: { SRC: null },
	}
	
	constructor( )
	{
		super( );
	}

	
	connectedCallback( )
	{
		this.style.display = 'inline-block';
		this.style.boxSizing = 'border-box';
		this.alreadyParsed = false; // internal tags are not processed yet
		
		this.id = this.getAttribute('id') || `suica${Suica.allSuicas.length}`
		this.createCanvas( ); // creates this.canvas
		this.createRenderer( ); // creates this.rendered, this.scene, this.camera
		
		this.parseTag = {};
		this.parseTag.OXYZ = this.parseTagOXYZ;
		this.parseTag.BACKGROUND = this.parseTagBACKGROUND;
		this.parseTag.ANIMATE = this.parseTagANIMATE;
		
		this.nextFrame = null;
		
		Suica.current = this;
		Suica.allSuicas.push( this );
		window[this.id] = this;
	}
	
	
	// create canvas element inside suica-canvas
	
	createCanvas()
	{
		// create a shadow root
		this.attachShadow({mode: 'open'}); // sets and returns 'this.shadowRoot'

		if( this.clientWidth < 1 )
			this.style.width = (this.getAttribute('width') || 500) + 'px';

		if( this.clientHeight < 1 )
			this.style.height = (this.getAttribute('height') || 300) + 'px';
		

		// create canvas elements
		this.canvas = document.createElement( 'canvas' );
		this.canvas.width = this.clientWidth;
		this.canvas.height = this.clientHeight;


		// create some CSS to apply to the shadow dom
		var style = document.createElement( 'style' );
			style.textContent = `canvas {
				border: none;
				width: 100%;
				height: 100%;
				box-sizing: border-box;
			}`;

		// attach the created elements to the shadow DOM
		this.shadowRoot.append( style, this.canvas );
	}
	
	
	
	get canvasAspect( )
	{
		return this.canvas.width / this.canvas.height;
	}
	
	
	
	// create Three.js renderer
	
	createRenderer( )
	{
		this.renderer = new THREE.WebGLRenderer( {
							canvas: this.canvas,
							alpha: true,
							antialias: true
						} );

		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color( getComputedStyle(this).backgroundColor );

		this.camera = new THREE.PerspectiveCamera( 40, this.canvasAspect, 1, 1000 );
		this.camera.position.set( 0, 0, 100 );
		this.camera.lookAt( this.scene.position );

		var light = new THREE.PointLight( 'white', 1 );
			light.position.set( 100, 150, 300 );
			this.scene.add( light );
			
		this.renderer.render( this.scene, this.camera );

		// this.mesh = new THREE.Mesh(
			// new THREE.BoxGeometry( 30, 30, 30 ),
			// new THREE.MeshLambertMaterial( {color: 'peru'} )
		// );
		// this.scene.add( this.mesh );
		
		var that = this;
		this.lastTime = 0;
		
		function loop( time )
		{
			var newTime = time/1000;
			
			if( that.nextFrame )
				that.nextFrame( newTime, newTime-that.lastTime );
			
			that.renderer.render( that.scene, that.camera );

			that.lastTime = newTime;
		}
		
		this.renderer.setAnimationLoop( loop );

	}

	// tick( t )
	// {
		// this.mesh.rotation.set( t, t/2, 0 );
		// this.renderer.render( this.scene, this.camera );
	// }
	
	parseTagOXYZ( suica, elem )
	{
		suica.oxyz(
			elem.getAttribute('size') || Suica.DEFAULT.OXYZ.SIZE,
			elem.getAttribute('color') || Suica.DEFAULT.OXYZ.COLOR
		);
	}
	
	
	parseTagBACKGROUND( suica, elem )
	{
		suica.background(
			elem.getAttribute('color') || Suica.DEFAULT.BACKGROUND.COLOR
		);
	}
	
	
	parseTagANIMATE( suica, elem )
	{
		suica.nextFrame = eval( elem.getAttribute('src') || Suica.DEFAULT.ANIMATE.SRC );
	}
	
	
	parseTagsInElement( that, elem )
	{
		for( var i = 0; i<elem.children.length; i++ )
		{
			var tagName = elem.children[i].tagName;
			if( that.parseTag[tagName] )
				that.parseTag[tagName](that,elem.children[i]);
			else
				throw `error: unknown tag in <${this.tagName}>`;
			that.parseTagsInElement( that, elem.children[i] );
		}
	}
	
	
	parseTags( )
	{
		if( this.alreadyParsed ) return;
		
		this.alreadyParsed = true;
		this.parseTagsInElement( this, this );
		this.renderer.render( this.scene, this.camera );
	}
	
	
	
	background( color=Suica.DEFAULT.BACKGROUND.COLOR )
	{
		this.parseTags();
		if( DEBUG_CALLS ) console.log(`:: ${this.getAttribute('id')}.background( ${color} )`);
		
		this.scene.background = new THREE.Color( color );
	}
	
	
	oxyz( size=Suica.DEFAULT.OXYZ.SIZE, color=Suica.DEFAULT.OXYZ.COLOR )
	{
		this.parseTags();
		if( DEBUG_CALLS ) console.log(`:: ${this.getAttribute('id')}.oxyz( ${size}, ${color} )`);
		
		var axes = new THREE.AxesHelper( size )
			axes.setColors( color, color, color );
		this.scene.add( axes );
	}
	
	
	animate( src=Suica.DEFAULT.ANIMATE.SRC )
	{
		this.parseTags();
		if( DEBUG_CALLS ) console.log(`:: ${this.getAttribute('id')}.animate( ${src} )`);
		
		this.nextFrame = src;
	}
	
	
	static precheck()
	{
		if( !(Suica.current instanceof Suica) )
			throw 'error: No Suica instance is active';
	}
	
	
	static tagId( id )
	{
		return document.getElementById( id );
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

suica = Suica.tagId;

window.addEventListener( 'load', function()
	{
		for( var suica of Suica.allSuicas )
			if( !suica.alreadyParsed )
				suica.parseTags( );
	}
);

