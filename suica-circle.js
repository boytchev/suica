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
	static solidGeometry = []; // array of geometries for different number of sides
	static frameGeometry = []; // array of geometries for different number of sides
	
	constructor( suica, count, center, size, color )
	{
		suica.parser?.parseTags();
		if( count < Suica.DEFAULT.CIRCLE.COUNT )
			suica.debugCall( 'polygon', count, center, size, color );
		else
			suica.debugCall( 'circle', center, size, color );

		super( suica, 
			new THREE.Mesh( Polygon.getSolidGeometry(count), Mesh.solidMaterial.clone() ),
			new THREE.LineLoop( Polygon.getFrameGeometry(count), Mesh.lineMaterial.clone() ),
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
		
		this.solidMesh.geometry = Polygon.getSolidGeometry( count );
		this.frameMesh.geometry = Polygon.getFrameGeometry( count );
		
		this.threejs.geometry = this.isWireframe ? this.frameMesh.geometry : this.solidMesh.geometry;
	}
	

	static getSolidGeometry( count )
	{
		if( !Polygon.solidGeometry[count] )
			Polygon.solidGeometry[count] = new THREE.CircleGeometry( 0.5, count, -Math.PI*(1/2-1/count) );
		
		return Polygon.solidGeometry[count];
	} // Polygon.getSolidGeometry
	
	
	static getFrameGeometry( count )
	{
		if( !Polygon.frameGeometry[count] )
		{
			Polygon.frameGeometry[count] = new THREE.BufferGeometry();

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
			Polygon.frameGeometry[count].setAttribute( 'position', new THREE.BufferAttribute(vertices,3) );
			Polygon.frameGeometry[count].setAttribute( 'uv', new THREE.BufferAttribute(uvs,2) );
		}
		
		return Polygon.frameGeometry[count];
	} // Polygon.getFrameGeometry


	get clone( )
	{
		var object = new Polygon( this.suica, this.n, this.center, this.size, this.color );
		
		object.wireframe = this.wireframe;
		object.image = this.image;
		
		return object;
		
	} // Polygon.clone
	
} // class Polygon




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