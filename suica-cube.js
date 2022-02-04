//
// Suica 2.0 Cube
// CC-3.0-SA-NC
//
// cube( center, size, color )
// cubeFrame( center, size, color )
//
// <cube id="" center="" size="" color="">
// <cube x="" y="" z="">
// <cube width="" height="" depth="">
// <cubeFrame ...>
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


class Cube extends Mesh
{
	
	// a geometry shared by all cubes
	static geometry = new THREE.BoxGeometry( 1, 1, 1 );
	
	constructor( suica, center, size, color )
	{
		suica.parser?.parseTags();
		if (DEBUG_CALLS) console.log(`:: ${suica.id}.cube(${center},${size},${color})`);
		
		super( suica, THREE.Mesh, Cube.geometry, Mesh.solidMaterial.clone() );
		
		this.center = center;
		this.color = color;
		this.size = size;
		
		suica.scene.add( this.threejs );
	}

} // class Cube




class CubeFrame extends Mesh
{
	
	constructor( suica, center, size, color )
	{
		suica.parser?.parseTags();
		if (DEBUG_CALLS) console.log(`:: ${suica.id}.cubeFrame(${center},${size},${color})`);
		
		super( suica, THREE.LineSegments, CubeFrame.geometry, Mesh.lineMaterial.clone() );

		this.center = center;
		this.color = color;
		this.size = size;
		
		suica.scene.add( this.threejs );

	}
	
} // class CubeFrame


CubeFrame.geometry = new THREE.BufferGeometry();
CubeFrame.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
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
CubeFrame.geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([
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




window.cube = function(
				center = Suica.DEFAULT.CUBE.CENTER,
				size   = Suica.DEFAULT.CUBE.SIZE,
				color  = Suica.DEFAULT.CUBE.COLOR )
{
	Suica.precheck();
	return Suica.current.cube( center, size, color );
}




window.cubeFrame = function(
				center = Suica.DEFAULT.CUBE.CENTER,
				size   = Suica.DEFAULT.CUBE.SIZE,
				color  = Suica.DEFAULT.CUBE.FRAMECOLOR )
{
	Suica.precheck();
	return Suica.current.cubeFrame( center, size, color );
}