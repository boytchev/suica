//
// Suica 2.0 Point
// CC-3.0-SA-NC
//
//===================================================


class Point extends Mesh
{
	static COLOR = 'black';
	static SIZE = 7;

	static solidGeometry;


	constructor(suica, center, size, color)
	{
		suica.parser?.parseTags();
		suica.debugCall( 'point', center, size, color );

		if( !Point.solidGeometry )
		{
			Point.solidGeometry = new THREE.BufferGeometry();
			Point.solidGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3));
		}
		
		super( suica,
			new THREE.Points( Point.solidGeometry, Mesh.pointMaterial.clone() ),
			null, // no wireframe
		);

		this.center = Suica.parseCenter( center );
		this.size = Suica.parseSize( size, Point.SIZE);
		this.color = Suica.parseColor( color, Point.COLOR);
		
		this._drawing = this.threejs.material.map;

	} // Point.constructor




	get size()
	{
		this.suica.parser?.parseTags();

		return this.threejs.material.size;
	}

	set size( size )
	{
		this.suica.parser?.parseTags();

		this.threejs.material.size = size;
		this.threejs.material.needsUpdate = true;
	}



	style( properties )
	{
		for( var n in properties ) this[n] = properties[n];
		return this;
		
	} // Point.style



	get clone( )
	{
		var object = new Point( this.suica, this.center, this.size, this.color );

		object.image = this.image;
		object.images = this.images;
		object.visible = this.visible;

		Suica.cloneEvents( object, this );
		
		return object;
		
	} // Point.clone
	
} // class Point

