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



		
	constructor( width=32, height=width, color=null, newCanvas=true )
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
			
			this.context.beginPath( );
		}
	} // Drawing.constructor




	moveTo( x = 0, y = 0 )
	{
		this.context.moveTo( x, this.canvas.height-y );
	} // Drawing.moveTo
	
	
	
	
	lineTo( x = 0, y = 0 )
	{
		this.context.lineTo( x, this.canvas.height-y );
	} // Drawing.lineTo
	
	
	
	
	curveTo( mx = 0, my = 0, x = 0, y = 0 )
	{
		this.context.quadraticCurveTo( mx, this.canvas.height-my, x, this.canvas.height-y );
	} // Drawing.curveTo
	
	
	

	arc( x = 0, y = 0, r = 10, from = 0, to = 360 )
	{
		this.context.arc( x, this.canvas.height-y, r, THREE.Math.degToRad(from-90), THREE.Math.degToRad(to-90) );
	} // Drawing.arc
	
	
	

	fillText( x = 0, y = 0, text = '', color = 'black', font = '20px Arial' )
	{
		if( this.texture ) this.texture.needsUpdate = true;
		
		this.context.fillStyle = color;
		this.context.font = font;
		this.context.fillText( text, x, this.canvas.height-y );
	} // Drawing.fillText
	
	
	

	stroke( color = 'black', width = 1, close = false )
	{
		if( this.texture ) this.texture.needsUpdate = true;
//		this.texture = null; // clear the texture
		
		if( close ) this.context.closePath();
		
		this.context.strokeStyle = color;
		this.context.lineWidth = width;
		this.context.stroke( );

		this.context.beginPath( );
	} // Drawing.stroke
	
	
	
	
	fill( color = 'gray' )
	{
		if( this.texture ) this.texture.needsUpdate = true;
//		this.texture = null; // clear the texture
		
		this.context.fillStyle = color;
		this.context.fill( );

		this.context.beginPath( );
	} // Drawing.fill
	
	
	
	clear( color = null )
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

		this.context.beginPath( );
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

		this.context.beginPath( );

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




window.arc = function ( x = 0, y = 0, r = 10, from = 0, to = 360 )
{
	Drawing.precheck();
	Drawing.current.arc( x, y, r, from, to );
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




