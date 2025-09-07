//
// Suica 3.0 Circle & Polygon
//
//===================================================


import * as THREE from 'three';
import { Mesh } from './suica-mesh.js';
import { CIRCLECOUNT, cloneEvents, parseCenter, parseColor, parseNumber, parseSize, random } from './suica-globals.js';


class Polygon extends Mesh {

	static COLOR = 'lightsalmon';
	static FRAMECOLOR = 'black';
	static SIZE = 30;
	static COUNT = 3;

	constructor( suica, count, center, size, color ) {

		suica.parser?.parseTags();
		if ( count < CIRCLECOUNT )
			suica.debugCall( 'polygon', count, center, size, color );
		else
			suica.debugCall( 'circle', center, size, color );

		suica._.solidGeometry.polygon = []; // array of geometries for different number of sides
		suica._.frameGeometry.polygon = []; // array of geometries for different number of sides

		super( suica,
			new THREE.Mesh( Polygon.getSolidGeometry( suica, count ), Mesh.solidMaterial.clone() ),
			new THREE.LineLoop( Polygon.getFrameGeometry( suica, count ), Mesh.lineMaterial.clone() ),
		);

		this.center = parseCenter( center );
		this.size = parseSize( size, Polygon.SIZE );
		this.color = parseColor( color, Polygon.COLOR );
		this.n = parseNumber( count, Polygon.COUNT );

	} // Polygon.constructor


	get count() {

		this.suica.parser?.parseTags();

		return this.n;

	}


	set count( count ) {

		this.suica.parser?.parseTags();

		if ( count == this.n ) return; // same number of side, no need to regenerate

		this.solidMesh.geometry = Polygon.getSolidGeometry( this.suica, count );
		this.frameMesh.geometry = Polygon.getFrameGeometry( this.suica, count );

		this.threejs.geometry = this.isWireframe ? this.frameMesh.geometry : this.solidMesh.geometry;

	}


	static getSolidGeometry( suica, count ) {

		if ( !suica._.solidGeometry.polygon[ count ])
			suica._.solidGeometry.polygon[ count ] = suica.flipNormal( new THREE.CircleGeometry( 0.5, count, /*-Math.PI*(1/2-1/count) -- issue #87 Polygon orientation */ ).applyMatrix4( suica.orientation.MATRIX ) );

		return suica._.solidGeometry.polygon[ count ];

	} // Polygon.getSolidGeometry


	static getFrameGeometry( suica, count ) {

		if ( !suica._.frameGeometry.polygon[ count ]) {

			suica._.frameGeometry.polygon[ count ] = new THREE.BufferGeometry();

			let vertices = new Float32Array( 3*count+3 ),
				uvs = new Float32Array( 2*count+2 );

			for ( var i=0; i<=count; i++ ) {

				var angle = 2*Math.PI * i/count;

				vertices[ 3*i ] = 0.5*Math.cos( angle );
				vertices[ 3*i+1 ] = 0.5*Math.sin( angle );

				// for up to octagons each side has uv from 0 to 1
				// above octagons each quarter of sides has uv from 0 to 1
				if ( count > 8 )
					uvs[ 2*i ] = 4*i/count;
				else
					uvs[ 2*i ] = i;

			}

			suica._.frameGeometry.polygon[ count ].setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
			suica._.frameGeometry.polygon[ count ].setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );
			suica._.frameGeometry.polygon[ count ].applyMatrix4( suica.orientation.MATRIX );

		}

		return suica._.frameGeometry.polygon[ count ];

	} // Polygon.getFrameGeometry


	get clone( ) {

		var object = new Polygon( this.suica, this.n, this.center, this.size, this.color );

		object.spin = this.spin;
		object.wireframe = this.wireframe;
		object.image = this.image;
		object.images = this.images;
		object.visible = this.visible;

		cloneEvents( object, this );

		return object;

	} // Polygon.clone

} // class Polygon




class Circle extends Polygon {

	constructor( suica, center, size, color ) {

		super( suica, CIRCLECOUNT, center, size, color );

	}

	get randomIn( ) {

		// idea:
		// https://www.quora.com/Is-it-possible-to-generate-random-points-within-a-given-rotated-ellipse-without-using-rejection-sampling
		var r = Math.sqrt( random( 0, 1 ) ) / 2,
			a = random( 0, 2*Math.PI ),
			x = r * Math.cos( a ),
			y = r * Math.sin( a );

		var v = new THREE.Vector3( x, y, 0 ).applyMatrix4( this.suica.orientation.MATRIX );

		return this.objectPosition([ v.x*this.width, v.y*this.height, v.z*this.depth ]);

	} // Circle.randomIn


	get randomOn( ) {

		var w = this.width,
			h = this.height;

		// check whether it is true circle
		if ( w == h ) {

			var a = random( 0, 2*Math.PI );

			var v = new THREE.Vector3( Math.cos( a )/3, Math.sin( a )/3, 0 ).applyMatrix4( this.suica.orientation.MATRIX );
			return this.objectPosition([ v.x*this.width, v.y*this.height, v.z*this.depth ]);

		}

		// 2D point on ellipse
		function elps( alpha ) {

			return [ w*Math.cos( alpha ), h*Math.sin( alpha ) ];

		}

		// distance between two 2D points
		function dist( a, b ) {

			return Math.sqrt( ( a[ 0 ]-b[ 0 ])**2 + ( a[ 1 ]-b[ 1 ])**2 );

		}

		// create array for angles between 0 and 90 degrees with given step
		// for each angle calculate (approx) the arc length from angle 0
		var sum = 0,
			step = ( Math.PI/2 ) / 10,
			accum = [ 0 ];
		for ( var i=0; i<=Math.PI/2; i+=step ) {

			sum += dist( elps( i ), elps( i+step ) );
			accum.push( sum );

		}

		// pick a random number from 0 to the length of the arc up to 90 degrees
		var rnd = random( 0, accum[ accum.length-2 ]),
			idx = accum.findIndex( x => x>rnd );

		// the random distance is between accum[idx-1] and accum[idx]
		// approximate the index and then calculate the angle
		idx += ( rnd-accum[ idx-1 ]) / ( accum[ idx ]-accum[ idx-1 ]) - 1;
		idx *= step;

		// (x,y) point in one quadrant
		var x = Math.cos( idx )/2,
			y = Math.sin( idx )/2;
		switch ( random([ 0, 1, 2, 3 ]) ) {

			case 1: [ x, y ] = [ -x, y ]; break;	// flip horizontally
			case 2: [ x, y ] = [ x, -y ]; break;	// flip vertically
			case 3: [ x, y ] = [ -x, -y ]; break;	// flip horz & vert

		}

		var v = new THREE.Vector3( x, y, 0 ).applyMatrix4( this.suica.orientation.MATRIX );
		return this.objectPosition([ v.x*this.width, v.y*this.height, v.z*this.depth ]);

	} // Circle.randomOn

} // class Circle


export { Polygon, Circle };
