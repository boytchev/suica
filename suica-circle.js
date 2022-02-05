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


class Circle extends Mesh
{
	
	constructor( suica, center, size, color )
	{
		suica.parser?.parseTags();
		if (DEBUG_CALLS) console.log(`:: ${suica.id}.circle(${center},${size},${color})`);
	
		if( !Circle.geometry )
		{
			Circle.geometry = new THREE.CircleGeometry( 0.5, Suica.DEFAULT.CIRCLE.COUNT );
		}
		
		super( suica, THREE.Mesh, Circle.geometry, Mesh.solidMaterial.clone() );
		
		this.center = center;
		this.color = color;
		this.size = size;
		
		suica.scene.add( this.threejs );
		
	} // Circle.constructor


} // class Circle




class CircleFrame extends Mesh
{

	constructor( suica, center, size, color )
	{
		suica.parser?.parseTags();
		if (DEBUG_CALLS) console.log(`:: ${suica.id}.circleFrame(${center},${size},${color})`);
		
		if( !CircleFrame.geometry  )
		{
			CircleFrame.geometry = new THREE.BufferGeometry();

			let vertices = new Float32Array(3*Suica.DEFAULT.CIRCLE.COUNT+3),
				uvs = new Float32Array(2*Suica.DEFAULT.CIRCLE.COUNT+2);

			for( var i=0; i<=Suica.DEFAULT.CIRCLE.COUNT; i++ )
			{
				var angle = 2*Math.PI * i/Suica.DEFAULT.CIRCLE.COUNT;
				
				vertices[3*i] = 0.5*Math.cos( angle ); 
				vertices[3*i+1] = 0.5*Math.sin( angle ); 
				uvs[2*i] = 2*i/Suica.DEFAULT.CIRCLE.COUNT;
			}
			CircleFrame.geometry.setAttribute( 'position', new THREE.BufferAttribute(vertices,3) );
			CircleFrame.geometry.setAttribute( 'uv', new THREE.BufferAttribute(uvs,2) );
		}

		super( suica, THREE.Line, CircleFrame.geometry, Mesh.lineMaterial.clone() );
		
		this.center = center;
		this.color = color;
		this.size = size;
		
		suica.scene.add( this.threejs );
	}		
	
} // class CircleFrame



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