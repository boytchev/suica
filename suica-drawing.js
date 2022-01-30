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
// stroke( color, width )
// fill( color )
// fillAndStroke( fillColor, strokeColor, width )
//
//===================================================


class Drawing
{

	// current active Drawing instance
	static current;



		
	constructor( width=32, height=width, color=null )
	{
		this.canvas = document.createElement( 'canvas' );
		this.canvas.width = width;
		this.canvas.height = height;
		
		this.texture = null;
		
		this.context = this.canvas.getContext( '2d' );
		//this.context.scale( 1, -1 );
		//this.context.translate( 0, -height );
		this.context.clearRect( 0, 0, width, height );
		
		if( color )
		{
			this.context.fillStyle = color;
			this.context.fillRect( 0, 0, width, height );
		}
			
		this.context.beginPath( );
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
		this.context.arc( x, this.canvas.height-y, r, from*Math.PI/2, to*Math.PI/2 );
	} // Drawing.arc
	
	
	

	fillText( x = 0, y = 0, text = '', color = 'black', font = '20px Arial' )
	{
		this.context.fillStyle = color;
		this.context.font = font;
		this.context.fillText( text, x, this.canvas.height-y );
	} // Drawing.fillText
	
	
	

	stroke( color = 'black', width = 1 )
	{
		this.texture = null; // clear the texture
		
		this.context.strokeStyle = color;
		this.context.lineWidth = width;
		this.context.stroke( );

		this.context.beginPath( );
	} // Drawing.stroke
	
	
	
	
	fill( color = 'gray' )
	{
		this.texture = null; // clear the texture
		
		this.context.fillStyle = color;
		this.context.fill( );

		this.context.beginPath( );
	} // Drawing.fill
	
	
	

	fillAndStroke( fillColor = 'gray', strokeColor = 'black', width = 1 )
	{
		this.texture = null; // clear the texture
		
		this.context.strokeStyle = strokeColor;
		this.context.lineWidth = width;
		this.context.stroke( );
		
		this.context.fillStyle = fillColor;
		this.context.fill( );

		this.context.beginPath( );
	} // Drawing.fillAndStroke
	
	
	

	get image( )
	{
		if( !this.texture )
			this.texture = new THREE.CanvasTexture( this.canvas );
			
		return this.texture;
	} // Drawing.image
	
	

	
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




window.stroke = function ( color = 'black', width = 1 )
{
	Drawing.precheck();
	Drawing.current.stroke( color, width );
}
	
	
	
	
window.fill = function ( color = 'gray' )
{
	Drawing.precheck();
	Drawing.current.fill( color );
}




window.fillAndStroke = function ( fillColor = 'gray', strokeColor = 'black', width = 1 )
{
	Drawing.precheck();
	Drawing.current.fillAndStroke( fillColor, strokeColor, width );
}




