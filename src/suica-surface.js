﻿//
// Suica 2.0 Surface
// CC-3.0-SA-NC
//
//
//===================================================



class Surface extends Mesh
{
	static POINTS = []
	static COUNT = [40,40];
	static COLOR = 'lightsalmon';
	static SIZE = 1;

	constructor( suica, center, plane, count, size, color )
	{
		suica.parser?.parseTags();
		suica.debugCall( 'surface', center, plane?.name || plane, count, size, color );

		var uSegments, vSegments;
		
		count = Suica.parseSize( count, Surface.COUNT );
		if( Array.isArray(count) )
		{
			uSegments = Suica.parseSize( count[0], Surface.COUNT[0] );
			vSegments = Suica.parseSize( count[1], Surface.COUNT[1] );
		}
		else
		{
			uSegments = count;
			vSegments = Surface.COUNT[1];
		}

		var geometry = new THREE.PlaneGeometry( 1, 1, uSegments, vSegments );
		
		super( suica, 
			new THREE.Mesh( geometry, Mesh.solidMaterial.clone() ),
			null, // no wireframe
		);
		
		this._plane = splane(plane);
		this.center = Suica.parseCenter( center );
		this.size = Suica.parseSize( size, Tube.SIZE );
		this.color = Suica.parseColor( color, Tube.COLOR);
		this._count = count;
		this.uSegments = uSegments;
		this.vSegments = vSegments;

		this.updateGeometry( );
		
	} // Surface.constructor

	get count( )
	{
		return this._count;
	}
	
	set count( count )
	{
		count = Suica.parseSize( count );
		if( Array.isArray(count) )
		{
			this.uSegments = Suica.parseSize( count[0], Surface.COUNT[0] );
			this.vSegments = Suica.parseSize( count[1], Surface.COUNT[1] );
		}
		else
		{
			this.uSegments = count;
			this.vSegments = Surface.COUNT[1];
		}
		this._count = count;

		this.threejs.geometry.dispose();
		this.threejs.geometry = new THREE.PlaneGeometry( 1, 1, this.uSegments, this.vSegments );
		this.updateGeometry();
	}
	
	
	get plane( )
	{
		return this._curve;
	}
	

	set plane( plane )
	{
		this._plane = plane;

		this.updateGeometry();
	}
	
	
	get clone( )
	{
		var object = new Tube( this.suica, this.center, this.curve, this.radius, this.size, this.color );
		
		object.spin = this.spin;
		object.image = this.image;

		Suica.cloneEvents( object, this );
			
		return object;
		
	} // Tube.clone
	
	
	updateGeometry( )
	{
		const EPS = 0.00001;
		
		var pos = this.threejs.geometry.getAttribute( 'position' ),
			nor = this.threejs.geometry.getAttribute( 'normal' ),
			uv = this.threejs.geometry.getAttribute( 'uv' ),
			tu = new THREE.Vector3,
			tv = new THREE.Vector3;

		for( var i=0; i<pos.count; i++ )
		{
			var u = (i % (this.uSegments+1))/(this.uSegments);
			var v = (Math.floor( i / (this.uSegments+1)))/(this.vSegments);
			
			var p = this._plane( u, v );
			
			var t = this._plane( u+EPS, v );
			tu.set( t[0]-p[0], t[1]-p[1], t[2]-p[2] );
			
			t = this._plane( u, v+EPS );
			tv.set( t[0]-p[0], t[1]-p[1], t[2]-p[2] );

			tu.cross( tv ).normalize( );
			pos.setXYZ( i, p[0],p[1],p[2] );
			nor.setXYZ( i, -tu.x,-tu.y,-tu.z );
			uv.setXY( i, u, v );
		}
		pos.needsUpdate = true;
		nor.needsUpdate = true;
		uv.needsUpdate = true;
	}
	
	
} // class Surface
