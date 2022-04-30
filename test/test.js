//
// Suica 2.0 Tester
// CC-3.0-SA-NC
//
//===================================================

const CASES_DIR = 'cases/';
const IMAGES_DIR = 'snapshots/';
const TEST_TIMEOUT = 10000; // per test, in milliseconds


var cases = [
	'cube',
	'colors',
	'sphere',
];


var timeout = -1;

var resultReady, targetReady, canvas, testName;



// show string in the log window

function log( string )
{
	var logEntry = document.createElement( 'div' );
		logEntry.innerHTML = string;
	
	document.getElementById( 'log' ).appendChild( logEntry );
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
	canvas.width = 400;
	canvas.height = 400;
	
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

		document.getElementById( 'sandbox' ).src = CASES_DIR + testName + '.html';
		document.getElementById( 'result-image' ).src = '';
		document.getElementById( 'target-image' ).src = IMAGES_DIR + testName + '.png';
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
	
	context.drawImage( document.getElementById('result-image'), 0, 0, 400, 400, 0, 0, 400, 400 );
	var resultPixels = context.getImageData( 0, 0, 400, 400).data;
	
	context.drawImage( document.getElementById('target-image'), 0, 0, 400, 400, 0, 0, 400, 400 );
	var targetPixels = context.getImageData( 0, 0, 400, 400).data;

	var diff = 0;
	var pnts = 0;
	var totals = 0;
	for( var i=0; i<resultPixels.length; i+=4 )
	{
		if( 
			resultPixels[i+0]==245 &&
			resultPixels[i+1]==245 &&
			resultPixels[i+2]==245 &&
			targetPixels[i+0]==245 &&
			targetPixels[i+1]==245 &&
			targetPixels[i+2]==245
		) continue;

		totals++;
		var diff = Math.sqrt(
					Math.pow( resultPixels[i+0]-targetPixels[i+0], 2 ) +
					Math.pow( resultPixels[i+1]-targetPixels[i+1], 2 ) +
					Math.pow( resultPixels[i+2]-targetPixels[i+2], 2 )
				)/255;
		
		if( diff>0.001 ) pnts++;
	}
	
	//var match = Math.round(100-100*pnts/totals);
	var match = (100-100*pnts/totals).toFixed(2);
	log( `match ${match}%; difference in ${pnts} pixels` );
	
	if( match<90 || pnts>10 )
	{
		log('it is this:<span style="width:350px; display:inline-block;"></span>should be this:');
		var a = document.getElementById('result-image').cloneNode();
		a.setAttribute('id','');
		document.getElementById( 'log' ).appendChild( a );

		a = document.getElementById('target-image').cloneNode();
		a.setAttribute('id','');
		document.getElementById( 'log' ).appendChild( a );
	}
	
	log('<br>');

	startNextTest();
}
