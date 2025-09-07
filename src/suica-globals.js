//
// Suica 3.0 Globals
//
//===================================================


import * as THREE from 'three';



window.suica = null;	// last (current) Suica instance


var CIRCLECOUNT = 50; // also cone and cylinder

var DEBUG_EVENTS = false;

var ANAGLYPH = { DISTANCE: 5 };
var STEREO = { DISTANCE: 1 };
var PERSPECTIVE = { NEAR: 1, FAR: 1000, FOV: 40 };
var ORTHOGRAPHIC = { NEAR: 0, FAR: 1000 };

var SPLINE = { POINTS: [[ 0, 0, 0 ], [ 0, 1, 0 ]], CLOSED: false, INTERPOLANT: true };
var SPLANE = { POINTS: [
	[[ -3, 0, -3 ], [ -1, 0, -3 ], [ +1, 0, -3 ], [ +3, 0, -3 ]],
	[[ -3, 0, -1 ], [ -1, 3, -1 ], [ +1, 3, -1 ], [ +3, 0, -1 ]],
	[[ -3, 0, +1 ], [ -1, 3, +1 ], [ +1, 3, +1 ], [ +3, 0, +1 ]],
	[[ -3, 0, +3 ], [ -1, 0, +3 ], [ +1, 0, +3 ], [ +3, 0, +3 ]]
], CLOSED: [ false, false ], INTERPOLANT: [ true, true ] };


var OX = new THREE.Vector3( 1, 0, 0 );
var OY = new THREE.Vector3( 0, 1, 0 );
var OZ = new THREE.Vector3( 0, 0, 1 );



var ORIENTATIONS = {
	YXZ: {	SCALE: new THREE.Vector3( 1, -1, 1 ),
		LOOKAT: { FROM: [ 0, 0, 100 ], TO: [ 0, 0, 0 ], UP: [ 1, 0, 0 ] },
		RIGHT: OY,
		UP: OX,
		FORWARD: OZ,
		NAME: 'YXZ',
	},
	ZYX: {	SCALE: new THREE.Vector3( 1, 1, -1 ),
		LOOKAT: { FROM: [ 100, 0, 0 ], TO: [ 0, 0, 0 ], UP: [ 0, 1, 0 ] },
		RIGHT: OZ,
		UP: OY,
		FORWARD: OX,
		NAME: 'ZYX',
	},
	XZY: {	SCALE: new THREE.Vector3( -1, 1, 1 ),
		LOOKAT: { FROM: [ 0, 100, 0 ], TO: [ 0, 0, 0 ], UP: [ 0, 0, 1 ] },
		RIGHT: OX,
		UP: OZ,
		FORWARD: OY,
		NAME: 'XZY',
	},


	ZXY: {	SCALE: new THREE.Vector3( 1, 1, 1 ),
		LOOKAT: { FROM: [ 0, 100, 0 ], TO: [ 0, 0, 0 ], UP: [ 1, 0, 0 ] },
		RIGHT: OZ,
		UP: OX,
		FORWARD: OY,
		NAME: 'ZXY',
	},
	XYZ: {	SCALE: new THREE.Vector3( 1, 1, 1 ),
		LOOKAT: { FROM: [ 0, 0, 100 ], TO: [ 0, 0, 0 ], UP: [ 0, 1, 0 ] },
		RIGHT: OX,
		UP: OY,
		FORWARD: OZ,
		NAME: 'XYZ',
	},
	YZX: {	SCALE: new THREE.Vector3( 1, 1, 1 ),
		LOOKAT: { FROM: [ 100, 0, 0 ], TO: [ 0, 0, 0 ], UP: [ 0, 0, 1 ] },
		RIGHT: OY,
		UP: OZ,
		FORWARD: OX,
		NAME: 'YZX',
	},
}; // ORIENTATIONS



function radians( degrees ) {

	return degrees * Math.PI/180;

}



function degrees( radians ) {

	return radians * 180/Math.PI;

}



function parseSize( data, defaultValue ) {

	// empty
	if ( data===null || data==='' || data===undefined )
		return defaultValue;

	// string 'x,y,z'
	if ( typeof data === 'string' || data instanceof String ) {

		// 'x,y,z'
		var size = evaluate( '['+data+']' );
		if ( size.length == 1 )
			return size[ 0 ];
		else
			return size;

	}

	return data;

} // parseSize



function parseColor( data, defaultValue ) {

	// empty
	if ( data===null || data==='' || data===undefined )
		return defaultValue;

	// Three.js color
	if ( data instanceof THREE.Color )
		return data;

	// [r,g,b]
	if ( Array.isArray( data ) )
		return new THREE.Color( data[ 0 ], data[ 1 ]||0, data[ 2 ]||0 );

	// string
	if ( typeof data === 'string' || data instanceof String ) {

		// try constant or function
		// 0xFFFFFF, rgb(...), hsl(...)
		// note: '%' is removed, '%' is often used in hsl()
		if ( data.indexOf( '0x' )>=0 || data.indexOf( '0X' )>=0 || data.indexOf( '(' )>=0 )
			return parseColor( evaluate( data.toLowerCase().replaceAll( '%', '' ) ) );

		// r,g,b
		if ( data.indexOf( ',' ) > 0 )
			return new THREE.Color( ...evaluate( '['+data+']' ) );

	}

	//	var color = new THREE.Color( data || 'white' );
	//	color.setRGB( color.r**(2.2**2), color.g**(2.2**2), color.b**(2.2**2));
	//	return color;
	return new THREE.Color( data || 'white' );

} // parseColor


function parseCenter( data, defaultValue = [ 0, 0, 0 ]) {

	// empty
	if ( data===null || data==='' || data===undefined )
		return defaultValue;

	// object with center
	if ( data.center )
		return data.center;

	// array
	if ( data instanceof Array )
		return data;

	// Three.js vector
	if ( data instanceof THREE.Vector3 )
		return [ data.x, data.y, data.z ];

	// string 'x,y,z' or global object name
	if ( typeof data === 'string' || data instanceof String ) {

		// global object name
		var global = window[ data ];
		if ( global && global.center )
			return global.center;

		// 'x,y,z'
		var center = evaluate( '['+data+']' );
		if ( center.length<3 ) center.push( 0, 0, 0 );
		return center;

	}

	return data;

} // parseCenter


function parseNumber( data, defaultValue ) {

	// empty
	if ( data===null || data==='' || data===undefined )
		return defaultValue;

	return evaluate( data );

} // Suica.parseNumber



function evaluate( string ) {

	return Function( '"use strict";return (' + string + ')' )();

}


function random( a=0, b=1 ) {

	if ( Array.isArray( a ) ) {

		var index = Math.floor( a.length*THREE.MathUtils.seededRandom() );
		return a[ index ];

	}

	return a+( b-a )*THREE.MathUtils.seededRandom();

}


function checkSuicaExists() {

	if ( !( window.suica?.isSuica ) )
		throw 'error: suica is not activated';

} // checkSuicaExists




function cloneEvents( target, source ) {

	target.onpointerenter = source.onpointerenter;
	target.onpointermove = source.onpointermove;
	target.onpointerleave = source.onpointerleave;
	target.onpointerdown = source.onpointerdown;
	target.onclick = source.onclick;
	target.onpointerup = source.onpointerup;
	target.onload = source.onload;

}



function spline( points=SPLINE.POINTS, closed, interpolant ) {

	if ( points instanceof Function ) {

		return function ( t ) {

			return points( t, closed, interpolant );

		};

	}

	// if points is a string - array of points "x,y,z;x,y,z;..."
	if ( typeof points === 'string' ) {

		if ( points.indexOf( ',' ) >= 0 )
			points = evaluate( '[['+points.replaceAll( ';', '],[' )+']]' );
		else
			return function ( t ) {

				return window[ points ]( t, closed, interpolant );

			};

	}

	if ( typeof closed === 'undefined' )
		closed = SPLINE.CLOSED;

	if ( typeof interpolant === 'undefined' )
		interpolant = SPLINE.INTERPOLANT;

	if ( !points.length ) points = SPLINE.POINTS;

	return function ( t ) {

		// set t in [0,1]
		if ( t<0 || t>1 ) {

			t = ( ( t%1 )+1 )%1;

		}

		var p = ( points.length-( closed?0:1 ) ) * t;
		var intPoint = Math.floor( p ),
			t = p - intPoint,
			t2 = t*t,
			t3 = t2*t;

		var p0, p1, p2, p3;

		if ( closed ) {

			p0 = points[ ( intPoint+points.length-1 )%points.length ];
			p1 = points[ ( intPoint+points.length )%points.length ];
			p2 = points[ ( intPoint+points.length+1 )%points.length ];
			p3 = points[ ( intPoint+points.length+2 )%points.length ];

		} else {

			p0 = points[ intPoint === 0 ? intPoint : intPoint-1 ];
			p1 = points[ intPoint ];
			p2 = points[ intPoint > points.length-2 ? points.length-1 : intPoint+1 ];
			p3 = points[ intPoint > points.length-3 ? points.length-1 : intPoint+2 ];

		}

		function catmullRom( p0, p1, p2, p3 ) {

			// var v0 = (p2-p0) * 0.5,
			//     v1 = (p3-p1) * 0.5;
			// return (2*p1-2*p2+v0+v1)*t3 + (-3*p1+3*p2-2*v0-v1)*t2 + v0*t + p1;
			var B0 = ( -t3+2*t2-t )/2,
				B1 = ( 3*t3-5*t2+2 )/2,
				B2 = ( -3*t3+4*t2+t )/2,
				B3 = ( t3-t2 )/2;

			return p0*B0 + p1*B1 + p2*B2 + p3*B3;

		}

		function bSpline( p0, p1, p2, p3 ) {

			var B0 = ( 1-3*t+3*t2-t3 )/6,
				B1 = ( 4-6*t2+3*t3 )/6,
				B2 = ( 1+3*t+3*t2-3*t3 )/6,
				B3 = ( t3 )/6;

			return p0*B0 + p1*B1 + p2*B2 + p3*B3;

		}

		var splineFunction = interpolant ? catmullRom : bSpline;

		var point = [
			splineFunction( p0[ 0 ], p1[ 0 ], p2[ 0 ], p3[ 0 ]),
			splineFunction( p0[ 1 ], p1[ 1 ], p2[ 1 ], p3[ 1 ]),
			splineFunction( p0[ 2 ], p1[ 2 ], p2[ 2 ], p3[ 2 ])
		];

		if ( typeof p0[ 3 ] !== 'undefined' )
			point.push( splineFunction( p0[ 3 ], p1[ 3 ], p2[ 3 ], p3[ 3 ]) );

		return point;

	}; // spline.getPoint

} // spline




function splane( points=SPLANE.POINTS, closed, interpolant ) {

	if ( points==null ) points = SPLANE.POINTS;

	if ( points instanceof Function ) {

		return function ( u, v ) {

			return points( u, v, closed, interpolant );

		};

	}

	// if points is a string - matrix of points "x,y,z;..| x,y,z;..."
	if ( typeof points === 'string' ) {

		if ( points.indexOf( ',' ) >= 0 )
			points = evaluate( '[[['+points.replaceAll( ';', '],[' ).replaceAll( '|', ']],[[' )+']]]' );
		else {

			return function ( u, v ) {

				console.log( points );
				console.log( window[ points ]);
				return window[ points ]( u, v, closed, interpolant );

			};

		}

	}

	if ( typeof closed === 'undefined' )
		closed = SPLANE.CLOSED;
	else
		if ( !Array.isArray( closed ) )
			closed = [ closed, false ];

	var uClosed = !!closed[ 0 ], // closed in U direction
		vClosed = !!closed[ 1 ]; // closed in V direction

	if ( typeof interpolant === 'undefined' )
		interpolant = SPLANE.INTERPOLANT;
	else
		if ( !Array.isArray( interpolant ) )
			interpolant = [ interpolant, false ];

	var uInterpolant = !!interpolant[ 0 ], // interpolant in U direction
		vInterpolant = !!interpolant[ 1 ]; // interpolant in V direction

	if ( !points.length ) points = SPLANE.POINTS;

	const NU = points[ 0 ].length;
	const NV = points.length;

	return function ( u, v ) {

		var B = [
			t => ( 1-3*t+3*t*t-t*t*t )/6,
			t => ( 4-6*t*t+3*t*t*t )/6,
			t => ( 1+3*t+3*t*t-3*t*t*t )/6,
			t => ( t*t*t )/6,
		];

		if ( uClosed || uInterpolant )
			u = ( NU+1 )*u-2;	// a-la-bezier & closed
		else
			u = ( NU-3 )*u; // transitional

		if ( vClosed || vInterpolant )
			v = ( NV+1 )*v-2;	// a-la-bezier & closed
		else
			v = ( NV-3 )*v;		// transitional

		var uPoint = Math.floor( u ),
			vPoint = Math.floor( v );

		u = u-uPoint;
		v = v-vPoint;

		var point = [ 0, 0, 0 ];

		for ( var iv=0; iv<4; iv++ )
			for ( var iu=0; iu<4; iu++ ) {

				var uIdx, vIdx;

				if ( uClosed )
					uIdx = ( uPoint+iu+NU )%NU;
				else
					uIdx = THREE.MathUtils.clamp( uPoint+iu, 0, NU-1 );

				if ( vClosed )
					vIdx = ( vPoint+iv+NV )%NV;
				else
					vIdx = THREE.MathUtils.clamp( vPoint+iv, 0, NV-1 );

				var weight = B[ iu ]( u ) * B[ iv ]( v );

				point[ 0 ] += weight * points[ vIdx ][ uIdx ][ 0 ];
				point[ 1 ] += weight * points[ vIdx ][ uIdx ][ 1 ];
				point[ 2 ] += weight * points[ vIdx ][ uIdx ][ 2 ];

			}

		return point;

	}; // splane.getPoint

} // spline


function eventCall( object, eventName, eventParam ) {

	// no object
	if ( !object ) return;

	// no event listener
	if ( !object[ eventName ]) return;

	// if event listener is a string, it is the name of the listener
	if ( typeof object[ eventName ] === 'string' || object[ eventName ] instanceof String ) {

		object[ eventName ] = window[ object[ eventName ] ];

	}

	// call the listener
	object[ eventName ]( eventParam );

	if ( DEBUG_EVENTS ) console.log( object.id+' :: '+eventName );

}


function onLoad( object ) {

	eventCall( object, 'onload', object );

} // Suica.onLoad


var allObjects = window.suica?window.suica.allObjects:[];



export { ORIENTATIONS, OX, OY, OZ, CIRCLECOUNT, DEBUG_EVENTS, ANAGLYPH, STEREO, PERSPECTIVE, ORTHOGRAPHIC, SPLINE, SPLANE };

export { onLoad, spline, splane, checkSuicaExists, random, parseNumber, parseCenter, parseColor, evaluate, radians, degrees, parseSize, eventCall, cloneEvents, allObjects };
