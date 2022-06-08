//
// Suica 2.0 Drawing
// CC-3.0-SA-NC
//
// drawing( width, height, color )
// moveTo( x, y )
// lineTo( x, y )
// curveTo( mx, my, x, y )
// arc( x, y, r, from, to )
// fillText( x, y, text, color, font )
// stroke( color, width, closed )
// fill( color )
//
//===================================================


class Drawing
{
	static SIZE = 32;
	static COLOR = null;
	static ARC_RADIUS = 10;
	static ARC_FROM = 0;
	static ARC_TO = 360;
	static ARC_CW = true;
	static FILL_COLOR = 'gray';
	static STROKE_COLOR = 'black';
	static STROKE_WIDTH = 1;
	static STROKE_CLOSED = false;
	static FONT = '20px Arial';

	// current active Drawing instance
	static current;


	constructor( width=Drawing.SIZE, height=width, color=Drawing.COLOR, newCanvas=true )
	{
		if( newCanvas )
		{
			this.canvas = document.createElement( 'canvas' );
			this.canvas.width = width;
			this.canvas.height = height;
			this.texture = null;
		
			this.context = this.canvas.getContext( '2d' );
			this.context.clearRect( 0, 0, width, height );
			
			if( color )
			{
				this.context.fillStyle = color;
				this.context.fillRect( 0, 0, width, height );
			}
			
			this.needsNewPath = true;
			
//document.body.appendChild( this.canvas );			
		}
	
		// register some local methods as public global functions
		for( var methodName of ['moveTo', 'lineTo', 'curveTo', 'arc', 'fillText', 'stroke', 'fill', 'clear'] )
		{
			Drawing.register( methodName );
		}
		
	} // Drawing.constructor



	static register( methodName )
	{
		window[methodName] = function ( ...params )
		{
			Drawing.precheck();
			Drawing.current[methodName]( ...params );
		}
	}
		


	// parse a number
	static parseN( elem, name, defaultValue )
	{
		return Suica.parseNumber( elem.getAttribute(name), defaultValue );
	}
	
	// parse 2D coordinates in centerName and alternatively
	// individual coordinates xName and yName
	static parseXY( elem, centerName, xName, yName )
	{
		var xy = Suica.parseSize( elem.getAttribute(centerName), [0,0] );
		if( elem.hasAttribute(xName) )
			xy[0] = Drawing.parseN( elem, xName, 0 );
		if( elem.hasAttribute(yName) )
			xy[1] = Drawing.parseN( elem, yName, 0 );
		return xy;
	}
	
	// parse exclusive boolean value trueName; or its opposite falseName
	static parseBool( elem, trueName, falseName, defaultValue )
	{
		const TRUTH = [null,'','true','yes','TRUE','True','YES','Yes','1'];
		
		if( trueName && elem.hasAttribute(trueName) )
			return TRUTH.indexOf(elem.getAttribute(trueName)) > -1;

		if( falseName && elem.hasAttribute(falseName) )
			return TRUTH.indexOf(elem.getAttribute(falseName)) == -1;
		
		return defaultValue;
	}


	managePath()
	{
		if( this.needsNewPath )
		{
			this.context.beginPath( );
			this.needsNewPath = false;
		}	
	} // Drawing.managePath



	moveTo( x=0, y=0, ...morePoints )
	{
		this.managePath();
		this.context.moveTo( x, this.canvas.height-y );

		for( var i=0; i<morePoints.length; i+=2 )
		{
			x = morePoints[i] || 0;
			y = morePoints[i+1] || 0;
			this.context.lineTo( x, this.canvas.height-y );
		}
	} // Drawing.moveTo
	
	
	
	
	lineTo( x=0, y=0, ...morePoints )
	{
		this.managePath();
		this.context.lineTo( x, this.canvas.height-y );
		
		for( var i=0; i<morePoints.length; i+=2 )
		{
			x = morePoints[i] || 0;
			y = morePoints[i+1] || 0;
			this.context.lineTo( x, this.canvas.height-y );
		}
	} // Drawing.lineTo
	
	
	
	
	curveTo( mx=0, my=0, x=0, y=0 )
	{
		this.managePath();
		this.context.quadraticCurveTo( mx, this.canvas.height-my, x, this.canvas.height-y );
	} // Drawing.curveTo
	
	
	

	arc( x=0, y=0, r=Drawing.ARC_RADIUS, from = Drawing.ARC_FROM, to = Drawing.ARC_TO, cw = Drawing.ARC_CW )
	{
		this.managePath();
		this.context.arc( x, this.canvas.height-y, r, THREE.MathUtils.degToRad(from-90), THREE.MathUtils.degToRad(to-90), !cw );
	} // Drawing.arc
	
	
	

	fillText( x=0, y=0, text='', color = Drawing.FILL_COLOR, font = Drawing.FONT )
	{
		if( this.texture ) this.texture.needsUpdate = true;
		
		this.context.fillStyle = color;
		this.context.font = font;
		this.context.fillText( text, x, this.canvas.height-y );
	} // Drawing.fillText
	
	
	

	stroke( color = Drawing.STROKE_COLOR, width = Drawing.STROKE_WIDTH, closed = Drawing.STROKE_CLOSED )
	{
		if( this.texture ) this.texture.needsUpdate = true;
		
		if( closed ) this.context.closePath();
		
		this.context.strokeStyle = color;
		this.context.lineWidth = width;
		this.context.stroke( );

		this.needsNewPath = true;
	} // Drawing.stroke
	
	
	
	
	fill( color = Drawing.FILL_COLOR )
	{
		if( this.texture ) this.texture.needsUpdate = true;
		
		this.context.fillStyle = color;
		this.context.fill( );

		this.needsNewPath = true;
	} // Drawing.fill
	
	
	// if color is missing, clear canvas to transparent
	clear( color )
	{
		if( this.texture ) this.texture.needsUpdate = true;

		if( color )
		{
			this.context.fillStyle = color;
			this.context.fillRect( -1, -1, this.canvas.width+2, this.canvas.height+2 );
		}
		else
		{
			this.context.clearRect( -1, -1, this.canvas.width+2, this.canvas.height+2 );
		}

		this.needsNewPath = true;
	}



	get image( )
	{
		if( !this.texture )
		{
			this.texture = new THREE.CanvasTexture( this.canvas );
			this.texture.anisotropy = /*Suica.current*/window.suica.renderer.capabilities.getMaxAnisotropy();
			this.texture.wrapS = THREE.RepeatWrapping;
			this.texture.wrapT = THREE.RepeatWrapping;
		}
			
		return this.texture;
	} // Drawing.image
	
	

	get clone( )
	{
		var newDrawing = drawing( this.canvas.width, this.canvas.height, 'white', false );
			newDrawing.canvas = this.canvas;
			newDrawing.context = this.context;
			newDrawing.texture = this.texture;

		// var newDrawing = drawing( this.canvas.width, this.canvas.height );
		// newDrawing.context.drawImage( this.canvas, 0, 0);
		
		return newDrawing;
	}
	
	
	static precheck()
	{
		if( !(Drawing.current instanceof Drawing) )
			throw 'error: No Drawing instance is active';		
	} // Drawing.precheck

} // class Drawing




window.drawing = function ( ...params )
{
	Drawing.current = new Drawing( ...params );
	return Drawing.current;
}



window.image = function ( url = null )
{
	var texture = new THREE.TextureLoader().load( url );

	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;

	texture.magFilter = THREE.LinearFilter;
	texture.minFilter = THREE.LinearMipmapLinearFilter;

	texture.anisotropy = /*Suica.current*/window.suica.renderer.capabilities.getMaxAnisotropy();

	return texture;
}




