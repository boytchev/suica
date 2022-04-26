//
// Suica 2.0 Tube
// CC-3.0-SA-NC
//
//
//===================================================


// converts Suica spline, array of points or a path function into a THREE.Curve
class SuicaCurve extends THREE.Curve
{
	constructor( curve )
	{
		super();
		
		if( curve instanceof SuicaCurve )
			return this;
		else
			this.spline = spline( curve );
	} // SuicaCurve.constructor

	
	getPoint( u, optionalTarget = new THREE.Vector3() )
	{
		var point = this.spline( u );
		
		optionalTarget.set( point[0]||0, point[1]||0, point[2]||0 );
		optionalTarget.radius = point[3];
		
		return optionalTarget;
	} // SuicaCurve.getPoint
	
} // SuicaCurve




// based on THREE.TubeGeometry
class SuicaTubeGeometry extends THREE.BufferGeometry
{
	constructor( path, tubularSegments, radialSegments, radius )
	{
		super();

		this.parameters = {
			path: path,
			tubularSegments: tubularSegments,
			radialSegments: radialSegments,
			radius: radius,
		};

		// number of vertices
		var count = (tubularSegments+1)*(radialSegments+1);

		// indexed faces
		{
			var indices = [];
			for( var j=1; j<=tubularSegments; j++ )
				for ( var i=1; i<=radialSegments; i++ )
				{
					var a = (radialSegments+1)*(j-1) + (i-1),
						b = (radialSegments+1)*(j)   + (i-1),
						c = (radialSegments+1)*(j)   + (i),
						d = (radialSegments+1)*(j-1) + (i);

					// faces
					indices.push( a, b, d );
					indices.push( b, c, d );
				}
			this.setIndex( indices );
		}
		
		// texture coordinates
		{
			var uvs = new THREE.Float32BufferAttribute( new Array(2*count), 2 );
			for( var i=0, idx=0; i<=tubularSegments; i++ )
				for ( var j=0; j<=radialSegments; j++ )
					uvs.setXY( idx++, i/tubularSegments, j/radialSegments );
			this.setAttribute( 'uv', uvs );
		}
		
		// positions and normals
		{
			this.setAttribute( 'position', new THREE.Float32BufferAttribute( new Array(3*count), 3 ) );
			this.setAttribute( 'normal', new THREE.Float32BufferAttribute( new Array(3*count), 3 ) );
			this.update( path );
		}
		
	} // SuicaTubeGeometry.constructor


	update( path/*, closed*/ )
	{
		
		var tubularSegments = this.parameters.tubularSegments,
			radialSegments = this.parameters.radialSegments,
			radius = this.parameters.radius;

		var frames = path.computeFrenetFrames( tubularSegments, false );

		// expose internals
		this.tangents = frames.tangents;
		this.normals = frames.normals;
		this.binormals = frames.binormals;

		// helper variables
		var vertex = new THREE.Vector3(),
			normal = new THREE.Vector3(),
			p = new THREE.Vector3();

		// update buffer data
		var pos = this.getAttribute( 'position' ),
			nor = this.getAttribute( 'normal' );

		for( var i=0, idx=0; i<=tubularSegments; i++ )
		{
			p = path.getPointAt( i/tubularSegments, p );

			var N = frames.normals[i];
			var B = frames.binormals[i];

			for( var j=0; j<=radialSegments; j++ )
			{
				var v = j/radialSegments * 2*Math.PI;

				var sin = Math.sin(v),
					cos = - Math.cos(v);

				normal.x = cos*N.x + sin*B.x;
				normal.y = cos*N.y + sin*B.y;
				normal.z = cos*N.z + sin*B.z;
				normal.normalize();

				nor.setXYZ( idx, normal.x, normal.y, normal.z );

				var rad = p.radius || radius;

				vertex.x = p.x + rad*normal.x;
				vertex.y = p.y + rad*normal.y;
				vertex.z = p.z + rad*normal.z;

				pos.setXYZ( idx, vertex.x, vertex.y, vertex.z );
				
				idx++;
			}
		}
		
		pos.needsUpdate = true;
		nor.needsUpdate = true;		
		
	} // SuicaTubeGeometry.update

} // SuicaTubeGeometry




class Tube extends Mesh
{
	constructor( suica, center=Suica.DEFAULT.TUBE.CENTER, curve=Suica.DEFAULT.TUBE.POINTS, radius, count=Suica.DEFAULT.TUBE.COUNT, size=Suica.DEFAULT.TUBE.SIZE, color=Suica.DEFAULT.TUBE.COLOR )
	{
		suica.parser?.parseTags();
		suica.debugCall( 'tube', center, curve.name+'()', radius, count, size, color );

		if( !radius && radius!==0 )
			radius = Suica.DEFAULT.TUBE.RADIUS;
		
		var tubularSegments, radialSegments;
		
		count = Suica.parseSize( count );
		if( Array.isArray(count) )
		{
			tubularSegments = count[0] || Suica.DEFAULT.TUBE.COUNT[0];
			radialSegments  = count[1] || Suica.DEFAULT.TUBE.COUNT[1];
		}
		else
		{
			tubularSegments = count || Suica.DEFAULT.TUBE.COUNT[0];
			radialSegments  = Suica.DEFAULT.TUBE.COUNT[1];
		}

		var geometry = new SuicaTubeGeometry( new SuicaCurve( curve ), tubularSegments, radialSegments, radius );
		
		super( suica, 
			new THREE.Mesh( geometry, Mesh.solidMaterial.clone() ),
			null, // no wireframe
		);
		
		this._curve = curve;
		this.center = center;
		this.color = color;
		this.size = size;
		this._radius = radius;
		this._count = count;

	} // Tube.constructor

	get count( )
	{
		return this._count;
	}
	
	set count( count )
	{
		var tubularSegments, radialSegments;
		
		count = Suica.parseSize( count );
		if( Array.isArray(count) )
		{
			tubularSegments = count[0] || Suica.DEFAULT.TUBE.COUNT[0];
			radialSegments  = count[1] || Suica.DEFAULT.TUBE.COUNT[1];
		}
		else
		{
			tubularSegments = count || Suica.DEFAULT.TUBE.COUNT[0];
			radialSegments  = Suica.DEFAULT.TUBE.COUNT[1];
		}
		this._count = count;

		this.threejs.geometry.dispose();
		this.threejs.geometry = new SuicaTubeGeometry( new SuicaCurve( this._curve ), tubularSegments, radialSegments, this._radius );
	}
	
	get radius( )
	{
		return this._radius;
	}

	set radius( radius )
	{
		this._radius = radius;
		this.threejs.geometry.parameters.radius = radius;
		this.threejs.geometry.update( new SuicaCurve( this._curve ) );
	}
	
	
	get curve( )
	{
		return this._curve;
	}
	

	set curve( curve )
	{
		this._curve = curve;

		this.threejs.geometry.update( new SuicaCurve( curve ) );
	}
	
	
	get clone( )
	{
		var object = new Tube( this.suica, this.center, this.curve, this.radius, this.size, this.color );
		
		object.spin = this.spin;
		object.image = this.image;

		Suica.cloneEvents( object, this );
			
		return object;
		
	} // Tube.clone
	
} // class Tube
