//
// Suica 2.0 Point
// CC-3.0-SA-NC
//
// {suica.}point( center, size, color )
//		center
//		x
//		y
//		z
//		size
//		color
//		visible
//		image
//
// <point id="..." center="x,y,z" x="..." y="..." z="..." size="..." color="...">
//
//===================================================




class Point extends THREE.Points
{
	// a geometry shared by all points
	static geometry = new THREE.BufferGeometry( ).setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( [0,0,0] ), 3 ) );
	
	
	constructor( suica, center, size, color )
	{
		super( Point.geometry, Suica.pointMaterial.clone() );
		
		this.suica = suica;
		this.center = center;
		this.color = color;
		this.size = size;
		
		suica.scene.add( this );
	} // Point.constructor
	
	
	// point coordinates [x,y,z]
	get center ( )
	{
		return [this.position.x, this.position.y, this.position.z];
	}
	
	set center ( center )
	{
		this.position.set( center[0], center[1], center[2] );
	}
	
	
	// point x coordinate
	get x ( )
	{
		return this.position.x;
	}
	
	
	set x ( x )
	{
		this.position.x = x;
	}
	
	
	// point y coordinate
	get y ( )
	{
		return this.position.y;
	}
	
	
	set y ( y )
	{
		this.position.y = y;
	}
	
	
	// point z coordinate
	get z ( )
	{
		return this.position.z;
	}
	
	
	set z ( z )
	{
		this.position.z = z;
	}
	
	
	// point size
	get size( )
	{
		return this.material.size;
	}


	set size( size )
	{
		this.material.size = size;
		this.material.needsUpdate = true;
	}


	// point color
	get color( )
	{
		this.suica.parser?.parseTags();
		var col = this.material.color;
		return [col.r, col.g, col.b];
	}

	set color( col )
	{
		if( DEBUG_CALLS ) console.log(`:: ${this.suica.id}.point.color = ${col}`);
		this.suica.parser?.parseTags();
		this.material.color = Suica.parseColor( col );
		this.material.needsUpdate = true;
	}

	//set visible - inherited from THREE.Point
	//get visible
	
	set image( drawing )
	{
		if( DEBUG_CALLS ) console.log(`:: ${this.suica.id}.point.image = ${drawing}`);

		if( drawing instanceof Drawing )
		{
			this.material.map = drawing.image;
			return;
		}
		
		throw 'error: Parameter of `image` is not a drawing';
	}
}

function point( center=Suica.DEFAULT.POINT.CENTER, size=Suica.DEFAULT.POINT.SIZE, color=Suica.DEFAULT.POINT.COLOR )
{
	Suica.precheck();
	return Suica.current.point( center, size, color );
}