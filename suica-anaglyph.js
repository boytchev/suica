//
// Suica 2.0 Anaglyph and Stereo Effect
//
// Massively based on Three.js' AnaglyphEffect.js and StereoEffect.js
//
// AnaglyphEffect (suica, distance );
//		setSize( width, height )
//		dispose( );
//
// StereoEffect (suica, distance );
//		setSize( width, height )
//		dispose( );
//
//===================================================


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
