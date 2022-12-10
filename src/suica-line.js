//
// Suica 2.0 Line
// CC-3.0-SA-NC
//
//===================================================


class Line extends Mesh
{
	static COLOR = 'black';
	static TO = [0,30,0];

	static solidGeometry;


	constructor( suica, center, to, color )
	{
		suica.parser?.parseTags();
		suica.debugCall( 'line', center, to, color );
			
		if( !Line.solidGeometry )
		{
			Line.solidGeometry = new THREE.BufferGeometry();
			Line.solidGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0, 0, 30, 0]), 3));
			Line.solidGeometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([0, 0, 1, 0]), 2));
		}
		
		super( suica,
			new THREE.LineSegments( Line.solidGeometry.clone(), Mesh.lineMaterial.clone() ),
			null, // no wireframe
		);

		this.center = Suica.parseCenter( center );
		this.to = Suica.parseCenter( to, Line.TO );
		this.color = Suica.parseColor( color, Line.COLOR);

	} // Line.constructor



	get center()
	{
		this.suica.parser?.parseTags();

		var pos = this.threejs.geometry.getAttribute( 'position' );
		return [pos.getX(0), pos.getY(0), pos.getZ(0)];
	}

	set center(center)
	{
		this.suica.parser?.parseTags();

		center = Suica.parseCenter( center );
		
		var pos = this.threejs.geometry.getAttribute( 'position' );
		pos.setXYZ( 0, ...center );
		pos.needsUpdate = true;
	}




	get from()
	{
		return this.center;
	}

	set from(from)
	{
		this.center = from;
	}




	get to()
	{
		this.suica.parser?.parseTags();

		var pos = this.threejs.geometry.getAttribute( 'position' );
		return [pos.getX(1), pos.getY(1), pos.getZ(1)];
	}

	set to(to)
	{
		this.suica.parser?.parseTags();

		to = Suica.parseCenter( to );
		
		var pos = this.threejs.geometry.getAttribute( 'position' );
		pos.setXYZ( 1, ...to );
		pos.needsUpdate = true;
	}



	get clone( )
	{
		var object = new Line( this.suica, this.from, this.to, this.color );
		
		object.image = this.image;
		object.images = this.images;
		object.visible = this.visible;

		Suica.cloneEvents( object, this );
		
		return object;
		
	} // Line.clone
	
	
	get randomIn( )
	{
		var from = this.from,
			to = this.to,
			k = random( 0, 1 );

		return this.objectPosition( [
			from[0]*(1-k)+k*to[0],
			from[1]*(1-k)+k*to[1],
			from[2]*(1-k)+k*to[2],
		] );
		
	} // Line.randomIn
	get randomOn( )
	{
		return this.randomIn;
	}
	
} // class Line

