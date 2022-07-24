//
// Suica 2.0 Square
// CC-3.0-SA-NC
//
//===================================================


class Square extends Mesh
{
	static COLOR = 'lightsalmon';
	static FRAMECOLOR = 'black';
	static SIZE = 30;
	
	constructor( suica, center, size, color )
	{
		suica.parser?.parseTags();
		suica.debugCall( 'square', center, size, color );
		
		suica._.solidGeometry.square = suica.flipNormal( new THREE.PlaneGeometry( 1, 1 ).applyMatrix4( suica.orientation.MATRIX ) ); // array of geometries for different number of sides
		suica._.frameGeometry.square = new THREE.BufferGeometry(); // array of geometries for different number of sides
		suica._.frameGeometry.square.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
			-0.5,-0.5,0, +0.5,-0.5,0, 
			+0.5,-0.5,0, +0.5,+0.5,0, 
			+0.5,+0.5,0, -0.5,+0.5,0, 
			-0.5,+0.5,0, -0.5,-0.5,0, 
		]), 3));
		suica._.frameGeometry.square.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([
			0, 0,  1, 0,
			0, 0,  1, 0,
			0, 0,  1, 0,
			0, 0,  1, 0,
		]), 2));
		suica._.frameGeometry.square.applyMatrix4( suica.orientation.MATRIX );
		
		super( suica, 
			/*solid*/ new THREE.Mesh( suica._.solidGeometry.square, Mesh.solidMaterial.clone() ),
			/*frame*/ new THREE.LineSegments( suica._.frameGeometry.square, Mesh.lineMaterial.clone() ),
		);
		
		this.center = Suica.parseCenter(center);
		this.size = Suica.parseSize(size, Square.SIZE);
		this.color = Suica.parseColor(color, Square.COLOR);
		
	} // Square.constructor


	get clone( )
	{
		var object = new Square( this.suica, this.center, this.size, this.color );
		
		object.spin = this.spin;
		object.wireframe = this.wireframe;
		object.image = this.image;
		object.visible = this.visible;

		Suica.cloneEvents( object, this );
		
		return object;
		
	} // Square.clone



	get randomIn( )
	{
		var x = random( -1/2, 1/2 ) * this.width,
			y = random( -1/2, 1/2 ) * this.height,
			z = random( -1/2, 1/2 ) * this.depth;
			
		switch( this.suica.orientation )
		{
			case Suica.ORIENTATIONS.YXZ:
			case Suica.ORIENTATIONS.XYZ: return this.objectPosition( [x,y,0] );
			
			case Suica.ORIENTATIONS.ZYX:
			case Suica.ORIENTATIONS.YZX: return this.objectPosition( [0,y,z] );
			
			case Suica.ORIENTATIONS.XZY:
			case Suica.ORIENTATIONS.ZXY: return this.objectPosition( [x,0,z] );
		}
		
	} // Square.randomIn


	get randomOn( )
	{
		var n,m;
		var s = this.threejs.scale;
		switch( this.suica.orientation )
		{
			case Suica.ORIENTATIONS.YXZ:
			case Suica.ORIENTATIONS.XYZ: [n,m] = [s.x,s.y]; break;
			case Suica.ORIENTATIONS.ZYX:
			case Suica.ORIENTATIONS.YZX: [n,m] = [s.y,s.z]; break;
			case Suica.ORIENTATIONS.XZY:
			case Suica.ORIENTATIONS.ZXY: [n,m] = [s.x,s.z]; break;
		}

		var a = random( -1/2, 1/2 ),
			b = random([-1/2, 1/2]);
		if( random(0,n+m)<m ) [a,b] = [b,a];
		
		var x, y, z;
		switch( this.suica.orientation )
		{
			case Suica.ORIENTATIONS.YXZ:
			case Suica.ORIENTATIONS.XYZ: [x,y,z] = [a,b,0]; break;
			case Suica.ORIENTATIONS.ZYX:
			case Suica.ORIENTATIONS.YZX: [x,y,z] = [0,a,b]; break;
			case Suica.ORIENTATIONS.XZY:
			case Suica.ORIENTATIONS.ZXY: [x,y,z] = [a,0,b]; break;
		}

		return this.objectPosition( [x*this.width, y*this.height, z*this.depth] );

	} // Square.randomOn

} // class Square

