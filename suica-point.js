//
// Suica 2.0 Point
// CC-3.0-SA-NC
//
// {suica.}point( center, size, color )
//		center
//		size
//		color
//		visible
//
//		
//===================================================
//
// History
//	2.0.00 (220118)	initiation
//	2.0.01 (220119)	custom tags, nested tags, background, oxyz, animate
//
//===================================================




class Point extends THREE.Points
{
	// generate geometry and material for all points
	static geometry;
	static material;
	
	static {
		var CANVAS_SIZE = 64;
		var canvas = document.createElement('canvas');
			canvas.width = CANVAS_SIZE;
			canvas.height = CANVAS_SIZE;
			
		var context = canvas.getContext('2d');
			context.fillStyle = 'white';
			context.beginPath( );
			context.arc( CANVAS_SIZE/2, CANVAS_SIZE/2, CANVAS_SIZE/2-1, 0, 2*Math.PI );
			context.fill( );

		let vertices = new Float32Array( [0,0,0] );
		let position = new THREE.BufferAttribute( vertices, 3 );
		
		this.geometry = new THREE.BufferGeometry( );
		this.geometry.setAttribute( 'position', position );

		this.material = new THREE.PointsMaterial( {
				color: 'white',
				size: 5,
				sizeAttenuation: false,
				map: new THREE.CanvasTexture( canvas ),
				transparent: !true,
				alphaTest: 0.2,
			});

	}
	
	constructor( suica, center, size, color )
	{
		super( Point.geometry, Point.material.clone() );
		
		this.suica = suica;
		this.center = center;
		this.color = color;
		this.size = size;
		
		suica.scene.add( this );
	}
	
	set center ( center )
	{
		this.position.set( center[0], center[1], center[2] );
	}
	
	get center ( )
	{
		return [this.position.x, this.position.y, this.position.z];
	}
	
	set x ( x )
	{
		this.position.x = x;
	}
	
	get x ( )
	{
		return this.position.x;
	}
	
	set y ( y )
	{
		this.position.y = y;
	}
	
	get y ( )
	{
		return this.position.y;
	}
	
	set z ( z )
	{
		this.position.z = z;
	}
	
	get z ( )
	{
		return this.position.z;
	}
	

	set color( col )
	{
		this.material.color = new THREE.Color( col );
		this.material.needsUpdate = true;
	}

	set size( size )
	{
		this.material.size = size;
		this.material.needsUpdate = true;
	}

	get size( )
	{
		return this.material.size;
	}

	//set visible - inherited from THREE.Point
	//get visible
}

function point( center=Suica.DEFAULT.POINT.CENTER, size=Suica.DEFAULT.POINT.SIZE, color=Suica.DEFAULT.POINT.COLOR )
{
	Suica.precheck();
	return Suica.current.point( center, size, color );
}