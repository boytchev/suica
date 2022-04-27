//
// Suica 2.0 Group
// CC-3.0-SA-NC
//
// new Group( suica, elements )
//
//
//	center		center [x,y,z]
//	x			x coordinate of center
//	y			y coordinate of center
//	z			z coordinate of center
//	size		size / [height,width,depth]
//	spin
//
//===================================================


class Group
{
	static SIZE = [1,1,1];
	
	constructor( suica, ...groupElements )
	{
		suica.debugCall( 'group' );

		this.suica = suica;
		
		this.threejs = new THREE.Group();
		this.threejs.suicaObject = this;
		this.groupElements = [];
		
		// [width, height, depth]
		this.meshSize = [1, 1, 1];
		this.meshSpin = [0, 0, 0];

		this.add( ...groupElements );
		
		suica.scene.add( this.threejs );
	}



	add( ...groupElements )
	{
		for( var oneElement of groupElements )
		{
			this.groupElements.push( oneElement );
			this.threejs.add( oneElement.threejs );
		}
	}
	
	
	
	
	get center()
	{
		this.suica.parser?.parseTags();

		return [this.threejs.position.x, this.threejs.position.y, this.threejs.position.z];
	}

	set center(center)
	{
		this.suica.parser?.parseTags();

		center = Suica.parseCenter( center );
		this.threejs.position.set( ...center );
	}




	get x()
	{
		this.suica.parser?.parseTags();

		return this.threejs.position.x;
	}

	set x( x )
	{
		this.suica.parser?.parseTags();

		this.threejs.position.x = x;
	}




	get y()
	{
		this.suica.parser?.parseTags();

		return this.threejs.position.y;
	}

	set y( y )
	{
		this.suica.parser?.parseTags();

		this.threejs.position.y = y;
	}




	get z()
	{
		this.suica.parser?.parseTags();

		return this.threejs.position.z;
	}

	set z( z )
	{
		this.suica.parser?.parseTags();

		this.threejs.position.z = z;
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
					this.threejs.scale.set( height, width, depth );
					break;
			case Suica.ORIENTATIONS.ZYX:
					this.threejs.scale.set( depth, height, width );
					break;
			case Suica.ORIENTATIONS.XZY:
					this.threejs.scale.set( width, depth, height );
					break;

			case Suica.ORIENTATIONS.ZXY:
					this.threejs.scale.set( height, depth, width );
					break;
			case Suica.ORIENTATIONS.XYZ:
					this.threejs.scale.set( width, height, depth );
					break;
			case Suica.ORIENTATIONS.YZX:
					this.threejs.scale.set( depth, width, height );
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
		
		size = Suica.parseSize( size, Group.SIZE );
		
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
		}
		
		this.updateScale();
	}




	style( properties )
	{
		for( var n in properties ) this[n] = properties[n];
		return this;
		
	} // Group.style




	updateOrientation( )
	{
		var spin = this.meshSpin;
		if( !spin ) return;

		var flip = 1;
		switch( this.suica.orientation )
		{
			//case Suica.ORIENTATIONS.XYZ: 
			case Suica.ORIENTATIONS.XZY: flip = -1; break;
			case Suica.ORIENTATIONS.YXZ: flip = -1; break;
			//case Suica.ORIENTATIONS.YZX:
			//case Suica.ORIENTATIONS.ZXY:
			case Suica.ORIENTATIONS.ZYX: flip = -1; break;
		};
		
		this.threejs.rotation.set( 0, 0, 0 );
		if( Array.isArray(spin) )
		{
			if( spin[0] ) this.threejs.rotateOnAxis( this.suica.orientation.UP, radians(flip*spin[0]) );
			if( spin[1] ) this.threejs.rotateOnAxis( this.suica.orientation.RIGHT, radians(flip*spin[1]) );
			if( spin[2] ) this.threejs.rotateOnAxis( this.suica.orientation.UP, radians(flip*spin[2]) );
		}
		else
		{
			this.threejs.rotateOnAxis( this.suica.orientation.UP, radians(flip*spin) );
		}

	} // Group.updateOrientation

	
	get spin( )
	{
		return this.meshSpin;
	}

	set spin( spin )
	{
		console.log('set spin =',spin, '=', Suica.parseSize( spin ));
		this.meshSpin = Suica.parseSize( spin );
		this.updateOrientation();
	}
	
	get spinH( )
	{
		return this.meshSpin[0];
	}

	set spinH( spin )
	{
		this.meshSpin[0] = Number( spin );
		this.updateOrientation();
	}
	

	get spinV( )
	{
		return this.meshSpin[1];
	}

	set spinV( spin )
	{
		this.meshSpin[1] = Number( spin );
		this.updateOrientation();
	}
	

	get spinT( )
	{
		return this.meshSpin[2];
	}

	set spinT( spin )
	{
		this.meshSpin[2] = Number( spin );
		this.updateOrientation();
	}
	

	addEventListener( type, listener, aux )
	{
		if( aux ) console.warn( 'Suica objects do not support third parameter of addEventListener');
		
		if( !type.startsWith('on') )
			type = 'on'+type;
		
		this[type.toLowerCase()] = listener;
	}
	

	removeEventListener( type, listener, aux )
	{
		if( listener ) console.warn( 'Suica objects do not support second parameter of removeEventListener');
		if( aux ) console.warn( 'Suica objects do not support third parameter of removeEventListener');

		if( !type.startsWith('on') )
			type = 'on'+type;
		
		this[type.toLowerCase()] = null;
	}
	
	
	
	set color( color )
	{
		for( var oneElement of this.groupElements )
		{
			oneElement.color = color;
		}
	}
	
	
	get clone( )
	{
		console.log('cloning',this.meshSpin);
		
		var object = new Group( this.suica );
		for( var oneElement of this.groupElements )
		{
			object.add( oneElement.clone );
		}
		object.center = this.center;
		object.size = this.size;
		object.spin = this.spin;
		Suica.cloneEvents( object, this );

		return object;
		
	} // Group.clone
	
} // class Group
