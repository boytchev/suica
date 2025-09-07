//
// Suica 3.0 VR, anaglyph and stereo
//
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


import { AnaglyphEffect as THREEAnaglyphEffect } from 'three/addons/effects/AnaglyphEffect.js';
import { StereoEffect as THREEStereoEffect } from 'three/addons/effects/StereoEffect.js';


function createFSButton( suica ) {

	var button = document.createElement( 'button' );

	button.id = 'suica-fullscreen-button';

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

	button.onpointerenter = function ( ) {

		button.style.opacity = '1.0';

	};

	button.onpointerleave = function ( ) {

		button.style.opacity = '0.5';

	};

	if ( requestFullscreen ) {

		button.onclick = function ( ) {

			requestFullscreen.call( suica.suicaTag );

		};

	}

	suica.suicaTag.onfullscreenchange = function ( ) {

		button.style.display = document.fullscreenElement ? 'none' : '';

		suica.resizeCanvas();

	};

	window.addEventListener( 'resize', function () {

		suica.resizeCanvas();

	} );

	return button;

} // createFSButton


class AnaglyphEffect extends THREEAnaglyphEffect {

	constructor( suica, distance ) {

		super( suica.renderer, suica.canvas.width, suica.canvas.height );

		this.suica = suica;
		this.suica.camera.focus = distance;

	} // AnaglyphEffect.constructor

} // class AnaglyphEffect


class StereoEffect extends THREEStereoEffect {

	constructor( suica, distance ) {

		super( suica.renderer, suica.canvas.width, suica.canvas.height );

		this.suica = suica;

		this.setEyeSeparation( distance );

	} // StereoEffect.constructor

} // class StereoEffect


export { createFSButton, StereoEffect, AnaglyphEffect };
