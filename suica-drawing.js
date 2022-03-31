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
// stroke( color, width, close )
// fill( color )
// fillAndStroke( fillColor, strokeColor, width, close )
//
//===================================================


class Drawing
{

	// current active Drawing instance
	static current;



		
	constructor( width=Suica.DEFAULT.DRAWING.SIZE, height=width, color=Suica.DEFAULT.DRAWING.COLOR, newCanvas=true )
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
		
	} // Drawing.constructor




	managePath()
	{
		if( this.needsNewPath )
		{
			this.context.beginPath( );
			this.needsNewPath = false;
		}	
	} // Drawing.managePath



	moveTo( x = Suica.DEFAULT.MOVETO.CENTER[0], y = Suica.DEFAULT.MOVETO.CENTER[1] )
	{
		this.managePath();
		this.context.moveTo( x, this.canvas.height-y );
	} // Drawing.moveTo
	
	
	
	
	lineTo( x = Suica.DEFAULT.LINETO.CENTER[0], y = Suica.DEFAULT.LINETO.CENTER[1] )
	{
		this.managePath();
		this.context.lineTo( x, this.canvas.height-y );
	} // Drawing.lineTo
	
	
	
	
	curveTo( mx = Suica.DEFAULT.CURVETO.M[0], my = Suica.DEFAULT.CURVETO.M[1], x = Suica.DEFAULT.CURVETO.CENTER[0], y = Suica.DEFAULT.CURVETO.CENTER[1] )
	{
		this.managePath();
		this.context.quadraticCurveTo( mx, this.canvas.height-my, x, this.canvas.height-y );
	} // Drawing.curveTo
	
	
	

	arc( x = Suica.DEFAULT.ARC.CENTER[0], y = Suica.DEFAULT.ARC.CENTER[1], r = Suica.DEFAULT.ARC.RADIUS, from = Suica.DEFAULT.ARC.FROM, to = Suica.DEFAULT.ARC.TO, cw = Suica.DEFAULT.ARC.CW )
	{
		this.managePath();
		this.context.arc( x, this.canvas.height-y, r, THREE.Math.degToRad(from-90), THREE.Math.degToRad(to-90), !cw );
	} // Drawing.arc
	
	
	

	fillText( x = Suica.DEFAULT.FILLTEXT.CENTER[0], y = Suica.DEFAULT.FILLTEXT.CENTER[1], text = Suica.DEFAULT.FILLTEXT.TEXT, color = Suica.DEFAULT.FILLTEXT.COLOR, font = Suica.DEFAULT.FILLTEXT.FONT )
	{
		if( this.texture ) this.texture.needsUpdate = true;
		
		this.context.fillStyle = color;
		this.context.font = font;
		this.context.fillText( text, x, this.canvas.height-y );
	} // Drawing.fillText
	
	
	

	stroke( color = Suica.DEFAULT.STROKE.COLOR, width = Suica.DEFAULT.STROKE.WIDTH, close = Suica.DEFAULT.STROKE.CLOSE )
	{
		if( this.texture ) this.texture.needsUpdate = true;
//		this.texture = null; // clear the texture
		
		if( close ) this.context.closePath();
		
		this.context.strokeStyle = color;
		this.context.lineWidth = width;
		this.context.stroke( );

		this.needsNewPath = true;
	} // Drawing.stroke
	
	
	
	
	fill( color = Suica.DEFAULT.FILL.COLOR )
	{
		if( this.texture ) this.texture.needsUpdate = true;
//		this.texture = null; // clear the texture
		
		this.context.fillStyle = color;
		this.context.fill( );

		this.needsNewPath = true;
	} // Drawing.fill
	
	
	
	clear( color = Suica.DEFAULT.CLEAR.COLOR )
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



	fillAndStroke( fillColor = 'gray', strokeColor = 'black', width = 1, close = false )
	{
		// if( this.texture )
		// {
			// console.log( this.texture );
			// this.texture.needsUpdate = true;
		// }
//		this.texture = null; // clear the texture
		
		if( close ) this.context.closePath();

		this.context.strokeStyle = strokeColor;
		this.context.lineWidth = width;
		this.context.stroke( );
		
		this.context.fillStyle = fillColor;
		this.context.fill( );

		this.needsNewPath = true;

		if( this.texture )
		{
			this.texture.needsUpdate = true;
		}
	} // Drawing.fillAndStroke
	
	
	

	get image( )
	{
		if( !this.texture )
		{
			this.texture = new THREE.CanvasTexture( this.canvas );
			this.texture.anisotropy = Suica.current.renderer.capabilities.getMaxAnisotropy();
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




window.drawing = function ( width=32, height=width, color=null )
{
	Drawing.current = new Drawing( width, height, color );
	return Drawing.current;
}




window.moveTo = function ( x = 0, y = 0 )
{
	Drawing.precheck();
	Drawing.current.moveTo( x, y );
}
	
	
	
	
window.lineTo = function ( x = 0, y = 0 )
{
	Drawing.precheck();
	Drawing.current.lineTo( x, y );
}




window.curveTo = function ( mx = 0, my = 0, x = 0, y = 0 )
{
	Drawing.precheck();
	Drawing.current.curveTo( mx, my, x, y );
}




window.arc = function ( x = 0, y = 0, r = 10, from = 0, to = 360, cw )
{
	Drawing.precheck();
	Drawing.current.arc( x, y, r, from, to, cw );
}




window.fillText = function ( x = 0, y = 0, text = '', color = 'black', font = '20px Arial' )
{
	Drawing.precheck();
	Drawing.current.fillText( x, y, text, color, font );
}




window.stroke = function ( color = 'black', width = 1, close = false )
{
	Drawing.precheck();
	Drawing.current.stroke( color, width, close );
}
	
	
	
	
window.fill = function ( color = 'gray' )
{
	Drawing.precheck();
	Drawing.current.fill( color );
}




window.fillAndStroke = function ( fillColor = 'gray', strokeColor = 'black', width = 1, close = false )
{
	Drawing.precheck();
	Drawing.current.fillAndStroke( fillColor, strokeColor, width, close );
}




window.clear = function ( color = null )
{
	Drawing.precheck();
	Drawing.current.clear( color );
}




window.image = function ( url = null )
{
	var texture = new THREE.TextureLoader().load( url );

	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;

	texture.magFilter = THREE.LinearFilter;
	texture.minFilter = THREE.LinearMipmapLinearFilter;

	texture.anisotropy = Suica.current.renderer.capabilities.getMaxAnisotropy();

	return texture;
}




