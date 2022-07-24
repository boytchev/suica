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


	get randomIn( )
	{
		var x = random( -1/2, 1/2 ) * this.width,
			y = random( -1/2, 1/2 ) * this.height,
			z = random( -1/2, 1/2 ) * this.depth;

		return this.objectPosition( [x,y,z] );
	} // Cube.randomIn


	get randomOn( )
	{
		var n,m,k;
		var s = this.threejs.scale;
		switch( this.suica.orientation )
		{
			case Suica.ORIENTATIONS.YXZ:
			case Suica.ORIENTATIONS.XYZ: [n,m,k] = [s.x,s.y,s.z]; break;
			case Suica.ORIENTATIONS.ZYX:
			case Suica.ORIENTATIONS.YZX: [n,m,k] = [s.y,s.z,s.x]; break;
			case Suica.ORIENTATIONS.XZY:
			case Suica.ORIENTATIONS.ZXY: [n,m,k] = [s.x,s.z,s.y]; break;
		}
		
		var nm = n*m,
			mk = m*k,
			nk = n*k;
			
		var a = random([-1/2, 1/2]),
			b = random( -1/2, 1/2 ),
			c = random( -1/2, 1/2 );
		var rnd = random( 0, nm+mk+nk );
		if( rnd < nk ) [a,b] = [b,a]
		else
		if( rnd < nk+nm ) [a,c] = [c,a]

		var x, y, z;
		switch( this.suica.orientation )
		{
			case Suica.ORIENTATIONS.YXZ:
			case Suica.ORIENTATIONS.XYZ: [x,y,z] = [a,b,c]; break;
			case Suica.ORIENTATIONS.ZYX:
			case Suica.ORIENTATIONS.YZX: [x,y,z] = [c,a,b]; break;
			case Suica.ORIENTATIONS.XZY:
			case Suica.ORIENTATIONS.ZXY: [x,y,z] = [a,c,b]; break;
		}		
			
		return this.objectPosition( [x*this.width, y*this.height, z*this.depth] );

	} // Cube.randomOn
	
} // class Cube
