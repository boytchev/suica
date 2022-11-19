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
			document.addEventListener( 'orientationchange', this.onOrientationChange );
		}
		
		window.addEventListener( 'deviceorientation', this.onDeviceOrientation );
		window.addEventListener( 'deviceorientationabsolute', this.onDeviceOrientation );
	} // Device.constructor
	
	
	
	onOrientationChange( event )
	{
		var angle;
		element('info').innerHTML = event;
		
		if( event.target.screen )
			angle = event.target.screen.orientation.angle;
		else
			angle = event.target.angle;

		Device._spin[3] = angle;
	} // Device.onOrientationChange
	


	onDeviceOrientation( event )
	{
		var angle;
		element('info').innerHTML = event.type;
		
		Device._spin[0] = event.alpha;
		Device._spin[1] = event.beta;
		Device._spin[2] = event.gamma;
		Device._absolute = event.absolute;
	} // Device.onDeviceOrientation
	


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
