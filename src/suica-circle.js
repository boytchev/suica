//
// Suica 2.0 Circle & Polygon
// CC-3.0-SA-NC
//
//===================================================


class Polygon extends Mesh
{	
	static COLOR = 'lightsalmon';
	static FRAMECOLOR = 'black';
	static SIZE = 30;
	static COUNT = 3;

	constructor( suica, count, center, size, color )
	{
		suica.parser?.parseTags();
		if( count < Suica.CIRCLECOUNT )
			suica.debugCall( 'polygon', count, center, size, color );
		else
			suica.debugCall( 'circle', center, size, color );

		suica._.solidGeometry.polygon = []; // array of geometries for different number of sides
		suica._.frameGeometry.polygon = []; // array of geometries for different number of sides

		super( suica, 
			new THREE.Mesh( Polygon.getSolidGeometry(suica,count), Mesh.solidMaterial.clone() ),
			new THREE.LineLoop( Polygon.getFrameGeometry(suica,count), Mesh.lineMaterial.clone() ),
		);
		
		this.center = Suica.parseCenter( center );
		this.size = Suica.parseSize( size, Polygon.SIZE);
		this.color = Suica.parseColor( color, Polygon.COLOR);
		this.n = Suica.parseNumber( count, Polygon.COUNT );

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
		object.visible = this.visible;
		
		Suica.cloneEvents( object, this );
		
		return object;
		
	} // Polygon.clone
	
} // class Polygon




class Circle extends Polygon
{
	constructor( suica, center, size, color )
	{
		super( suica, Suica.CIRCLECOUNT, center, size, color );
	}
	
	get randomIn( )
	{
		for( var i=0; i<50; i++ )
		{
			var ux = random( -1/2, 1/2 ),
				uy = random( -1/2, 1/2 ),
				uz = random( -1/2, 1/2 );
				
			var x = ux * this.width,
				y = uy * this.height,
				z = uz * this.depth;
				
			switch( this.suica.orientation )
			{
				case Suica.ORIENTATIONS.YXZ:
				case Suica.ORIENTATIONS.XYZ:
					if( ux*ux+uy*uy>1/4 ) continue;
					return this.objectPosition( [x,y,0] );
				
				case Suica.ORIENTATIONS.ZYX:
				case Suica.ORIENTATIONS.YZX:
					if( uz*uz+uy*uy>1/4 ) continue;
					return this.objectPosition( [0,y,z] );
				
				case Suica.ORIENTATIONS.XZY:
				case Suica.ORIENTATIONS.ZXY:
					if( uz*uz+ux*ux>1/4 ) continue;
					return this.objectPosition( [x,0,z] );
			}
		}
		
		return this.objectPosition( [0,0,0] );
	} // Circle.randomIn
	
	
	get randomOn( )
	{
		for( var i=0; i<20; i++ )
		{
			var ux = random( -1/2, 1/2 ),
				uy = random( -1/2, 1/2 ),
				uz = random( -1/2, 1/2 ),
				ud;
				
			var x = ux * this.width,
				y = uy * this.height,
				z = uz * this.depth;
				
			switch( this.suica.orientation )
			{
				case Suica.ORIENTATIONS.YXZ:
				case Suica.ORIENTATIONS.XYZ:
					ud = ux*ux+uy*uy;
					z = 0;
					break;
				
				case Suica.ORIENTATIONS.ZYX:
				case Suica.ORIENTATIONS.YZX:
					ud = uz*uz+uy*uy;
					x = 0;
					break;
				
				case Suica.ORIENTATIONS.XZY:
				case Suica.ORIENTATIONS.ZXY:
					ud = uz*uz+ux*ux;
					y = 0;
					break;
			}
			
			if( ud>1/4 ) continue;
			if( ud<1/5 ) continue;
			ud = Math.sqrt(ud)/(1/2);
			console.log(i);
			return this.objectPosition( [x/ud,y/ud,z/ud] );
		}
		console.log(i,'!!!');
		return this.objectPosition( [0,0,0] );
	} // Circle.randomOn
	
} // class Circle