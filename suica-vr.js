//
// Suica 2.0 VR, anaglyph and atereo
//
// Brutally based on Three.js' VRButton and StereoEffect.js
//
// createVRButton( renderer )
//
// AnaglyphEffect( suica, distance );
//		setSize( width, height )
//		dispose( );
//
// StereoEffect( suica, distance );
//		setSize( width, height )
//		dispose( );
//
//===================================================


function createFSButton( suica )
{
	var inFullScreen = false;
	
	var button = document.createElement( 'button' );

	button.style.display = '';

	button.style.cursor = 'pointer';
	button.style.left = 'calc(50% - 90px)';
	button.style.width = '180px';

	button.style.position = 'absolute';
	button.style.bottom = '20px';
	button.style.padding = '12px 6px';
	button.style.border = '1px solid #fff';
	button.style.borderRadius = '4px';
	button.style.background = 'rgba(0,0,0,0.5)';
	button.style.color = '#fff';
	button.style.font = 'normal 13px';
	button.style.textAlign = 'center';
	button.style.opacity = '0.5';
	button.style.outline = 'none';
	button.style.zIndex = '999';

	var requestFullscreen = suica.suicaTag.requestFullscreen || suica.suicaTag.webkitRequestFullscreen || suica.suicaTag.msRequestFullscreen;

	button.textContent = requestFullscreen ? 'ENTER FULLSCREEN' : 'FULLSCREEN NOT SUPPORTED';

	button.onmouseenter = function( )
	{
		button.style.opacity = '1.0';
	};

	button.onmouseleave = function( )
	{
		button.style.opacity = '0.5';
	};

	if( requestFullscreen )
	{
		button.onclick = function( )
		{
			requestFullscreen.call( suica.suicaTag );
		};
	}

	suica.suicaTag.onfullscreenchange = function( )
	{
		button.style.display = document.fullscreenElement ? 'none' : '';
		
		suica.resizeCanvas();
	}
	
	window.addEventListener( 'resize', function()
	{
		suica.resizeCanvas();
	});
	
	return button;
} // createFSButton



function createVRButton( renderer )
{
	var button = document.createElement( 'button' );

	function showEnterVR( )
	{
		var currentSession = null;


		async function onSessionStarted( session )
		{
			session.addEventListener( 'end', onSessionEnded );

			await renderer.xr.setSession( session );
			button.textContent = 'EXIT VR';

			currentSession = session;
		} // showEnterVR.onSessionStarted
		

		function onSessionEnded( )
		{
			currentSession.removeEventListener( 'end', onSessionEnded );

			button.textContent = 'ENTER VR';

			currentSession = null;
		} // showEnterVR.onSessionEnded



		button.style.display = '';

		button.style.cursor = 'pointer';
		button.style.left = 'calc(50% - 50px)';
		button.style.width = '100px';

		button.textContent = 'ENTER VR';

		button.onmouseenter = function ()
		{
			button.style.opacity = '1.0';
		};

		button.onmouseleave = function ()
		{
			button.style.opacity = '0.5';
		};

		button.onclick = function ()
		{
			if ( currentSession === null )
			{
				var sessionInit = { optionalFeatures: [ 'local-floor', 'bounded-floor', 'hand-tracking', 'layers' ] };
				navigator.xr.requestSession( 'immersive-vr', sessionInit ).then( onSessionStarted );
			}
			else
			{
				currentSession.end();
			}
		}; // onclick

	} // showEnterVR


	function disableButton()
	{
		button.style.display = '';

		button.style.cursor = 'auto';
		button.style.left = 'calc(50% - 75px)';
		button.style.width = '150px';

		button.onmouseenter = null;
		button.onmouseleave = null;

		button.onclick = null;
	}


	function showWebXRNotFound()
	{
		disableButton();

		button.textContent = 'VR NOT SUPPORTED';
	}


	function stylizeElement( element )
	{
		element.style.position = 'absolute';
		element.style.bottom = '20px';
		element.style.padding = '12px 6px';
		element.style.border = '1px solid #fff';
		element.style.borderRadius = '4px';
		element.style.background = 'rgba(0,0,0,0.5)';
		element.style.color = '#fff';
		element.style.font = 'normal 13px';
		element.style.textAlign = 'center';
		element.style.opacity = '0.5';
		element.style.outline = 'none';
		element.style.zIndex = '999';
	}


	if ( 'xr' in navigator )
	{
		// VR button is created
		
		button.id = 'VRButton';
		button.style.display = 'none';

		stylizeElement( button );

		navigator.xr.isSessionSupported( 'immersive-vr' ).then(
			function ( supported )
			{
				supported ? showEnterVR() : showWebXRNotFound();
			}
		);

		return button;
	}
	else
	{
		// VR button is not created

		const message = document.createElement( 'a' );

		if ( window.isSecureContext === false )
		{
			message.href = document.location.href.replace( /^http:/, 'https:' );
			message.innerHTML = 'WEBXR NEEDS HTTPS';
		}
		else
		{
			message.href = 'https://immersiveweb.dev/';
			message.innerHTML = 'WEBXR NOT AVAILABLE';
		}

		message.style.left = 'calc(50% - 90px)';
		message.style.width = '180px';
		message.style.textDecoration = 'none';

		stylizeElement( message );

		return message;
	} // if ( 'xr' in navigator )

} // createVRButton


class AnaglyphEffect extends THREE.AnaglyphEffect
{

	constructor( suica, distance )
	{
		super( suica.renderer, suica.canvas.width, suica.canvas.height );

		this.suica = suica;
		this.suica.camera.focus = distance;
	} // AnaglyphEffect.constructor

} // class AnaglyphEffect



class StereoEffect
{

	constructor( suica, distance )
	{
		this.suica = suica;
		
		this.stereo = new THREE.StereoCamera();
		this.stereo.aspect = 0.5;
		this.stereo.eyeSep = distance;
		
		this.size = new THREE.Vector2();

	} // StereoEffect.constructor


	setSize( width, height )
	{
		this.suica.renderer.setSize( width, height );
		
	} // StereoEffect.setSize


	render( scene, camera )
	{
		scene.updateMatrixWorld();
		if ( camera.parent === null ) camera.updateMatrixWorld();

		this.stereo.update( camera );

		this.suica.renderer.getSize( this.size );
		if ( this.suica.renderer.autoClear ) this.suica.renderer.clear();
		this.suica.renderer.setScissorTest( true );
		this.suica.renderer.setScissor( 0, 0, this.size.width / 2, this.size.height );
		this.suica.renderer.setViewport( 0, 0, this.size.width / 2, this.size.height );
		this.suica.renderer.render( scene, this.stereo.cameraL );
		this.suica.renderer.setScissor( this.size.width / 2, 0, this.size.width / 2, this.size.height );
		this.suica.renderer.setViewport( this.size.width / 2, 0, this.size.width / 2, this.size.height );
		this.suica.renderer.render( scene, this.stereo.cameraR );
		this.suica.renderer.setScissorTest( false );

	}; // StereoEffect.render


	dispose()
	{		
	}; // StereoEffect.dispose
	
} // class StereoEffect


