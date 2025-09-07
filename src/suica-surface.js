//
// Suica 3.0 Surface
//
//===================================================


import * as THREE from 'three';
import { Mesh } from './suica-mesh.js';
import { Tube } from './suica-tube.js';
import { cloneEvents, parseCenter, parseColor, parseSize, splane } from './suica-globals.js';



class Surface extends Mesh {

	static POINTS = [];
	static COUNT = [ 40, 40 ];
	static COLOR = 'lightsalmon';
	static SIZE = 1;

	constructor( suica, center, plane, count, size, color ) {

		suica.parser?.parseTags();
		suica.debugCall( 'surface', center, plane?.name || plane, count, size, color );

		var uSegments, vSegments;

		count = parseSize( count, Surface.COUNT );
		if ( Array.isArray( count ) ) {

			uSegments = parseSize( count[ 0 ], Surface.COUNT[ 0 ]);
			vSegments = parseSize( count[ 1 ], Surface.COUNT[ 1 ]);

		} else {

			uSegments = count;
			vSegments = count;

		}

		var geometry = new THREE.PlaneGeometry( 1, 1, uSegments, vSegments );

		super( suica,
			new THREE.Mesh( geometry, Mesh.solidMaterial.clone() ),
			null, // no wireframe
		);

		this._plane = splane( plane );
		this.center = parseCenter( center );
		this.size = parseSize( size, Tube.SIZE );
		this.color = parseColor( color, Tube.COLOR );
		this._count = count;
		this.uSegments = uSegments;
		this.vSegments = vSegments;

		this.updateGeometry( );

	} // Surface.constructor

	get count( ) {

		return this._count;

	}

	set count( count ) {

		count = parseSize( count );
		if ( Array.isArray( count ) ) {

			this.uSegments = parseSize( count[ 0 ], Surface.COUNT[ 0 ]);
			this.vSegments = parseSize( count[ 1 ], Surface.COUNT[ 1 ]);

		} else {

			this.uSegments = count;
			this.vSegments = Surface.COUNT[ 1 ];

		}

		this._count = count;

		this.threejs.geometry.dispose();
		this.threejs.geometry = new THREE.PlaneGeometry( 1, 1, this.uSegments, this.vSegments );
		this.updateGeometry();

	}


	get curve( ) {

		return this._plane;

	}


	set curve( plane ) {

		this._plane = splane( plane );

		this.updateGeometry();

	}


	get clone( ) {

		var object = new Surface( this.suica, this.center, this._plane, this.count, this.size, this.color );

		object.spin = this.spin;
		object.image = this.image;
		object.images = this.images;
		object.visible = this.visible;

		cloneEvents( object, this );

		return object;

	} // Surface.clone


	updateGeometry( ) {

		const EPS = 0.00001;

		var pos = this.threejs.geometry.getAttribute( 'position' ),
			nor = this.threejs.geometry.getAttribute( 'normal' ),
			uv = this.threejs.geometry.getAttribute( 'uv' ),
			tu = new THREE.Vector3(),
			tv = new THREE.Vector3();

		for ( var i=0; i<pos.count; i++ ) {

			var u = ( i % ( this.uSegments+1 ) )/( this.uSegments );
			var v = ( Math.floor( i / ( this.uSegments+1 ) ) )/( this.vSegments );

			var p = this._plane( u, v );

			var t1 = this._plane( u+EPS, v );
			var t2 = this._plane( u-EPS, v );
			tu.set( t1[ 0 ]-t2[ 0 ], t1[ 1 ]-t2[ 1 ], t1[ 2 ]-t2[ 2 ]);

			t1 = this._plane( u, v+EPS );
			t2 = this._plane( u, v-EPS );
			tv.set( t1[ 0 ]-t2[ 0 ], t1[ 1 ]-t2[ 1 ], t1[ 2 ]-t2[ 2 ]);

			tu.cross( tv ).normalize( );
			pos.setXYZ( i, p[ 0 ], p[ 1 ], p[ 2 ]);
			nor.setXYZ( i, -tu.x, -tu.y, -tu.z );
			uv.setXY( i, u, v );

		}

		pos.needsUpdate = true;
		nor.needsUpdate = true;
		uv.needsUpdate = true;

	}


} // class Surface


export { Surface };
