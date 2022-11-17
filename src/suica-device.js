//
// Suica 2.0 DEVICE
// CC-3.0-SA-NC
//
//===================================================


class Device
{
	static _delta; // screen orientation
	static _debug;
	
	constructor( )
	{
		if( screen.orientation )
		{
Device._debug = 'de1';
			Device._delta = screen.orientation.angle;
			screen.orientation.onchange = this.onOrientationChange;
		}
		else
		if( window.orientation )
		{
Device._debug = 'de2';
			Device._delta = window.orientation.angle;
			window.orientation.onchange = this.onOrientationChange;
		}
		else
		{
Device._debug = 'de3';
			document.addEventListener( 'orientationchange', this.onOrientationChange );
		}
		
	} // Device.constructor
	
	
	
	onOrientationChange( event )
	{
		var angle;
		element('info').innerHTML = event;
		
		if( event.target.screen )
			angle = event.target.screen.orientation.angle;
		else
			angle = event.target.angle;

		Device._delta = angle;
	} // Device.onOrientationChange
	


	get delta( )
	{
		return Device._delta;
	} // Device.delta
	
	
} // class Device


window.device = new Device();
