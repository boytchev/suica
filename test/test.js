//
// Suica 2.0 Tester
// CC-3.0-SA-NC
//
//===================================================


var SUICA_TEST_MODE = 1;

document.write('<script src="../../dist/suica.min.js"></script> ');


const CASES_DIR = 'cases/';
const IMAGES_DIR = 'snapshots/';
const TEST_TIMEOUT = 3000; // per test, in milliseconds
const FULL_SIZE = 400;
const TEST_SIZE = 400;
const COLOR_DIFF = 0.01;

const TRESHOLT_PERCENTAGE = 99;

//const PIXELS_DIFF = 0.005 * TEST_SIZE * TEST_SIZE; // 0.5%

var timeout = -1;
var startTime = Date.now();

var sumMatch = 0;

var resultReady, targetReady, canvas, testName;


var hmCanvas = document.createElement( 'canvas' );
	hmCanvas.width = TEST_SIZE;
	hmCanvas.height = TEST_SIZE;
var heatMap = hmCanvas.getContext( '2d', { willReadFrequently: true } );

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

	if( window.location.search )
	{
		var filterNames = window.location.search;
	
		if( filterNames.substring(0,3)=='?S&' ) filterNames = filterNames.substring(3);
		if( filterNames=='?S' ) filterNames = filterNames.substring(2);
		if( filterNames.substring(0,1)=='?' ) filterNames = filterNames.substring(1);
		cases = cases.filter( (name)=>name.indexOf(filterNames)>=0 );
	}

	
	document.getElementById( 'progress' ).max = cases.length;

	// install listeners for messages from test cases and images load

	window.addEventListener( 'message', (event) =>
	{
		//console.log('received message',event);
		if( typeof event.data == 'string' )
		{
			document.getElementById( 'result-image' ).src = event.data;
		}
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

	var oldTestNo = document.getElementById( 'progress' ).value;
	
	document.getElementById( 'progress' ).value++;
	
	var elapsedTime = (Date.now()-startTime)/1000,
		testNo = document.getElementById( 'progress' ).value,
		testAll = document.getElementById( 'progress' ).max,
		remainingTime =  elapsedTime/testNo*(testAll-testNo),
		min = Math.floor(remainingTime/60),
		sec = Math.round(remainingTime-60*min);
	
	var currentReport;
	
	if( oldTestNo == testAll )
	{
		// end of tests
		currentReport = `Tested ${testAll} &ndash; ${(sumMatch/testAll).toFixed(1)}%`;
	}
	else
	{
		// going on tests
		currentReport = `Testing ${testNo}/${testAll} (${min}:${sec<10?'0'+sec:sec})`;
		if( oldTestNo > 0 )
			currentReport += ` &ndash; ${(sumMatch/oldTestNo).toFixed(1)}%`;
	}
	document.getElementById( 'timer' ).innerHTML = currentReport;

	// more tests?
	if( cases.length )
	{
		testName = cases.shift();
		
		// set timeout timer; if there is result before the timeout, the the timer is cleared
		timeout = setTimeout( testTimeout, TEST_TIMEOUT );
	
		log( `<b>${testName}</b>` );
		
		
		console.groupEnd( );
		console.group( `${testName.toUpperCase()}` );
	
		resultReady = false;
		targetReady = false;

		document.getElementById( 'sandbox' ).src = 'about:blank';
		document.getElementById( 'sandbox' ).src = CASES_DIR + testName + '.html';
		document.getElementById( 'result-image' ).src = 'test.png';
		document.getElementById( 'target-image' ).src = IMAGES_DIR + testName + '.png';
		//console.log( `iFrame = ${document.getElementById( 'sandbox' ).src}` );
	}
	else
	{
		console.groupEnd( );
		console.log('::> no more tests');
		// no more tests
		//document.getElementById( 'sandbox' ).src = 'about:blank';
		document.getElementById( 'sandbox' ).style.display = 'none';
		document.getElementById( 'result-image' ).style.display = 'none';
		document.getElementById( 'target-image' ).style.display = 'none';
		//document.getElementById( 'timer' ).style.display = 'none';
		document.getElementById( 'progress' ).style.display = 'none';
		log( `end` );
	}
}


var ids = 0;

function testTimeout( )
{
	log('it is this:<span style="width:165px; display:inline-block;"></span>should be this:<span style="width:125px; display:inline-block;"></span>difference:');

	var a = document.getElementById('result-image').cloneNode();
	a.style.margin = "0 1em 0 0";
	a.style.padding = "0";
	a.style.width = "200px";
	a.style.height = "200px";
	a.setAttribute('id','');
	document.getElementById( 'log' ).appendChild( a );

	a = document.getElementById('target-image').cloneNode();
	a.style.margin = "0";
	a.style.padding = "0";
	a.style.width = "200px";
	a.style.height = "200px";
	a.setAttribute('id','');
	document.getElementById( 'log' ).appendChild( a );
	
	a = document.getElementById('target-image').cloneNode();
	a.setAttribute('id','');
	a.style.margin = "0 0 0 1em";
	a.style.padding = "0";
	a.style.width = "200px";
	a.style.height = "200px";
	a.setAttribute('id','');
	document.getElementById( 'log' ).appendChild( a );

	log('<br>');

	startNextTest();
}




// compare both images

function compareImages( )
{
	console.log('::> comparing');
	var context = canvas.getContext( '2d', { willReadFrequently: true } );
	
	context.drawImage( document.getElementById('result-image'), 0, 0, FULL_SIZE, FULL_SIZE, 0, 0, TEST_SIZE, TEST_SIZE );
	var resultPixels = context.getImageData( 0, 0, TEST_SIZE, TEST_SIZE ).data;
	
	context.drawImage( document.getElementById('target-image'), 0, 0, FULL_SIZE, FULL_SIZE, 0, 0, TEST_SIZE, TEST_SIZE );
	var targetPixels = context.getImageData( 0, 0, TEST_SIZE, TEST_SIZE ).data;

	heatMap.fillStyle = 'green';
	heatMap.fillRect( 0, 0, TEST_SIZE, TEST_SIZE );	
	var heatmapImage = heatMap.getImageData( 0, 0, TEST_SIZE, TEST_SIZE );
	var heatmapPixels = heatmapImage.data;
	var pnts = 0;
	var totals = 0;
//	var totalDiff = 0;
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

		totals++;
		
		// var sumR = resultPixels[i+0]+resultPixels[i+1]+resultPixels[i+2]+1;
		// var sumT = targetPixels[i+0]+targetPixels[i+1]+targetPixels[i+2]+1;
		
		// var diff = Math.max(
					// Math.abs( resultPixels[i+0]/sumR-targetPixels[i+0]/sumT ),
					// Math.abs( resultPixels[i+1]/sumR-targetPixels[i+1]/sumT ),
					// Math.abs( resultPixels[i+2]/sumR-targetPixels[i+2]/sumT )
				// );
		// totalDiff += diff*diff;
		

		var diff = Math.abs( resultPixels[i+0]-targetPixels[i+0] )+
					Math.abs( resultPixels[i+1]-targetPixels[i+1] )+
					Math.abs( resultPixels[i+2]-targetPixels[i+2] );
		
		if( diff/3/255>COLOR_DIFF ) pnts++;
		
		var grayscale = (resultPixels[i+0]+resultPixels[i+1]+resultPixels[i+2])/3;
			grayscale = (4*255+1*grayscale)/5;
			
		//var crimson = [220, 20, 60];
		var k = 5*(diff/3/255 - COLOR_DIFF);
		if( k<0 ) k=0;
		if( k>1 ) k=1;
		k=k*k;
		
		heatmapPixels[i+0] = Math.round(grayscale*(1-k)+k*220);
		heatmapPixels[i+1] = Math.round(grayscale*(1-k)+k*20);
		heatmapPixels[i+2] = Math.round(grayscale*(1-k)+k*60);
		
	}

	heatMap.putImageData( heatmapImage, 0, 0 );
	
	//console.log(`::> total diff ${totalDiff}` );
	
	//var match = Math.round(100-100*pnts/totals);
	var match = Math.round( 100 - 100*pnts/totals );
	
	sumMatch += 100 - 100*pnts/totals;
	
	//	log( `match ${match}%;` );
	console.log( `::> match ${match}%;` );
	//log( `match ${match}%; difference in ${pnts} pixels` );
	//var match = Math.max( 100-100*totalDiff, 0 );
	logAppend( ` &ndash; match ${match}%` );
	
	if( match<100 )
	{
		logAppend( ` [<a target="_blank" href="test.html?S&${testName}">retest</a> |` );
		logAppend( ` <a target="_blank" href="cases/${testName}.html">rerun</a>]` );
	}
	
	//if( match<90 || pnts>PIXELS_DIFF )
	if( match<TRESHOLT_PERCENTAGE || window.location.search.indexOf('?S')==0 )
	{
		log('it is this:<span style="width:165px; display:inline-block;"></span>should be this:<span style="width:125px; display:inline-block;"></span>difference:');
		var a = document.getElementById('result-image').cloneNode();
		a.setAttribute('id','');
		a.style.margin = "0 1em 0 0";
		a.style.padding = "0";
		a.style.width = "200px";
		a.style.height = "200px";
		a.setAttribute('id','');
		document.getElementById( 'log' ).appendChild( a );

		a = document.getElementById('target-image').cloneNode();
		a.setAttribute('id','');
		a.style.margin = "0";
		a.style.padding = "0";
		a.style.width = "200px";
		a.style.height = "200px";
		a.setAttribute('id','');
		document.getElementById( 'log' ).appendChild( a );
	
		a = document.createElement( 'canvas' );
		a.width = 200;
		a.height = 200;
		a.setAttribute('id','');
		a.style.margin = "0 0 0 1em";
		a.style.padding = "0";
		a.style.width = "200px";
		a.style.border = "solid 1px green";
		a.style.height = "200px";
		a.setAttribute('id','');
		document.getElementById( 'log' ).appendChild( a );
		a.getContext( '2d', { willReadFrequently: true } ).drawImage( hmCanvas, 0, 0, TEST_SIZE, TEST_SIZE, 0, 0, 200, 200 );

	
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

		log('<br>');
	}
	

	setTimeout( startNextTest, 100 );
}



function sendSnapshot( )
{
	if( !suica ) return;
	
	const DELAY = 0.9;

	var _onTime = suica.ontime;

	suica.ontime = (t, dT)=>{

		// call the original onTime (if any)
		if( _onTime )
		{
			if( typeof _onTime === 'string' )
				_onTime = window[_onTime];
			
			_onTime( t, dT );
		}
		
		// send result when time elapses
		
		if( t>=DELAY )
		{
			console.log( '::> capture delay',(t-DELAY).toFixed(3),'seconds' );
			sendResult( suica.canvas.toDataURL() );
			suica.ontime = _onTime;
		}
	};
}



	function simulatePointerEvent( eventName, x, y, button=0 )
	{
		// x,y -- mouse coordinates relative to the Suica canvas element
		
		var rect = suica.canvas.getBoundingClientRect();

		var oEvent = new PointerEvent( eventName,
			{
				screenX: window.screenX + rect.x + x,
				screenY: window.screenY + rect.y + y,
				clientX: rect.x + x,
				clientY: rect.y + y,
				button: button
			} );
		
		suica.canvas.dispatchEvent( oEvent );
	}
		
		
window.addEventListener( 'load', sendSnapshot );