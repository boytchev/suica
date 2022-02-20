//
// Suica 2.0 VR, anaglyph and atereo
//
// Brutally based on Three.js' VRButton, AnaglyphEffect.js and StereoEffect.js
//
// VRMode( suica )
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



class AnaglyphEffect
{

	constructor( suica, distance )
	{
		this.suica = suica;
		
		this.suica.camera.focus = distance;
		
		this.colorMatrixLeft = new THREE.Matrix3().fromArray( [
			//red in    green in    blue in
			1,0,0,	// red out
			0,0,0, 	// green out
			0,0,0,	// blue out
		] );

		this.colorMatrixRight = new THREE.Matrix3().fromArray( [
			//red in    green in    blue in
			0,0,0,	// red out
			0,1,0,	// green out
			0,0,1,	// blue out
		] );

		this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
		this.scene = new THREE.Scene();
		this.stereo = new THREE.StereoCamera();

		var params = {
			minFilter: THREE.LinearFilter,
			magFilter: THREE.NearestFilter,
			format: THREE.RGBAFormat
		};

		this.renderTargetL = new THREE.WebGLRenderTarget( this.suica.canvas.width, this.suica.canvas.height, params );
		this.renderTargetR = new THREE.WebGLRenderTarget( this.suica.canvas.width, this.suica.canvas.height, params );

		this.material = new THREE.ShaderMaterial( {
			uniforms: {
				'mapLeft': {value: this.renderTargetL.texture},
				'mapRight': {value: this.renderTargetR.texture},
				'colorMatrixLeft': {value: this.colorMatrixLeft},
				'colorMatrixRight': {value: this.colorMatrixRight}
			},
			vertexShader: `
				varying vec2 vUv;
				void main()
				{
					vUv = vec2( uv.x, uv.y );
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,
			fragmentShader: `
				uniform sampler2D mapLeft;
				uniform sampler2D mapRight;
				varying vec2 vUv;
				uniform mat3 colorMatrixLeft;
				uniform mat3 colorMatrixRight;
				
				// These functions implement sRGB linearization and gamma correction
				float lin( float c )
				{
					return c<=0.04045 ? c*0.0773993808 : pow( c*0.9478672986+0.0521327014, 2.4 );
				}
				vec4 lin( vec4 c )
				{
					return vec4( lin( c.r ), lin( c.g ), lin( c.b ), c.a );
				}
				float dev( float c )
				{
					return c<=0.0031308 ? c*12.92 : pow( c, 0.41666 ) * 1.055 - 0.055;
				}
				
				void main()
				{
					vec2 uv = vUv;
					vec4 colorL = lin( texture2D( mapLeft, uv ) );
					vec4 colorR = lin( texture2D( mapRight, uv ) );
					vec3 color = clamp( colorMatrixLeft * colorL.rgb + colorMatrixRight * colorR.rgb, 0., 1. );
					gl_FragColor = vec4( dev( color.r ), dev( color.g ), dev( color.b ), max( colorL.a, colorR.a ) );
				}`
		} );

		this.mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), this.material );

		this.scene.add( this.mesh );

	} // AnaglyphEffect.constructor


	setSize( width, height )
	{
		this.suica.renderer.setSize( width, height );
		
		var pixelRatio = this.suica.renderer.getPixelRatio();

		this.renderTargetL.setSize( width * pixelRatio, height * pixelRatio );
		this.renderTargetR.setSize( width * pixelRatio, height * pixelRatio );

	}; // AnaglyphEffect.setSize


	render( scene, camera )
	{

		var currentRenderTarget = this.suica.renderer.getRenderTarget();
		
		scene.updateMatrixWorld();
	
		if ( camera.parent === null ) camera.updateMatrixWorld();

		this.stereo.update( camera );

		this.suica.renderer.setRenderTarget( this.renderTargetL );
		this.suica.renderer.clear();
		this.suica.renderer.render( scene, this.stereo.cameraL );
		this.suica.renderer.setRenderTarget( this.renderTargetR );
		this.suica.renderer.clear();
		this.suica.renderer.render( scene, this.stereo.cameraR );
		this.suica.renderer.setRenderTarget( null );
		this.suica.renderer.render( this.scene, this.camera );
		this.suica.renderer.setRenderTarget( currentRenderTarget );

	}; // AnaglyphEffect.render


	dispose()
	{
		this.renderTargetL.dispose();
		this.renderTargetR.dispose();
		this.mesh.geometry.dispose();
		this.material.dispose();

	}; // AnaglyphEffect.dispose
	
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


