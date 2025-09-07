//
// Suica 3.0 Construct
//
//===================================================


import * as THREE from 'three';
import { cloneEvents, evaluate, parseColor, parseSize } from './suica-globals.js';
import { Mesh } from './suica-mesh.js';
import CSG from '../libs/three-csg.js';


class Construct extends Mesh {

	static SIZE = [ 1, 1, 1 ];
	static COLOR = 'lightsalmon';

	constructor( suica, expression, size, color ) {

		suica.parser?.parseTags();
		suica.debugCall( 'construct', expression, size, color );

		// expression can be:
		//		string				-> references global variables
		// 		{src:string, ...}	-> object with expression in src, references object's variables
		var scope = {};
		if ( expression.src ) {

			scope = expression;
			expression = expression.src;

		}

		var p = new THREE.Mesh();

		if ( expression ) {

			expression = '('+expression+')';

			// tokenize

			var tokens = '';
			for ( var i=0; i<expression.length; i++ ) {

				var ch = expression[ i ];
				if ( '*+-()'.indexOf( ch ) > -1 ) ch = ' '+ch+' ';
				tokens += ch;

			}

			tokens = tokens.split( ' ' ).filter( token => token );

			// parse

			var polish = [],
				stack = [],
				ra, pa, qa, p, q, token;

			for ( token of tokens ) {

				switch ( token ) {

					case ')':
						while ( p=stack.pop(), p != '(' )
							polish.push( p );
						break;

					case '+':
					case '-':
						while ( p=stack.pop(), p == '*' || p == '+' || p == '-' )
							polish.push( p );
						if ( p ) stack.push( p ); // no break!

					case '(':
					case '*':
						stack.push( token );
						break;

					default:
						polish.push( token );

				}

			}

			//			console.log( expression );
			//			console.log( tokens );
			//			console.log( polish );

			// evaluate
			console.assert( stack.length==0 );

			stack = [];
			for ( token of polish )
				switch ( token ) {

					case '*':
						qa = stack.pop();
						pa = stack.pop();
						//						console.log('intersect',pa,qa);
						q = CSG.fromMesh( qa );
						p = CSG.fromMesh( pa );
						ra = CSG.toMesh( p.intersect( q ) );//, pa.matrix );
						stack.push( ra );
						//						console.log('resut',ra);
						break;
					case '+':
						qa = stack.pop();
						pa = stack.pop();
						//						console.log('union',pa,qa);
						q = CSG.fromMesh( qa );
						p = CSG.fromMesh( pa );
						ra = CSG.toMesh( p.union( q ) );//, pa.matrix );
						stack.push( ra );
						//						console.log('resut',ra);
						break;
					case '-':
						qa = stack.pop();
						pa = stack.pop();
						//						console.log('substract',pa,qa);
						q = CSG.fromMesh( qa );
						p = CSG.fromMesh( pa );
						ra = CSG.toMesh( p.subtract( q ) );//, pa.matrix );
						stack.push( ra );
						//						console.log('resut',ra);
						break;
					default:
					{

						var object = scope[ token ] || evaluate( token );
						//console.log('push',object);
						if ( object.threejs ) {

							object.threejs.updateMatrix( );
							stack.push( object.threejs );

						} else
							throw `Error: cannot retrieve a 3D value from ${token}`;

					}

				}

			p = stack.pop();

			//			p.material = p.material.clone();
			//			p.material = new THREE.;
			//			console.log('final resut',p);

		}

		//console.log('constructing with p=',p);

		super( suica,
			p,
			null, // no wireframe
		);

		this.solidMesh.material = Mesh.solidMaterial.clone();

		this.center = [ 0, 0, 0 ];
		this.size = parseSize( size, Construct.SIZE );
		this.color = parseColor( color, Construct.COLOR );
		suica.scene.add( p );

	} // Construct.constructor


	get clone( ) {

		var object = new Construct( this.suica, '', this.size, this.color );

		object.threejs.material = this.threejs.material.clone();
		object.threejs.geometry = this.threejs.geometry.clone();

		object.spin = this.spin;
		object.image = this.image;
		object.images = this.images;
		object.visible = this.visible;

		cloneEvents( object, this );

		return object;

	} // Construct.clone


} // class Construct


export { Construct };
