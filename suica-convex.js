//
// Suica 2.0 Convex
// CC-3.0-SA-NC
//
//
//===================================================



class Convex extends Mesh
{
	static POINTS = []
	static COLOR = 'lightsalmon';

	constructor( suica, points, size, color )
	{
		suica.parser?.parseTags();
		suica.debugCall( 'convex', points, size, color );

		var threejsPoints = [];
		for( var pnt of points )
		{
			threejsPoints.push( new THREE.Vector3( ...pnt ) );
		}
		var geometry = new THREE.ConvexGeometry( threejsPoints );
		
		super( suica, 
			new THREE.Mesh( geometry, Mesh.solidMaterial.clone() ),
			null, // no wireframe
		);
		
		this.center = [0,0,0];
		this.size = Suica.parseSize( size, Tube.SIZE );
		this.color = Suica.parseColor( color, Tube.COLOR);
		this._points = points;

	} // Convex.constructor

	get clone( )
	{
		var object = new Tube( this.suica, this.points, this.size, this.color );
		
		object.spin = this.spin;
		object.image = this.image;

		Suica.cloneEvents( object, this );
			
		return object;
		
	} // Convex.clone
	
} // class Convex
