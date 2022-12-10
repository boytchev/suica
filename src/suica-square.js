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
		object.images = this.images;
		object.visible = this.visible;

		Suica.cloneEvents( object, this );
		
		return object;
		
	} // Square.clone



	get randomIn( )
	{
		var x = random( -1/2, 1/2 ),
			y = random( -1/2, 1/2 );
		
		var v = new THREE.Vector3( x, y, 0 ).applyMatrix4( this.suica.orientation.MATRIX );
		return this.objectPosition( [v.x*this.width, v.y*this.height, v.z*this.depth]  );
	} // Square.randomIn


	get randomOn( )
	{
		var x, y;
			
		var rnd = random( 0, this.width+this.height );
			
		if( rnd<this.width )
		{
			x = random( -1/2, 1/2 );
			y = random([-1/2, 1/2]);
		}
		else
		{
			x = random([-1/2, 1/2]);
			y = random( -1/2, 1/2 );
		}
		
		var v = new THREE.Vector3( x, y, 0 ).applyMatrix4( this.suica.orientation.MATRIX );
		return this.objectPosition( [v.x*this.width, v.y*this.height, v.z*this.depth]  );
	} // Square.randomOn

} // class Square

