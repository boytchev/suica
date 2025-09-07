//
// Suica 3.0 SCORM 1.2
//
//===================================================


import * as THREE from 'three';


class Scorm {

	constructor( ) {

		try {

			this.api = this.findAPI( window ) || this.findAPI( window.opener );

		} catch {

			this.api = null;

		}

	} // Scorm.constructor


	findAPI( win ) {

		if ( win == null )
			return null;

		var attempts = 0;

		while ( ( win.API == null ) && ( win.parent != null ) && ( win.parent != win ) ) {

			attempts++;
			if ( attempts > 10 ) {

				console.warn( 'Cannot find SCORM API.' );
				return null;

			}

			win = win.parent;

		}

		return win.API;

	} // Scorm.findAPI


	derandomize( seedValue = '~' ) {

		// set random seed depending on the student name and student id
		// hash is https://en.wikipedia.org/wiki/Jenkins_hash_function

		var str = this.studentId + seedValue + this.studentName,
			hash = 0;

		for ( var i=0; i<str.length; i++ ) {

			hash += str.charCodeAt( i );
			hash += hash << 10;
			hash ^= hash >> 6;

		}

		hash += hash << 3;
		hash ^= hash >> 11;
		hash += hash << 15;
		hash = hash & hash;

		THREE.MathUtils.seededRandom( hash ); // fixed seed, so random number will be the same

	} // Scorm.derandomize


	/*
	dump( )
	{
		var api = this.api;

		function scan( str )
		{
			console.log( str, '=', api.LMSGetValue( str ) );

			var children = api.LMSGetValue( str+'._children' ).split(',');

			for( var child of children )
				if( child )
					scan( str+'.'+child );
		}

		if( this.api && this.api.LMSInitialize("") )
		{
			scan( 'cmi' );
			this.api.LMSFinish("");
		}
	} // Scorm.dump
	*/

	getValue( name ) {

		var value = '';
		if ( this.api && this.api.LMSInitialize( "" ) ) {

			value = this.api.LMSGetValue( name );
			this.api.LMSFinish( "" );

		}

		return value;

	} // Scorm.getValue


	setValue( name, value ) {

		if ( this.api && this.api.LMSInitialize( "" ) ) {

			value = this.api.LMSSetValue( name, value );
			this.api.LMSCommit( "" );
			this.api.LMSFinish( "" );

		}

		return value;

	} // Scorm.setValue


	get studentId( ) {

		return this.getValue( 'cmi.core.student_id' );

	} // Scorm.studentId


	get studentName( ) {

		var name = this.getValue( 'cmi.core.student_name' ).split( ', ' );

		if ( name.length == 2 ) {

			name.unshift( name.pop() );

		}

		return name.join( ' ' );

	} // Scorm.studentName


	get score( ) {

		return this.getValue( 'cmi.core.score.raw' );

	}
	set score( value ) {

		this.setValue( 'cmi.core.score.raw', value );

	} // Scorm.score


} // class Scorm


var scorm = new Scorm();
window.scorm = scorm;


export { scorm };
