//
// Suica 3.0 Cube
//
//===================================================


import * as THREE from 'three';
import { Mesh } from './suica-mesh.js';
import { cloneEvents, parseCenter, parseColor, parseSize, random } from './suica-globals.js';



class Cube extends Mesh {

	static COLOR = 'lightsalmon';
	static FRAMECOLOR = 'black';
	static SIZE = 30;

	constructor( suica, center, size, color ) {

		suica.parser?.parseTags();
		suica.debugCall( 'cube', center, size, color );

		suica._.solidGeometry.cube = suica.flipNormal( new THREE.BoxGeometry( 1, 1, 1 ).applyMatrix4( suica.orientation.MATRIX ) );
		suica._.frameGeometry.cube = new THREE.BufferGeometry();

		suica._.frameGeometry.cube.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array([
			// bottom ring
			-0.5, -0.5, -0.5, +0.5, -0.5, -0.5,
			+0.5, -0.5, -0.5, +0.5, +0.5, -0.5,
			+0.5, +0.5, -0.5, -0.5, +0.5, -0.5,
			-0.5, +0.5, -0.5, -0.5, -0.5, -0.5,
			// top ring
			-0.5, -0.5, +0.5, +0.5, -0.5, +0.5,
			+0.5, -0.5, +0.5, +0.5, +0.5, +0.5,
			+0.5, +0.5, +0.5, -0.5, +0.5, +0.5,
			-0.5, +0.5, +0.5, -0.5, -0.5, +0.5,
			// bottom to top
			-0.5, -0.5, -0.5, -0.5, -0.5, +0.5,
			+0.5, -0.5, -0.5, +0.5, -0.5, +0.5,
			+0.5, +0.5, -0.5, +0.5, +0.5, +0.5,
			-0.5, +0.5, -0.5, -0.5, +0.5, +0.5,
		]), 3 ) );
		suica._.frameGeometry.cube.setAttribute( 'uv', new THREE.BufferAttribute( new Float32Array([
			// bottom ring
			0, 0, 1, 0,
			0, 0, 1, 0,
			0, 0, 1, 0,
			0, 0, 1, 0,
			// top ring
			0, 0, 1, 0,
			0, 0, 1, 0,
			0, 0, 1, 0,
			0, 0, 1, 0,
			// bottom to top
			0, 0, 1, 0,
			0, 0, 1, 0,
			0, 0, 1, 0,
			0, 0, 1, 0,
		]), 2 ) );

		suica._.frameGeometry.cube = suica._.frameGeometry.cube.applyMatrix4( suica.orientation.MATRIX );

		super( suica,
			new THREE.Mesh( suica._.solidGeometry.cube, Mesh.solidMaterial.clone() ),
			new THREE.LineSegments( suica._.frameGeometry.cube, Mesh.lineMaterial.clone() ),
		);

		this.center = parseCenter( center );
		this.size = parseSize( size, Cube.SIZE );
		this.color = parseColor( color, Cube.COLOR );

	} // Cube.constructor


	get clone( ) {

		var object = new Cube( this.suica, this.center, this.size, this.color );

		object.spin = this.spin;
		object.wireframe = this.wireframe;
		object.image = this.image;
		object.images = this.images;
		object.visible = this.visible;

		cloneEvents( object, this );

		return object;

	} // Cube.clone


	get randomIn( ) {

		var x = random( -1/2, 1/2 ) * this.width,
			y = random( -1/2, 1/2 ) * this.height,
			z = random( -1/2, 1/2 ) * this.depth;

		return this.objectPosition([ x, y, z ]);

	} // Cube.randomIn


	get randomOn( ) {

		var w = this.width,
			h = this.height,
			d = this.depth;

		var rnd = random( 0, w*h + w*d + h*d );

		var x = random( -1/2, 1/2 ),
			y = random( -1/2, 1/2 ),
			z = random( -1/2, 1/2 ),
			t = random([ -1/2, 1/2 ]);

		if ( rnd < w*h )
			z = t;
		else if ( rnd < w*h + w*d )
			y = t;
		else
			x = t;

		var v = new THREE.Vector3( x, y, z ).applyMatrix4( this.suica.orientation.MATRIX );
		return this.objectPosition([ v.x*w, v.y*h, v.z*d ]);

	} // Cube.randomOn

} // class Cube


export { Cube };
