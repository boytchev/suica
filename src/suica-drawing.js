//
// Suica 3.0 Drawing
//
// drawing( width, height, color )
// moveTo( x, y )
// lineTo( x, y )
// curveTo( mx, my, x, y )
// arc( x, y, r, from, to )
// fillText( x, y, text, color, font )
// stroke( color, width, closed )
// fill( color )
//
//===================================================


import * as THREE from 'three';
import { parseNumber, parseSize } from './suica-globals.js';



class Drawing {

	static SIZE = 32;
	static COLOR = null;
	static ARC_RADIUS = 10;
	static ARC_FROM = 0;
	static ARC_TO = 360;
	static ARC_CW = true;
	static FILL_COLOR = 'gray';
	static STROKE_COLOR = 'black';
	static STROKE_WIDTH = 1;
	static STROKE_CLOSED = false;
	static FONT = '20px Arial';

	// current active Drawing instance
	static current;


	constructor( width=Drawing.SIZE, height=width, color=Drawing.COLOR, newCanvas=true ) {

		// if width===null, then this is construction of a shape, not a drawing

		if ( width !== null && newCanvas ) {

			this.canvas = document.createElement( 'canvas' );
			this.canvas.width = width;
			this.canvas.height = height;
			this.texture = null;

			this.context = this.canvas.getContext( '2d' );
			this.context.clearRect( 0, 0, width, height );

			if ( color ) {

				this.context.fillStyle = color;
				this.context.fillRect( 0, 0, width, height );

			}

			this.needsNewPath = true;

			//document.body.appendChild( this.canvas );

		}

		// register some local methods as public global functions
		for ( var methodName of [ 'moveTo', 'lineTo', 'curveTo', 'arc', 'fillText', 'stroke', 'fill', 'clear' ]) {

			Drawing.register( methodName );

		}

	} // Drawing.constructor



	static register( methodName ) {

		window[ methodName ] = function ( ...params ) {

			Drawing.precheck();
			Drawing.current[ methodName ]( ...params );

		};

	}



	// parse a number
	static parseN( elem, name, defaultValue ) {

		return parseNumber( elem.getAttribute( name ), defaultValue );

	}

	// parse 2D coordinates in centerName and alternatively
	// individual coordinates xName and yName
	static parseXY( elem, centerName, xName, yName ) {

		var xy = parseSize( elem.getAttribute( centerName ), [ 0, 0 ]);
		if ( elem.hasAttribute( xName ) )
			xy[ 0 ] = Drawing.parseN( elem, xName, 0 );
		if ( elem.hasAttribute( yName ) )
			xy[ 1 ] = Drawing.parseN( elem, yName, 0 );
		return xy;

	}

	// parse exclusive boolean value trueName; or its opposite falseName
	static parseBool( elem, trueName, falseName, defaultValue ) {

		const TRUTH = [ null, '', 'true', 'yes', 'TRUE', 'True', 'YES', 'Yes', '1' ];

		if ( trueName && elem.hasAttribute( trueName ) )
			return TRUTH.indexOf( elem.getAttribute( trueName ).trim() ) > -1;

		if ( falseName && elem.hasAttribute( falseName ) )
			return TRUTH.indexOf( elem.getAttribute( falseName ).trim() ) == -1;

		return defaultValue;

	}

	// parse exclusive boolean values trueName; or its opposite falseName
	static parseBoolArray( elem, trueName, falseName, defaultValue ) {

		const TRUTH = [ null, '', 'true', 'yes', 'TRUE', 'True', 'YES', 'Yes', '1' ];

		if ( trueName && elem.hasAttribute( trueName ) ) {

			let array = elem.getAttribute( trueName ).split( ',' );
			for ( var i=0; i<array.length; i++ )
				array[ i ] = TRUTH.indexOf( array[ i ].trim() ) > -1;
			return array;

		}

		if ( falseName && elem.hasAttribute( falseName ) ) {

			let array = elem.getAttribute( falseName ).split( ',' );
			for ( var i=0; i<array.length; i++ )
				array[ i ] = TRUTH.indexOf( array[ i ].trim() ) == -1;
			return array;

		}

		return defaultValue;

	}


	// Shape overwrites this method
	managePath() {


		if ( this.needsNewPath ) {

			this.context.beginPath( );
			this.needsNewPath = false;

		}

	} // Drawing.managePath


	_moveTo( x, y ) {

		this.context.moveTo( x, this.canvas.height-y );

	}


	_lineTo( x, y ) {

		this.context.lineTo( x, this.canvas.height-y );

	}


	_quadraticCurveTo( mx, my, x, y ) {

		this.context.quadraticCurveTo( mx, this.canvas.height-my, x, this.canvas.height-y );

	}


	_arc( x, y, r, from, to, cw ) {

		this.context.arc( x, this.canvas.height-y, r, from, to, cw );

	} // Shape.arc



	moveTo( x=0, y=0, ...morePoints ) {

		this.managePath();
		this._moveTo( x, y );

		for ( var i=0; i<morePoints.length; i+=2 ) {

			x = morePoints[ i ] || 0;
			y = morePoints[ i+1 ] || 0;
			this._lineTo( x, y );

		}

	} // Drawing.moveTo




	lineTo( x=0, y=0, ...morePoints ) {

		this.managePath();
		this._lineTo( x, y );

		for ( var i=0; i<morePoints.length; i+=2 ) {

			x = morePoints[ i ] || 0;
			y = morePoints[ i+1 ] || 0;
			this._lineTo( x, y );

		}

	} // Drawing.lineTo




	curveTo( mx=0, my=0, x=0, y=0 ) {

		this.managePath();
		this._quadraticCurveTo( mx, my, x, y );

	} // Drawing.curveTo




	arc( x=0, y=0, r=Drawing.ARC_RADIUS, from = Drawing.ARC_FROM, to = Drawing.ARC_TO, cw = Drawing.ARC_CW ) {

		this.managePath();
		this._arc( x, y, r, THREE.MathUtils.degToRad( from-90 ), THREE.MathUtils.degToRad( to-90 ), !cw );

	} // Drawing.arc




	fillText( x=0, y=0, text='', color = Drawing.FILL_COLOR, font = Drawing.FONT ) {

		if ( this.texture ) this.texture.needsUpdate = true;

		this.context.fillStyle = color;
		this.context.font = font;
		this.context.fillText( text, x, this.canvas.height-y );

	} // Drawing.fillText



	cssColor( color ) {

		if ( color instanceof THREE.Color )
			return color.getStyle();
		else
			return color;

	}

	stroke( color = Drawing.STROKE_COLOR, width = Drawing.STROKE_WIDTH, closed = Drawing.STROKE_CLOSED ) {

		if ( this.texture ) this.texture.needsUpdate = true;

		if ( closed ) this.context.closePath();

		this.context.strokeStyle = this.cssColor( color );
		this.context.lineWidth = width;
		this.context.stroke( );

		this.needsNewPath = true;

	} // Drawing.stroke




	fill( color = Drawing.FILL_COLOR ) {

		if ( this.texture ) this.texture.needsUpdate = true;

		this.context.fillStyle = this.cssColor( color );
		this.context.fill( );

		this.needsNewPath = true;

	} // Drawing.fill


	// if color is missing, clear canvas to transparent
	clear( color ) {

		if ( this.texture ) this.texture.needsUpdate = true;

		if ( color ) {

			this.context.fillStyle = this.cssColor( color );
			this.context.fillRect( -1, -1, this.canvas.width+2, this.canvas.height+2 );

		} else {

			this.context.clearRect( -1, -1, this.canvas.width+2, this.canvas.height+2 );

		}

		this.needsNewPath = true;

	}



	get image( ) {

		if ( !this.texture ) {

			this.texture = new THREE.CanvasTexture( this.canvas );
			this.texture.anisotropy = window.suica.renderer.capabilities.getMaxAnisotropy();
			this.texture.colorSpace = THREE.SRGBColorSpace;
			this.texture.wrapS = THREE.RepeatWrapping;
			this.texture.wrapT = THREE.RepeatWrapping;

		}

		return this.texture;

	} // Drawing.image



	get clone( ) {

		var newDrawing = drawing( this.canvas.width, this.canvas.height, 'white', false );
		newDrawing.canvas = this.canvas;
		newDrawing.context = this.context;
		newDrawing.texture = this.texture;

		// var newDrawing = drawing( this.canvas.width, this.canvas.height );
		// newDrawing.context.drawImage( this.canvas, 0, 0);

		return newDrawing;

	}


	static precheck() {

		if ( !( Drawing.current instanceof Drawing ) && !( Drawing.current?.shape instanceof THREE.Shape ) )
			throw 'error: No drawing or shape instance is active';

	} // Drawing.precheck

} // class Drawing




function drawing( ...params ) {

	Drawing.current = new Drawing( ...params );
	return Drawing.current;

}

window.drawing = drawing;



function image( url = null ) {

	var texture = new THREE.TextureLoader().load( url );

	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;

	texture.magFilter = THREE.LinearFilter;
	texture.minFilter = THREE.LinearMipmapLinearFilter;

	texture.colorSpace = THREE.SRGBColorSpace;

	texture.anisotropy = window.suica.renderer.capabilities.getMaxAnisotropy();

	return texture;

}

window.image = image;



export { drawing, image, Drawing };
