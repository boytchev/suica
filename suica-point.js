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

	// a static geometry shared by all points
	static geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3));




	constructor(suica, center, size, color)
	{
		suica.parser?.parseTags();
		if (DEBUG_CALLS) console.log(`:: ${suica.id}.point(${center},${size},${color})`);

		super( suica, THREE.Points, Point.geometry, Mesh.pointMaterial.clone() );

		this.center = center;
		this.color = color;
		this.size = size;

		suica.scene.add( this.threejs );
		
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
	
} // class Point




window.point = function(
					center = Suica.DEFAULT.POINT.CENTER,
					size   = Suica.DEFAULT.POINT.SIZE,
					color  = Suica.DEFAULT.POINT.COLOR )
{
	Suica.precheck();
	return Suica.current.point( center, size, color );
}