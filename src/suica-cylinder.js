//
// Suica 2.0 Cylinder & Prism
// CC-3.0-SA-NC
//
//
//===================================================


class Prism extends Mesh
{
	static COLOR = 'lightsalmon';
	static SIZE = 30;
	static COUNT = 6;

	constructor( suica, count, center, size, color, flatShading=true )
	{
		count = Suica.parseNumber( count, Prism.COUNT );

		suica.parser?.parseTags();
		if( flatShading )
			suica.debugCall( 'prism', count, center, size, color );
		else
			suica.debugCall( 'cylinder', center, size, color );
	
		suica._.solidGeometry.prism = []; // array of geometries for different number of sides
		suica._.frameGeometry.prism = []; // array of geometries for different number of sides

		super( suica, 
			new THREE.Mesh( Prism.getSolidGeometry(suica,count), flatShading ? Mesh.flatMaterial.clone() : Mesh.solidMaterial.clone() ),
			new THREE.LineSegments( Prism.getFrameGeometry(suica,count), Mesh.lineMaterial.clone() ),
		);
		
		this.center = Suica.parseCenter( center );
		this.size = Suica.parseSize( size, Prism.SIZE);
		this.color = Suica.parseColor( color, Prism.COLOR);
		this.n = count;
		this.flatShading = flatShading;
		
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
		
		this.solidMesh.geometry = Prism.getSolidGeometry( count );
		this.frameMesh.geometry = Prism.getFrameGeometry( count );
		
		this.threejs.geometry = this.isWireframe ? this.frameMesh.geometry : this.solidMesh.geometry;
	}
	
	
	static getSolidGeometry( suica, count )
	{
		if( !suica._.solidGeometry.prism[count] )
			suica._.solidGeometry.prism[count] = suica.flipNormal( new THREE.CylinderGeometry( 0.5, 0.5, 1, count, 1, false ).rotateY(Math.PI/2).translate(0,0.5,0).applyMatrix4( suica.orientation.MATRIX ) );
		
		return suica._.solidGeometry.prism[count];
	} // Prism.getSolidGeometry
	
	
	static getFrameGeometry( suica, count )
	{
		if( !suica._.frameGeometry.prism[count] )
		{
			suica._.frameGeometry.prism[count] = new THREE.BufferGeometry();

			// count segments at bottom, at top, at sides
			// 2 vertices for each segment, 3 numbers for each vertex; uvs has 2 numbers per vertex
			let vertices = new Float32Array(3*2*3*count),
				uvs = new Float32Array(2*2*3*count);

			for( var i=0; i<count; i++ )
			{
				var angle1 = 2*Math.PI * i/count /*- Math.PI*(1/2-1/count) -- issue #87 Polygon orientation */,
					sin1 = 0.5*Math.sin( angle1 ),
					cos1 = 0.5*Math.cos( angle1 );
				var angle2 = 2*Math.PI * (i+1)/count /*- Math.PI*(1/2-1/count) -- issue #87 Polygon orientation */,
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
			suica._.frameGeometry.prism[count].setAttribute( 'position', new THREE.BufferAttribute(vertices,3) );
			suica._.frameGeometry.prism[count].setAttribute( 'uv', new THREE.BufferAttribute(uvs,2) );
			suica._.frameGeometry.prism[count].applyMatrix4( suica.orientation.MATRIX );
		}
		
		return suica._.frameGeometry.prism[count];
	} // Prism.getFrameGeometry


	get clone( )
	{
		var object = new Prism( this.suica, this.n, this.center, this.size, this.color, this.flatShading );
		
		object.spin = this.spin;
		object.wireframe = this.wireframe;
		object.image = this.image;
		object.visible = this.visible;

		Suica.cloneEvents( object, this );
		
		return object;
		
	} // Prism.clone
	
} // class Prism


class Cylinder extends Prism
{
	constructor( suica, center, size, color )
	{
		super( suica, Suica.CIRCLECOUNT, center, size, color, false );
	}
} // class Cylinder
