﻿//
// Suica 2.0 Mesh
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


import * as THREE from 'three';
import { degrees, ORIENTATIONS, parseCenter, parseColor, parseSize, radians } from './suica-globals.js';
import { Drawing, image } from './suica-drawing.js';


class Mesh {

	static id = 0;

	constructor( suica, solidMesh, frameMesh ) {

		this.id = 'Object'+( ++Mesh.id );

		this.suica = suica;
		this.solidMesh = solidMesh;
		this.frameMesh = frameMesh;

		this.threejs = solidMesh;
		this.threejs.suicaObject = this;
		this.isWireframe = false;

		// [width, height, depth]
		this.meshSize = [ null, null, null ];
		this.meshSpin = [ 0, 0, 0, 0 ];
		this.meshImages = 1;

		suica.scene.add( solidMesh );

		window.its = this;

	}




	// create default materials for SUica objects
	static createMaterials( ) {

		// point material
		var CANVAS_SIZE = 128;
		var canvas = document.createElement( 'canvas' );
		canvas.width = CANVAS_SIZE;
		canvas.height = CANVAS_SIZE;

		var context = canvas.getContext( '2d' );
		context.fillStyle = 'white';

		var gradient = context.createRadialGradient(
			CANVAS_SIZE/2, CANVAS_SIZE/2, CANVAS_SIZE/2-5,
			CANVAS_SIZE/2, CANVAS_SIZE/2, CANVAS_SIZE/2
		);
		gradient.addColorStop( 0, 'white' );
		gradient.addColorStop( 1, 'rgba(0,0,0,0)' );
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
		} );

		// solid material
		Mesh.solidMaterial = new THREE.MeshStandardMaterial( {
			color: 'cornflowerblue',
			side: THREE.DoubleSide,
		} );

		// solid flat material
		Mesh.flatMaterial = new THREE.MeshStandardMaterial( {
			color: 'cornflowerblue',
			side: THREE.DoubleSide,
			flatShading: true,
		} );

		// line material
		CANVAS_SIZE = 4;
		var canvas2 = document.createElement( 'canvas' );
		canvas2.width = CANVAS_SIZE;
		canvas2.height = 1;

		var context2 = canvas2.getContext( '2d' );
		context2.fillStyle = 'white';
		context2.fillRect( 0, 0, canvas2.width, canvas2.height );

		Mesh.lineMaterial = new THREE.MeshBasicMaterial( {
			color: 'black',
			transparent: true,
			map: new THREE.CanvasTexture( canvas2 ),
		} );

		Mesh.lineMaterial.onBeforeCompile = shader => {

			shader.fragmentShader = shader.fragmentShader.replace(
				'#include <map_fragment>',
				`#ifdef USE_MAP
					vec4 texelColor = texture2D( map, vUv );
					diffuseColor *= texelColor;
				#endif`
			);

		};

	}




	get center() {

		this.suica.parser?.parseTags();

		return [ this.threejs.position.x, this.threejs.position.y, this.threejs.position.z ];

	}

	set center( center ) {

		this.suica.parser?.parseTags();

		var value = parseSize( center );
		if ( value instanceof Array ) value = [ ...value ];

		this.threejs.position.set( ...value );

	}




	get x() {

		this.suica.parser?.parseTags();

		return this.threejs.position.x;

	}

	set x( x ) {

		this.suica.parser?.parseTags();

		this.threejs.position.x = x;

	}




	get y() {

		this.suica.parser?.parseTags();

		return this.threejs.position.y;

	}

	set y( y ) {

		this.suica.parser?.parseTags();

		this.threejs.position.y = y;

	}




	get z() {

		this.suica.parser?.parseTags();

		return this.threejs.position.z;

	}

	set z( z ) {

		this.suica.parser?.parseTags();

		this.threejs.position.z = z;

	}




	get color() {

		this.suica.parser?.parseTags();

		var col = this.threejs.material.color;
		return [ col.r, col.g, col.b ];

	}

	set color( col ) {

		this.suica.parser?.parseTags();

		this.threejs.material.color = parseColor( col );
		this.threejs.material.needsUpdate = true;

	}



	get image( ) {

		return this._drawing;// this.threejs.material.map;

	}

	set image( drawing ) {

		this.suica.parser?.parseTags();

		this._drawing = drawing;

		if ( !drawing ) {

			delete this.threejs.material.map;
			this.threejs.material.transparent = false;
			this.threejs.material.needsUpdate = true;
			return;

		}

		if ( drawing instanceof Drawing ) {

			this._drawing = drawing.clone;

			this.threejs.material.map = this._drawing.image;
			this.threejs.material.map.colorSpace = THREE.SRGBColorSpace;//this.suica.renderer.outputColorSpace;
			this.threejs.material.transparent = true;
			this.threejs.material.side = /*2025TwoPass2025*/THREE.DoubleSide;
			this.threejs.material.needsUpdate = true;
			this.updateImages();
			return;

		}

		if ( drawing instanceof THREE.Texture ) {

			this.threejs.material.map = drawing; // no cloning available
			this.threejs.material.map.colorSpace = THREE.SRGBColorSpace;
			this.threejs.material.transparent = true;
			this.threejs.material.side = /*2025TwoPass2025*/THREE.DoubleSide;
			this.threejs.material.needsUpdate = true;
			this.updateImages();
			return;

		}

		if ( typeof drawing == 'string' || drawing instanceof String ) {

			this.image = image( drawing );
			return;

		}

		throw 'error: parameter of `image` is not a drawing';

	}


	get images( ) {

		return this.meshImages;

	}

	set images( img ) {

		this.suica.parser?.parseTags();

		// img is string 'x,y'
		if ( typeof img === 'string' || img instanceof String ) {

			img = img.replaceAll( ' ', '' );
			img = img.split( ',' ).map( Number );

		}

		this.meshImages = img;

		this.updateImages();

	}


	updateImages( ) {

		var img = this.meshImages;

		// img is number
		if ( !isNaN( img ) ) {

			this.threejs.material.map?.repeat.set( img, img );
			return;

		}

		// img is array [x,y]
		if ( Array.isArray( img ) ) {

			switch ( img.count ) {

				case 0: this.threejs.material.map?.repeat.set( 1, 1 ); break;
				case 1: this.threejs.material.map?.repeat.set( img[ 0 ], img[ 0 ]); break;
				default: this.threejs.material.map?.repeat.set( img[ 0 ], img[ 1 ]);

			}

			return;

		}

		throw `error: invalid value '${img}' of 'images' property`;

	}


	updateScale( ) {

		var width = this.meshSize[ 0 ];
		var height = this.meshSize[ 1 ];
		var depth = this.meshSize[ 2 ];

		if ( height===null ) height = width;
		if ( depth===null ) depth = width;

		switch ( this.suica.orientation ) {

			case ORIENTATIONS.YXZ:
				this.threejs.scale.set( height, width, depth );
				break;
			case ORIENTATIONS.ZYX:
				this.threejs.scale.set( depth, height, width );
				break;
			case ORIENTATIONS.XZY:
				this.threejs.scale.set( width, depth, height );
				break;

			case ORIENTATIONS.ZXY:
				this.threejs.scale.set( height, depth, width ); // order is OK, 11.07.2022
				break;
			case ORIENTATIONS.XYZ:
				this.threejs.scale.set( width, height, depth );
				break;
			case ORIENTATIONS.YZX:
				this.threejs.scale.set( depth, width, height ); // order is OK, 11.07.2022
				break;
			default: throw 'error: unknown orientation';

		}

	}

	get width( ) {

		return this.meshSize[ 0 ];

	}

	set width( width ) {

		this.meshSize[ 0 ] = width;
		this.updateScale();

	}




	get height( ) {

		return ( this.meshSize[ 1 ]!==null ) ? this.meshSize[ 1 ] : this.meshSize[ 0 ];

	}

	set height( height ) {

		this.meshSize[ 1 ] = height;
		this.updateScale();

	}




	get depth( ) {

		return ( this.meshSize[ 2 ]!==null ) ? this.meshSize[ 2 ] : this.meshSize[ 0 ];

	}

	set depth( depth ) {

		this.meshSize[ 2 ] = depth;
		this.updateScale();

	}




	get size( ) {

		this.suica.parser?.parseTags();

		if ( this.meshSize[ 2 ]===null ) {

			if ( this.meshSize[ 1 ]===null )
				return this.meshSize[ 0 ];
			else
				return [ this.meshSize[ 0 ], this.meshSize[ 1 ] ];

		}

		return [ this.meshSize[ 0 ], this.meshSize[ 1 ], this.meshSize[ 2 ] ];

	}

	set size( size ) {

		this.suica.parser?.parseTags();

		size = parseSize( size );

		if ( Array.isArray( size ) ) {

			if ( size.length==0 )
				this.meshSize = [ null, null, null ];
			else
				if ( size.length==1 )
					this.meshSize = [ size[ 0 ], null, null ];
				else
					if ( size.length==2 )
						this.meshSize = [ size[ 0 ], size[ 1 ], null ];
					else
						this.meshSize = [ size[ 0 ], size[ 1 ], size[ 2 ] ];

		} else {

			this.meshSize = [ size, null, null ];

		}

		this.updateScale();

	}



	get wireframe( ) {

		return this.isWireframe;

	}

	set wireframe( wireframe ) {

		if ( !this.frameMesh )
			throw 'error: wireframe property not available';

		this.isWireframe = wireframe;

		var oldMesh = this.threejs,
			newMesh = ( wireframe===true ) || ([ '', 'true', 'yes', '1' ].indexOf( String( wireframe ).toLowerCase() ) >= 0 ) ? this.frameMesh : this.solidMesh;

		// copy properties
		newMesh.position.copy( oldMesh.position );
		newMesh.scale.copy( oldMesh.scale );
		newMesh.rotation.copy( oldMesh.rotation );
		newMesh.material.color.copy( oldMesh.material.color );
		newMesh.visible = oldMesh.visible;

		if ( oldMesh.material.map ) {

			newMesh.material.map = oldMesh.material.map;
			newMesh.material.transparent = oldMesh.material.transparent;
			newMesh.material.side = oldMesh.material.side;
			newMesh.material.needsUpdate = true;

		}

		this.threejs = newMesh;
		this.threejs.suicaObject = this;

		this.suica.scene.remove( oldMesh );
		this.suica.scene.add( newMesh );

	}


	style( properties ) {

		for ( var n in properties ) this[ n ] = properties[ n ];
		return this;

	} // Mesh.style


	updateOrientation( ) {

		var spin = this.meshSpin;
		if ( !spin ) return;

		var flip = 1;
		switch ( this.suica.orientation ) {

			//case ORIENTATIONS.XYZ:
			case ORIENTATIONS.XZY: flip = -1; break;
			case ORIENTATIONS.YXZ: flip = -1; break;
			//case ORIENTATIONS.YZX:
			//case ORIENTATIONS.ZXY:
			case ORIENTATIONS.ZYX: flip = -1; break;

		}



		this.threejs.rotation.set( 0, 0, 0 );
		if ( Array.isArray( spin ) ) {

			if ( spin[ 0 ]) this.threejs.rotateOnAxis( this.suica.orientation.UP, radians( flip*spin[ 0 ]) );
			if ( spin[ 1 ]) this.threejs.rotateOnAxis( this.suica.orientation.RIGHT, radians( flip*spin[ 1 ]) );
			if ( spin[ 2 ]) this.threejs.rotateOnAxis( this.suica.orientation.UP, radians( flip*spin[ 2 ]) );
			if ( spin[ 3 ]) this.threejs.rotateOnAxis( this.suica.orientation.FORWARD, radians( flip*spin[ 3 ]) );

		} else {

			this.threejs.rotateOnAxis( this.suica.orientation.UP, radians( flip*spin ) );

		}

	} // Mesh.updateOrientation


	get spin( ) {

		return this.meshSpin;

	}

	set spin( spin ) {

		var value = parseSize( spin );
		if ( value instanceof Array ) value = [ ...value ];

		this.meshSpin = value;

		this.updateOrientation();

	}


	get spinH( ) {

		return this.meshSpin[ 0 ];

	}

	set spinH( spin ) {

		this.meshSpin[ 0 ] = Number( spin );
		this.updateOrientation();

	}


	get spinV( ) {

		return this.meshSpin[ 1 ];

	}

	set spinV( spin ) {

		this.meshSpin[ 1 ] = Number( spin );
		this.updateOrientation();

	}


	get spinT( ) {

		return this.meshSpin[ 2 ];

	}

	set spinT( spin ) {

		this.meshSpin[ 2 ] = Number( spin );
		this.updateOrientation();

	}


	get spinS( ) {

		return this.meshSpin[ 3 ];

	}

	set spinS( spin ) {

		this.meshSpin[ 3 ] = Number( spin );
		this.updateOrientation();

	}


	get visible( ) {

		return this.threejs.visible;

	}

	set visible( visible ) {

		this.threejs.visible = visible;

	}


	get hidden( ) {

		return !this.threejs.visible;

	}

	set hidden( hidden ) {

		this.threejs.visible = !hidden;

	}


	addEventListener( type, listener, aux ) {

		if ( aux ) console.warn( 'Suica objects do not support third parameter of addEventListener' );

		if ( !type.startsWith( 'on' ) )
			type = 'on'+type;

		this[ type.toLowerCase() ] = listener;

	}


	removeEventListener( type, listener, aux ) {

		if ( listener ) console.warn( 'Suica objects do not support second parameter of removeEventListener' );
		if ( aux ) console.warn( 'Suica objects do not support third parameter of removeEventListener' );

		if ( !type.startsWith( 'on' ) )
			type = 'on'+type;

		this[ type.toLowerCase() ] = null;

	}


	objectPosition( localOffset=[ 0, 0, 0 ]) {

		localOffset = parseCenter( localOffset );

		if ( !( this instanceof THREE.Group ) ) {

			switch ( this.suica.orientation ) {

				case ORIENTATIONS.YXZ:
					localOffset[ 0 ] /= this.threejs.scale.y;
					localOffset[ 1 ] /= this.threejs.scale.x;
					localOffset[ 2 ] /= this.threejs.scale.z;
					break;
				case ORIENTATIONS.ZYX:
					localOffset[ 0 ] /= this.threejs.scale.z;
					localOffset[ 1 ] /= this.threejs.scale.y;
					localOffset[ 2 ] /= this.threejs.scale.x;
					break;
				case ORIENTATIONS.XZY:
					localOffset[ 0 ] /= this.threejs.scale.x;
					localOffset[ 1 ] /= this.threejs.scale.z;
					localOffset[ 2 ] /= this.threejs.scale.y;
					break;
				case ORIENTATIONS.ZXY:
					localOffset[ 0 ] /= this.threejs.scale.z;
					localOffset[ 1 ] /= this.threejs.scale.x;
					localOffset[ 2 ] /= this.threejs.scale.y;
					break;
				case ORIENTATIONS.XYZ:
					localOffset[ 0 ] /= this.threejs.scale.x;
					localOffset[ 1 ] /= this.threejs.scale.y;
					localOffset[ 2 ] /= this.threejs.scale.z;
					break;
				case ORIENTATIONS.YZX:
					localOffset[ 0 ] /= this.threejs.scale.y;
					localOffset[ 1 ] /= this.threejs.scale.z;
					localOffset[ 2 ] /= this.threejs.scale.x;
					break;
				default: throw 'error: unknown orientation';

			}

		}

		this.threejs.updateWorldMatrix( true, true );

		var target = new THREE.Vector3( ...localOffset ),
			pos = this.threejs.localToWorld( target );

		var scale = this.suica.orientation.SCALE;

		return [ pos.x*scale.x, pos.y*scale.y, pos.z*scale.z ];

	}


	screenPosition( localOffset=[ 0, 0, 0 ], globalOffset=[ 0, 0, 0 ]) {

		var pos = new THREE.Vector3( ...this.objectPosition( localOffset ) );

		globalOffset = parseCenter( globalOffset );

		pos.x += globalOffset[ 0 ];
		pos.y += globalOffset[ 1 ];
		pos.z += globalOffset[ 2 ];

		// get pos in relative screen coordinates [-1,-1]x[1,1]
		pos.project( this.suica.camera );

		// scale to pixels
		var x = ( 1+pos.x )/2 * this.suica.canvas.clientWidth,
			y = ( 1-pos.y )/2 * this.suica.canvas.clientHeight,
			z = pos.z;


		return [ Math.round( 100*x )/100, Math.round( 100*y )/100, Math.round( 1000*z )/1000 ];

	}


	get vertices( ) {

		var vertices = [],
			v = new THREE.Vector3();

		function processMesh( mesh ) {

			// collect vertices in the mesh
			if ( mesh.geometry ) {

				var pos = mesh.geometry.getAttribute( 'position' );
				if ( pos ) {

					for ( var i=0; i<pos.count; i++ ) {

						v.set( pos.getX( i ), pos.getY( i ), pos.getZ( i ) );
						v = mesh.localToWorld( v );
						vertices.push([ v.x, v.y, v.z ]);

					}

				}

			}

			// scan submeshes
			for ( var submesh of mesh.children )
				processMesh( submesh );

		}

		this.threejs.updateWorldMatrix( true, true );

		processMesh( this.threejs );

		return vertices;

	} // Mesh.vertices


	lookAt( to/*, axis=this.suica.orientation.NAME[1]*/ ) {

		to = parseCenter( to );

		var obj = new THREE.Object3D();
		obj.position.copy( this.threejs.position );
		obj.lookAt( ...to );

		//obj.rotateX( radians(90) );

		obj.rotation.reorder( 'YXZ' );
		var sx = degrees( obj.rotation.x ),
			sy = degrees( obj.rotation.y );

		//console.log( sx.toFixed(2),sy.toFixed(2),sz.toFixed(2) );

		switch ( this.suica.orientation ) {

			case ORIENTATIONS.YXZ:
				this.spin = [ 0, -sy, -90-sx, 0 ];
				break;
			case ORIENTATIONS.ZYX:
				this.spin = [ 90-sy, 90+sx, 90, 0 ];
				break;
			case ORIENTATIONS.XZY:
				this.spin = [ 90, sy-90, 0+sx, 0 ];
				break;
			case ORIENTATIONS.ZXY:
				this.spin = [ 90, -sy, sx, 0 ];
				break;
			case ORIENTATIONS.XYZ:
				this.spin = [ sy, 90+sx, 180, 0 ];
				break;
			case ORIENTATIONS.YZX:
				this.spin = [ 0, sy-90, -90-sx, 0 ];
				break;

		}




		// spin:XYXZ


		/*


		var u = new THREE.Vector3(
					to[0]-this.x,
					to[1]-this.y,
					to[2]-this.z ),
			v = this.suica.orientation.UP.clone(),
			w = new THREE.Vector3().crossVectors( u, v );

		v.crossVectors( w, u );

		u.normalize( );
		v.normalize( );
		w.normalize( );


		var m = new THREE.Matrix4();
			m = m.makeBasis( w, u, v );

		var e = new THREE.Euler();

//UP RIGHT UP FORWARD

		switch( this.suica.orientation )
		{
			case ORIENTATIONS.YXZ: // spin:XYXZ
				e = e.setFromRotationMatrix( m, 'XYZ' );
				var a = degrees(e.x);
				var b = degrees(e.y);
				switch( axis )
				{
					case 'x':
					case 'X':
						this.spin = [ -a, -b, 0, 0 ];
						break;
					case 'y':
					case 'Y':
						this.spin = [ -a, -b, 0, 90 ];
						break;
					case 'z':
					case 'Z':
						this.spin = [ -a, 90-b, 180, 0 ];
						break;
				}
				break;
			case ORIENTATIONS.ZYX: // spin:YZYX
				e = e.setFromRotationMatrix( m, 'YZX' );
				var a = degrees(e.x);
				var b = degrees(e.y);
				axis='z'
				switch( axis )
				{
					case 'x':
					case 'X':
						this.spin = [ -b, 0, 0, 90-a ];
						break;
					case 'y':
					case 'Y':
						this.spin = [ -b, 0, 0, -a ];
						break;
					case 'z':
					case 'Z':
						this.spin = [ -b, 0, 180, 90-a ];
						break;
				}
				break;
			case ORIENTATIONS.XZY:
				e.reorder( 'ZXY' );
				this.spin = [ -degrees(e.z), 90-degrees(e.x), 0, degrees(e.y) ];
				break;
			case ORIENTATIONS.ZXY:
				e.reorder( 'XZY' );
				this.spin = [ degrees(e.x), 90+degrees(e.z), 0, -90+degrees(e.y) ];
				break;
			case ORIENTATIONS.XYZ:
				e.reorder( 'YXZ' );
				this.spin = [ degrees(e.y), degrees(e.x), 0, degrees(e.z) ];
				break;
			case ORIENTATIONS.YZX:
				e.reorder( 'ZYX' );
				this.spin = [ degrees(e.z), degrees(e.y), 0, -90+degrees(e.x) ];
				break;
		};
	*/

	} // Mesh.lookAt


} // class Mesh




Mesh.createMaterials();


export { Mesh };
