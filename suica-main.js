﻿//
// Suica 2.0
// CC-3.0-SA-NC
//
//===================================================


// show suica version
console.log( `Suica 2.-1.46 (220421)` );


// control flags
const DEBUG_CALLS = !false;
const DEBUG_EVENTS = false;

// last Suica instance
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
	static current;
	
	// array of all Suicas
	static allSuicas = [];

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
					FLIP_NORMAL: false,
			},
			XYZ: {	SCALE: new THREE.Vector3(1,1,1),
					LOOKAT: {FROM: [0,0,100], TO: [0,0,0], UP: [0,1,0]},
					RIGHT: Suica.OX,
					UP: Suica.OY,
					FORWARD: Suica.OZ,
					FLIP_NORMAL: false,
			},
			YZX: {	SCALE: new THREE.Vector3(1,1,1),
					LOOKAT: {FROM: [100,0,0], TO: [0,0,0], UP: [0,0,1]},
					RIGHT: Suica.OY,
					UP: Suica.OZ,
					FORWARD: Suica.OX,
					FLIP_NORMAL: false,
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
	static DEFAULT = {
		VR: {  },
		ANAGLYPH: { DISTANCE: 5 },
		STEREO: { DISTANCE: 1 },
		PERSPECTIVE: { NEAR: 1, FAR: 1000, FOV: 40 },
		ORTHOGRAPHIC: { NEAR: 0, FAR: 1000 },
		BACKGROUND: { COLOR: 'whitesmoke' },
		ORIENTATION: 'XYZ',
		SIZE: '30',
		OXYZ: { COLOR: 'black', SIZE: 30 },
		DEMO: { DISTANCE: 100, ALTITUDE: 30 },

		POINT: { CENTER:[0,0,0], COLOR:'black', SIZE:7, SPIN:[0,0,0] },
		LINE: { CENTER:[0,0,0], COLOR:'black', TO:[0,30,0], SPIN:[0,0,0] },
		CUBE: { CENTER:[0,0,0], COLOR:'lightsalmon', FRAMECOLOR:'black', SIZE:30, SPIN:[0,0,0] },
		SQUARE: { CENTER:[0,0,0], COLOR:'lightsalmon', FRAMECOLOR:'black', SIZE:30, SPIN:[0,0,0] },
		CIRCLE: { CENTER:[0,0,0], COLOR:'lightsalmon', FRAMECOLOR:'black', SIZE:30, COUNT:50, SPIN:[0,0,0] },
		POLYGON: { CENTER:[0,0,0], COLOR:'lightsalmon', FRAMECOLOR:'black', SIZE:30, COUNT:3, SPIN:[0,0,0] },
		SPHERE: { CENTER:[0,0,0], COLOR:'lightsalmon', SIZE:30, COUNT: 50, SPIN:[0,0,0] },
		CYLINDER: { CENTER:[0,0,0], COLOR:'lightsalmon', SIZE:30, COUNT: 50, RATIO: 1, SPIN:[0,0,0] },
		CONE: { CENTER:[0,0,0], COLOR:'lightsalmon', SIZE:30, COUNT: 50, RATIO: 0, SPIN:[0,0,0] },
		PRISM: { CENTER:[0,0,0], COLOR:'lightsalmon', SIZE:30, COUNT: 6, RATIO: 1, SPIN:[0,0,0] },
		PYRAMID: { CENTER:[0,0,0], COLOR:'lightsalmon', SIZE:30, COUNT: 6, RATIO: 0, SPIN:[0,0,0] },
		
		GROUP: { CENTER:[0,0,0], COLOR:'lightsalmon', SIZE:[1,1,1], SPIN:[0,0,0] },
		TUBE: { POINTS: [], COUNT:[60,20], CENTER:[0,0,0], COLOR:'lightsalmon', SIZE:1, RADIUS:5, CLOSE:false },
		SPLINE: { POINTS:[[0,0,0],[0,1,0]], CLOSED:false, INTERPOLANT:true },
		
		DRAWING: { SIZE:32, COLOR:null },
		MOVETO: { CENTER:[0,0] },
		LINETO: { CENTER:[0,0] },
		CURVETO: { CENTER:[0,0], M:[0,0] },
		ARC: { CENTER:[0,0], RADIUS:10, FROM:0, TO:360, CW:true },
		STROKE: { COLOR:'black', WIDTH:1, CLOSE:false },
		FILL: { COLOR:'gray' },
		FILLTEXT: { CENTER:[0,0], TEXT:'Suica', COLOR:'black', FONT:'20px Arial' },
		CLEAR: { COLOR:null },
		
	} // Suica.DEFAULT
	
	
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
			suicaTag.style.width = '500px';
		if( !getComputedStyle(suicaTag).height && !suicaTag.hasAttribute('height') )
			suicaTag.style.height = '300px';
		
		if( !suicaTag.style.position ) suicaTag.style.position = 'relative';
		
		// get or invent id
		this.id = suicaTag.getAttribute('id') || `suica${Suica.allSuicas.length}`
		if( DEBUG_CALLS ) console.log(`Suica :: ${this.id}`);
		
		this.suicaTag = suicaTag;
		this.isProactive = false;

		// set Suica orientation data
		this.orientation = Suica.ORIENTATIONS[suicaTag.getAttribute('ORIENTATION')?.toUpperCase() || Suica.DEFAULT.ORIENTATION];
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

		// object selection and events
		this.raycaster = new THREE.Raycaster();
		this.raycastPointer = new THREE.Vector2();

		// register this suica instance
		window.suica = this;
		Suica.current = this; // as current Suica
		Suica.allSuicas.push( this ); // as one of all Suicas
		window[this.id] = this; // as global variable
		
//		this.debugObject = new THREE.Mesh( new THREE.SphereGeometry(5), new THREE.MeshPhongMaterial({color:'orange', shininess:200}));
//		this.scene.add( this.debugObject );
		
		// interactivity manager
		this.canvas.addEventListener( 'mousemove', Suica.onMouseMove );
		this.canvas.addEventListener( 'mousedown', Suica.onMouseDown );
		this.canvas.addEventListener( 'mouseup', Suica.onMouseUp );
		this.canvas.addEventListener( 'click', Suica.onClick );
		//this.canvas.addEventListener( 'dblclick', Suica.onDblClick );
		this.canvas.addEventListener( 'contextmenu', Suica.onContextMenu );

		// register some local methods as public global functions
		for( var methodName of ['cube', 'square', 'sphere', 'point', 'line', 'group', 'cylinder', 'prism', 'cone', 'pyramid', 'circle', 'polygon', /*'spline',*/ 'tube'] )
		{
			Suica.register( methodName );
		}
	} // Suica.constructor

	
	static register( methodName )
	{
		console.log(`register('${methodName}')`);
		window[methodName] = function ( ...params )
		{
			Suica.precheck();
			return Suica.current[methodName]( ...params );
		}
	}
	
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
							antialias: true
						} );

		// renderer with effects; if set, it is used instead of the normal renderer
		this.uberRenderer = null;
		
		// scene with background from <suica>'s CSS
		this.scene = new THREE.Scene();
		
		this.scene.scale.copy( this.orientation.SCALE );

		var color = getComputedStyle(this.suicaTag).backgroundColor;
		if( color == 'rgba(0, 0, 0, 0)' )
		{
			color = this.suicaTag.getAttribute('background') || Suica.DEFAULT.BACKGROUND.COLOR;
		}
		this.scene.background = Suica.parseColor( color );


		// set camera
		this.vrCamera = new THREE.Group();
		
		if( this.suicaTag.hasAttribute('PERSPECTIVE') )
		{
			// perspective camera
			let values = this.suicaTag.getAttribute('PERSPECTIVE').replaceAll(' ','');
				values = values ? values.split(',').map(Number) : [];
				
			this.perspective( ... values );
		}
		else
		if( this.suicaTag.hasAttribute('ORTHOGRAPHIC') )
		{
			// orthographic camera
			let values = this.suicaTag.getAttribute('ORTHOGRAPHIC').replaceAll(' ','');
				values = values ? values.split(',').map(Number) : [];
			this.orthographic( ...values );
		}
		else
		{
			// default perspective camera
			this.perspective();
		}


		if( this.suicaTag.hasAttribute('ANAGLYPH') )
		{
			// anaglyph camera
			let values = this.suicaTag.getAttribute('ANAGLYPH').replaceAll(' ','');
				values = values ? values.split(',').map(Number) : [];

			this.anaglyph( ... values );
		}
		else
		if( this.suicaTag.hasAttribute('STEREO') )
		{
			// stereo camera
			let values = this.suicaTag.getAttribute('STEREO').replaceAll(' ','');
				values = values ? values.split(',').map(Number) : [];

			this.stereo( ... values );
		}

		if( this.suicaTag.hasAttribute('VR') )
		{
			// vr camera
			let values = this.suicaTag.getAttribute('VR').replaceAll(' ','');
				values = values ? values.split(',').map(Number) : [];

			this.vr( ... values );
		}

		if( this.suicaTag.hasAttribute('FULLSCREEN') )
		{
			this.fullScreen( );
		}

		if( this.suicaTag.hasAttribute('FULLWINDOW') )
		{
			this.fullWindow( );
		}

		if( this.suicaTag.hasAttribute('PROACTIVE') )
		{
			this.proactive( );
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
		
		
		function adjustDemoViewPoint( time )
		{
			var x = that.demoViewPoint.distance*Math.cos(time),
				y = that.demoViewPoint.altitude,
				z = that.demoViewPoint.distance*Math.sin(time);
		
			that.camera.up.copy( that.orientation.UP );
			switch( that.orientation )
			{
				case Suica.ORIENTATIONS.XYZ:
						that.camera.position.set( x, y, -z );
						that.light.position.set( 2*x, 2*y, -2*z );
						break;
				case Suica.ORIENTATIONS.XZY:
						that.camera.position.set( -x, -z, y );
						that.light.position.set( /**/2*x, -2*z, 2*y );
						break;
				case Suica.ORIENTATIONS.YXZ:
						that.camera.position.set( y, -x, -z );
						that.light.position.set( 2*y, /**/2*x, -2*z );
						break;
				case Suica.ORIENTATIONS.YZX:
						that.camera.position.set( -z, x, y );
						that.light.position.set( -2*z, 2*x, 2*y );
						break;
				case Suica.ORIENTATIONS.ZXY:
						that.camera.position.set( y, -z, x );
						that.light.position.set( 2*y, -2*z, 2*x );
						break;
				case Suica.ORIENTATIONS.ZYX:
						that.camera.position.set( -z, y, -x );
						that.light.position.set( -2*z, 2*y, /**/2*x );
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

			//time=Math.PI/2;
			
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
				Suica.onMouseMoveUpdate( );
			
			that.render( );

			that.lastTime = time;
			
		} // Suica.createRenderer.loop
		
		this.renderer.setAnimationLoop( loop );

	} // Suica.createRenderer


	
	vr( )
	{
		this.parser?.parseTags();
		this.debugCall( 'vr' );

		this.suicaTag.appendChild( createVRButton( this.renderer ) );

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
	
	
	anaglyph( distance = Suica.DEFAULT.ANAGLYPH.DISTANCE )
	{
		this.parser?.parseTags();
		this.debugCall( 'anaglyph', distance );
		
		this.uberRenderer?.dispose();
		this.uberRenderer = new AnaglyphEffect( this, distance );
		//effect.setSize( window.innerWidth, window.innerHeight );
	}
	
	
	stereo( distance = Suica.DEFAULT.STEREO.DISTANCE )
	{
		this.parser?.parseTags();
		this.debugCall( 'stereo', distance );
		
		this.uberRenderer?.dispose();
		this.uberRenderer = new StereoEffect( this, distance );
		//effect.setSize( window.innerWidth, window.innerHeight );
	}
	
	
	perspective( near=Suica.DEFAULT.PERSPECTIVE.NEAR, far=Suica.DEFAULT.PERSPECTIVE.FAR, fov=Suica.DEFAULT.PERSPECTIVE.FOV )
	{
		this.parser?.parseTags();
		this.debugCall( 'perspective', near, far, fov );
		
		this.vrCamera.remove( this.camera );
		this.camera = new THREE.PerspectiveCamera( fov, this.canvasAspect, near, far );
		this.vrCamera.add( this.camera );
		this.lookAt();
		this.camera.updateProjectionMatrix();
		
	} // Suica.perspective
	
	
	orthographic( near=Suica.DEFAULT.ORTHOGRAPHIC.NEAR, far=Suica.DEFAULT.ORTHOGRAPHIC.FAR )
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
		// if( up ) this.debugCall( 'lookAt', from, to, up )
		// else if( to ) this.debugCall( 'lookAt', from, to )
		// else if( from ) this.debugCall( 'lookAt', from )

		if( typeof from === 'undefined' ) from = this.orientation.LOOKAT.FROM;
		if( typeof to === 'undefined' )   to   = this.orientation.LOOKAT.TO;
		if( typeof up === 'undefined' )   up   = this.orientation.LOOKAT.UP;

		this.viewPoint.from = Suica.parseCenter( from );
		this.viewPoint.to = Suica.parseCenter( to );
		this.viewPoint.up = Suica.parseCenter( up );
		
	} // Suica.lookAt
	
	
	background( color=Suica.DEFAULT.BACKGROUND.COLOR )
	{
		this.parser?.parseTags();
		this.debugCall( 'background', color );
		
		this.scene.background = new THREE.Color( color );
	} // Suica.background
	
	
	oxyz( size=Suica.DEFAULT.OXYZ.SIZE, color=Suica.DEFAULT.OXYZ.COLOR )
	{
		this.parser?.parseTags();
		this.debugCall( 'oxyz', size, color );
		
		var axes = new THREE.AxesHelper( size )
			axes.setColors( color, color, color );
		this.scene.add( axes );
	} // Suica.oxyz
	
	
	demo( distance=Suica.DEFAULT.DEMO.DISTANCE, altitude=Suica.DEFAULT.DEMO.ALTITUDE )
	{
		this.parser?.parseTags();
		this.debugCall( 'demo', distance, altitude );
		
		this.demoViewPoint = {distance:distance, altitude:altitude};
	} // Suica.demo

	
	
	static precheck()
	{
		if( !(Suica.current instanceof Suica) )
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
	
	
	static parseColor( color )
	{
		if( color === null )
			return color;

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
	} // Suica.parseCOlor
	
	
	static parseCenter( center )
	{
		// center is object with center
		if( center.center )
			return center.center;

		// center is Three.js vector
		if( center instanceof THREE.Vector3 )
			return [center.x, center.y, center.z];

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
	} // Suica.parseCenter
	
	
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
			else
				return Number(size);
		}

		return size;
	} // Suica.parseSize
	
	
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
	} // Suica.parseRadius
	
	
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
	} // Suica.parseColorTest
	
	
	
	point( center=Suica.DEFAULT.POINT.CENTER, size=Suica.DEFAULT.POINT.SIZE, color=Suica.DEFAULT.POINT.COLOR )
	{
		this.parser?.parseTags();

		return new Point( this, center, size, color );
	} // Suica.point
	
	
	line( center=Suica.DEFAULT.LINE.CENTER, to=Suica.DEFAULT.LINE.TO, color=Suica.DEFAULT.LINE.COLOR )
	{
		this.parser?.parseTags();

		return new Line( this, center, to, color );
	} // Suica.line
	
	
	square( center=Suica.DEFAULT.SQUARE.CENTER, size=Suica.DEFAULT.SQUARE.SIZE, color=Suica.DEFAULT.SQUARE.COLOR )
	{
		this.parser?.parseTags();

		return new Square( this, center, size, color );
	} // Suica.square
	


	cube( center=Suica.DEFAULT.CUBE.CENTER, size=Suica.DEFAULT.CUBE.SIZE, color=Suica.DEFAULT.CUBE.COLOR )
	{
		this.parser?.parseTags();

		return new Cube( this, center, size, color );
	} // Suica.cube
	
	
	circle( center=Suica.DEFAULT.CIRCLE.CENTER, size=Suica.DEFAULT.CIRCLE.SIZE, color=Suica.DEFAULT.CIRCLE.COLOR )
	{
		this.parser?.parseTags();

		return new Polygon( this, Suica.DEFAULT.CIRCLE.COUNT, center, size, color );
	} // Suica.circle
	
	
	polygon( count = Suica.DEFAULT.POLYGON.COUNT, center=Suica.DEFAULT.POLYGON.CENTER, size=Suica.DEFAULT.POLYGON.SIZE, color=Suica.DEFAULT.CIRCLE.COLOR )
	{
		this.parser?.parseTags();

		return new Polygon( this, count, center, size, color );
	} // Suica.polygon
	
	
	sphere( center=Suica.DEFAULT.SPHERE.CENTER, size=Suica.DEFAULT.SPHERE.SIZE, color=Suica.DEFAULT.SPHERE.COLOR )
	{
		this.parser?.parseTags();

		return new Sphere( this, center, size, color );
	} // Suica.sphere
	

	cylinder( center=Suica.DEFAULT.CYLINDER.CENTER, size=Suica.DEFAULT.CYLINDER.SIZE, color=Suica.DEFAULT.CYLINDER.COLOR )
	{
		this.parser?.parseTags();

		return new Prism( this, Suica.DEFAULT.CYLINDER.COUNT, center, size, color, false );
	} // Suica.cylinder
	

	prism( count=Suica.DEFAULT.PRISM.COUNT, center=Suica.DEFAULT.PRISM.CENTER, size=Suica.DEFAULT.PRISM.SIZE, color=Suica.DEFAULT.PRISM.COLOR )
	{
		this.parser?.parseTags();

		return new Prism( this, count, center, size, color, true );
	} // Suica.prims
	

	cone( center=Suica.DEFAULT.CONE.CENTER, size=Suica.DEFAULT.CONE.SIZE, color=Suica.DEFAULT.CONE.COLOR )
	{
		this.parser?.parseTags();

		return new Pyramid( this, Suica.DEFAULT.CONE.COUNT, center, size, color, false );
	} // Suica.cone
	

	pyramid( count=Suica.DEFAULT.PYRAMID.COUNT, center=Suica.DEFAULT.PYRAMID.CENTER, size=Suica.DEFAULT.PYRAMID.SIZE, color=Suica.DEFAULT.PYRAMID.COLOR )
	{
		this.parser?.parseTags();

		return new Pyramid( this, count, center, size, color, true );
	} // Suica.pyramid

	
	group( ...groupElements )
	{
		this.parser?.parseTags();

		return new Group( this, ...groupElements );
	} // Suica.group


	tube( center=Suica.DEFAULT.TUBE.CENTER, curve=Suica.DEFAULT.TUBE.POINTS, radius=Suica.DEFAULT.TUBE.RADIUS, count=Suica.DEFAULT.TUBE.COUNT, size=Suica.DEFAULT.TUBE.SIZE, color=Suica.DEFAULT.TUBE.COLOR )
	{
		this.parser?.parseTags();

		return new Tube( this, center, curve, radius, count, size, color );
	} // Suica.tube
	
	
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
				
				if( suicaObject.onmousemove ||
					suicaObject.onmousedown ||
					suicaObject.onmouseup ||
					suicaObject.onmouseenter ||
					suicaObject.onmouseleave ||
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
		Suica.current.addEventListener( type, listener, aux );
	}
	
	static removeEventListener( type, listener, aux )
	{
		Suica.current.removeEventListener( type, listener, aux );
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

	
	static onMouseMove( event )
	{
		Suica.globalHoverEvent = event;
		
		var object = findObject( event, true );

		if( Suica.hoverObject )
		{
			if( object == Suica.hoverObject )
			{
				Suica.eventCall( object, 'onmousemove', event );
			}
			else
			{
				Suica.eventCall( Suica.hoverObject, 'onmouseleave', event );		
				Suica.hoverObject = object;
				Suica.eventCall( Suica.hoverObject, 'onmouseenter', event );
			}
		}
		else
		{
			Suica.hoverObject = object;
			Suica.eventCall( Suica.hoverObject, 'onmouseenter', event );
		}
	} // Suica.onMouseMove
	
	
	static onMouseMoveUpdate( )
	{
		// this method updates mouseenter/leave cause by change in viewpoint
		
		if( !Suica.globalHoverEvent ) return;
		
		var event = Suica.globalHoverEvent;
		
		var object = findObject( event, true );
		if( Suica.hoverObject )
		{
			if( object != Suica.hoverObject )
			{
				Suica.eventCall( Suica.hoverObject, 'onmouseleave', event );		
				Suica.hoverObject = object;
				Suica.eventCall( Suica.hoverObject, 'onmouseenter', event );
			}
		}
		else
		{
			Suica.hoverObject = object;
			Suica.eventCall( Suica.hoverObject, 'onmouseenter', event );
		}
	} // Suica.onMouseMoveUpdate
	
	
	static onMouseDown( event )
	{
		var object = findObject( event, true );
		if( object )
		{
			Suica.eventCall( object, 'onmousedown', event );
		}
		event.preventDefault() ;
	} // Suica.onMouseDown
	
	
	static onMouseUp( event )
	{
		var object = findObject( event, true );
		if( object )
		{
			Suica.eventCall( object, 'onmouseup', event );
		}
	} // Suica.onMouseUp
	
	
	static onClick( event )
	{
		var object = findObject( event, true );

		if( object )
		{
			Suica.eventCall( object, 'onclick', event );
		}
		
		Suica.eventCall( Suica.current, 'onclick', event );
		
	} // Suica.onClick
	
	
	static cloneEvents( target, source )
	{
		target.onmouseenter = source.onmouseenter;
		target.onmousemove = source.onmousemove;
		target.onmouseleave = source.onmouseleave;
		target.onmousedown = source.onmousedown;
		target.onclick = source.onclick;
		target.onmouseup = source.onmouseup;
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


window.style = function( object, properties )
{
	for( var n in properties ) object[n] = properties[n];
	return object;
}


window.lookAt = function( from = Suica.DEFAULT.LOOKAT.CAMERA.FROM, to = Suica.DEFAULT.LOOKAT.CAMERA.TO, up = Suica.orientations)
{
	Suica.precheck();
	Suica.current.fullScreen( from, to, up );
}
	
window.fullScreen = function( )
{
	Suica.precheck();
	Suica.current.fullScreen(  );
}
	
window.fullWindow = function( )
{
	Suica.precheck();
	Suica.current.fullWindow(  );
}
	
window.proactive = function( )
{
	Suica.precheck();
	Suica.current.proactive(  );
}
	
window.anaglyph = function( distance = Suica.DEFAULT.ANAGLYPH.DISTANCE )
{
	Suica.precheck();
	Suica.current.anaglyph( distance );
}
	
window.stereo = function( distance = Suica.DEFAULT.STEREO.DISTANCE )
{
	Suica.precheck();
	Suica.current.stereo( distance );
}

window.perspective = function( near=Suica.DEFAULT.PERSPECTIVE.NEAR, far=Suica.DEFAULT.PERSPECTIVE.FAR, fov=Suica.DEFAULT.PERSPECTIVE.FOV )
{
	Suica.precheck();
	Suica.current.perspective( near, far, fov );
}
	
window.orthographic = function( near=Suica.DEFAULT.ORTHOGRAPHIC.NEAR, far=Suica.DEFAULT.ORTHOGRAPHIC.FAR )
{
	Suica.precheck();
	Suica.current.orthographic( near, far );
}
	
window.lookAt = function( from, to, up )
{
	Suica.precheck();
	Suica.current.lookAt( from, to, up );
}

window.background = function( color=Suica.DEFAULT.BACKGROUND.COLOR )
{
	Suica.precheck();
	Suica.current.background( color );
}

window.oxyz = function( size=Suica.DEFAULT.OXYZ.SIZE, color=Suica.DEFAULT.OXYZ.COLOR )
{
	Suica.precheck();
	Suica.current.oxyz( size, color );
}

window.demo = function( distance=Suica.DEFAULT.DEMO.DISTANCE, altitude=Suica.DEFAULT.DEMO.ALTITUDE )
{
	Suica.precheck();
	Suica.current.demo( distance, altitude );
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


window.allObjects = function( )
{
	Suica.precheck();
	return Suica.current.allObjects( );
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


window.spline = function( points=Suica.DEFAULT.SPLINE.POINTS, closed, interpolant )
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
			points = eval( '[['+points.replaceAll(';','],[')+']]' );
		else
			return function( t )
			{
				return window[points]( t, closed, interpolant );
			}
	}
	
	if( typeof closed === 'undefined' )
		closed = Suica.DEFAULT.SPLINE.CLOSED;
	
	if( typeof interpolant === 'undefined' )
		interpolant = Suica.DEFAULT.SPLINE.INTERPOLANT;
	
	if( !points.length ) points = Suica.DEFAULT.SPLINE.POINTS;

	return function( t )
	{
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
			var v0 = (p2-p0) * 0.5,
				v1 = (p3-p1) * 0.5;
			return (2*p1-2*p2+v0+v1)*t3 + (-3*p1+3*p2-2*v0-v1)*t2 + v0*t + p1;
		}

		function bSpline( p0, p1, p2, p3 )
		{
			return (p0*(1-3*t+3*t2-t3) + p1*(4-6*t2+3*t3) + p2*(1+3*t+3*t2-3*t3) + p3*t3)/6;
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
