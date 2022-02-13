//
// Suica 2.0 Sphere
// CC-3.0-SA-NC
//
// sphere( center, size, color )
//
// <sphere id="" center="" size="" color="">
// <sphere x="" y="" z="">
// <sphere width="" height="" depth="">
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


class Sphere extends Mesh
{
	static solidGeometry;
	
	constructor( suica, center, size, color )
	{
		suica.parser?.parseTags();
		suica.debugCall( 'sphere', center, size, color );
		
		if( !Sphere.solidGeometry )
		{
			Sphere.solidGeometry = new THREE.SphereGeometry( 0.5, Suica.DEFAULT.SPHERE.COUNT, Math.round(Suica.DEFAULT.SPHERE.COUNT/2) );
		}
		
		super( suica, 
			new THREE.Mesh( Sphere.solidGeometry, Mesh.solidMaterial.clone() ),
			null, // no wireframe
		);
		
		this.center = center;
		this.color = color;
		this.size = size;

	} // Sphere.constructor

} // class Sphere




window.sphere = function(
				center = Suica.DEFAULT.SPHERE.CENTER,
				size   = Suica.DEFAULT.SPHERE.SIZE,
				color  = Suica.DEFAULT.SPHERE.COLOR )
{
	Suica.precheck();
	return Suica.current.sphere( center, size, color );
}
