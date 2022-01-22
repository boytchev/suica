//
// Suica 2.0 Point
// CC-3.0-SA-NC
//
// {suica.}cube( center, size, color )
//		center
//		x
//		y
//		z
//		size
//		color
//		visible
//
//
//===================================================




class Cube extends THREE.Mesh
{
	// a geometry shared by all points
	static geometry = new THREE.BoxGeometry( 1, 1, 1 );
	
	constructor( suica, center, size, color )
	{
		super( Cube.geometry, Suica.solidMaterial.clone() );
		
		this.suica = suica;
		this.center = center;
		this.color = color;
		this.size = size;
		
		suica.scene.add( this );
	}
	
	// cube coordinates [x,y,z]
	get center ( )
	{
		return [this.position.x, this.position.y, this.position.z];
	}
	
	set center ( center )
	{
		this.position.set( center[0], center[1], center[2] );
	}
	
	// cube center x coordinate
	get x ( )
	{
		return this.position.x;
	}
	
	set x ( x )
	{
		this.position.x = x;
	}
	
	// cube center coordinate
	get y ( )
	{
		return this.position.y;
	}
	
	set y ( y )
	{
		this.position.y = y;
	}
	
	// cube center coordinate
	get z ( )
	{
		return this.position.z;
	}
	
	set z ( z )
	{
		this.position.z = z;
	}
	
	// cube size
	get size( )
	{
		return this.scale.x;
	}

	set size( size )
	{
		this.scale.set( size, size, size );
	}

	// cube color
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
}

function cube( center=Suica.DEFAULT.CUBE.CENTER, size=Suica.DEFAULT.CUBE.SIZE, color=Suica.DEFAULT.CUBE.COLOR )
{
	Suica.precheck();
	return Suica.current.cube( center, size, color );
}