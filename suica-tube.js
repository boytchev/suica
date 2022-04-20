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

				vertex.x = p.x + p.radius*normal.x;
				vertex.y = p.y + p.radius*normal.y;
				vertex.z = p.z + p.radius*normal.z;

				pos.setXYZ( idx, vertex.x, vertex.y, vertex.z );
				
				idx++;
			}
		}
		
		pos.needsUpdate = true;
		nor.needsUpdate = true;		
		
	} // SuicaTubeGeometry.update

} // SuicaTubeGeometry




class SuicaCurve extends THREE.Curve
{
	constructor( curve )
	{
		super();
		
		if( curve instanceof SuicaSplineCurve )
		{
			this.spline = curve;
		}
		else
		if( curve instanceof Array )
		{
			this.spline = new SuicaSplineCurve( curve );
		}
		else
		{
			this._getPoint = curve;
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

	constructor( points=Suica.DEFAULT.SPLINE.POINTS, closed=Suica.DEFAULT.SPLINE.CLOSED, interpolant=Suica.DEFAULT.SPLINE.INTERPOLANT  )
	{

		super();
		
		if( !points.length ) points = Suica.DEFAULT.SPLINE.POINTS;
		
		this.closed = closed;
		this.interpolant = interpolant;
		this.points = points;
	} // SuicaSplineCurve.constructor


	getPoint( t )
	{

		var points = this.points,
			p = (points.length-(this.closed?0:1)) * t;
		var intPoint = Math.floor( p ),
			t = p - intPoint,
			t2 = t*t,
			t3 = t2*t;

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
		
		function catmullRom( p0, p1, p2, p3 )
		{
			var v0 = (p2-p0) * 0.5,
				v1 = (p3-p1) * 0.5;
			return (2*p1-2*p2+v0+v1)*t3 + (-3*p1+3*p2-2*v0-v1)*t2 + v0*t + p1;
		}

		function bSpline( p0, p1, p2, p3 )
		{
			return (p0*(1-3*t+3*t2-t3) + p1*(4-6*t2+3*t3) + p2*(1+3*t+3*t2-3*t3) + p3*t3)/6;
		}

		var splineFunction = this.interpolant ? catmullRom : bSpline;
		
		var point = [
			splineFunction( p0[0], p1[0], p2[0], p3[0] ),
			splineFunction( p0[1], p1[1], p2[1], p3[1] ),
			splineFunction( p0[2], p1[2], p2[2], p3[2] )	
		];

		if( typeof p0[3] !== 'undefined' )
			point.push( splineFunction( p0[3], p1[3], p2[3], p3[3] ) );
		
		return point;
	} // SuicaSplineCurve.getPoint
	
} // SuicaSplineCurve




window['spline'] = function( points, closed=Suica.DEFAULT.SPLINE.CLOSED, interpolant=Suica.DEFAULT.SPLINE.INTERPOLANT )
{
	return new SuicaSplineCurve( points, closed, interpolant );
}


class Tube extends Mesh
{
	constructor( suica, center=Suica.DEFAULT.TUBE.CENTER, curveFunction=Suica.DEFAULT.TUBE.POINTS, count=Suica.DEFAULT.TUBE.COUNT, size=Suica.DEFAULT.TUBE.SIZE, color=Suica.DEFAULT.TUBE.COLOR )
	{
		suica.parser?.parseTags();
		suica.debugCall( 'tube', center, curveFunction.name+'()', count, size, color );

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
