//
// Suica 3.0 Capture
//
//===================================================


import * as THREE from 'three';
import { parseNumber } from './suica-globals.js';


class Capture {

	static TIME = 10;
	static SKIPTIME = 1;
	static FORMAT = 'video/webm; codecs=vp8';

	/* other formats
video/webm; codecs=vp8 (WebM with VP8 video codec, widely supported)
video/webm; codecs=vp9 (WebM with VP9, more efficient but less universal)
video/webm; codecs=h264 (WebM with H.264, less common)
video/mp4; codecs=h264 (MP4 with H.264, supported in some browsers like Safari)
video/mp4; codecs=av1 (MP4 with AV1, emerging support in newer browsers)
video/x-matroska; codecs=avc1 (Matroska container with H.264, rare)
*/

	constructor( suica, name, time, fps, format, skipTime ) {

		time = parseNumber( time, Capture.TIME );
		fps = parseNumber( fps, Capture.FPS );
		skipTime = parseNumber( skipTime, Capture.SKIPTIME );
		format = format || Capture.FORMAT;
		name = name || ( window.location.pathname.split( '/' ).pop().split( '#' ).shift().split( '.html' ).shift() + '.'+format.split( ';' )[ 0 ].split( '/' ).pop() );

		time = Math.round( time * 1000 );
		skipTime = THREE.MathUtils.clamp( skipTime*1000, 1, 10000 );

		var stream = suica.renderer.domElement.captureStream( fps );
		var recorder = new MediaRecorder( stream, { mimeType: format } );
		var chunks = [];

		recorder.ondataavailable = ( event ) => {

			chunks.push( event.data );

		};

		recorder.onstop = () => {

			var blob = new Blob( chunks, { type: format.split( ';' )[ 0 ] } );
			var url = URL.createObjectURL( blob );
			var a = document.createElement( 'a' );
			a.href = url;
			a.download = name;
			a.click();

		};

		setTimeout( ()=>{

			setTimeout( ()=>{

				console.log( 'Stop recording' );
				recorder.stop();

			}, time );

			console.log( 'Start recording' );
			recorder.start();

		}, skipTime );

	} // Capture.constructor


} // class Capture



export { Capture };
