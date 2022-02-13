//
// Suica 2.0 Square
// CC-3.0-SA-NC
//
// square( center, size, color )
//
// <square id="" center="" size="" color="" wireframe="">
// <square x="" y="" z="">
// <square width="" height="">
//
// center	center [x,y,z]
// x		x coordinate of center
// y		y coordinate of center
// z		z coordinate of center
// size		size(s) of edge
// width
// height
// color	color [r,g,b]
// wireframe true (wireframe) or false (solid)
// image	texture (drawing or canvas)
//
//===================================================


class Square extends Mesh
{
	static solidGeometry = new THREE.PlaneGeometry( 1, 1 );
	static frameGeometry = new THREE.BufferGeometry();
	
	static
	{
		this.frameGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
			-0.5,-0.5,0, +0.5,-0.5,0, 
			+0.5,-0.5,0, +0.5,+0.5,0, 
			+0.5,+0.5,0, -0.5,+0.5,0, 
			-0.5,+0.5,0, -0.5,-0.5,0, 
		]), 3));
		this.frameGeometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([
			0, 0,  1, 0,
			0, 0,  1, 0,
			0, 0,  1, 0,
			0, 0,  1, 0,
		]), 2));
			
	} // Square.static
	
	constructor( suica, center, size, color )
	{
		suica.parser?.parseTags();
		suica.debugCall( 'square', center, size, color );
		
		super( suica, 
			/*solid*/ new THREE.Mesh( Square.solidGeometry, Mesh.solidMaterial.clone() ),
			/*frame*/ new THREE.LineSegments( Square.frameGeometry, Mesh.lineMaterial.clone() ),
		);
		
		this.center = center;
		this.color = color;
		this.size = size;
		
	} // Square.constructor

} // class Square




window.square = function(
				center = Suica.DEFAULT.SQUARE.CENTER,
				size   = Suica.DEFAULT.SQUARE.SIZE,
				color  = Suica.DEFAULT.SQUARE.COLOR )
{
	Suica.precheck();
	return Suica.current.square( center, size, color );
}
