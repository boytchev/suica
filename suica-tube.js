//
// Suica 2.0 Tube
// CC-3.0-SA-NC
//
//
//===================================================



// based on THREE.TubeGeometry
class SuicaTubeGeometry extends THREE.BufferGeometry
{
	constructor( path, tubularSegments, radialSegments/*, closed = false*/ )
	{
		super();

		this.parameters = {
			path: path,
			tubularSegments: tubularSegments,
			radialSegments: radialSegments,
			/*closed: closed*/
		};

		var frames = path.computeFrenetFrames( tubularSegments, false/*closed*/ );

		// expose internals
		this.tangents = frames.tangents;
		this.normals = frames.normals;
		this.binormals = frames.binormals;

		// helper variables
		var vertex = new THREE.Vector3(),
			normal = new THREE.Vector3(),
			uv = new THREE.Vector2(),
			p = new THREE.Vector3();

		// buffers
		var vertices = [],
			normals = [],
			uvs = [],
			indices = [];

		generateBufferData();

		// build geometry
		this.setIndex( indices );
		this.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
		this.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );
		this.setAttribute( 'uv', new THREE.Float32BufferAttribute( uvs, 2 ) );


		function generateBufferData()
		{
			for ( var i=0; i<tubularSegments; i++ )
			{
				generateSegment( i );
			}

			generateSegment( /*closed?0:*/tubularSegments );
			generateUVs();
			generateIndices();
		} // SuicaTubeGeometry.constructor.generateBufferData


		function generateSegment( i )
		{
			p = path.getPointAt( i/tubularSegments, p );

			const N = frames.normals[i];
			const B = frames.binormals[i];

			// generate normals and vertices for the current segment
			for ( var j=0; j<=radialSegments; j++ )
			{
				var v = j/radialSegments * 2*Math.PI;

				var sin = Math.sin( v ),
					cos = -Math.cos( v );

				normal.x = cos*N.x + sin*B.x;
				normal.y = cos*N.y + sin*B.y;
				normal.z = cos*N.z + sin*B.z;
				normal.normalize();
				
				normals.push( normal.x, normal.y, normal.z );

				vertex.x = p.x + p.radius*normal.x;
				vertex.y = p.y + p.radius*normal.y;
				vertex.z = p.z + p.radius*normal.z;

				vertices.push( vertex.x, vertex.y, vertex.z );
			}
		} // SuicaTubeGeometry.constructor.generateSegment


		function generateIndices()
		{
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
		} // SuicaTubeGeometry.constructor.generateIndices


		function generateUVs()
		{
			for( var i=0; i<=tubularSegments; i++ )
				for ( var j=0; j<=radialSegments; j++ )
				{
					uv.x = i / tubularSegments;
					uv.y = j / radialSegments;

					uvs.push( uv.x, uv.y );
				}
		} // SuicaTubeGeometry.constructor.generateUVs

	} // SuicaTubeGeometry.constructor


	update( path/*, closed*/ )
	{
		var tubularSegments = this.parameters.tubularSegments,
			radialSegments = this.parameters.radialSegments;

		var frames = path.computeFrenetFrames( tubularSegments, false/*closed*/ );

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
			nor = this.getAttribute( 'normal' ),
			idx = 0;

		updateBufferData();

		pos.needsUpdate = true;
		nor.needsUpdate = true;
		
		
		function updateBufferData()
		{
			for( var i=0; i<tubularSegments; i++ )
			{
				updateSegment( i );
			}

			updateSegment( /*closed?0:*/tubularSegments );
		} // SuicaTubeGeometry.update.updateBufferData
		

		function updateSegment( i )
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

				vertex.x = p.x + p.radius*normal.x;
				vertex.y = p.y + p.radius*normal.y;
				vertex.z = p.z + p.radius*normal.z;

				pos.setXYZ( idx, vertex.x, vertex.y, vertex.z );
				
				idx++;
			}
		} // SuicaTubeGeometry.update.updateSegment

	} // SuicaTubeGeometry.update

} // SuicaTubeGeometry




class SuicaCurve extends THREE.Curve
{
	constructor( curveFunction )
	{
		super();
		
		if( Array.isArray(curveFunction) )
			curveFunction = new SuicaSplineCurve( curveFunction );

		if( curveFunction instanceof SuicaSplineCurve )
		{
			this.spline = curveFunction;
		}
		else
		{
			this._getPoint = curveFunction;
		}
	} // SuicaCurve.constructor

	
	getPoint( u, optionalTarget = new THREE.Vector3() )
	{
		var point = this.spline?.getPoint( u ) || this._getPoint( u );
		optionalTarget.set( point[0]||0, point[1]||0, point[2]||0 );
		optionalTarget.radius = (typeof point[3] === 'undefined')?Suica.DEFAULT.TUBE.RADIUS:point[3];
		return optionalTarget;
	} // SuicaCurve.getPoint
	
} // SuicaCurve




class SuicaSplineCurve extends THREE.Curve
{

	constructor( ...points )
	{
		super();
		
		this.closed = Suica.DEFAULT.SPLINE.CLOSED;
		points = points[0];
//		console.log('points=',points,'length=',points.length);

		if( points.length==1 )
		{
			// points = [[point, point, point, ...]]
			this.points = points[0];
		}
		else
		if( points.length==2 )
		{
			// points = [[point, point, point, ...], boolean]
			this.points = points[0];
			this.closed = points[1];
		}
		else
		{
			// points = [point, point, point, ... ]				count=N
			// points = [point, point, point, ... boolean]		count=N+1
			var last = points.pop();
			if( typeof last==='boolean' )
				this.closed = last;
			else
				points.push( last );
			this.points = points;
		}
		
	} // SuicaSplineCurve.constructor


	getPoint( t )
	{
		var points = this.points,
			p = (points.length-(this.closed?0:1)) * t;

		var intPoint = Math.floor( p ),
			weight = p - intPoint;


		var p0, p1, p2, p3;
		
		if( this.closed )
		{
			p0 = points[ (intPoint+points.length-1)%points.length ];
			p1 = points[ (intPoint+points.length  )%points.length ];
			p2 = points[ (intPoint+points.length+1)%points.length ];
			p3 = points[ (intPoint+points.length+2)%points.length ];
		}
		else
		{
			p0 = points[ intPoint === 0 ? intPoint : intPoint-1 ];
			p1 = points[ intPoint ];
			p2 = points[ intPoint > points.length-2 ? points.length-1 : intPoint+1 ];
			p3 = points[ intPoint > points.length-3 ? points.length-1 : intPoint+2 ];
		}
		
		function CatmullRom( t, p0, p1, p2, p3 )
		{
			var v0 = (p2-p0) * 0.5,
				v1 = (p3-p1) * 0.5,
				t2 = t*t,
				t3 = t*t2;
			return (2*p1-2*p2+v0+v1)*t3 + (-3*p1+3*p2-2*v0-v1)*t2 + v0*t + p1;
		}

		var point = [
			CatmullRom( weight, p0[0], p1[0], p2[0], p3[0] ),
			CatmullRom( weight, p0[1], p1[1], p2[1], p3[1] ),
			CatmullRom( weight, p0[2], p1[2], p2[2], p3[2] )
		];

		if( typeof p0[3] !== 'undefined' )
		{
			point.push( CatmullRom( weight, p0[3], p1[3], p2[3], p3[3] ) );
		}
		
		return point;
	} // SuicaSplineCurve.getPoint
	
} // SuicaSplineCurve




window['spline'] = function( ...points )
{
	// spline( point, point, point, ... );
	// spline( point, point, point, ... boolean );
	// spline( [point, point, point, ...] );
	// spline( [point, point, point, ...], boolean );

	return new SuicaSplineCurve( points );
}


	

class Tube extends Mesh
{
	constructor( suica, curveFunction, count, center, size, color )
	{
		suica.parser?.parseTags();
		suica.debugCall( 'tube', curveFunction.name+'()', count, center, size, color );

		if( Array.isArray(curveFunction) )
			curveFunction = new SuicaSplineCurve( curveFunction );
		
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

		var curve = new SuicaCurve( curveFunction ),
			geometry = new SuicaTubeGeometry( curve, tubularSegments, radialSegments, false );
		
		super( suica, 
			new THREE.Mesh( geometry, Mesh.solidMaterial.clone() ),
			null, // no wireframe
		);
		
		this.curveFunction = curve;
		this.center = center;
		this.color = color;
		this.size = size;

	} // Tube.constructor


	set curve( curveFunction )
	{
		if( Array.isArray(curveFunction) )
			curveFunction = new SuicaSplineCurve( curveFunction );

		var curve = new SuicaCurve( curveFunction );

		this.threejs.geometry.update( curve );
	}
	
	
	get clone( )
	{
		var object = new Tube( this.suica, this.curveFunction, this.center, this.size, this.color );
		
		object.spin = this.spin;
		object.image = this.image;
		/*object.close = this.close;*/
		Suica.cloneEvents( object, this );
			
		return object;
		
	} // Tube.clone
	
} // class Tube
