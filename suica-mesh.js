//
// Suica 2.0 Mesh
// CC-3.0-SA-NC
//
// new Mesh( suica, geometry, material, center, color )
// new MeshFrame( suica, geometry, material, center, color )
//
//
//	center		center [x,y,z]
//	x			x coordinate of center
//	y			y coordinate of center
//	z			z coordinate of center
//	color		color [r,g,b]
//	size		size / [height,width,depth]
//	image		drawing or texture -- only for Mesh
//
//===================================================


class Mesh extends THREE.Mesh
{

	constructor( suica, geometry, material )
	{
		super( geometry, material );
		
		this.suica = suica;
		
		// [width, height, depth]
		this.meshSize = [null, null, null];
	}



	
	get center()
	{
		this.suica.parser?.parseTags();

		return [this.position.x, this.position.y, this.position.z];
	}

	set center(center)
	{
		this.suica.parser?.parseTags();

		center = Suica.parseCenter(center);
		this.position.set(center[0], center[1], center[2]);
	}




	get x()
	{
		this.suica.parser?.parseTags();

		return this.position.x;
	}

	set x( x )
	{
		this.suica.parser?.parseTags();

		this.position.x = x;
	}




	get y()
	{
		this.suica.parser?.parseTags();

		return this.position.y;
	}

	set y( y )
	{
		this.suica.parser?.parseTags();

		this.position.y = y;
	}




	get z()
	{
		this.suica.parser?.parseTags();

		return this.position.z;
	}

	set z( z )
	{
		this.suica.parser?.parseTags();

		this.position.z = z;
	}




	get color()
	{
		this.suica.parser?.parseTags();
		
		var col = this.material.color;
		return [col.r, col.g, col.b];
	}

	set color( col )
	{
		this.suica.parser?.parseTags();

		this.material.color = Suica.parseColor(col);
		this.material.needsUpdate = true;
	}
	
	
	
	
	set image( drawing )
	{
		this.suica.parser?.parseTags();

		if (drawing instanceof Drawing)
		{
			this.material.map = drawing.image;
			this.material.transparent = true,
			this.material.needsUpdate = true;
			return;
		}

		if (drawing instanceof THREE.Texture)
		{
			this.material.map = drawing;
			this.material.transparent = true,
			this.material.needsUpdate = true;
			return;
		}

		throw 'error: Parameter of `image` is not a drawing';
	}
	
	
	
	
	updateScale( )
	{
		var width = this.meshSize[0];
		var height = this.meshSize[1];
		var depth = this.meshSize[2];
		
		if( height===null ) height = width;
		if( depth===null ) depth = width;
				
		switch( this.suica.orientation )
		{
			case Suica.ORIENTATIONS.YXZ:
					this.scale.set( height, width, depth );
					break;
			case Suica.ORIENTATIONS.ZYX:
					this.scale.set( depth, height, width );
					break;
			case Suica.ORIENTATIONS.XZY:
					this.scale.set( width, depth, height );
					break;

			case Suica.ORIENTATIONS.ZXY:
					this.scale.set( height, depth, width );
					break;
			case Suica.ORIENTATIONS.XYZ:
					this.scale.set( width, height, depth );
					break;
			case Suica.ORIENTATIONS.YZX:
					this.scale.set( depth, width, height );
					break;
			default: throw 'error: unknown orientation';
		}
	}

	get width( )
	{
		return this.meshSize[0];
	}

	set width( width )
	{
		this.meshSize[0] = width;
		this.updateScale();
	}
	


	
	get height( )
	{
		return (this.meshSize[1]!==null) ? this.meshSize[1] : this.meshSize[0];
	}

	set height( height )
	{
		this.meshSize[1] = height;
		this.updateScale();
	}
	


	
	get depth( )
	{
		return (this.meshSize[2]!==null) ? this.meshSize[2] : this.meshSize[0];
	}

	set depth( depth )
	{
		this.meshSize[2] = depth;
		this.updateScale();
	}
	


	
	get size( )
	{
		this.suica.parser?.parseTags();

		if( this.meshSize[2]===null )
		{
			if( this.meshSize[1]===null )
				return this.meshSize[0];
			else
				return [this.meshSize[0], this.meshSize[1]];
		}
			
		return [this.meshSize[0], this.meshSize[1], this.meshSize[2]];
	}

	set size( size )
	{
		this.suica.parser?.parseTags();
		
		if( Array.isArray(size) )
		{
			if( size.length==0 )
				this.meshSize = [null, null, null];
			else
			if( size.length==1 )
				this.meshSize = [size[0], null, null];
			else
			if( size.length==2 )
				this.meshSize = [size[0], size[1], null];
			else
				this.meshSize = [size[0], size[1], size[2]];
		}
		else
		{
			this.meshSize = [size, null, null];
			console.log('ms=',this.meshSize);
		}
		
		this.updateScale();
	}




	
} // class Mesh




class MeshFrame extends THREE.LineSegments
{

	constructor( suica, geometry, material )
	{
		super( geometry, material );
		
		this.suica = suica;

		// [width, height, depth]
		this.meshSize = [null, null, null];
	}



	
	get center()
	{
		this.suica.parser?.parseTags();

		return [this.position.x, this.position.y, this.position.z];
	}

	set center(center)
	{
		this.suica.parser?.parseTags();

		center = Suica.parseCenter(center);
		this.position.set(center[0], center[1], center[2]);
	}




	get x()
	{
		this.suica.parser?.parseTags();

		return this.position.x;
	}

	set x( x )
	{
		this.suica.parser?.parseTags();

		this.position.x = x;
	}




	get y()
	{
		this.suica.parser?.parseTags();

		return this.position.y;
	}

	set y( y )
	{
		this.suica.parser?.parseTags();

		this.position.y = y;
	}




	get z()
	{
		this.suica.parser?.parseTags();

		return this.position.z;
	}

	set z( z )
	{
		this.suica.parser?.parseTags();

		this.position.z = z;
	}




	get color()
	{
		this.suica.parser?.parseTags();
		
		var col = this.material.color;
		return [col.r, col.g, col.b];
	}

	set color( col )
	{
		this.suica.parser?.parseTags();

		this.material.color = Suica.parseColor(col);
		this.material.needsUpdate = true;
	}




	updateScale( )
	{
		var width = this.meshSize[0];
		var height = this.meshSize[1];
		var depth = this.meshSize[2];
		
		if( height===null ) height = width;
		if( depth===null ) depth = width;
				
		switch( this.suica.orientation )
		{
			case Suica.ORIENTATIONS.YXZ:
					this.scale.set( height, width, depth );
					break;
			case Suica.ORIENTATIONS.ZYX:
					this.scale.set( depth, height, width );
					break;
			case Suica.ORIENTATIONS.XZY:
					this.scale.set( width, depth, height );
					break;

			case Suica.ORIENTATIONS.ZXY:
					this.scale.set( height, depth, width );
					break;
			case Suica.ORIENTATIONS.XYZ:
					this.scale.set( width, height, depth );
					break;
			case Suica.ORIENTATIONS.YZX:
					this.scale.set( depth, width, height );
					break;
			default: throw 'error: unknown orientation';
		}
	}

	get width( )
	{
		return this.meshSize[0];
	}

	set width( width )
	{
		this.meshSize[0] = width;
		this.updateScale();
	}
	


	
	get height( )
	{
		return (this.meshSize[1]!==null) ? this.meshSize[1] : this.meshSize[0];
	}

	set height( height )
	{
		this.meshSize[1] = height;
		this.updateScale();
	}
	


	
	get depth( )
	{
		return (this.meshSize[2]!==null) ? this.meshSize[2] : this.meshSize[0];
	}

	set depth( depth )
	{
		this.meshSize[2] = depth;
		this.updateScale();
	}
	


	
	get size( )
	{
		this.suica.parser?.parseTags();

		if( this.meshSize[2]===null )
		{
			if( this.meshSize[1]===null )
				return this.meshSize[0];
			else
				return [this.meshSize[0], this.meshSize[1]];
		}
			
		return [this.meshSize[0], this.meshSize[1], this.meshSize[2]];
	}

	set size( size )
	{
		this.suica.parser?.parseTags();
		
		if( Array.isArray(size) )
		{
			if( size.length==0 )
				this.meshSize = [null, null, null];
			else
			if( size.length==1 )
				this.meshSize = [size[0], null, null];
			else
			if( size.length==2 )
				this.meshSize = [size[0], size[1], null];
			else
				this.meshSize = [size[0], size[1], size[2]];
		}
		else
		{
			this.meshSize = [size, null, null];
			console.log('ms=',this.meshSize);
		}
		
		this.updateScale();
	}


	

} // class MeshFrame