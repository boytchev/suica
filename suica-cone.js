//
// Suica 2.0 Cone
// CC-3.0-SA-NC
//
// cone( center, size, color )
// pyramid( center, size, color )
// pyramidFrame( center, size, color )
//
// <cone id="" center="" size="" color="">
// <pyramid id="" center="" size="" color="">
// <pyramidFrame id="" center="" size="" color="">
//
// center	center [x,y,z]
// x		x coordinate of center
// y		y coordinate of center
// z		z coordinate of center
// size		size(s)
// width
// height
// depth
// color	color [r,g,b]
// image	texture (drawing or canvas)
//
//===================================================


class Pyramid extends Mesh
{
	
	static geometry = []; // array of geometries for different number of sides
	
	constructor( suica, count, center, size, color, flatShading )
	{
		suica.parser?.parseTags();
		if( count < Suica.DEFAULT.CONE.COUNT )
			suica.debugCall( 'pyramid', count, center, size, color );
		else
			suica.debugCall( 'cone', center, size, color );
	
		if( !Prism.geometry[count] )
		{
			Prism.geometry[count] = new THREE.ConeGeometry( 0.5, 1, count, 1, false ).translate(0,0.5,0);
		}
		
		super( suica, THREE.Mesh, Prism.geometry[count], flatShading ? Mesh.flatMaterial.clone() : Mesh.solidMaterial.clone() );
		
		this.center = center;
		this.color = color;
		this.size = size;
		this.n = count;
		
		suica.scene.add( this.threejs );
		
	} // Pyramid.constructor


	get count()
	{
		this.suica.parser?.parseTags();

		return this.n;
	}
	
	
	set count( count )
	{
		this.suica.parser?.parseTags();

		if( count == this.n ) return; // same number of side, no need to regenerate
		
		if( !Pyramid.geometry[count] )
		{
			Pyramid.geometry[count] = new THREE.ConeGeometry( 0.5, 1, count, 1, false ).translate(0,0.5,0);
		}
		
		this.threejs.geometry = Pyramid.geometry[count];
	}
	
	
} // class Pyramid




class PyramidFrame extends Mesh
{

	static geometry = []; // array of geometries for different number of sides

	constructor( suica, count, center, size, color )
	{
		suica.parser?.parseTags();
		suica.debugCall( 'pyramidFrame', count, center, size, color );
		
		super( suica, THREE.LineSegments, PyramidFrame.getGeometry( count ), Mesh.lineMaterial.clone() );
		
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
		if( !Pyramid.geometry[count] )
		{
			PyramidFrame.geometry[count] = new THREE.BufferGeometry();

			// count segments at bottom and at sides
			// 2 vertices for each segment, 3 numbers for each vertex; uvs has 2 numbers per vertex
			let vertices = new Float32Array(3*2*2*count),
				uvs = new Float32Array(2*2*2*count);

			for( var i=0; i<count; i++ )
			{
				var angle1 = 2*Math.PI * i/count - Math.PI*(1/2-1/count),
					sin1 = 0.5*Math.sin( angle1 ),
					cos1 = 0.5*Math.cos( angle1 );
				var angle2 = 2*Math.PI * (i+1)/count - Math.PI*(1/2-1/count),
					sin2 = 0.5*Math.sin( angle2 ),
					cos2 = 0.5*Math.cos( angle2 );
				
				// horizontal bottom (skipping 0 values)
				vertices[12*i] = cos1;
				vertices[12*i+1] = 0; 
				vertices[12*i+2] = sin1; 
				vertices[12*i+3] = cos2;
				vertices[12*i+4] = 0; 
				vertices[12*i+5] = sin2; 
				
				// vertical
				vertices[12*i+6] = cos1;
				vertices[12*i+7] = 0; 
				vertices[12*i+8] = sin1; 
				vertices[12*i+9] = 0;
				vertices[12*i+10] = 1; 
				vertices[12*i+11] = 0; 
				
				// for up to octagons each side has uv from 0 to 1
				// above octagons each quarter of sides has uv from 0 to 1
				console.assert( uvs[2*i+1] == 0 );
				var u1,u2;
				if( count > 8 )
				{
					u1 = 4*i/count;
					u2 = 4*(i+1)/count;
				}
				else
				{
					u1 = i;
					u2 = i+1;
				}

				// horizontal bottom 
				uvs[8*i] = u1;
				uvs[8*i+2] = u2;

				// vertical
				uvs[8*i+4] = 0;
				uvs[8*i+6] = 1;
			}
			PyramidFrame.geometry[count].setAttribute( 'position', new THREE.BufferAttribute(vertices,3) );
			PyramidFrame.geometry[count].setAttribute( 'uv', new THREE.BufferAttribute(uvs,2) );
		}
		
		return PyramidFrame.geometry[count];
	}
	
	
	set count( count )
	{
		this.suica.parser?.parseTags();

		if( count == this.n ) return; // same number of side, no need to regenerate
		
		this.threejs.geometry = PyramidFrame.getGeometry( count );
	}
	
} // class PyramidFrame



window.cone = function(
				center = Suica.DEFAULT.CONE.CENTER,
				size   = Suica.DEFAULT.CONE.SIZE,
				color  = Suica.DEFAULT.CONE.COLOR )
{
	Suica.precheck();
	return Suica.current.cone( center, size, color );
}



window.pyramid = function(
				count = Suica.DEFAULT.PYRAMID.COUNT,
				center = Suica.DEFAULT.PYRAMID.CENTER,
				size   = Suica.DEFAULT.PYRAMID.SIZE,
				color  = Suica.DEFAULT.PYRAMID.COLOR )
{
	Suica.precheck();
	return Suica.current.pyramid( count, center, size, color );
}




window.pyramidFrame = function(
				count = Suica.DEFAULT.PYRAMID.COUNT,
				center = Suica.DEFAULT.PYRAMID.CENTER,
				size   = Suica.DEFAULT.PYRAMID.SIZE,
				color  = Suica.DEFAULT.PYRAMID.FRAMECOLOR )
{
	Suica.precheck();
	return Suica.current.pyramidFrame( count, center, size, color );
}