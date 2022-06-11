//
// Suica 2.0 Capture
// CC-3.0-SA-NC
//
//===================================================


class Capture
{
	static TIME = 10;
	static FPS = 30;
	static SKIPFRAMES = 5;
	static FORMAT = 'webm';
	
	constructor( suica, name, time, fps, format, skipFrames )
	{
		if( suica.capturer )
		{
			throw 'error: only one active capture is allowed';
		}
			
		time = Suica.parseNumber( time, Capture.TIME );
		fps = Suica.parseNumber( fps, Capture.FPS );
		skipFrames = Suica.parseNumber( skipFrames, Capture.SKIPFRAMES );
		
		var currentFileName
		
		this.options = {
				format: format || Capture.FORMAT,
				display: true,
				name: name || window.location.pathname.split('/').pop().split('#').shift().split('.html').shift(),
				framerate: fps,
				workersPath: './',
			}
			
		this.suica = suica;
		this.framesLeft = Math.round( time * fps );
		this.skipFrames = THREE.MathUtils.clamp( skipFrames, 0, 1000 );
		this._capturer = null;
		
		this.suica.capturer = this;
	} // Capture.constructor
	
	
	capture()
	{
		// skip some frame before staring actual recording
		if( this.skipFrames > 0 )
		{
			this.skipFrames--;
			return;
		}

		// if capturer is not created, create it now
		if( !this._capturer )
		{
			this._capturer = new CCapture ( this.options );
			this._capturer.start( );
		}
			
		// capture frame
		if( this.framesLeft > 0 )
		{
			this.framesLeft--;
			this._capturer.capture( this.suica.canvas );
			return;
		}

		// finiliza capturing
		this._capturer.save( );
		this._capturer.stop( );
		this.suica.capturer = null;

		// clear the recording indicator
		for( var div of document.getElementsByTagName( 'div' ) )
			if( div.innerHTML.includes('CCapture') )
				if( div.innerHTML.includes(' | ') )
						div.remove( );
					
	} // Capture.capture
	
	
} // class Capture
