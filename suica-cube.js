//
// Suica 2.0 Cube
// CC-3.0-SA-NC
//
// cube( center, size, color )
//
// <cube id="" center="" x="" y="" z="" size="" color="">
//
//	center		center [x,y,z]
//	x			x coordinate of center
//	y			y coordinate of center
//	z			z coordinate of center
//	size		size of edge
//	color		color [r,g,b]
//	image		texture (drawing or canvas)
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
		super( Cube.geometry, Suica.solidMaterial.clone() );
		
		this.suica = suica;
		this.center = center;
		this.color = color;
		this.size = size;
		
		suica.scene.add( this );
	}
	
	
	
	
	get size( )
	{
		this.suica.parser?.parseTags();
		
		return this.scale.x;
	}

	set size( size )
	{
		this.suica.parser?.parseTags();
		
		this.scale.set( size, size, size );
	}

} // class Cube




window.cube = function(
				center = Suica.DEFAULT.CUBE.CENTER,
				size   = Suica.DEFAULT.CUBE.SIZE,
				color  = Suica.DEFAULT.CUBE.COLOR )
{
	Suica.precheck();
	return Suica.current.cube( center, size, color );
}