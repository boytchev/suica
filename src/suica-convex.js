//
// Suica 2.0 Convex
// CC-3.0-SA-NC
//
//
//===================================================



class Convex extends Mesh
{
	static POINTS = [[1,1,1], [1,1,-1], [1,-1,1], [1,-1,-1], [-1,1,1], [-1,1,-1], [-1,-1,1], [-1,-1,-1]];
	static SIZE = [1,1,1];
	static COLOR = 'lightsalmon';

	constructor( suica, points, size, color )
	{
		suica.parser?.parseTags();
		suica.debugCall( 'convex', points, size, color );
		
		var geometry = Convex.generateGeometry( points );
		
		super( suica, 
			new THREE.Mesh( geometry, Mesh.solidMaterial.clone() ),
			null, // no wireframe
		);
		
		this.center = [0,0,0];
		this.size = Suica.parseSize( size, Convex.SIZE );
		this.color = Suica.parseColor( color, Convex.COLOR);
		this._points = points;

	} // Convex.constructor


	static generateGeometry( points )
	{
		var threejsPoints = [];
		for( var pnt of points )
		{
			if( pnt.center ) pnt = pnt.center;
			threejsPoints.push( new THREE.Vector3( ...pnt ) );
		}

		var geometry = new THREE.ConvexGeometry( threejsPoints );

		const MAX_X = 1, MAX_Y = 2, MAX_Z = 3;
		
		var uvs = [];
		var pos = geometry.getAttribute( 'position' ),
			nor = geometry.getAttribute( 'normal' );
		for( var i=0; i<pos.count; i++ )
		{
			// get the two minimal components of normal vector: XY, XZ or YZ
			var nx = Math.abs( nor.getX( i ) ),
				ny = Math.abs( nor.getY( i ) ),
				nz = Math.abs( nor.getZ( i ) );
				
			var max = MAX_X;
			if( ny>=nx && ny>=nz ) max = MAX_Y
			else
			if( nz>=nx && nz>=nx ) max = MAX_Z;
			
			var x = pos.getX( i ),
				y = pos.getY( i ),
				z = pos.getZ( i );

			switch( max )
			{
				case MAX_X:
					uvs.push( y, z );
					break;
				case MAX_Y:
					uvs.push( x, z );
					break;
				case MAX_Z:
					uvs.push( x, y );
					break;
			}
		}
		
		geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
		
		return geometry;
	} // Convex.generateGeometry
	
	
	get clone( )
	{
		var object = new Convex( this.suica, this._points, this.size, this.color );
		
		object.spin = this.spin;
		object.image = this.image;
		object.visible = this.visible;

		Suica.cloneEvents( object, this );
			
		return object;
		
	} // Convex.clone


	set src( points )
	{
		this._points = points;
		this.threejs.geometry.dispose();
		this.threejs.geometry = Convex.generateGeometry( points );
	} // Convex.src = ...
	
	
} // class Convex
