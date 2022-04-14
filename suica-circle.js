//
// Suica 2.0 Circle
// CC-3.0-SA-NC
//
// circle( center, size, color )
//
// <circle id="" center="" size="" color="" wireframe=""> 
// <circle x="" y="" z="">
// <circle width="" height="">
// <polygon id="" count="..." center="" size="" color="" wireframe=""> 
//
// center	center [x,y,z]
// x		x coordinate of center
// y		y coordinate of center
// z		z coordinate of center
// size		size(s) of edge
// width
// height
// color	color [r,g,b]
// wireframe
// image	texture (drawing or canvas)
//
//===================================================


class Polygon extends Mesh
{	
	constructor( suica, count, center, size, color )
	{
		suica.parser?.parseTags();
		if( count < Suica.DEFAULT.CIRCLE.COUNT )
			suica.debugCall( 'polygon', count, center, size, color );
		else
			suica.debugCall( 'circle', center, size, color );

		suica._.solidGeometry.polygon = []; // array of geometries for different number of sides
		suica._.frameGeometry.polygon = []; // array of geometries for different number of sides

		super( suica, 
			new THREE.Mesh( Polygon.getSolidGeometry(suica,count), Mesh.solidMaterial.clone() ),
			new THREE.LineLoop( Polygon.getFrameGeometry(suica,count), Mesh.lineMaterial.clone() ),
		);
		
		this.center = center;
		this.color = color;
		this.size = size;
		this.n = count;

	} // Polygon.constructor


	get count()
	{
		this.suica.parser?.parseTags();

		return this.n;
	}
	
	
	set count( count )
	{
		this.suica.parser?.parseTags();

		if( count == this.n ) return; // same number of side, no need to regenerate
		
		this.solidMesh.geometry = Polygon.getSolidGeometry( this.suica, count );
		this.frameMesh.geometry = Polygon.getFrameGeometry( this.suica, count );
		
		this.threejs.geometry = this.isWireframe ? this.frameMesh.geometry : this.solidMesh.geometry;
	}
	

	static getSolidGeometry( suica, count )
	{
		if( !suica._.solidGeometry.polygon[count] )
			suica._.solidGeometry.polygon[count] = suica.flipNormal( new THREE.CircleGeometry( 0.5, count, -Math.PI*(1/2-1/count) ).applyMatrix4( suica.orientation.MATRIX ) );
		
		return suica._.solidGeometry.polygon[count];
	} // Polygon.getSolidGeometry
	
	
	static getFrameGeometry( suica, count )
	{
		if( !suica._.frameGeometry.polygon[count] )
		{
			suica._.frameGeometry.polygon[count] = new THREE.BufferGeometry();

			let vertices = new Float32Array(3*count+3),
				uvs = new Float32Array(2*count+2);

			for( var i=0; i<=count; i++ )
			{
				var angle = 2*Math.PI * i/count - Math.PI*(1/2-1/count);
				
				vertices[3*i] = 0.5*Math.cos( angle ); 
				vertices[3*i+1] = 0.5*Math.sin( angle ); 
				
				// for up to octagons each side has uv from 0 to 1
				// above octagons each quarter of sides has uv from 0 to 1
				if( count > 8 )
					uvs[2*i] = 4*i/count;
				else
					uvs[2*i] = i;
			}
			suica._.frameGeometry.polygon[count].setAttribute( 'position', new THREE.BufferAttribute(vertices,3) );
			suica._.frameGeometry.polygon[count].setAttribute( 'uv', new THREE.BufferAttribute(uvs,2) );
			suica._.frameGeometry.polygon[count].applyMatrix4( suica.orientation.MATRIX );
		}
		
		return suica._.frameGeometry.polygon[count];
	} // Polygon.getFrameGeometry


	get clone( )
	{
		var object = new Polygon( this.suica, this.n, this.center, this.size, this.color );
		
		object.spin = this.spin;
		object.wireframe = this.wireframe;
		object.image = this.image;
		Suica.cloneEvents( object, this );
		
		return object;
		
	} // Polygon.clone
	
} // class Polygon



/*
window.circle = function(
				center = Suica.DEFAULT.CIRCLE.CENTER,
				size   = Suica.DEFAULT.CIRCLE.SIZE,
				color  = Suica.DEFAULT.CIRCLE.COLOR )
{
	Suica.precheck();
	return Suica.current.circle( center, size, color );
}




window.polygon = function(
				count = Suica.DEFAULT.POLYGON.COUNT,
				center = Suica.DEFAULT.POLYGON.CENTER,
				size   = Suica.DEFAULT.POLYGON.SIZE,
				color  = Suica.DEFAULT.POLYGON.COLOR )
{
	Suica.precheck();
	return Suica.current.polygon( count, center, size, color );
}
*/

// window.circle = function( ...params )
// {
	// Suica.precheck();
	// return Suica.current.circle( ...params );
// }




// window.polygon = function( ...params )
// {
	// Suica.precheck();
	// return Suica.current.polygon( ...params );
// }