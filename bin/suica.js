 document.write( '<script src="three.min.js" onload="LoadSuica();"></script>' );﻿function LoadSuica(){ 
﻿//
// Suica 2.0
// CC-3.0-SA-NC
//
//===================================================


// show suica version
console.log( `Suica 2.-1.45 (220419)` );


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
		for( var methodName of ['cube', 'square', 'sphere', 'point', 'line', 'group', 'cylinder', 'prism', 'cone', 'pyramid', 'circle', 'polygon', 'tube'] )
		{
			Suica.register( methodName );
		}
	} // Suica.constructor

	
	static register( methodName )
	{
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
//
// Suica 2.0 VR, anaglyph and atereo
//
// Brutally based on Three.js' VRButton, AnaglyphEffect.js and StereoEffect.js
//
// createVRButton( renderer )
//
// AnaglyphEffect( suica, distance );
//		setSize( width, height )
//		dispose( );
//
// StereoEffect( suica, distance );
//		setSize( width, height )
//		dispose( );
//
//===================================================


function createFSButton( suica )
{
	var inFullScreen = false;
	
	var button = document.createElement( 'button' );

	button.style.display = '';

	button.style.cursor = 'pointer';
	button.style.left = 'calc(50% - 90px)';
	button.style.width = '180px';

	button.style.position = 'absolute';
	button.style.bottom = '20px';
	button.style.padding = '12px 6px';
	button.style.border = '1px solid #fff';
	button.style.borderRadius = '4px';
	button.style.background = 'rgba(0,0,0,0.5)';
	button.style.color = '#fff';
	button.style.font = 'normal 13px';
	button.style.textAlign = 'center';
	button.style.opacity = '0.5';
	button.style.outline = 'none';
	button.style.zIndex = '999';

	var requestFullscreen = suica.suicaTag.requestFullscreen || suica.suicaTag.webkitRequestFullscreen || suica.suicaTag.msRequestFullscreen;

	button.textContent = requestFullscreen ? 'ENTER FULLSCREEN' : 'FULLSCREEN NOT SUPPORTED';

	button.onmouseenter = function( )
	{
		button.style.opacity = '1.0';
	};

	button.onmouseleave = function( )
	{
		button.style.opacity = '0.5';
	};

	if( requestFullscreen )
	{
		button.onclick = function( )
		{
			requestFullscreen.call( suica.suicaTag );
		};
	}

	suica.suicaTag.onfullscreenchange = function( )
	{
		button.style.display = document.fullscreenElement ? 'none' : '';
		
		suica.resizeCanvas();
	}
	
	window.addEventListener( 'resize', function()
	{
		suica.resizeCanvas();
	});
	
	return button;
} // createFSButton



function createVRButton( renderer )
{
	var button = document.createElement( 'button' );

	function showEnterVR( )
	{
		var currentSession = null;


		async function onSessionStarted( session )
		{
			session.addEventListener( 'end', onSessionEnded );

			await renderer.xr.setSession( session );
			button.textContent = 'EXIT VR';

			currentSession = session;
		} // showEnterVR.onSessionStarted
		

		function onSessionEnded( )
		{
			currentSession.removeEventListener( 'end', onSessionEnded );

			button.textContent = 'ENTER VR';

			currentSession = null;
		} // showEnterVR.onSessionEnded



		button.style.display = '';

		button.style.cursor = 'pointer';
		button.style.left = 'calc(50% - 50px)';
		button.style.width = '100px';

		button.textContent = 'ENTER VR';

		button.onmouseenter = function ()
		{
			button.style.opacity = '1.0';
		};

		button.onmouseleave = function ()
		{
			button.style.opacity = '0.5';
		};

		button.onclick = function ()
		{
			if ( currentSession === null )
			{
				var sessionInit = { optionalFeatures: [ 'local-floor', 'bounded-floor', 'hand-tracking', 'layers' ] };
				navigator.xr.requestSession( 'immersive-vr', sessionInit ).then( onSessionStarted );
			}
			else
			{
				currentSession.end();
			}
		}; // onclick

	} // showEnterVR


	function disableButton()
	{
		button.style.display = '';

		button.style.cursor = 'auto';
		button.style.left = 'calc(50% - 75px)';
		button.style.width = '150px';

		button.onmouseenter = null;
		button.onmouseleave = null;

		button.onclick = null;
	}


	function showWebXRNotFound()
	{
		disableButton();

		button.textContent = 'VR NOT SUPPORTED';
	}


	function stylizeElement( element )
	{
		element.style.position = 'absolute';
		element.style.bottom = '20px';
		element.style.padding = '12px 6px';
		element.style.border = '1px solid #fff';
		element.style.borderRadius = '4px';
		element.style.background = 'rgba(0,0,0,0.5)';
		element.style.color = '#fff';
		element.style.font = 'normal 13px';
		element.style.textAlign = 'center';
		element.style.opacity = '0.5';
		element.style.outline = 'none';
		element.style.zIndex = '999';
	}


	if ( 'xr' in navigator )
	{
		// VR button is created
		
		button.id = 'VRButton';
		button.style.display = 'none';

		stylizeElement( button );

		navigator.xr.isSessionSupported( 'immersive-vr' ).then(
			function ( supported )
			{
				supported ? showEnterVR() : showWebXRNotFound();
			}
		);

		return button;
	}
	else
	{
		// VR button is not created

		const message = document.createElement( 'a' );

		if ( window.isSecureContext === false )
		{
			message.href = document.location.href.replace( /^http:/, 'https:' );
			message.innerHTML = 'WEBXR NEEDS HTTPS';
		}
		else
		{
			message.href = 'https://immersiveweb.dev/';
			message.innerHTML = 'WEBXR NOT AVAILABLE';
		}

		message.style.left = 'calc(50% - 90px)';
		message.style.width = '180px';
		message.style.textDecoration = 'none';

		stylizeElement( message );

		return message;
	} // if ( 'xr' in navigator )

} // createVRButton



class AnaglyphEffect
{

	constructor( suica, distance )
	{
		this.suica = suica;
		
		this.suica.camera.focus = distance;
		
		this.colorMatrixLeft = new THREE.Matrix3().fromArray( [
			//red in    green in    blue in
			1,0,0,	// red out
			0,0,0, 	// green out
			0,0,0,	// blue out
		] );

		this.colorMatrixRight = new THREE.Matrix3().fromArray( [
			//red in    green in    blue in
			0,0,0,	// red out
			0,1,0,	// green out
			0,0,1,	// blue out
		] );

		this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
		this.scene = new THREE.Scene();
		this.stereo = new THREE.StereoCamera();

		var params = {
			minFilter: THREE.LinearFilter,
			magFilter: THREE.NearestFilter,
			format: THREE.RGBAFormat
		};

		this.renderTargetL = new THREE.WebGLRenderTarget( this.suica.canvas.width, this.suica.canvas.height, params );
		this.renderTargetR = new THREE.WebGLRenderTarget( this.suica.canvas.width, this.suica.canvas.height, params );

		this.material = new THREE.ShaderMaterial( {
			uniforms: {
				'mapLeft': {value: this.renderTargetL.texture},
				'mapRight': {value: this.renderTargetR.texture},
				'colorMatrixLeft': {value: this.colorMatrixLeft},
				'colorMatrixRight': {value: this.colorMatrixRight}
			},
			vertexShader: `
				varying vec2 vUv;
				void main()
				{
					vUv = vec2( uv.x, uv.y );
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,
			fragmentShader: `
				uniform sampler2D mapLeft;
				uniform sampler2D mapRight;
				varying vec2 vUv;
				uniform mat3 colorMatrixLeft;
				uniform mat3 colorMatrixRight;
				
				// These functions implement sRGB linearization and gamma correction
				float lin( float c )
				{
					return c<=0.04045 ? c*0.0773993808 : pow( c*0.9478672986+0.0521327014, 2.4 );
				}
				vec4 lin( vec4 c )
				{
					return vec4( lin( c.r ), lin( c.g ), lin( c.b ), c.a );
				}
				float dev( float c )
				{
					return c<=0.0031308 ? c*12.92 : pow( c, 0.41666 ) * 1.055 - 0.055;
				}
				
				void main()
				{
					vec2 uv = vUv;
					vec4 colorL = lin( texture2D( mapLeft, uv ) );
					vec4 colorR = lin( texture2D( mapRight, uv ) );
					vec3 color = clamp( colorMatrixLeft * colorL.rgb + colorMatrixRight * colorR.rgb, 0., 1. );
					gl_FragColor = vec4( dev( color.r ), dev( color.g ), dev( color.b ), max( colorL.a, colorR.a ) );
				}`
		} );

		this.mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), this.material );

		this.scene.add( this.mesh );

	} // AnaglyphEffect.constructor


	setSize( width, height )
	{
		this.suica.renderer.setSize( width, height );
		
		var pixelRatio = this.suica.renderer.getPixelRatio();

		this.renderTargetL.setSize( width * pixelRatio, height * pixelRatio );
		this.renderTargetR.setSize( width * pixelRatio, height * pixelRatio );

	}; // AnaglyphEffect.setSize


	render( scene, camera )
	{

		var currentRenderTarget = this.suica.renderer.getRenderTarget();
		
		scene.updateMatrixWorld();
	
		if ( camera.parent === null ) camera.updateMatrixWorld();

		this.stereo.update( camera );

		this.suica.renderer.setRenderTarget( this.renderTargetL );
		this.suica.renderer.clear();
		this.suica.renderer.render( scene, this.stereo.cameraL );
		this.suica.renderer.setRenderTarget( this.renderTargetR );
		this.suica.renderer.clear();
		this.suica.renderer.render( scene, this.stereo.cameraR );
		this.suica.renderer.setRenderTarget( null );
		this.suica.renderer.render( this.scene, this.camera );
		this.suica.renderer.setRenderTarget( currentRenderTarget );

	}; // AnaglyphEffect.render


	dispose()
	{
		this.renderTargetL.dispose();
		this.renderTargetR.dispose();
		this.mesh.geometry.dispose();
		this.material.dispose();

	}; // AnaglyphEffect.dispose
	
} // class AnaglyphEffect




class StereoEffect
{

	constructor( suica, distance )
	{
		this.suica = suica;
		
		this.stereo = new THREE.StereoCamera();
		this.stereo.aspect = 0.5;
		this.stereo.eyeSep = distance;
		
		this.size = new THREE.Vector2();

	} // StereoEffect.constructor


	setSize( width, height )
	{
		this.suica.renderer.setSize( width, height );
		
	} // StereoEffect.setSize


	render( scene, camera )
	{
		scene.updateMatrixWorld();
		if ( camera.parent === null ) camera.updateMatrixWorld();

		this.stereo.update( camera );

		this.suica.renderer.getSize( this.size );
		if ( this.suica.renderer.autoClear ) this.suica.renderer.clear();
		this.suica.renderer.setScissorTest( true );
		this.suica.renderer.setScissor( 0, 0, this.size.width / 2, this.size.height );
		this.suica.renderer.setViewport( 0, 0, this.size.width / 2, this.size.height );
		this.suica.renderer.render( scene, this.stereo.cameraL );
		this.suica.renderer.setScissor( this.size.width / 2, 0, this.size.width / 2, this.size.height );
		this.suica.renderer.setViewport( this.size.width / 2, 0, this.size.width / 2, this.size.height );
		this.suica.renderer.render( scene, this.stereo.cameraR );
		this.suica.renderer.setScissorTest( false );

	}; // StereoEffect.render


	dispose()
	{		
	}; // StereoEffect.dispose
	
} // class StereoEffect


﻿//
// Suica 2.0 Parser
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

/*
		this.parseTag = {};
		this.parseTag.LOOKAT = this.parseTagLOOKAT;
		this.parseTag.OXYZ = this.parseTagOXYZ;
		this.parseTag.DEMO = this.parseTagDEMO;
		this.parseTag.VR = this.parseTagVR;
		this.parseTag.FULLSCREEN = this.parseTagFULLSCREEN;
		this.parseTag.FULLWINDOW = this.parseTagFULLWINDOW;
		this.parseTag.ANAGLYPH = this.parseTagANAGLYPH;
		this.parseTag.STEREO = this.parseTagSTEREO;
		this.parseTag.PROACTIVE = this.parseTagPROACTIVE;
		this.parseTag.PERSPECTIVE = this.parseTagPERSPECTIVE;
		this.parseTag.ORTHOGRAPHIC = this.parseTagORTHOGRAPHIC;
		this.parseTag.BACKGROUND = this.parseTagBACKGROUND;
		
		this.parseTag.POINT = this.parseTagPOINT;
		this.parseTag.LINE = this.parseTagLINE;
		this.parseTag.SQUARE = this.parseTagSQUARE;
		this.parseTag.CUBE = this.parseTagCUBE;
		this.parseTag.CIRCLE = this.parseTagCIRCLE;
		this.parseTag.POLYGON = this.parseTagPOLYGON;
		this.parseTag.SPHERE = this.parseTagSPHERE;
		this.parseTag.CYLINDER = this.parseTagCYLINDER;
		this.parseTag.PRISM = this.parseTagPRISM;
		this.parseTag.CONE = this.parseTagCONE;
		this.parseTag.PYRAMID = this.parseTagPYRAMID;
		this.parseTag.GROUP = this.parseTagGROUP;

		this.parseTag.CLONE = this.parseTagCLONE;
		
		this.parseTag.DRAWING = this.parseTagDRAWING;
		this.parseTag.MOVETO = this.parseTagMOVETO;
		this.parseTag.LINETO = this.parseTagLINETO;
		this.parseTag.CURVETO = this.parseTagCURVETO;
		this.parseTag.ARC = this.parseTagARC;
		this.parseTag.STROKE = this.parseTagSTROKE;
		this.parseTag.FILL = this.parseTagFILL;
		this.parseTag.FILLTEXT = this.parseTagFILLTEXT;
		this.parseTag.CLEAR = this.parseTagCLEAR;

		this.parseTag.BUTTON = this.skipTag;
		this.parseTag.CANVAS = this.skipTagSilently;
		this.parseTag.DIV = this.skipTag;
		this.parseTag.SPAN = this.skipTag;
*/
		this.openGroups = [];
		this.openDrawings = [];
		
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
			var tagElement = elem.children[i];
			var tagName = tagElement.tagName;
			var newObject = null;

			//console.log('tagName=',tagName);
			
			var parseMethod = this['parseTag'+tagName];
			if( parseMethod/*this.parseTag[tagName]*/ )
			{
				newObject = /*this.parseTag[tagName]*/parseMethod( this.suica, tagElement );
				
				// if there is open group, add the new object to the latest open group
				if( this.openGroups.length )
					this.openGroups[ this.openGroups.length-1 ].add( newObject );
			}
			else
				console.error( `error: unknown tag <${tagName}> in <${that.tagName}>` );

			// if this tag is <group> then mark the gorup as open
			// new objects will be automatically added to the latest open group
			if( tagName == 'GROUP' )
			{
				this.openGroups.push( newObject );
			}

			// if this tag is <drawing> then mark the drawing as open
			// new drawing commands will be automatically added to the latest open drawing
			if( tagName == 'DRAWING' )
			{
				this.openDrawings.push( newObject );
			}

			// recurse into subtags
			this.parseTagsInElement( this.suica, tagElement );

			// is this tag is </group> then close the group
			if( tagName == 'GROUP' )
			{
				// post-process color
				var group = this.openGroups.pop( );
				
				if( tagElement.hasAttribute('color') )
				{
					group.color = tagElement.getAttribute('color');
				}
			}

			// is this tag is </drawing> then close the drawing
			if( tagName == 'DRAWING' )
			{
				this.openDrawings.pop( );
			}

		}
	} // HTMLParser.parseTagsInElement
		
/*
	// <some-unknown-tag> <div>
	skipTag( suica, elem )
	{
		suica.debugCall( 'skipTag', elem.tagName ); // skip this tag
	} // HTMLParser.skipTag
*/	
	
	parseTagBUTTON( suica, elem ) {}
	parseTagCANVAS( suica, elem ) {}
	parseTagDIV( suica, elem ) {}
	parseTagSPAN( suica, elem ) {}
	
/*	
	// <canvas> <div>
	skipTagSilently( suica, elem )
	{
	} // HTMLParser.skipTagSIlently
*/	
	
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
	
	
	// <vr>
	parseTagVR( suica, elem )
	{
		suica.vr(
		);
	} // HTMLParser.parseTagVR
	
	
	// <fullscreen>
	parseTagFULLSCREEN( suica, elem )
	{
		suica.fullScreen(
		);
	} // HTMLParser.parseTagFULLSCREEN
	
	
	// <fullwindow>
	parseTagFULLWINDOW( suica, elem )
	{
		suica.fullWindow(
		);
	} // HTMLParser.parseTagFULLWINDOW
	
	
	// <anaglyph distance="...">
	parseTagANAGLYPH( suica, elem )
	{
		suica.anaglyph(
			elem.getAttribute('distance') || Suica.DEFAULT.ANAGLYPH.DISTANCE
		);
	} // HTMLParser.parseTagANAGLYPH
	
	
	// <proactive>
	parseTagPROACTIVE( suica, elem )
	{
		suica.proactive();
	} // HTMLParser.parseTagPROACTIVE
	
	
	// <stereo distance="...">
	parseTagSTEREO( suica, elem )
	{
		suica.stereo(
			elem.getAttribute('distance') || Suica.DEFAULT.STEREO.DISTANCE
		);
	} // HTMLParser.parseTagSTEREO
	
	
	// <perspective fov="..." near="..." far="...">
	parseTagPERSPECTIVE( suica, elem )
	{
		suica.perspective(
			elem.getAttribute('near') || Suica.DEFAULT.PERSPECTIVE.NEAR,
			elem.getAttribute('far') || Suica.DEFAULT.PERSPECTIVE.FAR,
			elem.getAttribute('fov') || Suica.DEFAULT.PERSPECTIVE.FOV
		);
	} // HTMLParser.parseTagPERSPECTIVE
	
	
	// <orthographic near="..." far="...">
	parseTagORTHOGRAPHIC( suica, elem )
	{
		suica.perspective(
			elem.getAttribute('near') || Suica.DEFAULT.ORTHOGRAPHIC.NEAR,
			elem.getAttribute('far') || Suica.DEFAULT.ORTHOGRAPHIC.FAR
		);
	} // HTMLParser.parseTagORTHOGRAPHIC
	
	
	// <lookAt id="..." from="..." to="..." up="...">
	parseTagLOOKAT( suica, elem )
	{
		suica.lookAt(
			elem.getAttribute('from') || elem.getAttribute('center') || undefined,
			elem.getAttribute('to') || undefined,
			elem.getAttribute('up') || undefined
		);
		
	} // HTMLParser.parseTagLOOKAT
	
	
	// <background color="...">
	parseTagBACKGROUND( suica, elem )
	{
		suica.background(
			elem.getAttribute('color') || Suica.DEFAULT.BACKGROUND.COLOR
		);
	} // HTMLParser.parseTagBACKGROUND
	
		
	
	parseAttributes( elem, object, parseOptions = {} )
	{
		if( elem.hasAttribute('x') ) object.x = Number(elem.getAttribute('x')); 
		if( elem.hasAttribute('y') ) object.y = Number(elem.getAttribute('y')); 
		if( elem.hasAttribute('z') ) object.z = Number(elem.getAttribute('z')); 

		if( elem.hasAttribute('images') ) object.images = elem.getAttribute('images');
		if( elem.hasAttribute('image') )
		{
			var imageName = elem.getAttribute('image');
			if( window[imageName] )
				object.image = window[imageName]; 
			else
				object.image = image(imageName);
		}
		
		if( parseOptions.widthHeight )
		{
			if( elem.hasAttribute('width') ) object.width = Number(elem.getAttribute('width')); 
			if( elem.hasAttribute('height') ) object.height = Number(elem.getAttribute('height')); 
		}
		
		if( parseOptions.depth )
		{
			if( elem.hasAttribute('depth') ) object.depth = Number(elem.getAttribute('depth')); 
		}
		
		if( parseOptions.spin )
		{
			if( elem.hasAttribute('spin') ) object.spin = elem.getAttribute('spin'); 
			if( elem.hasAttribute('spinH') ) object.spinH = elem.getAttribute('spinH'); 
			if( elem.hasAttribute('spinV') ) object.spinV = elem.getAttribute('spinV'); 
			if( elem.hasAttribute('spinT') ) object.spinT = elem.getAttribute('spinT'); 
		}
		
		if( parseOptions.wireframe )
		{
			if( elem.hasAttribute('wireframe') ) object.wireframe = ['','true','yes','1'].indexOf(elem.getAttribute('wireframe').toLowerCase()) >= 0;
		}


		
		// parse id
		var id = elem.getAttribute('id');
		if( id )
		{
			window[id] = object;
			object.id = id;
		}
		
		this.parseEvents( elem, object );
	}
	
	
	parseEvents( tag, object, suica=null )
	{
		// parse events
		function parseEvent( actualName, name )
		{
			if( tag.hasAttribute(name) )
			{
		
				object[actualName] = tag.getAttribute(name);

				// if event is set to Suica.canvas, it cannot be set as a string,
				// (the browser just ignores this value), so we add a custom
				// event handler that creates the event handler the first time
				// it is called
				if( !object[actualName] )
				{
					object[actualName] = function(event)
					{
						object[actualName] = window[tag.getAttribute(name)];
						object[actualName]( event );
					}
				}
			}
		}
		
		parseEvent( 'onmousemove',	'onmousemove' );
		parseEvent( 'onmouseleave',	'onmouseleave' );
		parseEvent( 'onmouseenter', 'onmouseenter' );
		parseEvent( 'onmousedown',	'onmousedown' );
		parseEvent( 'onmouseup',	'onmouseup' );
		parseEvent( 'onclick',		'onclick' );
		//parseEvent( 'ondblclick',	'ondblclick' );

		parseEvent( 'onmousemove',	'mousemove' );
		parseEvent( 'onmouseleave',	'mouseleave' );
		parseEvent( 'onmouseenter', 'mouseenter' );
		parseEvent( 'onmousedown',	'mousedown' );
		parseEvent( 'onmouseup',	'mouseup' );
		parseEvent( 'onclick',		'click' );
		//parseEvent( 'ondblclick',	'dblclick' );
		
		if( suica )
		{
			object = suica;
			parseEvent( 'ontime',	'ontime' );
			parseEvent( 'ontime',	'time' );
		}
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
		
		return p;
		
	} // HTMLParser.parseTagPOINT
	
	
	// <line id="..." center="..." color="..." to="...">
	parseTagLINE( suica, elem )
	{
		var p = suica.line(
			elem.getAttribute('center') || elem.getAttribute('from') || Suica.DEFAULT.LINE.CENTER,
			elem.getAttribute('to') || Suica.DEFAULT.LINE.TO,
			elem.getAttribute('color') || Suica.DEFAULT.LINE.COLOR
		);

		suica.parserReadonly.parseAttributes( elem, p );

		var id = elem.getAttribute('id');
		if( id ) window[id] = p;
		
		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagLINE
	
	
	// <square id="..." center="..." color="..." size="..." wireframe="...">
	parseTagSQUARE( suica, elem )
	{
		var p = suica.square(
			elem.getAttribute('center') || Suica.DEFAULT.SQUARE.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.SQUARE.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.SQUARE.COLOR
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, wireframe:true, spin:true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagSQUARE
	
	
	// <cube id="..." center="..." color="..." size="..." wireframe="...">
	parseTagCUBE( suica, elem )
	{
		var p = suica.cube(
			elem.getAttribute('center') || Suica.DEFAULT.CUBE.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.CUBE.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.CUBE.COLOR
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, wireframe:true, spin:true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagCUBE
	
	
	// <circle id="..." center="..." color="..." size="..." wireframe="...">
	parseTagCIRCLE( suica, elem )
	{
		var p = suica.circle(
			elem.getAttribute('center') || Suica.DEFAULT.CIRCLE.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.CIRCLE.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.CIRCLE.COLOR
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, wireframe:true, spin:true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagCIRCLE
	
	
	// <polygon id="..." center="..." color="..." size="..." count="..." wireframe="...">
	parseTagPOLYGON( suica, elem )
	{
		var p = suica.polygon(
			elem.getAttribute('count') || Suica.DEFAULT.POLYGON.COUNT,
			elem.getAttribute('center') || Suica.DEFAULT.POLYGON.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.POLYGON.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.POLYGON.COLOR
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, wireframe:true, spin:true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagPOLYGON
	

	// <sphere id="..." center="..." color="..." size="...">
	parseTagSPHERE( suica, elem )
	{
		var p = suica.sphere(
			elem.getAttribute('center') || Suica.DEFAULT.SPHERE.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.SPHERE.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.SPHERE.COLOR
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, spin:true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagSPHERE
	
	
	// <cylinder id="..." center="..." color="..." size="...">
	parseTagCYLINDER( suica, elem )
	{
		var p = suica.cylinder(
			elem.getAttribute('center') || Suica.DEFAULT.CYLINDER.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.CYLINDER.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.CYLINDER.COLOR
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, spin:true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagCYLINDER
	
	
	// <prism id="..." center="..." color="..." size="..." count="..." wireframe="...">
	parseTagPRISM( suica, elem )
	{
		var p = suica.prism(
			elem.getAttribute('count') || Suica.DEFAULT.PRISM.COUNT,
			elem.getAttribute('center') || Suica.DEFAULT.PRISM.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.PRISM.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.PRISM.COLOR
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, wireframe:true, spin:true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagPRISM
	
	
	// <cone id="..." center="..." color="..." size="...">
	parseTagCONE( suica, elem )
	{
		var p = suica.cone(
			elem.getAttribute('center') || Suica.DEFAULT.CONE.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.CONE.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.CONE.COLOR
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, spin:true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagCONE
	
	
	// <pyramid id="..." center="..." color="..." size="..." count="..." wireframe="...">
	parseTagPYRAMID( suica, elem )
	{
		var p = suica.pyramid(
			elem.getAttribute('count') || Suica.DEFAULT.PYRAMID.COUNT,
			elem.getAttribute('center') || Suica.DEFAULT.PYRAMID.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.PYRAMID.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.PYRAMID.COLOR
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, wireframe:true, spin:true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagPYRAMID
	
	// <group id="..." center="..." color="..." size="..." spin="...">
	parseTagGROUP( suica, elem )
	{
		var p = suica.group();
		
		p.center = elem.getAttribute('center') || Suica.DEFAULT.GROUP.CENTER;
		p.size = Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.GROUP.SIZE );
		p.spin = elem.getAttribute('spin') || Suica.DEFAULT.GROUP.SPIN;

		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, spin:true} );

		elem.suicaObject = p;		
		
		return p;
		
	} // HTMLParser.parseTagGROUP
	
	// <clone id="..." src="..." center="..." color="..." size="..." spin="...">
	parseTagCLONE( suica, elem )
	{
		var sourceId = elem.getAttribute('src');
		if( !window[sourceId] )
		{
			console.error( `error: unknown object name '${sourceId}' in attribute 'src' of tag <clone>` );
			return;
		}

		var p = window[sourceId].clone;

		if( elem.hasAttribute('center') ) p.center = elem.getAttribute('center');
		if( elem.hasAttribute('size') ) p.size = Suica.parseSize( elem.getAttribute('size') );
		if( elem.hasAttribute('spin') ) p.spin = elem.getAttribute('spin');
		if( elem.hasAttribute('color') ) p.color = elem.getAttribute('color');

		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, spin:true, wireframe:true} );

		elem.suicaObject = p;		
		
		return p;
		
	} // HTMLParser.parseTagGROUP

	
	// <drawing id="..." color="..." size="..." width="..." height="...">
	parseTagDRAWING( suica, elem )
	{
		var color = elem.getAttribute('color') || Suica.DEFAULT.DRAWING.COLOR;
		var width = elem.getAttribute('width') || Suica.DEFAULT.DRAWING.SIZE;
		var height = elem.getAttribute('height') || width;

		// process size=n and size=n,m
		if( elem.hasAttribute('size') )
		{
			var size = Suica.parseSize( elem.getAttribute('size') );
			if( Array.isArray(size) )
			{
				if( size.length==1 )
					width = height = size[0];
				else
				if( size.length==2 )
				{
					width = size[0];
					height = size[1];
				}
			}
			else
			{
				width = height = size;
			}
		}

		var p = drawing( width, height, color );

		var id = elem.getAttribute('id');
		if( id ) window[id] = p;

		elem.suicaObject = p;		
		
		return p;
		
	} // HTMLParser.parseTagDRAWING


	// <moveto center="x,y">
	// <moveto x="..." y="...">
	parseTagMOVETO( suica, elem )
	{
		var center = Suica.parseCenter( elem.getAttribute('center') || Suica.DEFAULT.MOVETO.CENTER );
		if( elem.hasAttribute('x') )
			center[0] = elem.getAttribute('x') || Suica.DEFAULT.MOVETO.CENTER[0];
		if( elem.hasAttribute('y') )
			center[1] = elem.getAttribute('y') || Suica.DEFAULT.MOVETO.CENTER[1];

		moveTo( center[0], center[1] );
	} // HTMLParser.parseTagMOVETO


	// <lineto center="x,y">
	// <lineto x="..." y="...">
	parseTagLINETO( suica, elem )
	{
		var center = Suica.parseCenter( elem.getAttribute('center') || Suica.DEFAULT.LINETO.CENTER );
		if( elem.hasAttribute('x') )
			center[0] = elem.getAttribute('x') || Suica.DEFAULT.LINETO.CENTER[0];
		if( elem.hasAttribute('y') )
			center[1] = elem.getAttribute('y') || Suica.DEFAULT.LINETO.CENTER[1];

		lineTo( center[0], center[1] );
	} // HTMLParser.parseTagLINETO


	// <curveto m="mx,my" center="x,y">
	// <curveto mx="..." my="..." x="..." y="...">
	parseTagCURVETO( suica, elem )
	{
		var center = Suica.parseCenter( elem.getAttribute('center') || Suica.DEFAULT.CURVETO.CENTER );
		if( elem.hasAttribute('x') )
			center[0] = elem.getAttribute('x') || Suica.DEFAULT.CURVETO.CENTER[0];
		if( elem.hasAttribute('y') )
			center[1] = elem.getAttribute('y') || Suica.DEFAULT.CURVETO.CENTER[1];

		var m = Suica.parseCenter( elem.getAttribute('m') || Suica.DEFAULT.CURVETO.M );
		if( elem.hasAttribute('mx') )
			m[0] = elem.getAttribute('mx') || Suica.DEFAULT.CURVETO.M[0];
		if( elem.hasAttribute('my') )
			m[1] = elem.getAttribute('my') || Suica.DEFAULT.CURVETO.M[1];

		curveTo( m[0], m[1], center[0], center[1] );
	} // HTMLParser.parseTagCURVETO


	// <arc center="..." x="..." y="..." radius="..." from="..." to="..." cw cw="..." ccw ccw="ccw">
	parseTagARC( suica, elem )
	{
		var center = Suica.parseCenter( elem.getAttribute('center') || Suica.DEFAULT.ARC.CENTER );
		if( elem.hasAttribute('x') )
			center[0] = elem.getAttribute('x') || Suica.DEFAULT.ARC.CENTER[0];
		if( elem.hasAttribute('y') )
			center[1] = elem.getAttribute('y') || Suica.DEFAULT.ARC.CENTER[1];

		var radius = elem.getAttribute('radius') || Suica.DEFAULT.STROKE.RADIUS,
			from = elem.getAttribute('from') || Suica.DEFAULT.STROKE.FROM,
			to = elem.getAttribute('to') || Suica.DEFAULT.STROKE.TO;
			
		var cw = Suica.DEFAULT.STROKE.CW;
		
		if( elem.hasAttribute('cw') )
		{
			if( elem.getAttribute('cw') == "" )
				cw = true;
			else
				cw = elem.getAttribute('cw');
		}
		if( elem.hasAttribute('ccw') )
		{
			if( elem.getAttribute('ccw') == "" )
				cw = false;
			else
				cw = !elem.getAttribute('ccw');
		}

		arc( center[0], center[1], radius, from, to, cw );
	} // HTMLParser.parseTagARC


	// <stroke color="..." width="..." close close="...">
	parseTagSTROKE( suica, elem )
	{
		var color = elem.getAttribute('color') || Suica.DEFAULT.STROKE.COLOR,
			width = elem.getAttribute('width') || Suica.DEFAULT.STROKE.WIDTH,
			close = elem.getAttribute('close') || Suica.DEFAULT.STROKE.CLOSE;
		
		if( elem.hasAttribute('close') && elem.getAttribute('close')=="") close = true;

		stroke( color, width, close );
	} // HTMLParser.parseTagSTROKE


	// <fill color="...">
	parseTagFILL( suica, elem )
	{
		var color = elem.getAttribute('color') || Suica.DEFAULT.FILL.COLOR;

		fill( color );
	} // HTMLParser.parseTagFILL


	// <fillText center="..." x="..." y="..." text="..." color="..." font="...">
	parseTagFILLTEXT( suica, elem )
	{
		var center = Suica.parseCenter( elem.getAttribute('center') || Suica.DEFAULT.FILLTEXT.CENTER );
		if( elem.hasAttribute('x') )
			center[0] = elem.getAttribute('x') || Suica.DEFAULT.FILLTEXT.CENTER[0];
		if( elem.hasAttribute('y') )
			center[1] = elem.getAttribute('y') || Suica.DEFAULT.FILLTEXT.CENTER[1];

		var text = elem.getAttribute('text') || Suica.DEFAULT.FILLTEXT.TEXT,
			color = elem.getAttribute('color') || Suica.DEFAULT.FILLTEXT.COLOR,
			font = elem.getAttribute('font') || Suica.DEFAULT.FILLTEXT.FONT;
		
		fillText( center[0], center[1], text, color, font );
	} // HTMLParser.parseTagFILLTEXT


	// <clear color="...">
	parseTagCLEAR( suica, elem )
	{
		var color = elem.getAttribute('color') || elem.getAttribute('background') || Suica.DEFAULT.CLEAR.COLOR;

		clear( color );
	} // HTMLParser.parseTagCLEAR

	
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
// stroke( color, width, close )
// fill( color )
//
//===================================================


class Drawing
{

	// current active Drawing instance
	static current;



		
	constructor( width=Suica.DEFAULT.DRAWING.SIZE, height=width, color=Suica.DEFAULT.DRAWING.COLOR, newCanvas=true )
	{
		if( newCanvas )
		{
			this.canvas = document.createElement( 'canvas' );
			this.canvas.width = width;
			this.canvas.height = height;
			this.texture = null;
		
			this.context = this.canvas.getContext( '2d' );
			this.context.clearRect( 0, 0, width, height );
			
			if( color )
			{
				this.context.fillStyle = color;
				this.context.fillRect( 0, 0, width, height );
			}
			
			this.needsNewPath = true;
			
//document.body.appendChild( this.canvas );			
		}
	
		// register some local methods as public global functions
		for( var methodName of ['moveTo', 'lineTo', 'curveTo', 'arc', 'fillText', 'stroke', 'fill', 'clear'] )
		{
			Drawing.register( methodName );
		}
		
	} // Drawing.constructor



	static register( methodName )
	{
		window[methodName] = function ( ...params )
		{
			Drawing.precheck();
			Drawing.current[methodName]( ...params );
		}
	}
		


	managePath()
	{
		if( this.needsNewPath )
		{
			this.context.beginPath( );
			this.needsNewPath = false;
		}	
	} // Drawing.managePath



	moveTo( x = Suica.DEFAULT.MOVETO.CENTER[0], y = Suica.DEFAULT.MOVETO.CENTER[1] )
	{
		this.managePath();
		this.context.moveTo( x, this.canvas.height-y );
	} // Drawing.moveTo
	
	
	
	
	lineTo( x = Suica.DEFAULT.LINETO.CENTER[0], y = Suica.DEFAULT.LINETO.CENTER[1] )
	{
		this.managePath();
		this.context.lineTo( x, this.canvas.height-y );
	} // Drawing.lineTo
	
	
	
	
	curveTo( mx = Suica.DEFAULT.CURVETO.M[0], my = Suica.DEFAULT.CURVETO.M[1], x = Suica.DEFAULT.CURVETO.CENTER[0], y = Suica.DEFAULT.CURVETO.CENTER[1] )
	{
		this.managePath();
		this.context.quadraticCurveTo( mx, this.canvas.height-my, x, this.canvas.height-y );
	} // Drawing.curveTo
	
	
	

	arc( x = Suica.DEFAULT.ARC.CENTER[0], y = Suica.DEFAULT.ARC.CENTER[1], r = Suica.DEFAULT.ARC.RADIUS, from = Suica.DEFAULT.ARC.FROM, to = Suica.DEFAULT.ARC.TO, cw = Suica.DEFAULT.ARC.CW )
	{
		this.managePath();
		this.context.arc( x, this.canvas.height-y, r, THREE.Math.degToRad(from-90), THREE.Math.degToRad(to-90), !cw );
	} // Drawing.arc
	
	
	

	fillText( x = Suica.DEFAULT.FILLTEXT.CENTER[0], y = Suica.DEFAULT.FILLTEXT.CENTER[1], text = Suica.DEFAULT.FILLTEXT.TEXT, color = Suica.DEFAULT.FILLTEXT.COLOR, font = Suica.DEFAULT.FILLTEXT.FONT )
	{
		if( this.texture ) this.texture.needsUpdate = true;
		
		this.context.fillStyle = color;
		this.context.font = font;
		this.context.fillText( text, x, this.canvas.height-y );
	} // Drawing.fillText
	
	
	

	stroke( color = Suica.DEFAULT.STROKE.COLOR, width = Suica.DEFAULT.STROKE.WIDTH, close = Suica.DEFAULT.STROKE.CLOSE )
	{
		if( this.texture ) this.texture.needsUpdate = true;
//		this.texture = null; // clear the texture
		
		if( close ) this.context.closePath();
		
		this.context.strokeStyle = color;
		this.context.lineWidth = width;
		this.context.stroke( );

		this.needsNewPath = true;
	} // Drawing.stroke
	
	
	
	
	fill( color = Suica.DEFAULT.FILL.COLOR )
	{
		if( this.texture ) this.texture.needsUpdate = true;
//		this.texture = null; // clear the texture
		
		this.context.fillStyle = color;
		this.context.fill( );

		this.needsNewPath = true;
	} // Drawing.fill
	
	
	
	clear( color = Suica.DEFAULT.CLEAR.COLOR )
	{
		if( this.texture ) this.texture.needsUpdate = true;

		if( color )
		{
			this.context.fillStyle = color;
			this.context.fillRect( -1, -1, this.canvas.width+2, this.canvas.height+2 );
		}
		else
		{
			this.context.clearRect( -1, -1, this.canvas.width+2, this.canvas.height+2 );
		}

		this.needsNewPath = true;
	}



	get image( )
	{
		if( !this.texture )
		{
			this.texture = new THREE.CanvasTexture( this.canvas );
			this.texture.anisotropy = Suica.current.renderer.capabilities.getMaxAnisotropy();
			this.texture.wrapS = THREE.RepeatWrapping;
			this.texture.wrapT = THREE.RepeatWrapping;
		}
			
		return this.texture;
	} // Drawing.image
	
	

	get clone( )
	{
		var newDrawing = drawing( this.canvas.width, this.canvas.height, 'white', false );
			newDrawing.canvas = this.canvas;
			newDrawing.context = this.context;
			newDrawing.texture = this.texture;

		// var newDrawing = drawing( this.canvas.width, this.canvas.height );
		// newDrawing.context.drawImage( this.canvas, 0, 0);
		
		return newDrawing;
	}
	
	
	static precheck()
	{
		if( !(Drawing.current instanceof Drawing) )
			throw 'error: No Drawing instance is active';		
	} // Drawing.precheck

} // class Drawing




window.drawing = function ( ...params )
{
	Drawing.current = new Drawing( ...params );
	return Drawing.current;
}





/*
window.moveTo = function ( ...params )
{
	Drawing.precheck();
	Drawing.current.moveTo( ...params );
}
	
	
	
window.lineTo = function ( ...params )
{
	Drawing.precheck();
	Drawing.current.lineTo( ...params );
}




window.curveTo = function ( ...params )
{
	Drawing.precheck();
	Drawing.current.curveTo( ...params );
}




window.arc = function ( ...params )
{
	Drawing.precheck();
	Drawing.current.arc( ...params );
}




window.fillText = function ( ...params )
{
	Drawing.precheck();
	Drawing.current.fillText( ...params );
}




window.stroke = function ( ...params )
{
	Drawing.precheck();
	Drawing.current.stroke( ...params );
}
	
	
	
	
window.fill = function ( ...params )
{
	Drawing.precheck();
	Drawing.current.fill( ...params );
}




window.clear = function ( ...params )
{
	Drawing.precheck();
	Drawing.current.clear( ...params );
}

*/	



window.image = function ( url = null )
{
	var texture = new THREE.TextureLoader().load( url );

	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;

	texture.magFilter = THREE.LinearFilter;
	texture.minFilter = THREE.LinearMipmapLinearFilter;

	texture.anisotropy = Suica.current.renderer.capabilities.getMaxAnisotropy();

	return texture;
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
	static id = 0;
	
	constructor( suica, solidMesh, frameMesh )
	{
		this.id = 'Object'+(++Mesh.id);
		
		this.suica = suica;
		this.solidMesh = solidMesh;
		this.frameMesh = frameMesh;
		
		this.threejs = solidMesh;
		this.threejs.suicaObject = this;
		this.isWireframe = false;
		
		// [width, height, depth]
		this.meshSize = [null, null, null];
		this.meshSpin = [0, 0, 0];
		this.meshImages = 1;

		suica.scene.add( solidMesh );
	}



	
	// create default materials for SUica objects
	static createMaterials( )
	{
		// point material
		var CANVAS_SIZE = 128;
		var canvas = document.createElement('canvas');
			canvas.width = CANVAS_SIZE;
			canvas.height = CANVAS_SIZE;
			
		var context = canvas.getContext('2d');
			context.fillStyle = 'white';
			
		var gradient = context.createRadialGradient(
				CANVAS_SIZE/2, CANVAS_SIZE/2, CANVAS_SIZE/2-5,
				CANVAS_SIZE/2, CANVAS_SIZE/2, CANVAS_SIZE/2
			);
			gradient.addColorStop(0, 'white');
			gradient.addColorStop(1, 'rgba(0,0,0,0)');
			context.fillStyle = gradient;

			context.beginPath( );
			context.arc( CANVAS_SIZE/2, CANVAS_SIZE/2, CANVAS_SIZE/2-2, 0, 2*Math.PI );
			context.fill( );

		Mesh.pointMaterial = new THREE.PointsMaterial( {
				color: 'white',
				size: 5,
				sizeAttenuation: true,
				map: new THREE.CanvasTexture( canvas ),
				transparent: true,
				alphaTest: 0.1,
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

		this.threejs.position.set( ...center );
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
	
	
	
	get image( )
	{
		return this._drawing;// this.threejs.material.map;
	}
	
	set image( drawing )
	{
		this.suica.parser?.parseTags();

		this._drawing = drawing;
		
		if( !drawing )
		{
			delete this.threejs.material.map;
			this.threejs.material.transparent = false,
			this.threejs.material.needsUpdate = true;
			return;
		}

		if( drawing instanceof Drawing )
		{
			this._drawing = drawing.clone;
			
			this.threejs.material.map = this._drawing.image;
			this.threejs.material.transparent = true,
			this.threejs.material.needsUpdate = true;
			this.updateImages();
			return;
		}

		if( drawing instanceof THREE.Texture )
		{
			this.threejs.material.map = drawing; // no cloning available
			this.threejs.material.transparent = true,
			this.threejs.material.needsUpdate = true;
			this.updateImages();
			return;
		}

		if( typeof drawing == 'string' || drawing instanceof String )
		{
			this.image = image(drawing);
			return;
		}

		throw 'error: parameter of `image` is not a drawing';
	}
	
	
	get images( )
	{
		return this.meshImages;
	}
	
	set images( img )
	{
		this.suica.parser?.parseTags();

		// img is string 'x,y'
		if( typeof img === 'string' || img instanceof String )
		{
			img = img.replaceAll(' ','');
			img = img.split(',').map(Number);
		}

		this.meshImages = img;

		this.updateImages();
	}
	
	
	updateImages( )
	{
		var img = this.meshImages;

		// img is number
		if( !isNaN(img) )
		{
			this.threejs.material.map?.repeat.set( img, img );
			return;
		}
		
		// img is array [x,y]
		if( Array.isArray(img) )
		{
			switch( img.count )
			{
				case 0: this.threejs.material.map?.repeat.set( 1, 1 ); break;
				case 1: this.threejs.material.map?.repeat.set( img[0], img[0] ); break;
				default: this.threejs.material.map?.repeat.set( img[0], img[1] );
			}
			return;
		}
		
		throw `error: invalid value '${img}' of 'images' property`;
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



	get wireframe( )
	{
		return this.isWireframe;
	}
	
	set wireframe( wireframe )
	{
		if( !this.frameMesh )
			throw 'error: wireframe property not available';
		
		this.isWireframe = wireframe;
		
		var oldMesh = this.threejs,
			newMesh = (wireframe===true) || (['','true','yes','1'].indexOf(String(wireframe).toLowerCase()) >= 0) ? this.frameMesh : this.solidMesh;

		// copy properties
		newMesh.position.copy( oldMesh.position );
		newMesh.scale.copy( oldMesh.scale );
		newMesh.material.color.copy( oldMesh.material.color );
		
		if( oldMesh.material.map )
		{
			newMesh.material.map = oldMesh.material.map;
			newMesh.material.transparent = oldMesh.material.transparent;
			newMesh.material.needsUpdate = true;
		}
		
		this.threejs = newMesh;
		this.threejs.suicaObject = this;
		
		this.suica.scene.remove( oldMesh );
		this.suica.scene.add( newMesh );

	}
	
	
	style( properties )
	{
		for( var n in properties ) this[n] = properties[n];
		return this;
		
	} // Mesh.style


	updateOrientation( )
	{
		var spin = this.meshSpin;
		if( !spin ) return;

		var flip = 1;
		switch( this.suica.orientation )
		{
			//case Suica.ORIENTATIONS.XYZ: 
			case Suica.ORIENTATIONS.XZY: flip = -1; break;
			case Suica.ORIENTATIONS.YXZ: flip = -1; break;
			//case Suica.ORIENTATIONS.YZX:
			//case Suica.ORIENTATIONS.ZXY:
			case Suica.ORIENTATIONS.ZYX: flip = -1; break;
		};
		
		this.threejs.rotation.set( 0, 0, 0 );
		if( Array.isArray(spin) )
		{
			if( spin[0] ) this.threejs.rotateOnAxis( this.suica.orientation.UP, radians(flip*spin[0]) );
			if( spin[1] ) this.threejs.rotateOnAxis( this.suica.orientation.RIGHT, radians(flip*spin[1]) );
			if( spin[2] ) this.threejs.rotateOnAxis( this.suica.orientation.UP, radians(flip*spin[2]) );
		}
		else
		{
			this.threejs.rotateOnAxis( this.suica.orientation.UP, radians(flip*spin) );
		}

	} // Mesh.updateOrientation

	
	get spin( )
	{
		return this.meshSpin;
	}

	set spin( spin )
	{
		this.meshSpin = Suica.parseSize( spin );
		this.updateOrientation();
	}
	

	get spinH( )
	{
		return this.meshSpin[0];
	}

	set spinH( spin )
	{
		this.meshSpin[0] = Number( spin );
		this.updateOrientation();
	}
	

	get spinV( )
	{
		return this.meshSpin[1];
	}

	set spinV( spin )
	{
		this.meshSpin[1] = Number( spin );
		this.updateOrientation();
	}
	

	get spinT( )
	{
		return this.meshSpin[2];
	}

	set spinT( spin )
	{
		this.meshSpin[2] = Number( spin );
		this.updateOrientation();
	}
	

	addEventListener( type, listener, aux )
	{
		if( aux ) console.warn( 'Suica objects do not support third parameter of addEventListener');
		
		if( !type.startsWith('on') )
			type = 'on'+type;
		
		this[type.toLowerCase()] = listener;
	}
	

	removeEventListener( type, listener, aux )
	{
		if( listener ) console.warn( 'Suica objects do not support second parameter of removeEventListener');
		if( aux ) console.warn( 'Suica objects do not support third parameter of removeEventListener');

		if( !type.startsWith('on') )
			type = 'on'+type;
		
		this[type.toLowerCase()] = null;
	}
	

} // class Mesh




Mesh.createMaterials();

﻿//
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
	static solidGeometry;


	constructor(suica, center, size, color)
	{
		suica.parser?.parseTags();
		suica.debugCall( 'point', center, size, color );

		if( !Point.solidGeometry )
		{
			Point.solidGeometry = new THREE.BufferGeometry();
			Point.solidGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3));
		}
		
		super( suica,
			new THREE.Points( Point.solidGeometry, Mesh.pointMaterial.clone() ),
			null, // no wireframe
		);

		this.center = center;
		this.color = color;
		this.size = size;
		
		this._drawing = this.threejs.material.map;

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



	style( properties )
	{
		for( var n in properties ) this[n] = properties[n];
		return this;
		
	} // Point.style



	get clone( )
	{
		var object = new Point( this.suica, this.center, this.size, this.color );

		object.image = this.image;
		Suica.cloneEvents( object, this );
		
		return object;
		
	} // Point.clone
	
} // class Point



/*
window.point = function(
					center = Suica.DEFAULT.POINT.CENTER,
					size   = Suica.DEFAULT.POINT.SIZE,
					color  = Suica.DEFAULT.POINT.COLOR )
{
	Suica.precheck();
	return Suica.current.point( center, size, color );
}
*/

// window.point = function( ...params )
// {
	// Suica.precheck();
	// return Suica.current.point( ...params );
// }
﻿//
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
	static solidGeometry;


	constructor( suica, center, to, color )
	{
		suica.parser?.parseTags();
		suica.debugCall( 'line', center, to, color );
			
		if( !Line.solidGeometry )
		{
			Line.solidGeometry = new THREE.BufferGeometry();
			Line.solidGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0, 0, 30, 0]), 3));
			Line.solidGeometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([0, 0, 1, 0]), 2));
		}
		
		super( suica,
			new THREE.LineSegments( Line.solidGeometry.clone(), Mesh.lineMaterial.clone() ),
			null, // no wireframe
		);

		this.center = center;
		this.color = color;
		this.to = to;

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


	style( properties )
	{
		for( var n in properties ) this[n] = properties[n];
		return this;
		
	} // Line.style


	get clone( )
	{
		var object = new Line( this.suica, this.from, this.to, this.color );
		
		object.image = this.image;
		Suica.cloneEvents( object, this );
		
		return object;
		
	} // Line.clone
	
} // class Line



/*
window.line = function(
					center = Suica.DEFAULT.LINE.CENTER,
					to     = Suica.DEFAULT.LINE.TO,
					color  = Suica.DEFAULT.LINE.COLOR )
{
	Suica.precheck();
	return Suica.current.line( center, to, color );
}
*/

// window.line = function( ...params )
// {
	// Suica.precheck();
	// return Suica.current.line( ...params );
// }
﻿//
// Suica 2.0 Square
// CC-3.0-SA-NC
//
// square( center, size, color )
//
// <square id="" center="" size="" color="" wireframe="">
// <square x="" y="" z="">
// <square width="" height="">
//
// center	center [x,y,z]
// x		x coordinate of center
// y		y coordinate of center
// z		z coordinate of center
// size		size(s) of edge
// width
// height
// color	color [r,g,b]
// wireframe true (wireframe) or false (solid)
// image	texture (drawing or canvas)
//
//===================================================


class Square extends Mesh
{
	
	constructor( suica, center, size, color )
	{
		suica.parser?.parseTags();
		suica.debugCall( 'square', center, size, color );
		
		suica._.solidGeometry.square = suica.flipNormal( new THREE.PlaneGeometry( 1, 1 ).applyMatrix4( suica.orientation.MATRIX ) );; // array of geometries for different number of sides
		suica._.frameGeometry.square = new THREE.BufferGeometry(); // array of geometries for different number of sides
		suica._.frameGeometry.square.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
			-0.5,-0.5,0, +0.5,-0.5,0, 
			+0.5,-0.5,0, +0.5,+0.5,0, 
			+0.5,+0.5,0, -0.5,+0.5,0, 
			-0.5,+0.5,0, -0.5,-0.5,0, 
		]), 3));
		suica._.frameGeometry.square.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([
			0, 0,  1, 0,
			0, 0,  1, 0,
			0, 0,  1, 0,
			0, 0,  1, 0,
		]), 2));
		suica._.frameGeometry.square.applyMatrix4( suica.orientation.MATRIX );
		
		super( suica, 
			/*solid*/ new THREE.Mesh( suica._.solidGeometry.square, Mesh.solidMaterial.clone() ),
			/*frame*/ new THREE.LineSegments( suica._.frameGeometry.square, Mesh.lineMaterial.clone() ),
		);
		
		this.center = center;
		this.color = color;
		this.size = size;
		
	} // Square.constructor


	get clone( )
	{
		var object = new Square( this.suica, this.center, this.size, this.color );
		
		object.spin = this.spin;
		object.wireframe = this.wireframe;
		object.image = this.image;
		Suica.cloneEvents( object, this );
		
		return object;
		
	} // Square.clone

} // class Square



/*
window.square = function(
				center = Suica.DEFAULT.SQUARE.CENTER,
				size   = Suica.DEFAULT.SQUARE.SIZE,
				color  = Suica.DEFAULT.SQUARE.COLOR )
{
	Suica.precheck();
	return Suica.current.square( center, size, color );
}
*/

// window.square = function( ...params )
// {
	// Suica.precheck();
	// return Suica.current.square( ...params );
// }
﻿//
// Suica 2.0 Cube
// CC-3.0-SA-NC
//
// cube( center, size, color )
//
// <cube id="" center="" size="" color="" wireframe="">
// <cube x="" y="" z="">
// <cube width="" height="" depth="">
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
// wireframe true (wireframe) or false (solid)
// image	texture (drawing or canvas)
//
//===================================================


class Cube extends Mesh
{
	
	constructor( suica, center, size, color )
	{
		
		suica.parser?.parseTags();
		suica.debugCall( 'cube', center, size, color );
		
		suica._.solidGeometry.cube = suica.flipNormal( new THREE.BoxGeometry( 1, 1, 1 ).applyMatrix4( suica.orientation.MATRIX ) ); // array of geometries for different number of sides
		suica._.frameGeometry.cube = new THREE.BufferGeometry(); // array of geometries for different number of sides

		suica._.frameGeometry.cube.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
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
		suica._.frameGeometry.cube.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([
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

		suica._.frameGeometry.cube = suica._.frameGeometry.cube.applyMatrix4( suica.orientation.MATRIX );
		
		super( suica, 
			new THREE.Mesh( suica._.solidGeometry.cube, Mesh.solidMaterial.clone() ),
			new THREE.LineSegments( suica._.frameGeometry.cube, Mesh.lineMaterial.clone() ),
		);
		
		this.center = center;
		this.color = color;
		this.size = size;
		
	} // Cube.constructor


	get clone( )
	{
		var object = new Cube( this.suica, this.center, this.size, this.color );
		
		object.spin = this.spin;
		object.wireframe = this.wireframe;
		object.image = this.image;
		Suica.cloneEvents( object, this );
		
		return object;
		
	} // Cube.clone

} // class Cube


/*
window.cube = function( ... params )
{
	Suica.precheck();
	return Suica.current.cube( ... params );
}
*/

﻿//
// Suica 2.0 Circle
// CC-3.0-SA-NC
//
// circle( center, size, color )
//
// <circle id="" center="" size="" color="" wireframe=""> 
// <circle x="" y="" z="">
// <circle width="" height="">
// <polygon id="" count="..." center="" size="" color="" wireframe=""> 
//
// center	center [x,y,z]
// x		x coordinate of center
// y		y coordinate of center
// z		z coordinate of center
// size		size(s) of edge
// width
// height
// color	color [r,g,b]
// wireframe
// image	texture (drawing or canvas)
//
//===================================================


class Polygon extends Mesh
{	
	constructor( suica, count, center, size, color )
	{
		suica.parser?.parseTags();
		if( count < Suica.DEFAULT.CIRCLE.COUNT )
			suica.debugCall( 'polygon', count, center, size, color );
		else
			suica.debugCall( 'circle', center, size, color );

		suica._.solidGeometry.polygon = []; // array of geometries for different number of sides
		suica._.frameGeometry.polygon = []; // array of geometries for different number of sides

		super( suica, 
			new THREE.Mesh( Polygon.getSolidGeometry(suica,count), Mesh.solidMaterial.clone() ),
			new THREE.LineLoop( Polygon.getFrameGeometry(suica,count), Mesh.lineMaterial.clone() ),
		);
		
		this.center = center;
		this.color = color;
		this.size = size;
		this.n = count;

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
		
		this.solidMesh.geometry = Polygon.getSolidGeometry( this.suica, count );
		this.frameMesh.geometry = Polygon.getFrameGeometry( this.suica, count );
		
		this.threejs.geometry = this.isWireframe ? this.frameMesh.geometry : this.solidMesh.geometry;
	}
	

	static getSolidGeometry( suica, count )
	{
		if( !suica._.solidGeometry.polygon[count] )
			suica._.solidGeometry.polygon[count] = suica.flipNormal( new THREE.CircleGeometry( 0.5, count, -Math.PI*(1/2-1/count) ).applyMatrix4( suica.orientation.MATRIX ) );
		
		return suica._.solidGeometry.polygon[count];
	} // Polygon.getSolidGeometry
	
	
	static getFrameGeometry( suica, count )
	{
		if( !suica._.frameGeometry.polygon[count] )
		{
			suica._.frameGeometry.polygon[count] = new THREE.BufferGeometry();

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
			suica._.frameGeometry.polygon[count].setAttribute( 'position', new THREE.BufferAttribute(vertices,3) );
			suica._.frameGeometry.polygon[count].setAttribute( 'uv', new THREE.BufferAttribute(uvs,2) );
			suica._.frameGeometry.polygon[count].applyMatrix4( suica.orientation.MATRIX );
		}
		
		return suica._.frameGeometry.polygon[count];
	} // Polygon.getFrameGeometry


	get clone( )
	{
		var object = new Polygon( this.suica, this.n, this.center, this.size, this.color );
		
		object.spin = this.spin;
		object.wireframe = this.wireframe;
		object.image = this.image;
		Suica.cloneEvents( object, this );
		
		return object;
		
	} // Polygon.clone
	
} // class Polygon



/*
window.circle = function(
				center = Suica.DEFAULT.CIRCLE.CENTER,
				size   = Suica.DEFAULT.CIRCLE.SIZE,
				color  = Suica.DEFAULT.CIRCLE.COLOR )
{
	Suica.precheck();
	return Suica.current.circle( center, size, color );
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
*/

// window.circle = function( ...params )
// {
	// Suica.precheck();
	// return Suica.current.circle( ...params );
// }




// window.polygon = function( ...params )
// {
	// Suica.precheck();
	// return Suica.current.polygon( ...params );
// }﻿//
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
	constructor( suica, center, size, color )
	{
		suica.parser?.parseTags();
		suica.debugCall( 'sphere', center, size, color );
		
		suica._.solidGeometry.sphere = null; // array of geometries for different number of sides

		if( !suica._.solidGeometry.sphere )
		{
			suica._.solidGeometry.sphere = suica.flipNormal( new THREE.SphereGeometry( 0.5, Suica.DEFAULT.SPHERE.COUNT, Math.round(Suica.DEFAULT.SPHERE.COUNT/2) ).applyMatrix4( suica.orientation.MATRIX ) );
		}
		
		super( suica, 
			new THREE.Mesh( suica._.solidGeometry.sphere, Mesh.solidMaterial.clone() ),
			null, // no wireframe
		);
		
		this.center = center;
		this.color = color;
		this.size = size;

	} // Sphere.constructor


	get clone( )
	{
		var object = new Sphere( this.suica, this.center, this.size, this.color );
		
		object.spin = this.spin;
		object.image = this.image;
		Suica.cloneEvents( object, this );
			
		return object;
		
	} // Sphere.clone
	
} // class Sphere



/*
window.sphere = function(
				center = Suica.DEFAULT.SPHERE.CENTER,
				size   = Suica.DEFAULT.SPHERE.SIZE,
				color  = Suica.DEFAULT.SPHERE.COLOR )
{
	Suica.precheck();
	return Suica.current.sphere( center, size, color );
}
*/

// window.sphere = function( ...params )
// {
	// Suica.precheck();
	// return Suica.current.sphere( ...params );
// }
﻿//
// Suica 2.0 Cylinder
// CC-3.0-SA-NC
//
// cylinder( center, size, color )
// prism( center, size, color )
//
// <cylinder id="" center="" size="" color="" wireframe=""> 
// <prism id="" center="" size="" color="">
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
// wireframe
// image	texture (drawing or canvas)
//
//===================================================


class Prism extends Mesh
{
	constructor( suica, count, center, size, color, flatShading )
	{
		suica.parser?.parseTags();
		if( flatShading )
			suica.debugCall( 'prism', count, center, size, color );
		else
			suica.debugCall( 'cylinder', center, size, color );
	
		suica._.solidGeometry.prism = []; // array of geometries for different number of sides
		suica._.frameGeometry.prism = []; // array of geometries for different number of sides

		super( suica, 
			new THREE.Mesh( Prism.getSolidGeometry(suica,count), flatShading ? Mesh.flatMaterial.clone() : Mesh.solidMaterial.clone() ),
			new THREE.LineSegments( Prism.getFrameGeometry(suica,count), Mesh.lineMaterial.clone() ),
		);
		
		this.center = center;
		this.color = color;
		this.size = size;
		this.n = count;
		this.flatShading = flatShading;
		
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
		
		this.solidMesh.geometry = Prism.getSolidGeometry( count );
		this.frameMesh.geometry = Prism.getFrameGeometry( count );
		
		this.threejs.geometry = this.isWireframe ? this.frameMesh.geometry : this.solidMesh.geometry;
	}
	
	
	static getSolidGeometry( suica, count )
	{
		if( !suica._.solidGeometry.prism[count] )
			suica._.solidGeometry.prism[count] = suica.flipNormal( new THREE.CylinderGeometry( 0.5, 0.5, 1, count, 1, false ).translate(0,0.5,0).applyMatrix4( suica.orientation.MATRIX ) );
		
		return suica._.solidGeometry.prism[count];
	} // Prism.getSolidGeometry
	
	
	static getFrameGeometry( suica, count )
	{
		if( !suica._.frameGeometry.prism[count] )
		{
			suica._.frameGeometry.prism[count] = new THREE.BufferGeometry();

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
			suica._.frameGeometry.prism[count].setAttribute( 'position', new THREE.BufferAttribute(vertices,3) );
			suica._.frameGeometry.prism[count].setAttribute( 'uv', new THREE.BufferAttribute(uvs,2) );
			suica._.frameGeometry.prism[count].applyMatrix4( suica.orientation.MATRIX );
		}
		
		return suica._.frameGeometry.prism[count];
	} // Prism.getFrameGeometry


	get clone( )
	{
		var object = new Prism( this.suica, this.n, this.center, this.size, this.color, this.flatShading );
		
		object.spin = this.spin;
		object.wireframe = this.wireframe;
		object.image = this.image;
		Suica.cloneEvents( object, this );
		
		return object;
		
	} // Prism.clone
	
} // class Prism



/*
window.cylinder = function(
				center = Suica.DEFAULT.CYLINDER.CENTER,
				size   = Suica.DEFAULT.CYLINDER.SIZE,
				color  = Suica.DEFAULT.CYLINDER.COLOR )
{
	Suica.precheck();
	return Suica.current.cylinder( center, size, color );
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
*/

// window.cylinder = function( ...params )
// {
	// Suica.precheck();
	// return Suica.current.cylinder( ...params );
// }



// window.prism = function( ...params )
// {
	// Suica.precheck();
	// return Suica.current.prism( ...params );
// }
﻿//
// Suica 2.0 Cone
// CC-3.0-SA-NC
//
// cone( center, size, color )
// pyramid( center, size, color )
// pyramidFrame( center, size, color )
//
// <cone id="" center="" size="" color="" wireframe=""> 
// <pyramid id="" center="" size="" color="">
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
// wireframe
// image	texture (drawing or canvas)
//
//===================================================


class Pyramid extends Mesh
{
	constructor( suica, count, center, size, color, flatShading )
	{
		suica.parser?.parseTags();
		if( flatShading )
			suica.debugCall( 'pyramid', count, center, size, color );
		else
			suica.debugCall( 'cone', center, size, color );
	
		suica._.solidGeometry.pyramid = []; // array of geometries for different number of sides
		suica._.frameGeometry.pyramid = []; // array of geometries for different number of sides
	
		super( suica, 
			new THREE.Mesh( Pyramid.getSolidGeometry(suica,count), flatShading ? Mesh.flatMaterial.clone() : Mesh.solidMaterial.clone() ),
			new THREE.LineSegments( Pyramid.getFrameGeometry(suica,count), Mesh.lineMaterial.clone() ),
		);
		
		this.center = center;
		this.color = color;
		this.size = size;
		this.n = count;
		this.flatShading = flatShading;

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
		
		this.solidMesh.geometry = Pyramid.getSolidGeometry( this.suica, count );
		this.frameMesh.geometry = Pyramid.getFrameGeometry( this.suica, count );
		
		this.threejs.geometry = this.isWireframe ? this.frameMesh.geometry : this.solidMesh.geometry;
	}
	
	
	static getSolidGeometry( suica, count )
	{
		if( !suica._.solidGeometry.pyramid[count] )
		{
			suica._.solidGeometry.pyramid[count] = suica.flipNormal( new THREE.ConeGeometry( 0.5, 1, count, 1, false ).translate(0,0.5,0).applyMatrix4( suica.orientation.MATRIX ) );
		}
		
		return suica._.solidGeometry.pyramid[count];
	} // Pyramid.getSolidGeometry


	static getFrameGeometry( suica, count )
	{
		if( !suica._.frameGeometry.pyramid[count] )
		{
			suica._.frameGeometry.pyramid[count] = new THREE.BufferGeometry();

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
			suica._.frameGeometry.pyramid[count].setAttribute( 'position', new THREE.BufferAttribute(vertices,3) );
			suica._.frameGeometry.pyramid[count].setAttribute( 'uv', new THREE.BufferAttribute(uvs,2) );
			suica._.frameGeometry.pyramid[count].applyMatrix4( suica.orientation.MATRIX );
		}
		
		return suica._.frameGeometry.pyramid[count];
	} // Pyramid.getFrameGeometry


	get clone( )
	{
		var object = new Pyramid( this.suica, this.n, this.center, this.size, this.color, this.flatShading );

		object.spin = this.spin;
		object.wireframe = this.wireframe;
		object.image = this.image;
		Suica.cloneEvents( object, this );
		
		return object;
		
	} // Pyramid.clone
	
} // class Pyramid



/*
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
*/

// window.cone = function( ...params )
// {
	// Suica.precheck();
	// return Suica.current.cone( ...params );
// }



// window.pyramid = function( ...params )
// {
	// Suica.precheck();
	// return Suica.current.pyramid( ...params );
// }
﻿//
// Suica 2.0 Group
// CC-3.0-SA-NC
//
// new Group( suica, elements )
//
//
//	center		center [x,y,z]
//	x			x coordinate of center
//	y			y coordinate of center
//	z			z coordinate of center
//	size		size / [height,width,depth]
//	spin
//
//===================================================


class Group
{
	constructor( suica, ...groupElements )
	{
		suica.debugCall( 'group' );

		this.suica = suica;
		
		this.threejs = new THREE.Group();
		this.threejs.suicaObject = this;
		this.groupElements = [];
		
		// [width, height, depth]
		this.meshSize = [1, 1, 1];
		this.meshSpin = [0, 0, 0];

		this.add( ...groupElements );
		
		suica.scene.add( this.threejs );
	}



	add( ...groupElements )
	{
		for( var oneElement of groupElements )
		{
			this.groupElements.push( oneElement );
			this.threejs.add( oneElement.threejs );
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
		this.threejs.position.set( ...center );
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




	style( properties )
	{
		for( var n in properties ) this[n] = properties[n];
		return this;
		
	} // Group.style




	updateOrientation( )
	{
		var spin = this.meshSpin;
		if( !spin ) return;

		var flip = 1;
		switch( this.suica.orientation )
		{
			//case Suica.ORIENTATIONS.XYZ: 
			case Suica.ORIENTATIONS.XZY: flip = -1; break;
			case Suica.ORIENTATIONS.YXZ: flip = -1; break;
			//case Suica.ORIENTATIONS.YZX:
			//case Suica.ORIENTATIONS.ZXY:
			case Suica.ORIENTATIONS.ZYX: flip = -1; break;
		};
		
		this.threejs.rotation.set( 0, 0, 0 );
		if( Array.isArray(spin) )
		{
			if( spin[0] ) this.threejs.rotateOnAxis( this.suica.orientation.UP, radians(flip*spin[0]) );
			if( spin[1] ) this.threejs.rotateOnAxis( this.suica.orientation.RIGHT, radians(flip*spin[1]) );
			if( spin[2] ) this.threejs.rotateOnAxis( this.suica.orientation.UP, radians(flip*spin[2]) );
		}
		else
		{
			this.threejs.rotateOnAxis( this.suica.orientation.UP, radians(flip*spin) );
		}

	} // Group.updateOrientation

	
	get spin( )
	{
		return this.meshSpin;
	}

	set spin( spin )
	{
		this.meshSpin = Suica.parseSize( spin );
		this.updateOrientation();
	}
	
	get spinH( )
	{
		return this.meshSpin[0];
	}

	set spinH( spin )
	{
		this.meshSpin[0] = Number( spin );
		this.updateOrientation();
	}
	

	get spinV( )
	{
		return this.meshSpin[1];
	}

	set spinV( spin )
	{
		this.meshSpin[1] = Number( spin );
		this.updateOrientation();
	}
	

	get spinT( )
	{
		return this.meshSpin[2];
	}

	set spinT( spin )
	{
		this.meshSpin[2] = Number( spin );
		this.updateOrientation();
	}
	

	addEventListener( type, listener, aux )
	{
		if( aux ) console.warn( 'Suica objects do not support third parameter of addEventListener');
		
		if( !type.startsWith('on') )
			type = 'on'+type;
		
		this[type.toLowerCase()] = listener;
	}
	

	removeEventListener( type, listener, aux )
	{
		if( listener ) console.warn( 'Suica objects do not support second parameter of removeEventListener');
		if( aux ) console.warn( 'Suica objects do not support third parameter of removeEventListener');

		if( !type.startsWith('on') )
			type = 'on'+type;
		
		this[type.toLowerCase()] = null;
	}
	
	
	
	set color( color )
	{
		for( var oneElement of this.groupElements )
		{
			oneElement.color = color;
		}
	}
	
	
	get clone( )
	{
		var object = new Group( this.suica );
		for( var oneElement of this.groupElements )
		{
			object.add( oneElement.clone );
		}
		object.center = this.center;
		object.size = this.size;
		object.spin = this.spin;
		Suica.cloneEvents( object, this );

		return object;
		
	} // Group.clone
	
} // class Group








// window.group = function( ...groupElements )
// {
	// Suica.precheck();
	// return Suica.current.group( ...groupElements );
// }

﻿//
// Suica 2.0 Tube
// CC-3.0-SA-NC
//
//
//===================================================



// based on THREE.TubeGeometry
class SuicaTubeGeometry extends THREE.BufferGeometry
{
	constructor( path, tubularSegments, radialSegments, radius )
	{
		super();

		this.parameters = {
			path: path,
			tubularSegments: tubularSegments,
			radialSegments: radialSegments,
			radius: radius,
		};

		// number of vertices
		var count = (tubularSegments+1)*(radialSegments+1);

		// indexed faces
		{
			var indices = [];
			for( var j=1; j<=tubularSegments; j++ )
				for ( var i=1; i<=radialSegments; i++ )
				{
					var a = (radialSegments+1)*(j-1) + (i-1),
						b = (radialSegments+1)*(j)   + (i-1),
						c = (radialSegments+1)*(j)   + (i),
						d = (radialSegments+1)*(j-1) + (i);

					// faces
					indices.push( a, b, d );
					indices.push( b, c, d );
				}
			this.setIndex( indices );
		}
		
		// texture coordinates
		{
			var uvs = new THREE.Float32BufferAttribute( new Array(2*count), 2 );
			for( var i=0, idx=0; i<=tubularSegments; i++ )
				for ( var j=0; j<=radialSegments; j++ )
					uvs.setXY( idx++, i/tubularSegments, j/radialSegments );
			this.setAttribute( 'uv', uvs );
		}
		
		// positions and normals
		{
			this.setAttribute( 'position', new THREE.Float32BufferAttribute( new Array(3*count), 3 ) );
			this.setAttribute( 'normal', new THREE.Float32BufferAttribute( new Array(3*count), 3 ) );
			this.update( path );
		}
		
	} // SuicaTubeGeometry.constructor


	update( path/*, closed*/ )
	{
		var tubularSegments = this.parameters.tubularSegments,
			radialSegments = this.parameters.radialSegments,
			radius = this.parameters.radius;

		var frames = path.computeFrenetFrames( tubularSegments, false/*closed*/ );

		// expose internals
		this.tangents = frames.tangents;
		this.normals = frames.normals;
		this.binormals = frames.binormals;

		// helper variables
		var vertex = new THREE.Vector3(),
			normal = new THREE.Vector3(),
			p = new THREE.Vector3();

		// update buffer data
		var pos = this.getAttribute( 'position' ),
			nor = this.getAttribute( 'normal' );

		for( var i=0, idx=0; i<=tubularSegments; i++ )
		{
			p = path.getPointAt( i/tubularSegments, p );

			var N = frames.normals[i];
			var B = frames.binormals[i];

			for( var j=0; j<=radialSegments; j++ )
			{
				var v = j/radialSegments * 2*Math.PI;

				var sin = Math.sin(v),
					cos = - Math.cos(v);

				normal.x = cos*N.x + sin*B.x;
				normal.y = cos*N.y + sin*B.y;
				normal.z = cos*N.z + sin*B.z;
				normal.normalize();

				nor.setXYZ( idx, normal.x, normal.y, normal.z );

				var rad = p.radius || radius;

				vertex.x = p.x + rad*normal.x;
				vertex.y = p.y + rad*normal.y;
				vertex.z = p.z + rad*normal.z;

				pos.setXYZ( idx, vertex.x, vertex.y, vertex.z );
				
				idx++;
			}
		}
		
		pos.needsUpdate = true;
		nor.needsUpdate = true;		
		
	} // SuicaTubeGeometry.update

} // SuicaTubeGeometry




class SuicaCurve extends THREE.Curve
{
	constructor( curve )
	{
		super();
		
		if( curve instanceof SuicaSplineCurve )
		{
			this.spline = curve;
		}
		else
		if( curve instanceof Array )
		{
			this.spline = new SuicaSplineCurve( curve );
		}
		else
		{
			this._getPoint = curve;
		}
	} // SuicaCurve.constructor

	
	getPoint( u, optionalTarget = new THREE.Vector3() )
	{
		var point = this.spline?.getPoint( u ) || this._getPoint( u );
		optionalTarget.set( point[0]||0, point[1]||0, point[2]||0 );
		optionalTarget.radius = point[3];
		return optionalTarget;
	} // SuicaCurve.getPoint
	
} // SuicaCurve




class SuicaSplineCurve extends THREE.Curve
{

	constructor( points=Suica.DEFAULT.SPLINE.POINTS, closed=Suica.DEFAULT.SPLINE.CLOSED, interpolant=Suica.DEFAULT.SPLINE.INTERPOLANT  )
	{

		super();
		
		if( !points.length ) points = Suica.DEFAULT.SPLINE.POINTS;
		
		this.closed = closed;
		this.interpolant = interpolant;
		this.points = points;
	} // SuicaSplineCurve.constructor


	getPoint( t )
	{

		var points = this.points,
			p = (points.length-(this.closed?0:1)) * t;
		var intPoint = Math.floor( p ),
			t = p - intPoint,
			t2 = t*t,
			t3 = t2*t;

		var p0, p1, p2, p3;
		
		if( this.closed )
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

		var splineFunction = this.interpolant ? catmullRom : bSpline;
		
		var point = [
			splineFunction( p0[0], p1[0], p2[0], p3[0] ),
			splineFunction( p0[1], p1[1], p2[1], p3[1] ),
			splineFunction( p0[2], p1[2], p2[2], p3[2] )	
		];

		if( typeof p0[3] !== 'undefined' )
			point.push( splineFunction( p0[3], p1[3], p2[3], p3[3] ) );
		
		return point;
	} // SuicaSplineCurve.getPoint
	
} // SuicaSplineCurve




window['spline'] = function( points, closed=Suica.DEFAULT.SPLINE.CLOSED, interpolant=Suica.DEFAULT.SPLINE.INTERPOLANT )
{
	return new SuicaSplineCurve( points, closed, interpolant );
}


class Tube extends Mesh
{
	constructor( suica, center=Suica.DEFAULT.TUBE.CENTER, curveFunction=Suica.DEFAULT.TUBE.POINTS, radius, count=Suica.DEFAULT.TUBE.COUNT, size=Suica.DEFAULT.TUBE.SIZE, color=Suica.DEFAULT.TUBE.COLOR )
	{
		suica.parser?.parseTags();
		suica.debugCall( 'tube', center, curveFunction.name+'()', radius, count, size, color );

		if( !radius && radius!==0 )
			radius = Suica.DEFAULT.TUBE.RADIUS;
		
		if( Array.isArray(curveFunction) )
			curveFunction = new SuicaSplineCurve( curveFunction );
		
		var tubularSegments, radialSegments;
		
		count = Suica.parseSize( count );
		if( Array.isArray(count) )
		{
			tubularSegments = count[0] || Suica.DEFAULT.TUBE.COUNT[0];
			radialSegments  = count[1] || Suica.DEFAULT.TUBE.COUNT[1];
		}
		else
		{
			tubularSegments = count || Suica.DEFAULT.TUBE.COUNT[0];
			radialSegments  = Suica.DEFAULT.TUBE.COUNT[1];
		}

		var curve = new SuicaCurve( curveFunction ),
			geometry = new SuicaTubeGeometry( curve, tubularSegments, radialSegments, radius );
		
		super( suica, 
			new THREE.Mesh( geometry, Mesh.solidMaterial.clone() ),
			null, // no wireframe
		);
		
		this.curveFunction = curve;
		this.center = center;
		this.color = color;
		this.size = size;
		this._radius = radius;

	} // Tube.constructor

	get radius( )
	{
		return this._radius;
	}

	set radius( radius )
	{
		this._radius = radius;
		this.threejs.geometry.parameters.radius = radius;
		this.threejs.geometry.update( this.curveFunction );
	}
	
	
	set curve( curveFunction )
	{
		if( Array.isArray(curveFunction) )
			curveFunction = new SuicaSplineCurve( curveFunction );

		this.curveFunction = new SuicaCurve( curveFunction );

		this.threejs.geometry.update( this.curveFunction );
	}
	
	
	get clone( )
	{
		var object = new Tube( this.suica, this.center, this.curveFunction, this.radius, this.size, this.color );
		
		object.spin = this.spin;
		object.image = this.image;

		Suica.cloneEvents( object, this );
			
		return object;
		
	} // Tube.clone
	
} // class Tube
} // LoadSuica 
