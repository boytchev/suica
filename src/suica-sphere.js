//
// Suica 2.0 Sphere
// CC-3.0-SA-NC
//
//===================================================


Sphere = class Sphere extends Mesh
{
	static COLOR = 'lightsalmon';
	static SIZE = 30;
	
	constructor( suica, center, size, color )
	{
		suica.parser?.parseTags();
		suica.debugCall( 'sphere', center, size, color );
		
		suica._.solidGeometry.sphere = null; // array of geometries for different number of sides

		if( !suica._.solidGeometry.sphere )
		{
			suica._.solidGeometry.sphere = suica.flipNormal( new THREE.SphereGeometry( 0.5, Suica.CIRCLECOUNT, Math.round(Suica.CIRCLECOUNT/2) ).applyMatrix4( suica.orientation.MATRIX ) );
		}
		
		super( suica, 
			new THREE.Mesh( suica._.solidGeometry.sphere, Mesh.solidMaterial.clone() ),
			null, // no wireframe
		);

		this.center = Suica.parseCenter(center);
		this.size = Suica.parseSize(size, Sphere.SIZE);
		this.color = Suica.parseColor(color, Sphere.COLOR);

	} // Sphere.constructor


	randomDirection( scale )
	{
		var z = random( -1, 1 ),
			alpha = random( 0, 2*Math.PI ),		
			r = Math.sqrt( 1 - z**2 );

		return new THREE.Vector3(
			scale * r * Math.cos( alpha ),
			scale * r * Math.sin( alpha ),
			scale * z
		);
	}
	
	get clone( )
	{
		var object = new Sphere( this.suica, this.center, this.size, this.color );
		
		object.spin = this.spin;
		object.image = this.image;
		object.images = this.images;
		object.visible = this.visible;

		Suica.cloneEvents( object, this );
			
		return object;
		
	} // Sphere.clone


	get randomIn( )
	{
		var r = Math.pow( random(0,1), 1/3 );
		var v = this.randomDirection(r/2).applyMatrix4( this.suica.orientation.MATRIX );
		return this.objectPosition( [v.x*this.width, v.y*this.height, v.z*this.depth]  );
		
	} // Sphere.randomIn
	


	get randomOn( )
	{
		var v = this.randomDirection(1/2).applyMatrix4( this.suica.orientation.MATRIX );
		return this.objectPosition( [v.x*this.width, v.y*this.height, v.z*this.depth]  );
	} // Sphere.randomOn
	
} // class Sphere

