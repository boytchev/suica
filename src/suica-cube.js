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
		var wh = this.width*this.height,
			wd = this.width*this.depth,
			hd = this.height*this.depth;
	
		switch( this.suica.orientation )
		{
			case Suica.ORIENTATIONS.ZYX:
			case Suica.ORIENTATIONS.XYZ: break;
			case Suica.ORIENTATIONS.YZX:
			case Suica.ORIENTATIONS.XZY: [wh,wd] = [wd,wh]; break;
			case Suica.ORIENTATIONS.ZXY:
			case Suica.ORIENTATIONS.YXZ: [hd,wd] = [wd,hd]; break;
		}
		
		var rnd = random( 0, wh+wd+hd );

		var x, y, z;
		
		if( rnd <= wh )
		{
			x = random( -1/2, 1/2 ) * this.width;
			y = random( -1/2, 1/2 ) * this.height;
			z = random([-1/2, 1/2]) * this.depth;
		}
		else if( rnd <= wh+wd )
		{
			x = random( -1/2, 1/2 ) * this.width;
			y = random([-1/2, 1/2]) * this.height;
			z = random( -1/2, 1/2 ) * this.depth;
		}
		else
		{
			x = random([-1/2, 1/2]) * this.width;
			y = random( -1/2, 1/2 ) * this.height;
			z = random( -1/2, 1/2 ) * this.depth;
		}
			
		return this.objectPosition( [x,y,z] );
	} // Cube.randomOn
	
} // class Cube
