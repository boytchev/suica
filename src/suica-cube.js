//
// Suica 2.0 Cube
// CC-3.0-SA-NC
//
//===================================================


class Cube extends Mesh
{
	static COLOR = 'lightsalmon';
	static FRAMECOLOR = 'black';
	static SIZE = 30;		
	
	constructor( suica, center, size, color )
	{
		suica.parser?.parseTags();
		suica.debugCall( 'cube', center, size, color );
		
		suica._.solidGeometry.cube = suica.flipNormal( new THREE.BoxGeometry( 1, 1, 1 ).applyMatrix4( suica.orientation.MATRIX ) );
		suica._.frameGeometry.cube = new THREE.BufferGeometry();

		suica._.frameGeometry.cube.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
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
		suica._.frameGeometry.cube.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([
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

		suica._.frameGeometry.cube = suica._.frameGeometry.cube.applyMatrix4( suica.orientation.MATRIX );
		
		super( suica, 
			new THREE.Mesh( suica._.solidGeometry.cube, Mesh.solidMaterial.clone() ),
			new THREE.LineSegments( suica._.frameGeometry.cube, Mesh.lineMaterial.clone() ),
		);
		
		this.center = Suica.parseCenter(center);
		this.size = Suica.parseSize(size, Cube.SIZE);
		this.color = Suica.parseColor(color, Cube.COLOR);
		
	} // Cube.constructor


	get clone( )
	{
		var object = new Cube( this.suica, this.center, this.size, this.color );
		
		object.spin = this.spin;
		object.wireframe = this.wireframe;
		object.image = this.image;
		object.visible = this.visible;

		Suica.cloneEvents( object, this );
		
		return object;
		
	} // Cube.clone

} // class Cube
