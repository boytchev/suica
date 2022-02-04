//
// Suica 2.0 Line
// CC-3.0-SA-NC
//
// line( center, to, color )
//
// <line id="" center="" to="" color="">
// <line x="" y="" z="">
//
// center	center [x,y,z]
// x		x coordinate of center
// y		y coordinate of center
// z		z coordinate of center
// to		second point of line
// size		visual size
// color	color [r,g,b]
//
//===================================================


class Line extends Mesh
{

	constructor(suica, center, to, color)
	{
		suica.parser?.parseTags();
		if (DEBUG_CALLS) console.log(`:: ${suica.id}.line(${center},${to},${color})`);
			
		super( suica, THREE.LineSegments, Line.geometry.clone(), Mesh.lineMaterial.clone() );

		this.center = center;
		this.color = color;
		this.to = to;

		suica.scene.add( this.threejs );
	} // Line.constructor



	get center()
	{
		this.suica.parser?.parseTags();

		var pos = this.threejs.geometry.getAttribute( 'position' );
		return [pos.getX(0), pos.getY(0), pos.getZ(0)];
	}

	set center(center)
	{
		this.suica.parser?.parseTags();

		center = Suica.parseCenter( center );
		
		this.threejs.geometry.getAttribute( 'position' ).setXYZ( 0, center[0], center[1], center[2] );
		this.threejs.geometry.needsUpdate = true;
	}




	get from()
	{
		return this.center;
	}

	set from(from)
	{
		this.center = from;
	}




	get to()
	{
		this.suica.parser?.parseTags();

		var pos = this.threejs.geometry.getAttribute( 'position' );
		return [pos.getX(1), pos.getY(1), pos.getZ(1)];
	}

	set to(to)
	{
		this.suica.parser?.parseTags();

		to = Suica.parseCenter( to );
		
		this.threejs.geometry.getAttribute( 'position' ).setXYZ( 1, to[0], to[1], to[2] );
		this.threejs.geometry.needsUpdate = true;
	}





	get size()
	{
		throw 'error: size is not available for line';
	}

	set size( size )
	{
		throw 'error: size is not available for line';
	}
	
	get width()
	{
		throw 'error: width is not available for line';
	}

	set width( width )
	{
		throw 'error: width is not available for line';
	}
	
	get height()
	{
		throw 'error: height is not available for line';
	}

	set height( height )
	{
		throw 'error: height is not available for line';
	}
	
	get depth()
	{
		throw 'error: depth is not available for line';
	}

	set depth( depth )
	{
		throw 'error: depth is not available for line';
	}
	
	get x()
	{
		throw 'error: x is not available for line';
	}

	set x( x )
	{
		throw 'error: x is not available for line';
	}
	
	get y()
	{
		throw 'error: y is not available for line';
	}

	set y( y )
	{
		throw 'error: y is not available for line';
	}
	
	get z()
	{
		throw 'error: z is not available for line';
	}

	set z( z )
	{
		throw 'error: z is not available for line';
	}
	
} // class Line


Line.geometry = new THREE.BufferGeometry();
Line.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0, 0, 30, 0]), 3));
Line.geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([0, 0, 1, 0]), 2));


window.line = function(
					center = Suica.DEFAULT.LINE.CENTER,
					to     = Suica.DEFAULT.LINE.TO,
					color  = Suica.DEFAULT.LINE.COLOR )
{
	Suica.precheck();
	return Suica.current.line( center, to, color );
}