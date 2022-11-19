//
// Suica 2.0 DEVICE
// CC-3.0-SA-NC
//
//===================================================


class Device
{
	// device and screen orientation
	// 		spin[0] = device orientation alpha
	// 		spin[1] = device orientation beta
	// 		spin[2] = device orientation gamma
	// 		spin[3] = screen orientation alpha
	static _spin = [0,0,0,0];
	static _absolute = false;
	
	static enableDeviceOrientationAbsolute = true;
	static enableDeviceOrientationRelative = true;
	
	static _debug;
	
	constructor( )
	{
		if( screen.orientation )
		{
Device._debug = 'de1';
			Device._spin[3] = screen.orientation.angle;
			screen.orientation.onchange = this.onOrientationChange;
		}
		else
		if( window.orientation )
		{
Device._debug = 'de2';
			Device._spin[3] = window.orientation.angle;
			window.orientation.onchange = this.onOrientationChange;
		}
		else
		{
Device._debug = 'de3';
			document.addEventListener( 'orientationchange', Device.onOrientationChange, true );
		}
		
		window.addEventListener( 'deviceorientation', Device.onDeviceOrientationRelative, true );
		window.addEventListener( 'deviceorientationabsolute', Device.onDeviceOrientationAbsolute, true );
	} // Device.constructor
	
	
	
	static onOrientationChange( event )
	{
		var angle;
		element('info').innerHTML = event;
		
		if( event.target.screen )
			angle = event.target.screen.orientation.angle;
		else
			angle = event.target.angle;

		Device._spin[3] = angle;
	} // Device.onOrientationChange
	


	static handleOrientation( event )
	{
		const Q = 100;
		
		element('info').innerHTML = event.type;
		
		console.log(event.type,event.alpha,event.beta,event.gamma);
		
		Device._spin[0] = Math.round( Q*event.alpha )/Q;
		Device._spin[1] = Math.round( Q*event.beta )/Q;
		Device._spin[2] = Math.round( Q*event.gamma )/Q;
		Device._absolute = event.absolute;
	} // Device.handleOrientation
	


	static onDeviceOrientationRelative( event )
	{
		if( Device.enableDeviceOrientationRelative )
		{
			Device.handleOrientation( event );
		}
	} // Device.onDeviceOrientationRelative
	


	static onDeviceOrientationAbsolute( event )
	{
		if( Device.enableDeviceOrientationAbsolute )
		{
			Device.handleOrientation( event );
			
			// if no data is provided, unhook the absolute handler, otherwise unhool the relative handler
			if( (event.alpha == null) || (event.beta == null) || (event.gamma == null) )
			{
				// absolute orientation is not good, disable it
				Device.enableDeviceOrientationAbsolute = false;
				window.removeEventListener( 'deviceorientationabsolute', Device.onDeviceOrientationAbsolute, true );
			}
			else
			{
				// absolute orientation is good, disable relative
				Device.enableDeviceOrientationRelative = false;
				window.removeEventListener( 'deviceorientation', Device.onDeviceOrientationRelative, true );
			}
		}
	} // Device.onDeviceOrientationAbsolute
	


	get spin( )
	{
		return Device._spin;
	} // Device.spin
	
	
	get alpha( )
	{
		return Device._spin[0];
	} // Device.alpha
	
	
	get beta( )
	{
		return Device._spin[1];
	} // Device.beta
	
	
	get gamma( )
	{
		return Device._spin[2];
	} // Device.gamma
	
	
	get delta( )
	{
		return Device._spin[3];
	} // Device.delta
	
	
	get absolute( )
	{
		return Device._absolute;
	} // Device.delta
	
	
} // class Device


window.device = new Device();
