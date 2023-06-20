//
// Suica 2.0 Shape
// CC-3.0-SA-NC
//


class Shape extends Drawing
{
	static COUNT = 10;
	
	// current active Shape instance
	static current;


	constructor( count )
	{
		super( null );
		
		suica.parser?.parseTags();
		suica.debugCall( 'shape', count );

		this.count = Suica.parseNumber( count, Shape.COUNT );
		this.shape = new THREE.Shape( );
		
		// register some local methods as public global functions
		// for( var methodName of ['moveTo', 'lineTo', 'curveTo', 'arc'] )
		// {
			// Shape.register( methodName );
		// }

	} // Shape.constructor



	// static register( methodName )
	// {
		// window[methodName] = function ( ...params )
		// {
			// Shape.precheck();
			// Shape.current[methodName]( ...params );
		// }
	// }



	managePath( )
	{
	}

	
	
	_moveTo( x, y )
	{
		this.shape.moveTo( x, y );
	}

	
	
	_lineTo( x, y )
	{
		this.shape.lineTo( x, y );
	}
	
	
	
	_quadraticCurveTo( mx, my, x, y )
	{
		this.shape.quadraticCurveTo( mx, my, x, y );
	}
	
	
	

	_arc( x, y, r, from, to, cw )
	{
		this.shape.absarc( x, y, r, from, to, cw );
	} // Shape.arc



	fillText(  )
	{
		throw 'fillText() is supported only in drawings, not in shapes';
	} // Shape.fillText
	
	
	
	stroke( )
	{
		throw 'stroke() is supported only in drawings, not in shapes';
	} // Shape.stroke
	
	
	
	
	fill( )
	{
		throw 'fill() is supported only in drawings, not in shapes';
	} // Shape.fill
	
	
	clear( )
	{
		throw 'clear() is supported only in drawings, not in shapes';
	} // Shape.clear


	get clone( )
	{
		var newShape = shape( );
			newShape.shape = this.shape.clone();
		
		return newShape;
	}
	
	
	// static precheck()
	// {
		// if( !(Shape.current instanceof Shape) )
			// throw 'error: No Shape instance is active';		
	// } // Shape.precheck



	get vertices( )
	{
		var vertices = [ ];
		for( var point of this.shape.extractPoints( this.count ).shape )
			vertices.push( [point.x, point.y, 0] );
		
		return vertices;
	}
	
} // class Shape




window.shape = function ( ...params )
{
	Drawing.current = new Shape( ...params );
	return Drawing.current;
}




