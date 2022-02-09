﻿//
// Suica 2.0 Cylinder
// CC-3.0-SA-NC
//
// cylinder( center, size, color )
// prism( center, size, color )
// prismFrame( center, size, color )
//
// <cylinder id="" center="" size="" color="">
// <prism id="" center="" size="" color="">
// <prismFrame id="" center="" size="" color="">
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


class Prism extends Mesh
{
	
	static geometry = []; // array of geometries for different number of sides
	
	constructor( suica, count, center, size, color, flatShading )
	{
		suica.parser?.parseTags();
		if( count < Suica.DEFAULT.CYLINDER.COUNT )
			suica.debugCall( 'prism', count, center, size, color );
		else
			suica.debugCall( 'cylinder', center, size, color );
	
		if( !Prism.geometry[count] )
		{
			Prism.geometry[count] = new THREE.CylinderGeometry( 0.5, 0.5, 1, count, 1, false ).translate(0,0.5,0);
		}
		
		super( suica, THREE.Mesh, Prism.geometry[count], flatShading ? Mesh.flatMaterial.clone() : Mesh.solidMaterial.clone() );
		
		this.center = center;
		this.color = color;
		this.size = size;
		this.n = count;
		
		suica.scene.add( this.threejs );
		
	} // Prism.constructor


	get count()
	{
		this.suica.parser?.parseTags();

		return this.n;
	}
	
	
	set count( count )
	{
		this.suica.parser?.parseTags();

		if( count == this.n ) return; // same number of side, no need to regenerate
		
		if( !Prism.geometry[count] )
		{
			Prism.geometry[count] = new THREE.CylinderGeometry( 0.5, 0.5, 1, count, 1, false ).translate(0,0.5,0);
		}
		
		this.threejs.geometry = Prism.geometry[count];
	}
	
	
} // class Prism




class PrismFrame extends Mesh
{

	static geometry = []; // array of geometries for different number of sides

	constructor( suica, count, center, size, color )
	{
		suica.parser?.parseTags();
		suica.debugCall( 'prismFrame', count, center, size, color );
		
		super( suica, THREE.LineSegments, PrismFrame.getGeometry( count ), Mesh.lineMaterial.clone() );
		
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
		if( !Prism.geometry[count] )
		{
			PrismFrame.geometry[count] = new THREE.BufferGeometry();

			// count segments at bottom, at top, at sides
			// 2 vertices for each segment, 3 numbers for each vertex; uvs has 2 numbers per vertex
			let vertices = new Float32Array(3*2*3*count),
				uvs = new Float32Array(2*2*3*count);

			for( var i=0; i<count; i++ )
			{
				var angle1 = 2*Math.PI * i/count - Math.PI*(1/2-1/count),
					sin1 = 0.5*Math.sin( angle1 ),
					cos1 = 0.5*Math.cos( angle1 );
				var angle2 = 2*Math.PI * (i+1)/count - Math.PI*(1/2-1/count),
					sin2 = 0.5*Math.sin( angle2 ),
					cos2 = 0.5*Math.cos( angle2 );
				
				// horizontal bottom 
				vertices[18*i] = cos1;
				vertices[18*i+1] = 0; 
				vertices[18*i+2] = sin1; 
				vertices[18*i+3] = cos2;
				vertices[18*i+4] = 0; 
				vertices[18*i+5] = sin2; 
				
				// horizontal top
				vertices[18*i+6] = cos1;
				vertices[18*i+7] = 1; 
				vertices[18*i+8] = sin1; 
				vertices[18*i+9] = cos2;
				vertices[18*i+10] = 1; 
				vertices[18*i+11] = sin2; 
				
				// vertical
				vertices[18*i+12] = cos1;
				vertices[18*i+13] = 0; 
				vertices[18*i+14] = sin1; 
				vertices[18*i+15] = cos1;
				vertices[18*i+16] = 1; 
				vertices[18*i+17] = sin1; 
				
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
				uvs[12*i] = u1;
				uvs[12*i+2] = u2;

				// horizontal top
				uvs[12*i+4] = u1;
				uvs[12*i+6] = u2;

				// vertical
				uvs[12*i+8] = 0;
				uvs[12*i+10] = 1;
			}
			PrismFrame.geometry[count].setAttribute( 'position', new THREE.BufferAttribute(vertices,3) );
			PrismFrame.geometry[count].setAttribute( 'uv', new THREE.BufferAttribute(uvs,2) );
		}
		
		return PrismFrame.geometry[count];
	}
	
	
	set count( count )
	{
		this.suica.parser?.parseTags();

		if( count == this.n ) return; // same number of side, no need to regenerate
		
		this.threejs.geometry = PrismFrame.getGeometry( count );
	}
	
} // class PrismFrame



window.cylinder = function(
				center = Suica.DEFAULT.CYLINDER.CENTER,
				size   = Suica.DEFAULT.CYLINDER.SIZE,
				color  = Suica.DEFAULT.CYLINDER.COLOR )
{
	Suica.precheck();
	return Suica.current.cylnder( center, size, color );
}



window.prism = function(
				count = Suica.DEFAULT.PRISM.COUNT,
				center = Suica.DEFAULT.PRISM.CENTER,
				size   = Suica.DEFAULT.PRISM.SIZE,
				color  = Suica.DEFAULT.PRISM.COLOR )
{
	Suica.precheck();
	return Suica.current.prism( count, center, size, color );
}




window.prismFrame = function(
				count = Suica.DEFAULT.PRISM.COUNT,
				center = Suica.DEFAULT.PRISM.CENTER,
				size   = Suica.DEFAULT.PRISM.SIZE,
				color  = Suica.DEFAULT.PRISM.FRAMECOLOR )
{
	Suica.precheck();
	return Suica.current.prismFrame( count, center, size, color );
}