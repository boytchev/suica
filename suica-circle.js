//
// Suica 2.0 Circle
// CC-3.0-SA-NC
//
// circle( center, size, color )
// circleFrame( center, size, color )
//
// <circle id="" center="" size="" color="">
// <circle x="" y="" z="">
// <circle width="" height="">
// <circleFrame ...>
//
// center	center [x,y,z]
// x		x coordinate of center
// y		y coordinate of center
// z		z coordinate of center
// size		size(s) of edge
// width
// height
// color	color [r,g,b]
// image	texture (drawing or canvas)
//
//===================================================


class Polygon extends Mesh
{
	
	static geometry = []; // array of geometries for different number of sides
	
	constructor( suica, count, center, size, color )
	{
		suica.parser?.parseTags();
		if( count < Suica.DEFAULT.CIRCLE.COUNT )
			suica.debugCall( 'polygon', count, center, size, color );
		else
			suica.debugCall( 'circle', center, size, color );

	
		if( !Polygon.geometry[count] )
		{
			Polygon.geometry[count] = new THREE.CircleGeometry( 0.5, count, -Math.PI*(1/2-1/count) );
		}
		
		super( suica, THREE.Mesh, Polygon.geometry[count], Mesh.solidMaterial.clone() );
		
		this.center = center;
		this.color = color;
		this.size = size;
		this.n = count;
		
		suica.scene.add( this.threejs );
		
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
		
		if( !Polygon.geometry[count] )
		{
			Polygon.geometry[count] = new THREE.CircleGeometry( 0.5, count, -Math.PI*(1/2-1/count) );
		}
		
		this.threejs.geometry = Polygon.geometry[count];
	}
	
	
} // class Polygon




class PolygonFrame extends Mesh
{

	static geometry = []; // array of geometries for different number of sides

	constructor( suica, count, center, size, color )
	{
		suica.parser?.parseTags();
		if( count < Suica.DEFAULT.CIRCLE.COUNT )
			suica.debugCall( 'polygonFrame', count, center, size, color );
		else
			suica.debugCall( 'circleFrame', center, size, color );
		
		super( suica, THREE.Line, PolygonFrame.getGeometry( count ), Mesh.lineMaterial.clone() );
		
		this.center = center;
		this.color = color;
		this.size = size;
		this.n = count;
		
		suica.scene.add( this.threejs );
	}		
	
	


	get count()
	{
		this.suica.parser?.parseTags();

		return this.n;
	}
	

	static getGeometry( count )
	{
		if( !Polygon.geometry[count] )
		{
			PolygonFrame.geometry[count] = new THREE.BufferGeometry();

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
			PolygonFrame.geometry[count].setAttribute( 'position', new THREE.BufferAttribute(vertices,3) );
			PolygonFrame.geometry[count].setAttribute( 'uv', new THREE.BufferAttribute(uvs,2) );
		}
		
		return PolygonFrame.geometry[count];
	}
	
	
	set count( count )
	{
		this.suica.parser?.parseTags();

		if( count == this.n ) return; // same number of side, no need to regenerate
		
		this.threejs.geometry = PolygonFrame.getGeometry( count );
	}
	
} // class PolygonFrame



window.circle = function(
				center = Suica.DEFAULT.CIRCLE.CENTER,
				size   = Suica.DEFAULT.CIRCLE.SIZE,
				color  = Suica.DEFAULT.CIRCLE.COLOR )
{
	Suica.precheck();
	return Suica.current.circle( center, size, color );
}




window.circleFrame = function(
				center = Suica.DEFAULT.CIRCLE.CENTER,
				size   = Suica.DEFAULT.CIRCLE.SIZE,
				color  = Suica.DEFAULT.CIRCLE.FRAMECOLOR )
{
	Suica.precheck();
	return Suica.current.circleFrame( center, size, color );
}




window.polygon = function(
				count = Suica.DEFAULT.POLYGON.COUNT,
				center = Suica.DEFAULT.CIRCLE.CENTER,
				size   = Suica.DEFAULT.CIRCLE.SIZE,
				color  = Suica.DEFAULT.CIRCLE.COLOR )
{
	Suica.precheck();
	return Suica.current.polygon( count, center, size, color );
}




window.polygonFrame = function(
				count = Suica.DEFAULT.POLYGON.COUNT,
				center = Suica.DEFAULT.CIRCLE.CENTER,
				size   = Suica.DEFAULT.CIRCLE.SIZE,
				color  = Suica.DEFAULT.CIRCLE.FRAMECOLOR )
{
	Suica.precheck();
	return Suica.current.polygonFrame( count, size, color );
}