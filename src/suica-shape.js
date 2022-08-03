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
		for( var methodName of ['moveTo', 'lineTo', 'curveTo', 'arc'] )
		{
			Shape.register( methodName );
		}

	} // Shape.constructor



	static register( methodName )
	{
		window[methodName] = function ( ...params )
		{
			Shape.precheck();
			Shape.current[methodName]( ...params );
		}
	}



	moveTo( x=0, y=0, ...morePoints )
	{
		this.shape.moveTo( x, y );

		for( var i=0; i<morePoints.length; i+=2 )
		{
			x = morePoints[i] || 0;
			y = morePoints[i+1] || 0;
			this.shape.lineTo( x, y );
		}
	} // Shape.moveTo
	
	
	
	
	lineTo( x=0, y=0, ...morePoints )
	{
		this.shape.lineTo( x, y );
		
		for( var i=0; i<morePoints.length; i+=2 )
		{
			x = morePoints[i] || 0;
			y = morePoints[i+1] || 0;
			this.shape.lineTo( x, y );
		}
	} // Shape.lineTo
	
	
	
	
	curveTo( mx=0, my=0, x=0, y=0 )
	{
		console.log(`this.shape.quadraticCurveTo( ${mx}, ${my}, ${x}, ${y} );`);
		this.shape.quadraticCurveTo( mx, my, x, y );
	} // Shape.curveTo
	
	
	

	arc( x=0, y=0, r=Drawing.ARC_RADIUS, from = Drawing.ARC_FROM, to = Drawing.ARC_TO, cw = Drawing.ARC_CW )
	{
		this.shape.arc( x, y, r, THREE.MathUtils.degToRad(from-90), THREE.MathUtils.degToRad(to-90), !cw );
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
	
	
	static precheck()
	{
		if( !(Shape.current instanceof Shape) )
			throw 'error: No Shape instance is active';		
	} // Shape.precheck



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
	Shape.current = new Shape( ...params );
	return Shape.current;
}




