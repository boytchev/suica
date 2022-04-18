//
// Suica 2.0 Tube
// CC-3.0-SA-NC
//
//
//===================================================

class SuicaTubeGeometry extends THREE.BufferGeometry {

	constructor( path, tubularSegments, radialSegments, closed = false ) {

		super();
		this.type = 'SuicaTubeGeometry';

		this.parameters = {
			path: path,
			tubularSegments: tubularSegments,
			radialSegments: radialSegments,
			closed: closed
		};

		const frames = path.computeFrenetFrames( tubularSegments, closed );

		// expose internals

		this.tangents = frames.tangents;
		this.normals = frames.normals;
		this.binormals = frames.binormals;

		// helper variables

		const vertex = new THREE.Vector3();
		const normal = new THREE.Vector3();
		const uv = new THREE.Vector2();
		let P = new THREE.Vector3();

		// buffer

		const vertices = [];
		const normals = [];
		const uvs = [];
		const indices = [];

		// create buffer data

		generateBufferData();

		// build geometry

		this.setIndex( indices );
		this.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
		this.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );
		this.setAttribute( 'uv', new THREE.Float32BufferAttribute( uvs, 2 ) );

		// functions

		function generateBufferData()
		{
			for ( let i = 0; i < tubularSegments; i ++ )
			{
				generateSegment( i );
			}

			// if the geometry is not closed, generate the last row of vertices and normals
			// at the regular position on the given path
			//
			// if the geometry is closed, duplicate the first row of vertices and normals (uvs will differ)

			generateSegment( ( closed === false ) ? tubularSegments : 0 );

			// uvs are generated in a separate function.
			// this makes it easy compute correct values for closed geometries

			generateUVs();

			// finally create faces

			generateIndices();

		}

		function generateSegment( i )
		{

			// we use getPointAt to sample evenly distributed points from the given path

			P = path.getPointAt( i / tubularSegments, P );

			// retrieve corresponding normal and binormal

			const N = frames.normals[ i ];
			const B = frames.binormals[ i ];

			// generate normals and vertices for the current segment

			for ( let j = 0; j <= radialSegments; j ++ )
			{

				const v = j / radialSegments * Math.PI * 2;

				const sin = Math.sin( v );
				const cos = - Math.cos( v );

				// normal

				normal.x = ( cos * N.x + sin * B.x );
				normal.y = ( cos * N.y + sin * B.y );
				normal.z = ( cos * N.z + sin * B.z );
				normal.normalize();

				normals.push( normal.x, normal.y, normal.z );

				// vertex
				vertex.x = P.x + P.radius * normal.x;
				vertex.y = P.y + P.radius * normal.y;
				vertex.z = P.z + P.radius * normal.z;

				vertices.push( vertex.x, vertex.y, vertex.z );
			}

		}

		function generateIndices()
		{

			for ( let j = 1; j <= tubularSegments; j ++ ) {

				for ( let i = 1; i <= radialSegments; i ++ ) {

					const a = ( radialSegments + 1 ) * ( j - 1 ) + ( i - 1 );
					const b = ( radialSegments + 1 ) * j + ( i - 1 );
					const c = ( radialSegments + 1 ) * j + i;
					const d = ( radialSegments + 1 ) * ( j - 1 ) + i;

					// faces

					indices.push( a, b, d );
					indices.push( b, c, d );

				}

			}

		}

		function generateUVs()
		{

			for ( let i = 0; i <= tubularSegments; i ++ ) {

				for ( let j = 0; j <= radialSegments; j ++ ) {

					uv.x = i / tubularSegments;
					uv.y = j / radialSegments;

					uvs.push( uv.x, uv.y );

				}

			}

		}

	}

	update( path ) {

		var tubularSegments = this.parameters.tubularSegments;
		var radialSegments = this.parameters.radialSegments;
		var closed = this.parameters.closed;
		
		const frames = path.computeFrenetFrames( tubularSegments, closed );

		// expose internals

		this.tangents = frames.tangents;
		this.normals = frames.normals;
		this.binormals = frames.binormals;

		// helper variables

		const vertex = new THREE.Vector3();
		const normal = new THREE.Vector3();
		const uv = new THREE.Vector2();
		let P = new THREE.Vector3();



		// update buffer data

		var pos = this.getAttribute( 'position' );
		var nor = this.getAttribute( 'normal' );
		var idx = 0;

		updateBufferData();

		pos.needsUpdate = true;
		nor.needsUpdate = true;
		
		// functions

		function updateBufferData()
		{
			for ( let i = 0; i < tubularSegments; i ++ )
			{
				updateSegment( i );
			}

			updateSegment( ( closed === false ) ? tubularSegments : 0 );
		}

		function updateSegment( i )
		{

			// we use getPointAt to sample evenly distributed points from the given path

			P = path.getPointAt( i / tubularSegments, P );

			// retrieve corresponding normal and binormal

			const N = frames.normals[ i ];
			const B = frames.binormals[ i ];

			// generate normals and vertices for the current segment

			for ( let j = 0; j <= radialSegments; j ++ )
			{

				const v = j / radialSegments * Math.PI * 2;

				const sin = Math.sin( v );
				const cos = - Math.cos( v );

				// normal

				normal.x = ( cos * N.x + sin * B.x );
				normal.y = ( cos * N.y + sin * B.y );
				normal.z = ( cos * N.z + sin * B.z );
				normal.normalize();

				nor.setXYZ( idx, normal.x, normal.y, normal.z );

				// vertex
				vertex.x = P.x + P.radius * normal.x;
				vertex.y = P.y + P.radius * normal.y;
				vertex.z = P.z + P.radius * normal.z;

				pos.setXYZ( idx, vertex.x, vertex.y, vertex.z );
				
				idx++;
			}

		}

	}


	toJSON() {

		const data = super.toJSON();

		data.path = this.parameters.path.toJSON();

		return data;

	}

	static fromJSON( data ) {

		// This only works for built-in curves (e.g. CatmullRomCurve3).
		// User defined curves or instances of CurvePath will not be deserialized.
		return new TubeGeometry(
			new Curves[ data.path.type ]().fromJSON( data.path ),
			data.tubularSegments,
			data.radius,
			data.radialSegments,
			data.closed
		);

	}

}


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
	}
	
	getPoint( u, optionalTarget = new THREE.Vector3() )
	{
		var point = this.spline?.getPoint( u ) || this._getPoint( u );
		optionalTarget.set( point[0]||0, point[1]||0, point[2]||0 );
		optionalTarget.radius = (typeof point[3] === 'undefined')?Suica.DEFAULT.TUBE.RADIUS:point[3];
		return optionalTarget;
	}
}


class SuicaSplineCurve extends THREE.Curve
{

	constructor( points )
	{
		super();
		this.points = points;
	}

	getPoint( t )
	{
		const points = this.points;
		const p = ( points.length - 1 ) * t;

		const intPoint = Math.floor( p );
		const weight = p - intPoint;

		const p0 = points[ intPoint === 0 ? intPoint : intPoint - 1 ];
		const p1 = points[ intPoint ];
		const p2 = points[ intPoint > points.length - 2 ? points.length - 1 : intPoint + 1 ];
		const p3 = points[ intPoint > points.length - 3 ? points.length - 1 : intPoint + 2 ];

		function CatmullRom( t, p0, p1, p2, p3 )
		{
			const v0 = ( p2 - p0 ) * 0.5;
			const v1 = ( p3 - p1 ) * 0.5;
			const t2 = t * t;
			const t3 = t * t2;
			return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( - 3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;
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
	}
}

window['spline'] = function( ...points )
{
	if( points.length==1 )
		return new SuicaSplineCurve( points[0] );
	else
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
		
		this.tubularSegments = tubularSegments;
		this.radialSegments  = radialSegments;

	} // Tube.constructor


	set curve( curveFunction )
	{
		if( Array.isArray(curveFunction) )
			curveFunction.points = curveFunction;
		
		this.curveFunction = new SuicaCurve( curveFunction );
		
		this.threejs.geometry.update( this.curveFunction );
	}
	
	
	get clone( )
	{
		var object = new Tube( this.suica, this.curveFunction, this.center, this.size, this.color );
		
		object.spin = this.spin;
		object.image = this.image;
		Suica.cloneEvents( object, this );
			
		return object;
		
	} // Tube.clone
	
} // class Tube



/*
window.sphere = function(
				center = Suica.DEFAULT.SPHERE.CENTER,
				size   = Suica.DEFAULT.SPHERE.SIZE,
				color  = Suica.DEFAULT.SPHERE.COLOR )
{
	Suica.precheck();
	return Suica.current.sphere( center, size, color );
}
*/

// window.sphere = function( ...params )
// {
	// Suica.precheck();
	// return Suica.current.sphere( ...params );
// }
