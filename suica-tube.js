//
// Suica 2.0 Tube
// CC-3.0-SA-NC
//
//
//===================================================

class SuicaTubeGeometry extends THREE.BufferGeometry {

	constructor( path = new Curves[ 'QuadraticBezierCurve3' ]( new Vector3( - 1, - 1, 0 ), new Vector3( - 1, 1, 0 ), new Vector3( 1, 1, 0 ) ), tubularSegments = 64, radius = 1, radialSegments = 8, closed = false ) {

		super();
		this.type = 'SuicaTubeGeometry';

		this.parameters = {
			path: path,
			tubularSegments: tubularSegments,
			radius: radius,
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

		function generateBufferData() {

			for ( let i = 0; i < tubularSegments; i ++ ) {

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

		function generateSegment( i ) {

			// we use getPointAt to sample evenly distributed points from the given path

			P = path.getPointAt( i / tubularSegments, P );

			// retrieve corresponding normal and binormal

			const N = frames.normals[ i ];
			const B = frames.binormals[ i ];

			// generate normals and vertices for the current segment

			for ( let j = 0; j <= radialSegments; j ++ ) {

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

		function generateIndices() {

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

		function generateUVs() {

			for ( let i = 0; i <= tubularSegments; i ++ ) {

				for ( let j = 0; j <= radialSegments; j ++ ) {

					uv.x = i / tubularSegments;
					uv.y = j / radialSegments;

					uvs.push( uv.x, uv.y );

				}

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
	constructor( _getPointAt )
	{
		super();
		this._getPointAt = _getPointAt;
	}
	
	getPoint( u, optionalTarget = new THREE.Vector3() )
	{
		var point = this._getPointAt( u );
		optionalTarget.set( point[0]||0, point[1]||0, point[2]||0 );
		optionalTarget.radius = point[3];
		return optionalTarget;
	}
	
	getPointAt( u, optionalTarget = new THREE.Vector3() )
	{
		var point = this._getPointAt( u );
		optionalTarget.set( point[0]||0, point[1]||0, point[2]||0 );
		optionalTarget.radius = point[3];
		return optionalTarget;
	}
}

class Tube extends Mesh
{
	constructor( suica, curveFunction, count, center, size, color )
	{
		suica.parser?.parseTags();
		suica.debugCall( 'tube', curveFunction.name+'()', count, center, size, color );

		var curve = new SuicaCurve( curveFunction ),
			geometry = new SuicaTubeGeometry( curve, count[0], 2, count[1], false );
		
		super( suica, 
			new THREE.Mesh( geometry, Mesh.solidMaterial.clone() ),
			null, // no wireframe
		);
		
		this.curve = curve;
		this.center = center;
		this.color = color;
		this.size = size;

	} // Tube.constructor


	get clone( )
	{
		var object = new Tube( this.suica, this.curve, this.center, this.size, this.color );
		
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
