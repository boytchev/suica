//
// Suica 2.0 Square
// CC-3.0-SA-NC
//
// square( center, size, color )
// squareFrame( center, size, color )
//
// <square id="" center="" size="" color="">
// <square x="" y="" z="">
// <square width="" height="">
// <squareFrame ...>
//
// center	center [x,y,z]
// x		x coordinate of center
// y		y coordinate of center
// z		z coordinate of center
// size		size(s) of edge
// width
// height
// color	color [r,g,b]
// image	texture (drawing or canvas)
//
//===================================================


class Square extends Mesh
{
	
	// a geometry shared by all cubes
	static geometry = new THREE.PlaneGeometry( 1, 1 );
	
	constructor( suica, center, size, color )
	{
		suica.parser?.parseTags();
		if (DEBUG_CALLS) console.log(`:: ${suica.id}.square(${center},${size},${color})`);
		
		super( suica, THREE.Mesh, Square.geometry, Suica.solidMaterial.clone() );
		
		this.center = center;
		this.color = color;
		this.size = size;
		
		suica.scene.add( this.threejs );
	}

} // class Square




class SquareFrame extends Mesh
{
	
	// a geometry shared by all square frames
	static geometry = new THREE.EdgesGeometry( Square.geometry );
	
	constructor( suica, center, size, color )
	{
		suica.parser?.parseTags();
		if (DEBUG_CALLS) console.log(`:: ${suica.id}.squareFrame(${center},${size},${color})`);
		
		super( suica, THREE.LineSegments, SquareFrame.geometry, Suica.lineMaterial.clone() );
		
		this.center = center;
		this.color = color;
		this.size = size;
		
		suica.scene.add( this.threejs );
	}
	
} // class SquareFrame




window.square = function(
				center = Suica.DEFAULT.SQUARE.CENTER,
				size   = Suica.DEFAULT.SQUARE.SIZE,
				color  = Suica.DEFAULT.SQUARE.COLOR )
{
	Suica.precheck();
	return Suica.current.square( center, size, color );
}




window.squareFrame = function(
				center = Suica.DEFAULT.SQUARE.CENTER,
				size   = Suica.DEFAULT.SQUARE.SIZE,
				color  = Suica.DEFAULT.SQUARE.FRAMECOLOR )
{
	Suica.precheck();
	return Suica.current.squareFrame( center, size, color );
}