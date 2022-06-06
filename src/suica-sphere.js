//
// Suica 2.0 Sphere
// CC-3.0-SA-NC
//
//===================================================


Sphere = class Sphere extends Mesh
{
	static COLOR = 'lightsalmon';
	static SIZE = 30;
	static COUNT = 50;
	
	constructor( suica, center, size, color )
	{
		suica.parser?.parseTags();
		suica.debugCall( 'sphere', center, size, color );
		
		suica._.solidGeometry.sphere = null; // array of geometries for different number of sides

		if( !suica._.solidGeometry.sphere )
		{
			suica._.solidGeometry.sphere = suica.flipNormal( new THREE.SphereGeometry( 0.5, Sphere.COUNT, Math.round(Sphere.COUNT/2) ).applyMatrix4( suica.orientation.MATRIX ) );
		}
		
		super( suica, 
			new THREE.Mesh( suica._.solidGeometry.sphere, Mesh.solidMaterial.clone() ),
			null, // no wireframe
		);

		this.center = Suica.parseCenter(center);
		this.size = Suica.parseSize(size, Sphere.SIZE);
		this.color = Suica.parseColor(color, Sphere.COLOR);

	} // Sphere.constructor


	get clone( )
	{
		var object = new Sphere( this.suica, this.center, this.size, this.color );
		
		object.spin = this.spin;
		object.image = this.image;
		Suica.cloneEvents( object, this );
			
		return object;
		
	} // Sphere.clone
	
} // class Sphere

