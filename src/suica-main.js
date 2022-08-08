//
// Suica 2.0
// CC-3.0-SA-NC
//
//===================================================


// control flags
const DEBUG_CALLS = false;
const DEBUG_EVENTS = false;
const TEST_MODE = typeof SUICA_TEST_MODE !== 'undefined';


// show suica version
if( TEST_MODE )
	console.log('::> suica');
else
	console.log(`(\\/)
( ..)		Suica 2.0
c(”)(”)		 (2207)
`);


// SUICA_TEST_MODE must be declared before loading suica.js:
//
// 	SUICA_TEST_MODE
//		- right click on canvas is allowed
//		- preserveDrawingBuffer in renderer set to  true
//		- time is rounded to 0.05s



// last (current) Suica instance
var suica = null;




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
	//static current;
	
	// array of all Suicas
	static allSuicas = [];

	static CIRCLECOUNT = 50; // also cone and cylinder

	// coordinate system orientations
	static OX = new THREE.Vector3(1,0,0);
	static OY = new THREE.Vector3(0,1,0);
	static OZ = new THREE.Vector3(0,0,1);
	static ORIENTATIONS = {
			YXZ: {	SCALE: new THREE.Vector3(1,-1,1),
					LOOKAT: {FROM: [0,0,100], TO: [0,0,0], UP: [1,0,0]},
					RIGHT: Suica.OY,
					UP: Suica.OX,
					FORWARD: Suica.OZ,
			},
			ZYX: {	SCALE: new THREE.Vector3(1,1,-1),
					LOOKAT: {FROM: [100,0,0], TO: [0,0,0], UP: [0,1,0]},
					RIGHT: Suica.OZ,
					UP: Suica.OY,
					FORWARD: Suica.OX,
			},
			XZY: {	SCALE: new THREE.Vector3(-1,1,1),
					LOOKAT: {FROM: [0,100,0], TO: [0,0,0], UP: [0,0,1]},
					RIGHT: Suica.OX,
					UP: Suica.OZ,
					FORWARD: Suica.OY,
			},


			ZXY: {	SCALE: new THREE.Vector3(1,1,1),
					LOOKAT: {FROM: [0,100,0], TO: [0,0,0], UP: [1,0,0]},
					RIGHT: Suica.OZ,
					UP: Suica.OX,
					FORWARD: Suica.OY,
			},
			XYZ: {	SCALE: new THREE.Vector3(1,1,1),
					LOOKAT: {FROM: [0,0,100], TO: [0,0,0], UP: [0,1,0]},
					RIGHT: Suica.OX,
					UP: Suica.OY,
					FORWARD: Suica.OZ,
			},
			YZX: {	SCALE: new THREE.Vector3(1,1,1),
					LOOKAT: {FROM: [100,0,0], TO: [0,0,0], UP: [0,0,1]},
					RIGHT: Suica.OY,
					UP: Suica.OZ,
					FORWARD: Suica.OX,
			},
		} // Suica.ORIENTATIONS

	static globalHoverObject; // used to track mouse enter/leave for Suica objects
	static globalHoverEvent;  // used to track mouse enter/leave for Suica objects while demo()
	
	flipNormal( geometry )
	{
		if( this.orientation.FLIP_NORMAL )
		{
			var nor = geometry.getAttribute( 'normal' ).array;
			for( var i=0; i<nor.length; i++ )
				nor[i] = -nor[i];
		}
		
		return geometry;
	} // Suica.flipNormal
	
	
	// default values for Suica commands
	static OXYZ = { COLOR: 'black', SIZE: 30 };
	static DEMO = { DISTANCE: 100, ALTITUDE: 30, SPEED: 1 };
	static ORBIT = { DISTANCE: 100, ALTITUDE: 30, SPEED: 0 };
	static BACKGROUND = 'whitesmoke';
	static ANAGLYPH = { DISTANCE: 5 };
	static STEREO = { DISTANCE: 1 };
	static PERSPECTIVE = { NEAR: 1, FAR: 1000, FOV: 40 };
	static ORTHOGRAPHIC = { NEAR: 0, FAR: 1000 };
	static DEFAULT_ORIENTATION = 'XYZ';
	static SPLINE = { POINTS:[[0,0,0],[0,1,0]], CLOSED:false, INTERPOLANT:true };	
	static SPLANE = { POINTS:[
		[[-3,0,-3], [-1,0,-3], [+1,0,-3], [+3,0,-3]],
		[[-3,0,-1], [-1,3,-1], [+1,3,-1], [+3,0,-1]],
		[[-3,0,+1], [-1,3,+1], [+1,3,+1], [+3,0,+1]],
		[[-3,0,+3], [-1,0,+3], [+1,0,+3], [+3,0,+3]]
	], CLOSED:[false,false], INTERPOLANT:[true,true] };	
	
	constructor( suicaTag )
	{
		// internal storage
		this._ = {
			solidGeometry:{},
			frameGeometry:{},
		};
		
		// fix styling of <suica>
		suicaTag.style.display = 'inline-block';
		suicaTag.style.boxSizing = 'border-box';
		if( !getComputedStyle(suicaTag).width && !suicaTag.hasAttribute('width') )
			suicaTag.style.width = TEST_MODE?'400px':'500px';
		if( !getComputedStyle(suicaTag).height && !suicaTag.hasAttribute('height') )
			suicaTag.style.height = TEST_MODE?'400px':'300px';
		
		if( !suicaTag.style.position ) suicaTag.style.position = 'relative';
		
		// get or invent id
		this.id = suicaTag.getAttribute('id') || `suica${Suica.allSuicas.length}`
		if( DEBUG_CALLS ) console.log(`Suica :: ${this.id}`);
		
		this.suicaTag = suicaTag;
		this.isProactive = false;
		
		this.capturer = null;

		// set Suica orientation data
		this.orientation = Suica.ORIENTATIONS[suicaTag.getAttribute('ORIENTATION')?.toUpperCase() || Suica.DEFAULT_ORIENTATION];
		this.orientation.MATRIX = new THREE.Matrix4().makeBasis(this.orientation.RIGHT,this.orientation.UP,this.orientation.FORWARD);
		this.orientation.FLIP_NORMAL = this.orientation.SCALE.x<0 || this.orientation.SCALE.y<0 || this.orientation.SCALE.z<0;
		
		this.viewPoint = {
			from: this.orientation.LOOKAT.FROM,
			to: this.orientation.LOOKAT.TO,
			up: this.orientation.LOOKAT.UP,
		};
		
		// create and initialize <canvas>
		this.createCanvas( ); // creates this.canvas
		this.createRenderer( ); // creates this.rendered, this.scene, this.camera
		
		// define parsers for suica tags inside <suica>
		this.parser = new HTMLParser( this );
		
		// parse event handlers (if any)
		this.parser.parseEvents( suicaTag, this.canvas, this );
		
		// automatic rotation
		this.demoViewPoint = null;
		this.controls = null;

		// object selection and events
		this.raycaster = new THREE.Raycaster();
		this.raycastPointer = new THREE.Vector2();

		// register this suica instance
		window.suica = this;
		//Suica.current = this; // as current Suica
		Suica.allSuicas.push( this ); // as one of all Suicas
		window[this.id] = this; // as global variable
		
//		this.debugObject = new THREE.Mesh( new THREE.SphereGeometry(5), new THREE.MeshPhongMaterial({color:'orange', shininess:200}));
//		this.scene.add( this.debugObject );
		
		// interactivity manager
		this.canvas.addEventListener( 'pointermove', Suica.onPointerMove );
		this.canvas.addEventListener( 'pointerdown', Suica.onPointerDown );
		this.canvas.addEventListener( 'pointerup', Suica.onPointerUp );
		this.canvas.addEventListener( 'click', Suica.onClick );
		//this.canvas.addEventListener( 'dblclick', Suica.onDblClick );
		
		if( TEST_MODE )
		{
			THREE.MathUtils.seededRandom(1); // fixed seed, so random number will be the same
		}
		else
		{
			this.canvas.addEventListener( 'contextmenu', Suica.onContextMenu );
			THREE.MathUtils.seededRandom( Math.round(Number.MAX_SAFE_INTEGER*Math.random()) );
		}
		
		
		// register local methods that have stereotypical code
		for( var classObject of [Point, Line, Square, Cube, Polygon, Sphere, Group, Tube, Surface, Prism, Cylinder, Cone, Pyramid, Circle, Convex, Extrude, Model, Construct, Text3D, Capture] )
		{
			Suica.registerClass( this, classObject );
		}
		
		// register some local methods as public global functions
		for( var methodName of ['cube', 'square', 'sphere', 'point', 'line', 'group', 'cylinder', 'prism', 'cone', 'pyramid', 'circle', 'polygon', 'tube', 'surface','lookAt', 'fullScreen', 'fullWindow', 'proactive', 'anaglyph', 'stereo', 'perspective', 'orthographic', 'lookAt', 'background', 'oxyz', 'demo', 'allObjects', 'convex', 'extrude', 'model', 'construct', 'text3d', 'capture', 'orbit'] )
		{
			Suica.register( this, methodName );
		}
		
		// manual fix of some special functions
		// (`save` is a static method of `Model`)
		this.model.save = function( ...params )
		{
			this.parser?.parseTags();
			return Model.save( ...params );
		}
		window.model.save = function ( ...params )
		{
			Suica.precheck();
			return Model.save( ...params );
		}
		
	} // Suica.constructor

	
	static registerClass( suica, classObject )
	{
		suica[classObject.name.toLowerCase()] = function( ...params )
		{
			suica.parser?.parseTags();
			return new classObject( suica, ...params );
		}
	}

	
	static register( suica, methodName )
	{
		//console.log(`register('${methodName}')`);
		window[methodName] = function ( ...params )
		{
			Suica.precheck();
			return /*Suica.current*/suica[methodName]( ...params );
		}
		
	}
	
	
	// create canvas element inside <suica>
	createCanvas()
	{
		// calculates size - if size is not defined in CSS,
		// than use <suica> attributes, or default values
		if( this.suicaTag.clientWidth < 1 )
			this.suicaTag.style.width = (this.suicaTag.getAttribute('width') || (TEST_MODE?400:500)) + 'px';

		if( this.suicaTag.clientHeight < 1 )
			this.suicaTag.style.height = (this.suicaTag.getAttribute('height') || (TEST_MODE?400:300)) + 'px';

		// create canvas elements
		this.canvas = document.createElement( 'canvas' );
		this.canvas.width = this.suicaTag.clientWidth;
		this.canvas.height = this.suicaTag.clientHeight;
		this.canvas.style = `	border: solid 1px gray;
								width: 100%;
								height: 100%;
								box-sizing: border-box;`;
		this.canvas.suicaObject = this;
		this.suicaTag.appendChild( this.canvas );
		
	} // Suica.createCanvas
	

	// readjust canvas (after resize)
	resizeCanvas()
	{
		var w = this.suicaTag.clientWidth,
			h = this.suicaTag.clientHeight;
			
		if( this.camera instanceof THREE.PerspectiveCamera )
		{
			this.camera.aspect = w/h;
		}
		else
		if( this.camera instanceof THREE.OrthographicCamera )
		{
			this.camera.left = -w/2;
			this.camera.right = +w/2;
			this.camera.top = h/2;
			this.camera.bottom = -h/2;
		}
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( w, h, true );
		this.uberRenderer?.setSize( w, h, true );		
	}

	// pseudo-element to calculates the canvas aspect
	get canvasAspect( )
	{
		return this.canvas.width / this.canvas.height;
		
	} // Suica.canvasAspect
	
	
	// render the current scene
	render( )
	{
		if( this.uberRenderer )
			this.uberRenderer.render( this.scene, this.camera );
		else
			this.renderer.render( this.scene, this.camera );
		
	} // Suica.render
	
	
	// create Three.js renderer bound to <canvas>
	createRenderer( )
	{
		// renderer with antialias and alpha
		this.renderer = new THREE.WebGLRenderer( {
							canvas: this.canvas,
							alpha: true,
							antialias: true,
							preserveDrawingBuffer: TEST_MODE,
						} );

		// renderer with effects; if set, it is used instead of the normal renderer
		this.uberRenderer = null;
		
		// scene with background from <suica>'s CSS
		this.scene = new THREE.Scene();
		
		this.scene.scale.copy( this.orientation.SCALE );

		var color = getComputedStyle(this.suicaTag).backgroundColor;
		if( color == 'rgba(0, 0, 0, 0)' )
		{
			color = this.suicaTag.getAttribute('BACKGROUND') || Suica.BACKGROUND;
		}
		this.scene.background = Suica.parseColor( color );


		// set camera
		this.vrCamera = new THREE.Group();
		this.perspective();


		for( var attribute of this.suicaTag.getAttributeNames() )
		{
			var value = this.suicaTag.getAttribute( attribute );
			
			switch( attribute.toUpperCase() )
			{
				case 'PERSPECTIVE':
						this.perspective( ... Suica.evaluate( '['+value+']' ) );
						break;
				case 'ORTHOGRAPHIC':
						this.orthographic( ... Suica.evaluate( '['+value+']' ) );
						break;
				case 'ANAGLYPH':
						this.anaglyph( ... Suica.evaluate( '['+value+']' ) );
						break;
				case 'STEREO':
						this.stereo( ... Suica.evaluate( '['+value+']' ) );
						break;
				case 'VR':
						this.vr( );
						break;
				case 'FULLSCREEN':
						this.fullScreen( );
						break;
				case 'FULLWINDOW':
						this.fullWindow( );
						break;
				case 'PROACTIVE':
						this.proactive( );
						break;
			}
		}
		

		// default light
		this.light = new THREE.PointLight( 'white', 0.5 );
			this.light.position.set( 1000, 1500, 3000 );
		this.scene.add( this.light );
			
		// ambient light
		this.scene.add( new THREE.AmbientLight( 'white', 0.5 ) );
			
		// main animation loop
		var that = this;
		this.lastTime = 0;
		
		
		function adjustOrbitControls( )
		{
			that.camera.up.copy( that.orientation.UP );
			that.controls.update( );
			that.light.position.copy( that.camera.position );
			that.light.position.multiply( that.orientation.SCALE );
		}
		
		function adjustDemoViewPoint( time )
		{
			time *= that.demoViewPoint.speed;
			
			var cos = -that.demoViewPoint.distance*Math.cos(time),
				up = that.demoViewPoint.altitude,
				sin = -that.demoViewPoint.distance*Math.sin(time);
		
			// rotation is cos->sin, while up is upward
			that.camera.up.copy( that.orientation.UP );
			switch( that.orientation )
			{
				case Suica.ORIENTATIONS.YXZ:
						that.camera.position.set( up, cos, sin );
						that.light.position.set( 2*up, -2*cos, 2*sin );
						break;
				case Suica.ORIENTATIONS.ZYX:
						that.camera.position.set( sin, up, cos );
						that.light.position.set( 2*sin, 2*up, -2*cos );
						break;
				case Suica.ORIENTATIONS.XZY:
						that.camera.position.set( cos, sin, up );
						that.light.position.set( -2*cos, 2*sin, 2*up );
						break;

				case Suica.ORIENTATIONS.ZXY:
						that.camera.position.set( up, sin, -cos );
						that.light.position.set( 2*up, 2*sin, -2*cos );
						break;
				case Suica.ORIENTATIONS.XYZ:
						that.camera.position.set( -cos, up, sin );
						that.light.position.set( -2*cos, 2*up, 2*sin );
						break;
				case Suica.ORIENTATIONS.YZX:
						that.camera.position.set( sin, -cos, up );
						that.light.position.set( 2*sin, -2*cos, 2*up );
						break;
				default: console.error( 'error: Unknown orientation in <suica>' );
			};
			that.camera.lookAt( that.scene.position );
			
			//the following line is required for smooth animation on old laptops
			that.camera.updateMatrixWorld();
			
			//that.debugObject.position.set( that.light.position.x/4, that.light.position.y/4, that.light.position.z/4 );
			//that.light.position.set( that.light.position.x/10, that.light.position.y/10, that.light.position.z/10 );
			//console.log(that.light.position);
		}
		

		function adjustViewPoint( )
		{
			
			var up = [ ...that.viewPoint.up ],
				from = [ ...that.viewPoint.from ],
				to = [ ...that.viewPoint.to ];
			
			switch( that.orientation )
			{
				case Suica.ORIENTATIONS.XZY:
						up[0] = -up[0];
						from[0] = -from[0];
						to[0] = -to[0];
						break;
				case Suica.ORIENTATIONS.YXZ:
						up[1] = -up[1];
						from[1] = -from[1];
						to[1] = -to[1];
						break;
				case Suica.ORIENTATIONS.ZYX:
						up[2] = -up[2];
						from[2] = -from[2];
						to[2] = -to[2];
						break;
			}
			
			if( that.renderer.xr.isPresenting )
			{
				that.camera.up.set( 0, 1, 0 );
				that.camera.position.set( 0, 0, 0 );
				that.camera.lookAt( 1, 0, 0 );

				that.vrCamera.up.set( ...up );
				that.vrCamera.position.set( ...to );
				that.vrCamera.lookAt( ...from );
				that.vrCamera.position.set( ...from );
			}
			else
			{
				that.vrCamera.up.set( 0, 1, 0 );
				that.vrCamera.lookAt( 0, 0, 1 );
				that.vrCamera.position.set( 0, 0, 0 );
				
				that.camera.up.set( ...up );
				that.camera.position.set( ...from );
				that.camera.lookAt( ...to );
			}
			
			that.light?.position.set( ...that.viewPoint.from );
	
		} // Suica.adjustViewPoint
		

		function loop( time )
		{
			time /= 1000; // convert miliseconds to seconds

			if( TEST_MODE )
			{
				time = Math.floor( 5*time ) / 5;
			}
			
			//time=Math.PI/2;
			
			if( that.controls && that.controls.enabled )
			{
				adjustOrbitControls( );
			}
			else
			if( that.demoViewPoint )
			{
				adjustDemoViewPoint( time );
			}
			else
			{
				adjustViewPoint( );
			}
			
			
			if( that.ontime )
			{
				if (typeof that.ontime === 'string' || that.ontime instanceof String)
					that.ontime = window[that.ontime];
				
				that.ontime( time, time-that.lastTime );
			}
			
			if( that.isProactive /*&& (that.demoViewPoint || that.onTimeHandler)*/ )
				Suica.onPointerMoveUpdate( );
			
			that.render( );

			if( that.capturer ) that.capturer.capture( );
			
			that.lastTime = time;
			
		} // Suica.createRenderer.loop

		this.renderer.setAnimationLoop( loop );

	} // Suica.createRenderer


	
	vr( )
	{
		this.parser?.parseTags();
		this.debugCall( 'vr' );

		var button = this.suicaTag.appendChild( VRButton.createButton( this.renderer ) );
		button.style.background = 'rgba(0, 0, 0, 0.5)';

		this.renderer.xr.enabled = true;
		
		this.camera.position.set( 0, 0, 0 );
//		this.camera.lookAt(	0, 0, 0 );

	}
	
	
	fullScreen( )
	{
		this.parser?.parseTags();
		this.debugCall( 'fullScreen' );

		this.suicaTag.appendChild( createFSButton( this ) );
	}
	
	
	fullWindow( )
	{
		this.parser?.parseTags();
		this.debugCall( 'fullWindow' );

		this.suicaTag.style.position = 'fixed';
		this.suicaTag.style.width = '100%';
		this.suicaTag.style.height = '100%';
		this.suicaTag.style.left = '0';
		this.suicaTag.style.top = '0';
		
		this.resizeCanvas();
		
		var that = this;
		window.addEventListener( 'resize', function()
		{
			that.resizeCanvas();
		});
	}
	
	
	proactive( )
	{
		this.parser?.parseTags();
		this.debugCall( 'proactive' );

		this.isProactive = true;
	}
	
	
	anaglyph( distance = Suica.ANAGLYPH.DISTANCE )
	{
		this.parser?.parseTags();
		this.debugCall( 'anaglyph', distance );
		
		this.uberRenderer?.dispose();
		this.uberRenderer = new AnaglyphEffect( this, distance );
		//effect.setSize( window.innerWidth, window.innerHeight );
	}
	
	
	stereo( distance = Suica.STEREO.DISTANCE )
	{
		this.parser?.parseTags();
		this.debugCall( 'stereo', distance );
		
		this.uberRenderer?.dispose();
		this.uberRenderer = new StereoEffect( this, distance );
		//effect.setSize( window.innerWidth, window.innerHeight );
	}
	
	
	perspective( near=Suica.PERSPECTIVE.NEAR, far=Suica.PERSPECTIVE.FAR, fov=Suica.PERSPECTIVE.FOV )
	{
		this.parser?.parseTags();
		this.debugCall( 'perspective', near, far, fov );
		
		this.vrCamera.remove( this.camera );
		this.camera = new THREE.PerspectiveCamera( fov, this.canvasAspect, near, far );
		this.vrCamera.add( this.camera );
		this.lookAt();
		this.camera.updateProjectionMatrix();
		
	} // Suica.perspective
	
	
	orthographic( near=Suica.ORTHOGRAPHIC.NEAR, far=Suica.ORTHOGRAPHIC.FAR )
	{
		this.parser?.parseTags();
		this.debugCall( 'orthographic', near, far );

		var w = this.canvas.width/2,
			h = this.canvas.height/2;
			
		this.vrCamera.remove( this.camera );
		this.camera = new THREE.OrthographicCamera( -w, w, h, -h, near, far );
		this.vrCamera.add( this.camera );
		this.lookAt();
		this.camera.updateProjectionMatrix();
		
	} // Suica.orthographic


	
	lookAt( from, to, up )
	{
		this.parser?.parseTags();

		this.viewPoint.from = Suica.parseCenter( from, this.orientation.LOOKAT.FROM );
		this.viewPoint.to = Suica.parseCenter( to, this.orientation.LOOKAT.TO );
		this.viewPoint.up = Suica.parseCenter( up, this.orientation.LOOKAT.UP );
		
	} // Suica.lookAt
	
	
	background( color )
	{
		this.parser?.parseTags();
		this.debugCall( 'background', ...arguments );

		this.scene.background = Suica.parseColor( color );
	} // Suica.background
	
	
	oxyz( size, color )
	{
		this.parser?.parseTags();
		this.debugCall( 'oxyz', ...arguments );
		
		size = Suica.parseNumber( size, Suica.OXYZ.SIZE );
		color = Suica.parseColor( color, Suica.OXYZ.COLOR );
		
		var axes = new THREE.AxesHelper( size )
			axes.setColors( color, color, color );
		this.scene.add( axes );
	} // Suica.oxyz
	
	
	demo( distance, altitude, speed )
	{
		this.parser?.parseTags();
		this.debugCall( 'demo', ...arguments );
		
		this.demoViewPoint = {
			distance : Suica.parseNumber( distance, Suica.DEMO.DISTANCE ),
			altitude : Suica.parseNumber( altitude, Suica.DEMO.ALTITUDE ),
			speed    : Suica.parseNumber( speed, Suica.DEMO.SPEED ),
		};
	} // Suica.demo

	
	
	orbit( distance, altitude, speed )
	{
		this.parser?.parseTags();
		this.debugCall( 'orbit', ...arguments );
		
		this.camera.up.copy( this.orientation.UP );
		//this.camera.position.set( ...this.orientation.LOOKAT.FROM );
		
		var d = Suica.parseNumber( distance, Suica.ORBIT.DISTANCE ),
			a = Suica.parseNumber( altitude, Suica.ORBIT.ALTITUDE );
			
		switch( this.orientation )
		{
			case Suica.ORIENTATIONS.YXZ:
					this.camera.position.set( a, 0, d );
					break;
			case Suica.ORIENTATIONS.ZYX:
					this.camera.position.set( d, a, 0 );
					break;
			case Suica.ORIENTATIONS.XZY:
					this.camera.position.set( 0, d, a );
					break;

			case Suica.ORIENTATIONS.ZXY:
					this.camera.position.set( a, d, 0 );
					break;
			case Suica.ORIENTATIONS.XYZ:
					this.camera.position.set( 0, a, d );
					break;
			case Suica.ORIENTATIONS.YZX:
					this.camera.position.set( d, 0, a );
					break;
			default: throw 'error: unknown orientation';
		}
		
		this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );

		this.controls.autoRotateSpeed =	-4*Suica.parseNumber( speed, Suica.ORBIT.SPEED );
		this.controls.autoRotate = this.controls.autoRotateSpeed!=0;
		
		this.controls.enablePan = false;
		
//		this.controls.update( );

		return this.controls;
	} // Suica.orbit

	
	
	static precheck()
	{
		if( !(/*Suica.current*/window.suica instanceof Suica) )
			throw 'error: No Suica instance is active';
	} // Suica.precheck
	
	
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
	} // Suica.debugCall
	
	
	static evaluate( string )
	{
		return Function('"use strict";return (' + string + ')')();
	}
	
	static parseColor( data, defaultValue )
	{
		// empty
		if( data===null || data==='' || data===undefined  )
			return defaultValue;
		
		// Three.js color
		if( data instanceof THREE.Color )
			return data;

		// [r,g,b]
		if( Array.isArray(data) )
			return new THREE.Color( data[0], data[1]||0, data[2]||0 );

		// string
		if( typeof data === 'string' || data instanceof String )
		{
			// try constant or function
			// 0xFFFFFF, rgb(...), hsl(...)
			// note: '%' is removed, '%' is often used in hsl()
			if( data.indexOf('0x')>=0 || data.indexOf('0X')>=0  || data.indexOf('(')>=0 )
				return Suica.parseColor( Suica.evaluate( data.toLowerCase().replaceAll('%','') ) );
			
			// r,g,b
			if( data.indexOf(',') > 0 )
				return new THREE.Color( ...Suica.evaluate( '['+data+']' ) );
		}

		return new THREE.Color( data || 'white' );
	} // Suica.parseColor
	
	
	static parseCenter( data, defaultValue = [0,0,0] )
	{
		// empty
		if( data===null || data==='' || data===undefined )
			return defaultValue;
		
		// object with center
		if( data.center )
			return data.center;

		// array
		if( data instanceof Array )
			return data;

		// Three.js vector
		if( data instanceof THREE.Vector3 )
			return [data.x, data.y, data.z];

		// string 'x,y,z' or global object name
		if( typeof data === 'string' || data instanceof String )
		{
			// global object name
			var global = window[data];
			if( global && global.center )
				return global.center;
				
			// 'x,y,z'
			var center = Suica.evaluate( '['+data+']' );
			if( center.length<3 ) center.push(0,0,0);
			return center;
		}

		return data;
	} // Suica.parseCenter
	
	
	static parseNumber( data, defaultValue )
	{
		// empty
		if( data===null || data==='' || data===undefined  )
			return defaultValue;

		return Suica.evaluate( data );
	} // Suica.parseNumber
	
	
	static parseSize( data, defaultValue )
	{
		// empty
		if( data===null || data==='' || data===undefined  )
			return defaultValue;

		// string 'x,y,z'
		if( typeof data === 'string' || data instanceof String )
		{
			// 'x,y,z'
			var size = Suica.evaluate( '['+data+']' );
			if( size.length == 1 )
				return size[0]
			else
				return size;
		}

		return data;
	} // Suica.parseSize
	
	
/*	
	point( ...args )
	{
		this.parser?.parseTags();
		return new Point( this, ...args );
	} // Suica.point
	
	
	line( ...args )
	{
		this.parser?.parseTags();
		return new Line( this, ...args );
	} // Suica.line
	
	
	square( ...args )
	{
		this.parser?.parseTags();
		return new Square( this, ...args );
	} // Suica.square
	

	cube( ...args )
	{
		this.parser?.parseTags();
		return new Cube( this, ...args );
	} // Suica.cube
	
	
	circle( ...args )
	{
		this.parser?.parseTags();
		return new Polygon( this, Suica.CIRCLECOUNT, ...args );
	} // Suica.circle
	
	
	polygon( ...args )
	{
		this.parser?.parseTags();
		return new Polygon( this, ...args );
	} // Suica.polygon
	
	
	sphere( ...args )
	{
		this.parser?.parseTags();
		return new Sphere( this, ...args );
	} // Suica.sphere


	cylinder( ...args )
	{
		this.parser?.parseTags();
		return new Prism( this, Suica.CIRCLECOUNT, ...args, false );
	} // Suica.cylinder


	prism( ...args )
	{
		this.parser?.parseTags();
		return new Prism( this, ...args, true );
	} // Suica.prims


	cone( ...args )
	{
		this.parser?.parseTags();
		return new Pyramid( this, Suica.CIRCLECOUNT, ...args, false );
	} // Suica.cone
	

	pyramid( ...args )
	{
		this.parser?.parseTags();
		return new Pyramid( this, ...args, true );
	} // Suica.pyramid

	
	group( ...args )
	{
		this.parser?.parseTags();
		return new Group( this, ...args );
	} // Suica.group


	tube( ...args )
	{
		this.parser?.parseTags();
		return new Tube( this, ...args );
	} // Suica.tube
*/	
	
	findPosition( domEvent )
	{
		var canvas = domEvent.target;
		
		console.assert( canvas == this.canvas );

		// get pixel position withing the Suica canvas
		var rect = canvas.getBoundingClientRect(),
			pixelX = Math.floor( domEvent.clientX - rect.left ),
			pixelY = Math.floor( domEvent.clientY - rect.top );

		// get relative pixel position (ie. [-1,+1])
		this.raycastPointer.x =  2*pixelX/canvas.clientWidth - 1;
		this.raycastPointer.y = -2*pixelY/canvas.clientHeight + 1;
	
		return [pixelX-canvas.clientWidth/2, -pixelY+canvas.clientHeight/2];
	}
	

	allObjects( )
	{
		var foundObjects = [];
			
		for( var threejsObject of this.scene.children )
		{
			if( threejsObject.suicaObject )
				foundObjects.push( threejsObject.suicaObject );
		}
		
		return foundObjects;
	}
	

	findObjects( domEvent, onlyInteractive = false )
	{
		var scanObjects = [];

		if( onlyInteractive )
		{
			for( let object of this.scene.children )
			{
				let suicaObject = object.suicaObject;
				if( !suicaObject ) continue;
				
				if( suicaObject.onpointermove ||
					suicaObject.onpointerdown ||
					suicaObject.onpointerup ||
					suicaObject.onpointerenter ||
					suicaObject.onpointerleave ||
					suicaObject.onclick )
					scanObjects.push( object );
			}
		}
		else
		{
			scanObjects = this.scene.children;
		}

		// sets this.raycastPointer
		findPosition( domEvent );

		// cast a ray and find intersection with all objects
		this.raycaster.setFromCamera( this.raycastPointer, this.camera );
		var intersects = this.raycaster.intersectObjects( scanObjects, true );

		// construct a list of all intersected objects
		var foundObjects = [];

		for( var intersection of intersects )
		{
			let suicaObject = null;
			
			// get the topmost Suica object
			for( let object=intersection.object; object; object=object.parent )
			{
				suicaObject = object.suicaObject || suicaObject;
			}
			
			// if the object has Suica object that is not found,
			// add it to the list of found objects
			if( foundObjects.indexOf( suicaObject ) < 0 )
				foundObjects.push( suicaObject );
		}
		
		return foundObjects;
	}
	

	findObject( domEvent, onlyInteractive = false )
	{
		var objects = this.findObjects( domEvent, onlyInteractive );
	
		if( objects.length )
			return objects[0];
		
		return null;
	}
	
	
	addEventListener( type, listener, aux )
	{
		if( aux ) console.warn( 'Suica canvas does not support third parameter of addEventListener');
		
		if( !type.startsWith('on') )
			type = 'on'+type;
		
		this[type.toLowerCase()] = listener;
	}
	
	removeEventListener( type, listener, aux )
	{
		if( listener ) console.warn( 'Suica canvas does not support second parameter of removeEventListener');
		if( aux ) console.warn( 'Suica canvas does not support third parameter of removeEventListener');

		if( !type.startsWith('on') )
			type = 'on'+type;
		
		this[type.toLowerCase()] = null;
	}

	static addEventListener( type, listener, aux )
	{
		/*Suica.current*/window.suica.addEventListener( type, listener, aux );
	}
	
	static removeEventListener( type, listener, aux )
	{
		/*Suica.current*/window.suica.removeEventListener( type, listener, aux );
	}

	
	static eventCall( object, eventName, eventParam )
	{
		// no object
		if( !object ) return;
		
		// no event listener
		if( !object[eventName] ) return;
		
		// if event listener is a string, it is the name of the listener
		if( typeof object[eventName] === 'string' || object[eventName] instanceof String )
		{
			object[eventName] = window[object[eventName]];
		}
		
		// call the listener
		object[eventName]( eventParam );

		if( DEBUG_EVENTS ) console.log( object.id+' :: '+eventName );
	}

	
	static onPointerMove( event )
	{
		Suica.globalHoverEvent = event;
		
		var object = findObject( event, true );

		if( Suica.hoverObject )
		{
			if( object == Suica.hoverObject )
			{
				Suica.eventCall( object, 'onpointermove', event );
			}
			else
			{
				Suica.eventCall( Suica.hoverObject, 'onpointerleave', event );		
				Suica.hoverObject = object;
				Suica.eventCall( Suica.hoverObject, 'onpointerenter', event );
			}
		}
		else
		{
			Suica.hoverObject = object;
			Suica.eventCall( Suica.hoverObject, 'onpointerenter', event );
		}
	} // Suica.onPointerMove
	
	
	static onPointerMoveUpdate( )
	{
		// this method updates mouseenter/leave cause by change in viewpoint
		
		if( !Suica.globalHoverEvent ) return;
		
		var event = Suica.globalHoverEvent;
		
		var object = findObject( event, true );
		if( Suica.hoverObject )
		{
			if( object != Suica.hoverObject )
			{
				Suica.eventCall( Suica.hoverObject, 'onpointerleave', event );		
				Suica.hoverObject = object;
				Suica.eventCall( Suica.hoverObject, 'onpointerenter', event );
			}
		}
		else
		{
			Suica.hoverObject = object;
			Suica.eventCall( Suica.hoverObject, 'onpointerenter', event );
		}
	} // Suica.onPointerMoveUpdate
	
	
	static onPointerDown( event )
	{
		var object = findObject( event, true );
		if( object )
		{
			Suica.eventCall( object, 'onpointerdown', event );
		}
		event.preventDefault() ;
	} // Suica.onPointerDown
	
	
	static onPointerUp( event )
	{
		var object = findObject( event, true );
		if( object )
		{
			Suica.eventCall( object, 'onpointerup', event );
		}
	} // Suica.onPointerUp
	
	
	static onClick( event )
	{
		var object = findObject( event, true );

		if( object )
		{
			Suica.eventCall( object, 'onclick', event );
		}
		
		Suica.eventCall( /*Suica.current*/window.suica, 'onclick', event );
		
	} // Suica.onClick
	
	
	static onLoad( object )
	{
		Suica.eventCall( object, 'onload', object );
		
	} // Suica.onLoad
	
	
	static cloneEvents( target, source )
	{
		target.onpointerenter = source.onpointerenter;
		target.onpointermove = source.onpointermove;
		target.onpointerleave = source.onpointerleave;
		target.onpointerdown = source.onpointerdown;
		target.onclick = source.onclick;
		target.onpointerup = source.onpointerup;
		target.onload = source.onload;
	}
	
	// static onDblClick( event )
	// {
		// var object = findObject( event );
		// if( object )
		// {
			// Suica.eventCall( object, 'ondblclick', event );
		// }
	// } // Suica.onDblClick
	
	
	static onContextMenu( event )
	{
		event.preventDefault();
	} // Suica.onContextMenu
	
	
} // class Suica



// propagate Suica into the parent window (if Suica is run inside <iframe>)
//if( parent?.Suica )
//{
//	parent.Suica = Suica;
//}


window.style = function( object, properties )
{
	for( var n in properties ) object[n] = properties[n];
	return object;
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
	return new THREE.Color( ).setHSL( (1+(h/360)%1)%1, s/100, l/100 );
}


window.random = function( a=0, b=1 )
{
	if( Array.isArray(a) )
	{
		var index = Math.floor( a.length*THREE.MathUtils.seededRandom() );
		return a[ index ];
	}
	
	return a+(b-a)*THREE.MathUtils.seededRandom();
}


window.randomIn = function( object )
{
	return object.randomIn;
}

window.randomOn = function( object )
{
	return object.randomOn;
}


window.radians = function( degrees )
{
	return degrees * Math.PI/180;
}


window.degrees = function( radians )
{
	return radians * 180/Math.PI;
}

window.clone = function( object )
{
	if( object.clone )
		return object.clone();
	else
		throw 'error: cannot clone object';
}

window.findPosition = function( domEvent )
{
	Suica.precheck();
	
	var suica = domEvent.target.suicaObject;
	if( suica )
		return suica.findPosition( domEvent );
}


window.findObjects = function( domEvent, onlyInteractive = false )
{
	Suica.precheck();
	
	var suica = domEvent.target.suicaObject;
	if( suica )
		return suica.findObjects( domEvent, onlyInteractive );
}


window.findObject = function( domEvent, onlyInteractive = false )
{
	Suica.precheck();
	
	var suica = domEvent.target.suicaObject;
	if( suica )
		return suica.findObject( domEvent, onlyInteractive );
}


window.spline = function( points=Suica.SPLINE.POINTS, closed, interpolant )
{
	if( points instanceof Function )
	{
		return function( t )
		{
			return points( t, closed, interpolant );
		}
	}

	// if points is a string - array of points "x,y,z;x,y,z;..."
	if( typeof points === 'string' )
	{
		if( points.indexOf(',') >= 0 )
			points = Suica.evaluate( '[['+points.replaceAll(';','],[')+']]' );
		else
			return function( t )
			{
				return window[points]( t, closed, interpolant );
			}
	}
	
	if( typeof closed === 'undefined' )
		closed = Suica.SPLINE.CLOSED;
	
	if( typeof interpolant === 'undefined' )
		interpolant = Suica.SPLINE.INTERPOLANT;
	
	if( !points.length ) points = Suica.SPLINE.POINTS;

	return function( t )
	{
		// set t in [0,1]
		if( t<0 || t>1 )
		{
			t = ((t%1)+1)%1;
		}
		
		var p = (points.length-(closed?0:1)) * t;
		var intPoint = Math.floor( p ),
			t = p - intPoint,
			t2 = t*t,
			t3 = t2*t;

		var p0, p1, p2, p3;
		
		if( closed )
		{
			p0 = points[ (intPoint+points.length-1)%points.length ];
			p1 = points[ (intPoint+points.length  )%points.length ];
			p2 = points[ (intPoint+points.length+1)%points.length ];
			p3 = points[ (intPoint+points.length+2)%points.length ];
		}
		else
		{
			p0 = points[ intPoint === 0 ? intPoint : intPoint-1 ];
			p1 = points[ intPoint ];
			p2 = points[ intPoint > points.length-2 ? points.length-1 : intPoint+1 ];
			p3 = points[ intPoint > points.length-3 ? points.length-1 : intPoint+2 ];
		}
		
		function catmullRom( p0, p1, p2, p3 )
		{
			// var v0 = (p2-p0) * 0.5,
			//     v1 = (p3-p1) * 0.5;
			// return (2*p1-2*p2+v0+v1)*t3 + (-3*p1+3*p2-2*v0-v1)*t2 + v0*t + p1;
			var B0 = (-t3+2*t2-t)/2,
				B1 = (3*t3-5*t2+2)/2,
				B2 = (-3*t3+4*t2+t)/2,
				B3 = (t3-t2)/2;
				
			return p0*B0 + p1*B1 + p2*B2 + p3*B3;
		}

		function bSpline( p0, p1, p2, p3 )
		{
			var B0 = (1-3*t+3*t2-t3)/6,
				B1 = (4-6*t2+3*t3)/6,
				B2 = (1+3*t+3*t2-3*t3)/6,
				B3 = (t3)/6;
				
			return p0*B0 + p1*B1 + p2*B2 + p3*B3;
		}

		var splineFunction = interpolant ? catmullRom : bSpline;
		
		var point = [
			splineFunction( p0[0], p1[0], p2[0], p3[0] ),
			splineFunction( p0[1], p1[1], p2[1], p3[1] ),
			splineFunction( p0[2], p1[2], p2[2], p3[2] )	
		];

		if( typeof p0[3] !== 'undefined' )
			point.push( splineFunction( p0[3], p1[3], p2[3], p3[3] ) );
		
		return point;
	} // spline.getPoint
	
} // spline


window.splane = function( points=Suica.SPLANE.POINTS, closed, interpolant )
{
	if( points==null ) points = Suica.SPLANE.POINTS;
	
	if( points instanceof Function )
	{
		return function( u, v )
		{
			return points( u, v, closed, interpolant );
		}
	}

	// if points is a string - matrix of points "x,y,z;..| x,y,z;..."
	if( typeof points === 'string' )
	{
		if( points.indexOf(',') >= 0 )
			points = Suica.evaluate( '[[['+points.replaceAll(';','],[').replaceAll('|',']],[[')+']]]' );
		else
		{
			return function( u, v )
			{
			console.log(points);
			console.log(window[points]);
				return window[points]( u, v, closed, interpolant );
			}
		}
	}
	
	if( typeof closed === 'undefined' )
		closed = Suica.SPLANE.CLOSED;
	else
	if( !Array.isArray(closed) )
		closed = [closed, false];

	var uClosed = !!closed[0], // closed in U direction
		vClosed = !!closed[1]; // closed in V direction

	if( typeof interpolant === 'undefined' )
		interpolant = Suica.SPLANE.INTERPOLANT;
	else
	if( !Array.isArray(interpolant) )
		interpolant = [interpolant, false];

	var uInterpolant = !!interpolant[0], // interpolant in U direction
		vInterpolant = !!interpolant[1]; // interpolant in V direction
	
	if( !points.length ) points = Suica.SPLANE.POINTS;

	const NU = points[0].length;
	const NV = points.length;

	return function( u, v )
	{
		var B = [
			t => (1-3*t+3*t*t-t*t*t)/6,	
			t => (4-6*t*t+3*t*t*t)/6,
			t => (1+3*t+3*t*t-3*t*t*t)/6,
			t => (t*t*t)/6,
		];

		if( uClosed || uInterpolant )
			u = (NU+1)*u-2;	// a-la-bezier & closed
		else
			u = (NU-3)*u; // transitional
		
		if( vClosed || vInterpolant)
			v = (NV+1)*v-2;	// a-la-bezier & closed
		else
			v = (NV-3)*v;		// transitional

		var uPoint = Math.floor( u ),
			vPoint = Math.floor( v );
			
		u = u-uPoint;
		v = v-vPoint;
		
		var point = [0,0,0];
			
		for( var iv=0; iv<4; iv++ )
		for( var iu=0; iu<4; iu++ )
		{
			var uIdx, vIdx;
			
			if( uClosed )
				uIdx = (uPoint+iu+NU)%NU;
			else
				uIdx = THREE.MathUtils.clamp( uPoint+iu, 0, NU-1 );
				
			if( vClosed )
				vIdx = (vPoint+iv+NV)%NV;
			else
				vIdx = THREE.MathUtils.clamp( vPoint+iv, 0, NV-1 );
			
			var weight = B[iu](u) * B[iv](v);
			
			point[0] += weight * points[vIdx][uIdx][0];
			point[1] += weight * points[vIdx][uIdx][1];
			point[2] += weight * points[vIdx][uIdx][2];
		}

		return point;
	} // splane.getPoint
	
} // spline



// monitor creation of tags, we are interested in creation of
// <script> because it might contain Suica tags; thus for each
// <script> try to parase all unparsed Suicas
//
// idea from https://github.com/jspenguin2017/Snippets/blob/master/onbeforescriptexecute.html
new MutationObserver( function( mutations )
	{		
		for( var parentElem of mutations )
		{
			for( var childElem of parentElem.addedNodes) 
			{
				if( childElem?.tagName=='SCRIPT' )
				{
//					console.log('MutationObserver <script>');
					for( var suica of Suica.allSuicas )
						suica.parser?.parseTags();
				}
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
//		console.log('onLoad');
		for( var suica of Suica.allSuicas )
			suica.parser?.parseTags();
	}
);
