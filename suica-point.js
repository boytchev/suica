//
// Suica 2.0 Point
// CC-3.0-SA-NC
//
// point( center, size, color )
//
// <point id="" center="" x="" y="" z="" size="" color="">
//
// center	center [x,y,z]
// x		x coordinate of center
// y		y coordinate of center
// z		z coordinate of center
// size		visual size
// color	color [r,g,b]
// image	texture (drawing or canvas)
//
//===================================================


class Point extends THREE.Points
{

	// a static geometry shared by all points
	static geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3));




	constructor(suica, center, size, color)
	{
		suica.parser?.parseTags();
		if (DEBUG_CALLS) console.log(`:: ${suica.id}.point(${center},${size},${color})`);

		super( Point.geometry, Suica.pointMaterial.clone() );

		this.suica = suica;
		this.center = center;
		this.color = color;
		this.size = size;

		suica.scene.add(this);
		
	} // Point.constructor




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




	get size()
	{
		this.suica.parser?.parseTags();

		return this.material.size;
	}

	set size( size )
	{
		this.suica.parser?.parseTags();

		this.material.size = size;
		this.material.needsUpdate = true;
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




	set image(drawing)
	{
		this.suica.parser?.parseTags();

		if (drawing instanceof Drawing)
		{
			this.material.map = drawing.image;
			this.material.needsUpdate = true;
			return;
		}

		throw 'error: Parameter of `image` is not a drawing';
	}
	
} // class Point




window.point = function(
					center = Suica.DEFAULT.POINT.CENTER,
					size   = Suica.DEFAULT.POINT.SIZE,
					color  = Suica.DEFAULT.POINT.COLOR )
{
	Suica.precheck();
	return Suica.current.point( center, size, color );
}