//
// Suica 2.0 Tester
// CC-3.0-SA-NC
//
//===================================================

const CASES_DIR = 'cases/';
const IMAGES_DIR = 'snapshots/';
const TEST_TIMEOUT = 3000; // per test, in milliseconds
const FULL_SIZE = 400;
const TEST_SIZE = 100;
//const COLOR_DIFF = 0.1;
//const PIXELS_DIFF = 0.005 * TEST_SIZE * TEST_SIZE; // 0.5%

var cases = [
	'cube',
	'colors',
	'sphere',
];


var timeout = -1;

var resultReady, targetReady, canvas, testName;



// show string in the log window

var logEntry;
function log( string )
{
	logEntry = document.createElement( 'div' );
	logEntry.innerHTML = string;
	
	document.getElementById( 'log' ).appendChild( logEntry );
}
function logAppend( string )
{
	logEntry.innerHTML += string;
}




// send message from test case to the main test program

function sendResult( string )
{
	window.parent?.postMessage( string, '*' );
}




// start all tests

function startTests()
{
console.log('::> starting all tests');


	// install listeners for messages from test cases and images load

	window.addEventListener( 'message', (event) =>
	{
		console.log('received message');
		document.getElementById( 'result-image' ).src = event.data;
	}, false);


	document.getElementById( 'result-image' ).addEventListener( 'load', (event) =>
	{
		// if the test image is loaded, do not compare images
		if( event.target.currentSrc.indexOf('/test/test.png')>0 )
			return;
		
		
		resultReady = true;
console.log('::> result is ready');
		if( targetReady ) compareImages();
	}, false);

	document.getElementById( 'target-image' ).addEventListener( 'load', (event) =>
	{
		targetReady = true;
console.log('::> target is ready');
		if( resultReady ) compareImages();
	}, false);

	canvas = document.createElement( 'canvas' );
	canvas.width = TEST_SIZE;
	canvas.height = TEST_SIZE;
	
	startNextTest();
}




// if there are more tests to do, do the first of them

function startNextTest( )
{
	clearTimeout( timeout );

	// more tests?
	if( cases.length )
	{
		testName = cases.shift();
		
		// set timeout timer; if there is result before the timeout, the the timer is cleared
		timeout = setTimeout( testTimeout, TEST_TIMEOUT );
	
		log( `testing <b>${testName.toUpperCase()}</b>` );
		console.log( `testing ${testName.toUpperCase()}` );
	
		resultReady = false;
		targetReady = false;

		document.getElementById( 'sandbox' ).src = 'about:blank';
		document.getElementById( 'sandbox' ).src = CASES_DIR + testName + '.html';
		document.getElementById( 'result-image' ).src = 'test.png';
		document.getElementById( 'target-image' ).src = IMAGES_DIR + testName + '.png';
		console.log( `iFrame = ${document.getElementById( 'sandbox' ).src}` );
	}
	else
	{
console.log('::> no more tests');
		// no more tests
		document.getElementById( 'sandbox' ).src = 'about:blank';
		document.getElementById( 'sandbox' ).style.display = 'none';
		document.getElementById( 'result-image' ).style.display = 'none';
		document.getElementById( 'target-image' ).style.display = 'none';
		log( `end` );
	}
}



function testTimeout( )
{
	log('it is this:<span style="width:350px; display:inline-block;"></span>should be this:');
	var a = document.getElementById('result-image').cloneNode();
	a.setAttribute('id','');
	document.getElementById( 'log' ).appendChild( a );

	a = document.getElementById('target-image').cloneNode();
	a.setAttribute('id','');
	document.getElementById( 'log' ).appendChild( a );
	
	log('<br>');

	startNextTest();
}




// compare both images

function compareImages( )
{
console.log('::> comparing');
	var context = canvas.getContext( '2d' );
	
	context.drawImage( document.getElementById('result-image'), 0, 0, FULL_SIZE, FULL_SIZE, 0, 0, TEST_SIZE, TEST_SIZE );
	var resultPixels = context.getImageData( 0, 0, TEST_SIZE, TEST_SIZE ).data;
	
	context.drawImage( document.getElementById('target-image'), 0, 0, FULL_SIZE, FULL_SIZE, 0, 0, TEST_SIZE, TEST_SIZE );
	var targetPixels = context.getImageData( 0, 0, TEST_SIZE, TEST_SIZE ).data;

//	var pnts = 0;
//	var totals = 0;
	var totalDiff = 0;
	for( var i=0; i<resultPixels.length; i+=4 )
	{
		// if( 
			// resultPixels[i+0]==245 &&
			// resultPixels[i+1]==245 &&
			// resultPixels[i+2]==245 &&
			// targetPixels[i+0]==245 &&
			// targetPixels[i+1]==245 &&
			// targetPixels[i+2]==245
		// ) continue;

//		totals++;
		
		var sumR = resultPixels[i+0]+resultPixels[i+1]+resultPixels[i+2]+1;
		var sumT = targetPixels[i+0]+targetPixels[i+1]+targetPixels[i+2]+1;
		
		var diff = Math.max(
					Math.abs( resultPixels[i+0]/sumR-targetPixels[i+0]/sumT ),
					Math.abs( resultPixels[i+1]/sumR-targetPixels[i+1]/sumT ),
					Math.abs( resultPixels[i+2]/sumR-targetPixels[i+2]/sumT )
				);
		totalDiff += diff*diff;
		
/*
		var diff = Math.max(
					Math.abs( resultPixels[i+0]-targetPixels[i+0] ),
					Math.abs( resultPixels[i+1]-targetPixels[i+1] ),
					Math.abs( resultPixels[i+2]-targetPixels[i+2] )
				);
*/		
//		if( diff>COLOR_DIFF ) pnts++;
		
	}
	
	//var match = Math.round(100-100*pnts/totals);
	//var match = (100-100*pnts/totals).toFixed(2);
	//log( `match ${match}%; difference in ${pnts} pixels (of ${totals}) totDiff=${totalDiff}` );
	var match = Math.max( 100-100*totalDiff, 0 );
	logAppend( ` &ndash; match ${match.toFixed(2)}%;` );
	
	//if( match<90 || pnts>PIXELS_DIFF )
	if( match<90 )
	{
		log('it is this:<span style="width:350px; display:inline-block;"></span>should be this:');
		var a = document.getElementById('result-image').cloneNode();
		a.setAttribute('id','');
		a.setAttribute('width','402');
		a.setAttribute('height','402');
		document.getElementById( 'log' ).appendChild( a );

		a = document.getElementById('target-image').cloneNode();
		a.setAttribute('id','');
		a.setAttribute('width','402');
		a.setAttribute('height','402');
		document.getElementById( 'log' ).appendChild( a );
	
		// log('<br>');
		// var resultCanvas = document.createElement( 'canvas' );
		// resultCanvas.width = TEST_SIZE;
		// resultCanvas.height = TEST_SIZE;
		// var resultContext = resultCanvas.getContext( '2d' );
		// resultContext.drawImage( document.getElementById('result-image'), 0, 0, FULL_SIZE, FULL_SIZE, 0, 0, TEST_SIZE, TEST_SIZE );
		// document.getElementById( 'log' ).appendChild( resultCanvas );

		// resultCanvas = document.createElement( 'canvas' );
		// resultCanvas.width = TEST_SIZE;
		// resultCanvas.height = TEST_SIZE;
		// var resultContext = resultCanvas.getContext( '2d' );
		// resultContext.drawImage( document.getElementById('target-image'), 0, 0, FULL_SIZE, FULL_SIZE, 0, 0, TEST_SIZE, TEST_SIZE );
		// document.getElementById( 'log' ).appendChild( resultCanvas );
	}
	
	log('<br>');

	setTimeout( startNextTest, 1000 );
}
