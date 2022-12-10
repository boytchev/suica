//
// Suica 2.0 Extrude
// CC-3.0-SA-NC
//
//
//===================================================



class Extrude extends Mesh
{
	static SIZE = [1,1,1];
	static COLOR = 'lightsalmon';
	static RADIUS = 0;
	static OFFSET = 0;
	static COUNT = 10;
	static SHAPECOUNT = 10;

	constructor( suica, shapes, center, size, color )
	{
		suica.parser?.parseTags();
		suica.debugCall( 'extrude', shapes, center, size, color );

		var shape;
		var settings = {
				steps: 1,
				depth: 1,
				curveSegments: Extrude.SHAPECOUNT,
				bevelEnabled: true,
				bevelThickness: Extrude.RADIUS,
				bevelSize: Extrude.RADIUS,
				bevelOffset: Extrude.OFFSET,
				bevelSegments: Extrude.COUNT
			};
		
		if( shapes instanceof THREE.Shape )
		{
			shape = shapes;
			settings = shapes.settings;
		}
		else
		if( shapes instanceof Array )
		{
			shape = shapes[0].shape.clone();
			shape.holes = [];
			for( var i=1; i<shapes.length; i++ )
				shape.holes.push( shapes[i].shape.clone() );
		}
		else
		{
			shape = shapes.shape.clone();
			shape.holes = [ ];
		}
		
		var geometry = new THREE.ExtrudeGeometry( shape, settings );
		
		super( suica, 
			new THREE.Mesh( geometry, Mesh.solidMaterial.clone() ),
			null, // no wireframe
		);
		
		this.shape = shape;
		this.settings = settings;
		this.center = Suica.parseCenter( center );
		this.size = Suica.parseSize( size, Extrude.SIZE );
		this.color = Suica.parseColor( color, Extrude.COLOR);

	} // Extrude.constructor
	
	
	
	get radius( )
	{
		return this.settings.bevelThickness;
	}
	set radius( radius )
	{
		this.settings.bevelThickness = Math.abs(radius/this.depth);
		this.settings.bevelSize = radius/this.width;
		this.solidMesh.geometry.dispose( );
		this.solidMesh.geometry = new THREE.ExtrudeGeometry( this.shape, this.settings );
	}


	
	get offset( )
	{
		return this.settings.bevelOffset;
	}
	set offset( offset )
	{
		this.settings.bevelOffset = offset;
		this.solidMesh.geometry.dispose( );
		this.solidMesh.geometry = new THREE.ExtrudeGeometry( this.shape, this.settings );
	}


	
	get count( )
	{
		return [this.settings.bevelSegments, this.settings.curveSegments];
	}
	set count( count )
	{
		if( count instanceof Array )
		{
			this.settings.bevelSegments = count[0];
			this.settings.curveSegments = count[1] || count[0];
		}
		else
		{
			this.settings.bevelSegments = count;
		}
		this.solidMesh.geometry.dispose( );
		this.solidMesh.geometry = new THREE.ExtrudeGeometry( this.shape, this.settings );
	}
	
	get clone( )
	{
		this.shape.settings = {...this.settings};

		var object = new Extrude( this.suica, this.shape, this.center, this.size, this.color );
		
		object.spin = this.spin;
		object.image = this.image;
		object.images = this.images;
		object.visible = this.visible;

		Suica.cloneEvents( object, this );
			
		return object;
		
	} // Extrude.clone
	
} // class Extrude
