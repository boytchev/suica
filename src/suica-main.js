//
// Suica 3.0
//
//===================================================


import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

import { ANAGLYPH, checkSuicaExists, CIRCLECOUNT, evaluate, eventCall, ORIENTATIONS, ORTHOGRAPHIC, parseCenter, parseColor, parseNumber, PERSPECTIVE, STEREO } from './suica-globals.js';
import { HTMLParser } from './suica-parser.js';
import { Mesh } from './suica-mesh.js';
import { Cube } from './suica-cube.js';
import { Circle, Polygon } from './suica-circle.js';
import { Cone, Pyramid } from './suica-cone.js';
import { Line } from './suica-line.js';
import { Point } from './suica-point.js';
import { Square } from './suica-square.js';
import { Sphere } from './suica-sphere.js';
import { Group } from './suica-group.js';
import { Tube } from './suica-tube.js';
import { Cylinder, Prism } from './suica-cylinder.js';
import { Convex } from './suica-convex.js';
import { Surface } from './suica-surface.js';
import { Extrude } from './suica-extrude.js';
import { Model } from './suica-model.js';
import { shape } from './suica-shape.js';
import { Text3D } from './suica-text3d.js';
import { Capture } from './suica-capture.js';
import { AnaglyphEffect, createFSButton, StereoEffect } from './suica-vr.js';
import { Construct } from './suica-construct.js';


// control flags
const DEBUG_CALLS = false;
const TEST_MODE = typeof SUICA_TEST_MODE !== 'undefined';

const SUICA_VERSION = '3.0';


// show suica version
if ( TEST_MODE ) {

	console.log( '::> suica' );

} else
	console.log( `(\\/)
( ..)
c(")(")		 Suica ${SUICA_VERSION}
` );


// SUICA_TEST_MODE must be declared before loading suica.js:
//
// 	SUICA_TEST_MODE
//		- right click on canvas is allowed
//		- preserveDrawingBuffer in renderer set to  true
//		- time is rounded to 0.05s





function registerMethodAsGlobalFunction( suica, methodName ) {

	window[ methodName ] = function ( ...params ) {

		checkSuicaExists();
		return suica[ methodName ]( ...params );

	};

}


//========================================================================
//
// class Suica
//
// Implements custom tag <suica> and creates a tag <canvas> inside it
//
//========================================================================

class Suica {

	// array of all Suicas
	static allSuicas = [];

	// coordinate system orientations

	static globalHoverObject; // used to track mouse enter/leave for Suica objects
	static globalHoverEvent; // used to track mouse enter/leave for Suica objects while demo()

	flipNormal( geometry ) {

		if ( this.orientation.FLIP_NORMAL ) {

			var nor = geometry.getAttribute( 'normal' ).array;
			for ( var i=0; i<nor.length; i++ )
				nor[ i ] = -nor[ i ];

		}

		return geometry;

	} // Suica.flipNormal


	// default values for Suica commands
	static OXYZ = { COLOR: 'black', SIZE: 30 };
	static DEMO = { DISTANCE: 100, ALTITUDE: 30, SPEED: 1 };
	static ORBIT = { DISTANCE: 100, ALTITUDE: 30, SPEED: 0 };
	static TRACKBALL = { DISTANCE: 100, ALTITUDE: 30 };
	static BACKGROUND = 'whitesmoke';
	static DEFAULT_ORIENTATION = 'XYZ';

	constructor( suicaTag ) {

		if ( suicaTag.getAttribute( 'suica-auto-generated' ) ) {

			return window.suica;

		}

		this.isSuica = true;

		// internal storage
		this._ = {
			solidGeometry: {},
			frameGeometry: {},
		};

		// fix styling of <suica>
		if ( getComputedStyle( suicaTag ).display == 'inline' )
			suicaTag.style.display = 'inline-block';

		suicaTag.style.boxSizing = 'border-box';
		suicaTag.setAttribute( 'suica-auto-generated', true );

		if ( getComputedStyle( suicaTag ).width == 'auto' ) {

			if ( suicaTag.hasAttribute( 'width' ) )
				suicaTag.style.width = suicaTag.getAttribute( 'width' )+'px';
			else
				suicaTag.style.width = TEST_MODE?'400px':'500px';

		}

		if ( getComputedStyle( suicaTag ).height == 'auto' ) {

			if ( suicaTag.hasAttribute( 'height' ) )
				suicaTag.style.height = suicaTag.getAttribute( 'height' )+'px';
			else
				suicaTag.style.height = TEST_MODE?'400px':'300px';

		}

		if ( !suicaTag.style.position ) suicaTag.style.position = 'relative';

		// get or invent id
		this.id = suicaTag.getAttribute( 'id' ) || `suica${Suica.allSuicas.length}`;
		if ( DEBUG_CALLS ) console.log( `Suica :: ${this.id}` );

		this.suicaTag = suicaTag;
		this.isProactive = false;

		//		this.capturer = null;

		// set Suica orientation data
		this.orientation = ORIENTATIONS[ suicaTag.getAttribute( 'ORIENTATION' )?.toUpperCase() || Suica.DEFAULT_ORIENTATION ];
		this.orientation.MATRIX = new THREE.Matrix4().makeBasis( this.orientation.RIGHT, this.orientation.UP, this.orientation.FORWARD );
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
		window[ this.id ] = this; // as global variable

		//		this.debugObject = new THREE.Mesh( new THREE.SphereGeometry(5), new THREE.MeshPhongMaterial({color:'orange', shininess:200}));
		//		this.scene.add( this.debugObject );

		// interactivity manager
		this.canvas.addEventListener( 'pointermove', Suica.onPointerMove );
		this.canvas.addEventListener( 'pointerdown', Suica.onPointerDown );
		this.canvas.addEventListener( 'pointerup', Suica.onPointerUp );
		this.canvas.addEventListener( 'click', Suica.onClick );
		//this.canvas.addEventListener( 'dblclick', Suica.onDblClick );

		if ( TEST_MODE ) {

			THREE.MathUtils.seededRandom( 1 ); // fixed seed, so random number will be the same

		} else {

			this.canvas.addEventListener( 'contextmenu', Suica.onContextMenu );
			THREE.MathUtils.seededRandom( Math.round( Number.MAX_SAFE_INTEGER*Math.random() ) );

		}


		// register local methods that have stereotypical code
		for ( var classObject of [ Point, Line, Square, Cube, Polygon, Sphere, Group, Tube, Surface, Prism, Cylinder, Cone, Pyramid, Circle, Convex, Extrude, Model, Construct, Text3D, Capture ]) {

			Suica.registerClass( this, classObject );

		}

		// register some local methods as public global functions
		for ( var methodName of [ 'cube', 'square', 'sphere', 'point', 'line', 'group', 'cylinder', 'prism', 'cone', 'pyramid', 'circle', 'polygon', 'tube', 'surface', 'lookAt', 'fullScreen', 'fullWindow', 'proactive', 'anaglyph', 'stereo', 'perspective', 'orthographic', 'lookAt', 'background', 'oxyz', 'demo', 'allObjects', 'convex', 'extrude', 'model', 'construct', 'text3d', 'capture', 'orbit', 'trackball' ])
			registerMethodAsGlobalFunction( this, methodName );

		// manual fix of some special functions
		// (`save` is a static method of `Model`)
		if ( this.model ) {

			this.model.save = function ( ...params ) {

				this.parser?.parseTags();
				return Model.save( ...params );

			};

			window.model.save = function ( ...params ) {

				checkSuicaExists();
				return Model.save( ...params );

			};

		}

		if ( window.onSuicaCreated )
			window.onSuicaCreated( this );

	} // Suica.constructor


	static registerClass( suica, classObject ) {

		suica[ classObject.name.toLowerCase() ] = function ( ...params ) {

			window.suica.parser?.parseTags();
			return new classObject( suica, ...params );

		};

	}




	// create canvas element inside <suica> (if it does not exist)
	createCanvas() {

		// calculates size - if size is not defined in CSS,
		// than use <suica> attributes, or default values
		if ( this.suicaTag.clientWidth < 1 )
			this.suicaTag.style.width = ( this.suicaTag.getAttribute( 'width' ) || ( TEST_MODE?400:500 ) ) + 'px';

		if ( this.suicaTag.clientHeight < 1 )
			this.suicaTag.style.height = ( this.suicaTag.getAttribute( 'height' ) || ( TEST_MODE?400:300 ) ) + 'px';

		// create canvas element
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
	resizeCanvas() {

		var w = this.suicaTag.clientWidth,
			h = this.suicaTag.clientHeight;

		if ( this.controls instanceof TrackballControls ) {

			this.controls.handleResize( );

		}

		if ( this.camera instanceof THREE.PerspectiveCamera ) {

			this.camera.aspect = w/h;

		} else
			if ( this.camera instanceof THREE.OrthographicCamera ) {

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
	get canvasAspect( ) {

		return this.canvas.width / this.canvas.height;

	} // Suica.canvasAspect


	// render the current scene
	render( ) {

		if ( this.uberRenderer )
			this.uberRenderer.render( this.scene, this.camera );
		else
			this.renderer.render( this.scene, this.camera );

	} // Suica.render


	// create Three.js renderer bound to <canvas>
	createRenderer( ) {

		// renderer with antialias and alpha
		this.renderer = new THREE.WebGLRenderer( {
			canvas: this.canvas,
			alpha: true,
			antialias: true,
			preserveDrawingBuffer: TEST_MODE,
		} );

		this.renderer.outputColorSpace = THREE.SRGBColorSpace;

		// renderer with effects; if set, it is used instead of the normal renderer
		this.uberRenderer = null;

		// scene with background from <suica>'s CSS
		this.scene = new THREE.Scene();

		this.scene.scale.copy( this.orientation.SCALE );

		var color = getComputedStyle( this.suicaTag ).backgroundColor;
		if ( color == 'rgba(0, 0, 0, 0)' ) {

			color = this.suicaTag.getAttribute( 'BACKGROUND' ) || Suica.BACKGROUND;

		}

		this.scene.background = parseColor( color );


		// set camera
		this.vrCamera = new THREE.Group();
		this.perspective();


		for ( var attribute of this.suicaTag.getAttributeNames() ) {

			var value = this.suicaTag.getAttribute( attribute );

			switch ( attribute.toUpperCase() ) {

				case 'PERSPECTIVE':
					this.perspective( ... evaluate( '['+value+']' ) );
					break;
				case 'ORTHOGRAPHIC':
					this.orthographic( ... evaluate( '['+value+']' ) );
					break;
				case 'ANAGLYPH':
					this.anaglyph( ... evaluate( '['+value+']' ) );
					break;
				case 'STEREO':
					this.stereo( ... evaluate( '['+value+']' ) );
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
		this.light = new THREE.DirectionalLight( 'white', 0.9*Math.PI );
		this.light.position.set( 0, 0, 10 );
		this.light.decay = 0;
		//		this.light.angle = Math.PI/2;
		this.light.target = new THREE.Object3D();

		//		this.light.decay = 0;
		this.scene.add( this.light, this.light.target );

		// ambient light
		this.scene.add( new THREE.AmbientLight( 'white', Math.PI-this.light.intensity ) );

		// main animation loop
		var that = this;
		this.lastTime = 0;


		function adjustOrbitControls( ) {

			that.camera.up.copy( that.orientation.UP );
			that.controls.update( );

			that.light.position.copy( that.camera.position );
			that.light.target.position.set( 0, 0, 0 );

			if ( that.orientation==ORIENTATIONS.YXZ ) that.light.position.y *= -1;
			if ( that.orientation==ORIENTATIONS.ZYX ) that.light.position.z *= -1;
			if ( that.orientation==ORIENTATIONS.XZY ) that.light.position.x *= -1;

		}

		function adjustTrackballControls( ) {

			that.controls.update( );
			///			that.light.position.copy( that.camera.position );
			///			that.light.position.multiply( that.orientation.SCALE );

			that.light.position.copy( that.camera.position );
			that.light.target.position.set( 0, 0, 0 );

			if ( that.orientation==ORIENTATIONS.YXZ ) that.light.position.y *= -1;
			if ( that.orientation==ORIENTATIONS.ZYX ) that.light.position.z *= -1;
			if ( that.orientation==ORIENTATIONS.XZY ) that.light.position.x *= -1;

			that.camera.updateMatrixWorld();

		}

		function adjustDemoViewPoint( time ) {

			time *= that.demoViewPoint.speed;

			var cos = -that.demoViewPoint.distance*Math.cos( time ),
				up = that.demoViewPoint.altitude,
				sin = -that.demoViewPoint.distance*Math.sin( time );

			// rotation is cos->sin, while up is upward
			that.camera.up.copy( that.orientation.UP );
			switch ( that.orientation ) {

				case ORIENTATIONS.YXZ:
					that.camera.position.set( up, cos, sin );
					that.light.position.set( up, -cos, sin );
					break;
				case ORIENTATIONS.ZYX:
					that.camera.position.set( sin, up, cos );
					that.light.position.set( sin, up, -cos );
					break;
				case ORIENTATIONS.XZY:
					that.camera.position.set( cos, sin, up );
					that.light.position.set( -cos, sin, up );
					break;

				case ORIENTATIONS.ZXY:
					that.camera.position.set( up, sin, -cos );
					that.light.position.set( up, sin, -cos );
					break;
				case ORIENTATIONS.XYZ:
					that.camera.position.set( -cos, up, sin );
					that.light.position.set( -cos, up, sin );
					break;
				case ORIENTATIONS.YZX:
					that.camera.position.set( sin, -cos, up );
					that.light.position.set( sin, -cos, up );
					break;
				default: console.error( 'error: Unknown orientation in <suica>' );

			}

			that.light.target.position.set( 0, 0, 0 );

			that.camera.lookAt( that.scene.position );

			//the following line is required for smooth animation on old laptops
			that.camera.updateMatrixWorld();

		}


		function adjustViewPoint( ) {

			var up = [ ...that.viewPoint.up ],
				from = [ ...that.viewPoint.from ],
				to = [ ...that.viewPoint.to ];

			switch ( that.orientation ) {

				case ORIENTATIONS.XZY:
					up[ 0 ] = -up[ 0 ];
					from[ 0 ] = -from[ 0 ];
					to[ 0 ] = -to[ 0 ];
					break;
				case ORIENTATIONS.YXZ:
					up[ 1 ] = -up[ 1 ];
					from[ 1 ] = -from[ 1 ];
					to[ 1 ] = -to[ 1 ];
					break;
				case ORIENTATIONS.ZYX:
					up[ 2 ] = -up[ 2 ];
					from[ 2 ] = -from[ 2 ];
					to[ 2 ] = -to[ 2 ];
					break;

			}

			if ( that.renderer.xr.isPresenting ) {

				that.camera.up.set( 0, 1, 0 );
				that.camera.position.set( 0, 0, 0 );
				that.camera.lookAt( 1, 0, 0 );

				that.vrCamera.up.set( ...up );
				that.vrCamera.position.set( ...to );
				that.vrCamera.lookAt( ...from );
				that.vrCamera.position.set( ...from );

			} else {

				that.vrCamera.up.set( 0, 1, 0 );
				that.vrCamera.lookAt( 0, 0, 1 );
				that.vrCamera.position.set( 0, 0, 0 );

				that.camera.up.set( ...up );
				that.camera.position.set( ...from );
				that.camera.lookAt( ...to );

			}

			//the following line is required for smooth animation on old laptops
			that.camera.updateMatrixWorld();

			that.light.position.copy( that.camera.position );
			that.light.target.position.set( 0, 0, 0 );

			if ( that.orientation==ORIENTATIONS.YXZ ) that.light.position.y *= -1;
			if ( that.orientation==ORIENTATIONS.ZYX ) that.light.position.z *= -1;
			if ( that.orientation==ORIENTATIONS.XZY ) that.light.position.x *= -1;

		} // Suica.adjustViewPoint


		function loop( time ) {

			time /= 1000; // convert miliseconds to seconds

			if ( TEST_MODE ) {

				time = Math.floor( 5*time ) / 5;

			}

			//time=Math.PI/2;

			if ( that.controls instanceof OrbitControls && that.controls.enabled ) {

				adjustOrbitControls( );

			} else
				if ( that.controls instanceof TrackballControls && that.controls.enabled ) {

					adjustTrackballControls( );

				} else
					if ( that.demoViewPoint ) {

						adjustDemoViewPoint( time );

					} else {

						adjustViewPoint( );

					}


			if ( that.ontime ) {

				if ( typeof that.ontime === 'string' || that.ontime instanceof String )
					that.ontime = window[ that.ontime ];

				that.ontime( time, time-that.lastTime );

			}

			if ( that.isProactive /*&& (that.demoViewPoint || that.onTimeHandler)*/ )
				Suica.onPointerMoveUpdate( );

			that.render( );

			//			if ( that.capturer ) that.capturer.capture( );

			that.lastTime = time;

		} // Suica.createRenderer.loop

		this.renderer.setAnimationLoop( loop );

	} // Suica.createRenderer



	vr( ) {

		this.parser?.parseTags();
		this.debugCall( 'vr' );

		var button = this.suicaTag.appendChild( VRButton.createButton( this.renderer ) );
		button.style.background = 'rgba(0, 0, 0, 0.5)';

		this.renderer.xr.enabled = true;

		this.camera.position.set( 0, 0, 0 );
		//		this.camera.lookAt(	0, 0, 0 );

	}


	fullScreen( ) {

		this.parser?.parseTags();
		this.debugCall( 'fullScreen' );

		this.suicaTag.appendChild( createFSButton( this ) );

	}


	fullWindow( ) {

		this.parser?.parseTags();
		this.debugCall( 'fullWindow' );

		this.suicaTag.style.position = 'fixed';
		this.suicaTag.style.width = '100%';
		this.suicaTag.style.height = '100%';
		this.suicaTag.style.left = '0';
		this.suicaTag.style.top = '0';

		this.resizeCanvas();

		var that = this;
		window.addEventListener( 'resize', function () {

			that.resizeCanvas();

		} );

	}


	proactive( ) {

		this.parser?.parseTags();
		this.debugCall( 'proactive' );

		this.isProactive = true;

	}


	anaglyph( distance = ANAGLYPH.DISTANCE ) {

		this.parser?.parseTags();
		this.debugCall( 'anaglyph', distance );

		this.uberRenderer?.dispose();
		this.uberRenderer = new AnaglyphEffect( this, distance );

		this.uberRenderer.colorMatrixLeft.set( 1, 0, 0, 0, 0, 0, 0, 0, 0 );
		this.uberRenderer.colorMatrixRight.set( 0, 0, 0, 0, 1, 0, 0, 0, 1 );

		//effect.setSize( window.innerWidth, window.innerHeight );

	}


	stereo( distance = STEREO.DISTANCE ) {

		this.parser?.parseTags();
		this.debugCall( 'stereo', distance );

		this.uberRenderer?.dispose();
		this.uberRenderer = new StereoEffect( this, distance );
		//effect.setSize( window.innerWidth, window.innerHeight );

	}


	perspective( near=PERSPECTIVE.NEAR, far=PERSPECTIVE.FAR, fov=PERSPECTIVE.FOV ) {

		this.parser?.parseTags();
		this.debugCall( 'perspective', near, far, fov );

		this.vrCamera.remove( this.camera );
		this.camera = new THREE.PerspectiveCamera( fov, this.canvasAspect, near, far );
		this.vrCamera.add( this.camera );
		this.lookAt();
		this.camera.updateProjectionMatrix();

	} // Suica.perspective


	orthographic( near=ORTHOGRAPHIC.NEAR, far=ORTHOGRAPHIC.FAR ) {

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



	lookAt( from, to, up ) {

		this.parser?.parseTags();

		this.viewPoint.from = parseCenter( from, this.orientation.LOOKAT.FROM );
		this.viewPoint.to = parseCenter( to, this.orientation.LOOKAT.TO );
		this.viewPoint.up = parseCenter( up, this.orientation.LOOKAT.UP );

	} // Suica.lookAt


	background( color ) {

		this.parser?.parseTags();
		this.debugCall( 'background', ...arguments );

		this.scene.background = parseColor( color );

	} // Suica.background


	oxyz( size, color ) {

		this.parser?.parseTags();
		this.debugCall( 'oxyz', ...arguments );

		size = parseNumber( size, Suica.OXYZ.SIZE );
		color = parseColor( color, Suica.OXYZ.COLOR );

		var axes = new THREE.AxesHelper( size );
		axes.setColors( color, color, color );
		this.scene.add( axes );

	} // Suica.oxyz


	demo( distance, altitude, speed ) {

		this.parser?.parseTags();
		this.debugCall( 'demo', ...arguments );

		this.demoViewPoint = {
			distance: parseNumber( distance, Suica.DEMO.DISTANCE ),
			altitude: parseNumber( altitude, Suica.DEMO.ALTITUDE ),
			speed: parseNumber( speed, Suica.DEMO.SPEED ),
		};

	} // Suica.demo



	orbit( distance, altitude, speed ) {

		this.parser?.parseTags();
		this.debugCall( 'orbit', ...arguments );

		this.camera.up.copy( this.orientation.UP );
		//this.camera.position.set( ...this.orientation.LOOKAT.FROM );

		var d = parseNumber( distance, Suica.ORBIT.DISTANCE ),
			a = parseNumber( altitude, Suica.ORBIT.ALTITUDE );

		switch ( this.orientation ) {

			case ORIENTATIONS.YXZ:
				this.camera.position.set( a, 0, d );
				break;
			case ORIENTATIONS.ZYX:
				this.camera.position.set( d, a, 0 );
				break;
			case ORIENTATIONS.XZY:
				this.camera.position.set( 0, d, a );
				break;

			case ORIENTATIONS.ZXY:
				this.camera.position.set( a, d, 0 );
				break;
			case ORIENTATIONS.XYZ:
				this.camera.position.set( 0, a, d );
				break;
			case ORIENTATIONS.YZX:
				this.camera.position.set( d, 0, a );
				break;
			default: throw 'error: unknown orientation';

		}

		this.controls = new OrbitControls( this.camera, this.renderer.domElement );

		this.controls.autoRotateSpeed =	-4*parseNumber( speed, Suica.ORBIT.SPEED );
		this.controls.autoRotate = this.controls.autoRotateSpeed!=0;

		this.controls.enablePan = false;

		//		this.controls.update( );

		return this.controls;

	} // Suica.orbit



	trackball( distance, altitude ) {

		this.parser?.parseTags();
		this.debugCall( 'trackball', ...arguments );

		this.camera.up.copy( this.orientation.UP );
		//this.camera.position.set( ...this.orientation.LOOKAT.FROM );

		var d = parseNumber( distance, Suica.TRACKBALL.DISTANCE ),
			a = parseNumber( altitude, Suica.TRACKBALL.ALTITUDE );

		switch ( this.orientation ) {

			case ORIENTATIONS.YXZ:
				this.camera.position.set( a, 0, d );
				break;
			case ORIENTATIONS.ZYX:
				this.camera.position.set( d, a, 0 );
				break;
			case ORIENTATIONS.XZY:
				this.camera.position.set( 0, d, a );
				break;

			case ORIENTATIONS.ZXY:
				this.camera.position.set( a, d, 0 );
				break;
			case ORIENTATIONS.XYZ:
				this.camera.position.set( 0, a, d );
				break;
			case ORIENTATIONS.YZX:
				this.camera.position.set( d, 0, a );
				break;
			default: throw 'error: unknown orientation';

		}

		this.controls = new TrackballControls( this.camera, this.renderer.domElement );

		this.controls.noPan = true;
		this.controls.zoomSpeed = 1.5;
		this.controls.staticMoving = false;

		//		this.controls.update( );

		return this.controls;

	} // Suica.trackball



	debugCall( functionName, ...parameters ) {

		if ( !DEBUG_CALLS ) return;

		for ( var i=0; i<parameters.length; i++ ) {

			if ( Array.isArray( parameters[ i ]) )
				parameters[ i ] = `[${parameters[ i ]}]`;
			else
				if ( typeof parameters[ i ] === 'string' || parameters[ i ] instanceof String )
					parameters[ i ] = `'${parameters[ i ]}'`;
				else
					parameters[ i ] = ''+parameters[ i ];

		}

		console.info( `:: ${this.id}.${functionName}(${parameters.join( ',' )})` );

	} // Suica.debugCall


	point( ...args ) {

		this.parser?.parseTags();
		return new Point( this, ...args );

	} // Suica.point


	line( ...args ) {

		this.parser?.parseTags();
		return new Line( this, ...args );

	} // Suica.line


	square( ...args ) {

		this.parser?.parseTags();
		return new Square( this, ...args );

	} // Suica.square


	cube( ...args ) {

		this.parser?.parseTags();
		return new Cube( this, ...args );

	} // Suica.cube


	construct( ...args ) {

		this.parser?.parseTags();
		return new Construct( this, ...args );

	} // Suica.construct


	capture( ...args ) {

		this.parser?.parseTags();
		return new Capture( this, ...args );

	} // Suica.capture


	text3d( ...args ) {

		this.parser?.parseTags();
		return new Text3D( this, ...args );

	} // Suica.text3d


	surface( ...args ) {

		this.parser?.parseTags();
		return new Surface( this, ...args );

	} // Suica.surface


	model( ...args ) {

		this.parser?.parseTags();
		return new Model( this, ...args );

	} // Suica.model


	convex( ...args ) {

		this.parser?.parseTags();
		return new Convex( this, ...args );

	} // Suica.convex


	extrude( ...args ) {

		this.parser?.parseTags();
		return new Extrude( this, ...args );

	} // Suica.extrude


	circle( ...args ) {

		this.parser?.parseTags();
		return new Circle( this, ...args );

	} // Suica.circle


	polygon( ...args ) {

		this.parser?.parseTags();
		return new Polygon( this, ...args );

	} // Suica.polygon


	sphere( ...args ) {

		this.parser?.parseTags();
		return new Sphere( this, ...args );

	} // Suica.sphere


	cylinder( ...args ) {

		this.parser?.parseTags();
		return new Prism( this, CIRCLECOUNT, ...args, false );

	} // Suica.cylinder


	prism( ...args ) {

		this.parser?.parseTags();
		return new Prism( this, ...args, true );

	} // Suica.prims


	cone( ...args ) {

		this.parser?.parseTags();
		return new Pyramid( this, CIRCLECOUNT, ...args, false );

	} // Suica.cone


	pyramid( ...args ) {

		this.parser?.parseTags();
		return new Pyramid( this, ...args, true );

	} // Suica.pyramid


	group( ...args ) {

		this.parser?.parseTags();
		return new Group( this, ...args );

	} // Suica.group


	tube( ...args ) {

		this.parser?.parseTags();
		return new Tube( this, ...args );

	} // Suica.tube

	findPosition( domEvent ) {

		var canvas = domEvent.target;

		console.assert( canvas == this.canvas );

		// get pixel position withing the Suica canvas
		var rect = canvas.getBoundingClientRect(),
			pixelX = Math.floor( domEvent.clientX - rect.left ),
			pixelY = Math.floor( domEvent.clientY - rect.top );

		// get relative pixel position (ie. [-1,+1])
		this.raycastPointer.x = 2*pixelX/canvas.clientWidth - 1;
		this.raycastPointer.y = -2*pixelY/canvas.clientHeight + 1;

		return [ pixelX-canvas.clientWidth/2, -pixelY+canvas.clientHeight/2, 0 ];

	}


	allObjects( ) {

		var foundObjects = [];

		for ( var threejsObject of this.scene.children ) {

			if ( threejsObject.suicaObject )
				foundObjects.push( threejsObject.suicaObject );

		}

		return foundObjects;

	}


	findObjects( domEvent, onlyInteractive = false ) {

		var scanObjects = [],
			autoObjects = true;

		// if onlyInteractive is an array, then elements are the scan objects

		if ( onlyInteractive instanceof Array ) {

			autoObjects = false; // list of scan objects are not automatically generated
			for ( let object of onlyInteractive )
				scanObjects.push( object.threejs );
			onlyInteractive = false;

		} else
			if ( onlyInteractive ) {

				for ( let object of this.scene.children ) {

					let suicaObject = object.suicaObject;
					if ( !suicaObject ) continue;

					if ( suicaObject.onpointermove ||
					suicaObject.onpointerdown ||
					suicaObject.onpointerup ||
					suicaObject.onpointerenter ||
					suicaObject.onpointerleave ||
					suicaObject.onclick )
						scanObjects.push( object );

				}

			} else {

				scanObjects = this.scene.children;

			}

		// sets this.raycastPointer
		findPosition( domEvent );

		// cast a ray and find intersection with all objects
		this.raycaster.setFromCamera( this.raycastPointer, this.camera );
		var intersects = this.raycaster.intersectObjects( scanObjects, true );

		// construct a list of all intersected objects
		var foundObjects = [];

		for ( var intersection of intersects ) {

			let suicaObject = null;

			if ( autoObjects ) {

				// get the topmost Suica object
				for ( let object=intersection.object; object; object=object.parent ) {

					suicaObject = object.suicaObject || suicaObject;

				}

			} else {

				// get the closest parent with a Suica object attached
				for ( let object=intersection.object; object; object=object.parent ) {

					suicaObject = object.suicaObject;
					if ( scanObjects.indexOf( object ) > -1 ) break;

				}

			}

			// if the object has Suica object that is not found,
			// add it to the list of found objects
			if ( suicaObject )
				if ( foundObjects.indexOf( suicaObject ) < 0 ) {

					suicaObject.intersectData = intersection;
					foundObjects.push( suicaObject );

				}

		}

		return foundObjects;

	}


	findObject( domEvent, onlyInteractive = false ) {

		var objects = this.findObjects( domEvent, onlyInteractive );

		if ( objects.length )
			return objects[ 0 ];

		return null;

	}


	addEventListener( type, listener, aux ) {

		if ( aux ) console.warn( 'Suica canvas does not support third parameter of addEventListener' );

		if ( !type.startsWith( 'on' ) )
			type = 'on'+type;

		this[ type.toLowerCase() ] = listener;

	}

	removeEventListener( type, listener, aux ) {

		if ( listener ) console.warn( 'Suica canvas does not support second parameter of removeEventListener' );
		if ( aux ) console.warn( 'Suica canvas does not support third parameter of removeEventListener' );

		if ( !type.startsWith( 'on' ) )
			type = 'on'+type;

		this[ type.toLowerCase() ] = null;

	}

	static addEventListener( type, listener, aux ) {

		/*Suica.current*/window.suica.addEventListener( type, listener, aux );

	}

	static removeEventListener( type, listener, aux ) {

		/*Suica.current*/window.suica.removeEventListener( type, listener, aux );

	}


	static onPointerMove( event ) {

		Suica.globalHoverEvent = event;

		var object = findObject( event, true );

		if ( Suica.hoverObject ) {

			if ( object == Suica.hoverObject ) {

				eventCall( object, 'onpointermove', event );

			} else {

				eventCall( Suica.hoverObject, 'onpointerleave', event );
				Suica.hoverObject = object;
				eventCall( Suica.hoverObject, 'onpointerenter', event );

			}

		} else {

			Suica.hoverObject = object;
			eventCall( Suica.hoverObject, 'onpointerenter', event );

		}

	} // Suica.onPointerMove


	static onPointerMoveUpdate( ) {

		// this method updates mouseenter/leave cause by change in viewpoint

		if ( !Suica.globalHoverEvent ) return;

		var event = Suica.globalHoverEvent;

		var object = findObject( event, true );
		if ( Suica.hoverObject ) {

			if ( object != Suica.hoverObject ) {

				eventCall( Suica.hoverObject, 'onpointerleave', event );
				Suica.hoverObject = object;
				eventCall( Suica.hoverObject, 'onpointerenter', event );

			}

		} else {

			Suica.hoverObject = object;
			eventCall( Suica.hoverObject, 'onpointerenter', event );

		}

	} // Suica.onPointerMoveUpdate


	static onPointerDown( event ) {

		var object = findObject( event, true );
		if ( object ) {

			eventCall( object, 'onpointerdown', event );

		}

		event.preventDefault();

	} // Suica.onPointerDown


	static onPointerUp( event ) {

		var object = findObject( event, true );
		if ( object ) {

			eventCall( object, 'onpointerup', event );

		}

	} // Suica.onPointerUp


	static onClick( event ) {

		var object = findObject( event, true );

		if ( object ) {

			eventCall( object, 'onclick', event );

		}

		eventCall( /*Suica.current*/window.suica, 'onclick', event );

	} // Suica.onClick


	// static onDblClick( event )
	// {
	// var object = findObject( event );
	// if( object )
	// {
	// eventCall( object, 'ondblclick', event );
	// }
	// } // Suica.onDblClick


	static onContextMenu( event ) {

		event.preventDefault();

	} // Suica.onContextMenu


} // class Suica



window.newSuica = function ( ) {

	var suicaTag = document.createElement( 'suica' );
	suicaTag.style = 'border: solid 1m red;';
	document.body.appendChild( suicaTag );

	new Suica( suicaTag );

};


window.style = function ( object, properties ) {

	for ( var n in properties ) object[ n ] = properties[ n ];
	return object;

};


window.element = function ( id ) {

	return document.getElementById( id );

};


window.rgb = function ( r, g, b ) {

	return new THREE.Color( r/255, g/255, b/255 );

};


window.hsl = function ( h, s, l ) {

	return new THREE.Color( ).setHSL( ( 1+( h/360 )%1 )%1, s/100, l/100 );

};



window.randomIn = function ( object ) {

	return object.randomIn;

};

window.randomOn = function ( object ) {

	return object.randomOn;

};



window.lerp = function ( a, b, k ) {

	if ( a instanceof Mesh )
		a = a.center;

	if ( b instanceof Mesh )
		b = b.center;

	return [ a[ 0 ]*( 1-k )+k*b[ 0 ], a[ 1 ]*( 1-k )+k*b[ 1 ], a[ 2 ]*( 1-k )+k*b[ 2 ] ];

};

window.clamp = function ( x, a, b ) {

	if ( x < a ) return a;
	if ( x > b ) return b;
	return x;

};

window.clone = function ( object ) {

	if ( object.clone )
		return object.clone();
	else
		throw 'error: cannot clone object';

};

function findPosition( domEvent ) {

	checkSuicaExists();

	var suica = domEvent.target.suicaObject;
	if ( suica )
		return suica.findPosition( domEvent );

}

window.findPosition = findPosition;


function findObjects( domEvent, onlyInteractive = false ) {

	checkSuicaExists();

	var suica = domEvent.target.suicaObject;
	if ( suica )
		return suica.findObjects( domEvent, onlyInteractive );

}

window.findObjects = findObjects;




function findObject( domEvent, onlyInteractive = false ) {

	checkSuicaExists();

	var suica = domEvent.target.suicaObject;
	if ( suica )
		return suica.findObject( domEvent, onlyInteractive );

}



window.shape = shape;
window.findObject = findObject;







// monitor creation of tags, we are interested in creation of
// <script> because it might contain Suica tags; thus for each
// <script> try to parase all unparsed Suicas
//
// idea from https://github.com/jspenguin2017/Snippets/blob/master/onbeforescriptexecute.html
new MutationObserver( function ( mutations ) {

	for ( var parentElem of mutations ) {

		for ( var childElem of parentElem.addedNodes ) {

			if ( childElem?.tagName=='SCRIPT' ) {

				//					console.log('MutationObserver <script>');
				for ( var suica of Suica.allSuicas )
					suica.parser?.parseTags();

			}

			if ( childElem?.tagName=='SUICA' )
				new Suica( childElem );
			if ( childElem?.tagName=='SCORM' )
				HTMLParser.parseTagSCORM( childElem );

		}

		if ( parentElem.type == 'attributes' && parentElem.target.suicaObject ) {

			var name = parentElem.attributeName,
				value = parentElem.target.getAttribute( parentElem.attributeName );

			parentElem.target.suicaObject[ name ] = value;

		}

	}

} ).observe( document, { childList: true, subtree: true, attributes: true } );


window.addEventListener( 'load', function () {

	for ( var suica of Suica.allSuicas )
		suica.parser?.parseTags();

}
);


/*
var htmlSuicas = document.getElementsByTagName('suica');

for( var i=0; i<htmlSuicas.length; i++ )
{
	var suica = new Suica( htmlSuicas[i] );
	suica.parser.parseTags();
}
*/

export { Suica };
