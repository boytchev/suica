//
// Suica 2.0 DEVICE
// CC-3.0-SA-NC
//
//===================================================


class Device
{
	static screenOrientation = 1;
	static relativeOrientation = {alpha:0, beta:0, gamma:0, absolute:0};
	static absoluteOrientation = {alpha:0, beta:0, gamma:0, absolute:0};

	static relativeAcceleration = {x:0, y:0, z:0, dT:0};
	static relativeVelocity = {x:0, y:0, z:0, dT:0};
	static relativePosition = {x:0, y:0, z:0, dT:0};
	
	constructor( )
	{
		if( screen.orientation )
		{
			Device.screenOrientation = screen.orientation.angle;
			screen.orientation.onchange = Device.onOrientationChange;
		}
		else
		if( window.orientation )
		{
			Device.screenOrientation = window.orientation.angle;
			window.orientation.onchange = Device.onOrientationChange;
		}
		else
		{
			document.addEventListener( 'orientationchange', Device.onOrientationChange, true );
		}
		
		window.addEventListener( 'deviceorientation', Device.onDeviceOrientationRelative, true );
		window.addEventListener( 'deviceorientationabsolute', Device.onDeviceOrientationAbsolute, true );
		window.addEventListener( 'devicemotion', Device.onDeviceMotion, true );
	} // Device.constructor
	
	
	
	static onOrientationChange( event )
	{	
		if( event.target.screen )
			Device.screenOrientation = event.target.screen.orientation.angle;
		else
			Device.screenOrientation = event.target.angle;
	} // Device.onOrientationChange
	


	static onDeviceOrientationRelative( event )
	{
		const Q = 100;
		
		Device.relativeOrientation.alpha = Math.round( Q*event.alpha )/Q;
		Device.relativeOrientation.beta = Math.round( Q*event.beta )/Q;
		Device.relativeOrientation.gamma = Math.round( Q*event.gamma )/Q;
		Device.relativeOrientation.absolute = event.absolute;
	} // Device.onDeviceOrientationRelative
	


	static onDeviceOrientationAbsolute( event )
	{
		const Q = 100;
		
		Device.absoluteOrientation.alpha = Math.round( Q*event.alpha )/Q;
		Device.absoluteOrientation.beta = Math.round( Q*event.beta )/Q;
		Device.absoluteOrientation.gamma = Math.round( Q*event.gamma )/Q;
		Device.absoluteOrientation.absolute = event.absolute;
	} // Device.onDeviceOrientationAbsolute
	


	static onDeviceMotion( event )
	{
		var dT = event.interval/1000;
		
		var a = Device.relativeAcceleration,
			v = Device.relativeVelocity,
			p = Device.relativePosition;
			
		a.x = event.acceleration.x;
		a.y = event.acceleration.y;
		a.z = event.acceleration.z;
		a.dT = dT;

		v.x += dT * a.x;
		v.y += dT * a.y;
		v.z += dT * a.z;
		v.dT = dT;

		p.x += dT * v.x;
		p.y += dT * v.y;
		p.z += dT * v.z;
		p.dT = dT;

	} // Device.onDeviceMotion
	


	get screenOrientation( )
	{
		return Device.screenOrientation;
	} // Device.screenOrientation
	
	
	get relativeOrientation( )
	{
		return Device.relativeOrientation;
	} // Device.relativeOrientation
	
	
	get absoluteOrientation( )
	{
		return Device.absoluteOrientation;
	} // Device.absoluteOrientation
	
	
	get relativeAcceleration( )
	{
		return Device.relativeAcceleration;
	} // Device.relativeAcceleration
	
	
	get relativeVelocity( )
	{
		return Device.relativeVelocity;
	} // Device.relativeVelocity
	
	
	get relativePosition( )
	{
		return Device.relativePosition;
	} // Device.relativePosition

} // class Device


window.device = new Device();
