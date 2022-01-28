//
// Suica 2.0 Mesh
// CC-3.0-SA-NC
//
// new Mesh( suica, geometry, material, center, color )
//
//
//	center		center [x,y,z]
//	x			x coordinate of center
//	y			y coordinate of center
//	z			z coordinate of center
//	color		color [r,g,b]
//	image		texture (drawing or canvas)
//
//===================================================


class Mesh extends THREE.Mesh
{

	constructor( suica, geometry, material )
	{
		super( geometry, material );
		
		this.suica = suica;
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

		throw 'error: Parameter of `image` is not a drawing';
	}
	
} // class Mesh




class MeshFrame extends THREE.LineSegments
{

	constructor( suica, geometry, material )
	{
		super( geometry, material );
		
		this.suica = suica;
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

	
} // class MeshFrame