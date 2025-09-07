//
// Suica 3.0 Group
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


import * as THREE from 'three';
import { Mesh } from './suica-mesh.js';
import { cloneEvents } from './suica-globals.js';


class Group extends Mesh {

	static SIZE = [ 1, 1, 1 ];

	constructor( suica, ...groupElements ) {

		suica.debugCall( 'group' );

		//		this.suica = suica;

		super( suica, new THREE.Group(), null );
		//		this.threejs = new THREE.Group();
		this.threejs.suicaObject = this;
		this.groupElements = [];

		// [width, height, depth]
		this.meshSize = [ 1, 1, 1 ];
		this.meshSpin = [ 0, 0, 0 ];

		this.add( ...groupElements );

		//		suica.scene.add( this.threejs );

	}



	add( ...groupElements ) {

		for ( var oneElement of groupElements ) {

			this.groupElements.push( oneElement );
			this.threejs.add( oneElement.threejs );

		}

	}




	set color( color ) {

		for ( var oneElement of this.groupElements ) {

			oneElement.color = color;

		}

	}


	get clone( ) {

		var object = new Group( this.suica );
		for ( var oneElement of this.groupElements ) {

			object.add( oneElement.clone );

		}

		object.center = this.center;
		object.size = this.size;
		object.spin = this.spin;
		object.visible = this.visible;

		cloneEvents( object, this );

		return object;

	} // Group.clone

} // class Group


export { Group };
