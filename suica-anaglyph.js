//
// Suica 2.0 Anaglyph Effect
//
// Massively based on Three.js' AnaglyphEffect.js
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

		var _camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 ),
			_scene = new THREE.Scene(),
			_stereo = new THREE.StereoCamera();

		var _params = {
			minFilter: THREE.LinearFilter,
			magFilter: THREE.NearestFilter,
			format: THREE.RGBAFormat
		};

		var _renderTargetL = new THREE.WebGLRenderTarget( this.suica.canvas.width, this.suica.canvas.height, _params ),
			_renderTargetR = new THREE.WebGLRenderTarget( this.suica.canvas.width, this.suica.canvas.height, _params );

		var _material = new THREE.ShaderMaterial( {
			uniforms: {
				'mapLeft': {value: _renderTargetL.texture},
				'mapRight': {value: _renderTargetR.texture},
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

		var _mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), _material );

		_scene.add( _mesh );

		this.setSize = function ( width, height ) {

			this.suica.renderer.setSize( width, height );
			const pixelRatio = this.suica.renderer.getPixelRatio();

			_renderTargetL.setSize( width * pixelRatio, height * pixelRatio );

			_renderTargetR.setSize( width * pixelRatio, height * pixelRatio );

		};

		this.render = function ( scene, camera ) {

			const currentRenderTarget = this.suica.renderer.getRenderTarget();
			scene.updateMatrixWorld();
			if ( camera.parent === null ) camera.updateMatrixWorld();

			_stereo.update( camera );

			this.suica.renderer.setRenderTarget( _renderTargetL );
			this.suica.renderer.clear();
			this.suica.renderer.render( scene, _stereo.cameraL );
			this.suica.renderer.setRenderTarget( _renderTargetR );
			this.suica.renderer.clear();
			this.suica.renderer.render( scene, _stereo.cameraR );
			this.suica.renderer.setRenderTarget( null );
			this.suica.renderer.render( _scene, _camera );
			this.suica.renderer.setRenderTarget( currentRenderTarget );

		};

		this.dispose = function () {

			_renderTargetL.dispose();
			_renderTargetR.dispose();
			_mesh.geometry.dispose();
			_material.dispose();

		};

	} // AnaglyphEffect.constructor

} // class AnaglyphEffect