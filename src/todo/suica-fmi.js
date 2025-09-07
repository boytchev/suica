//
// Suica 3.0 FMI Add-ons
//
//===================================================

// https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js
function cyrb53( str, seed = 0 ) {

	var h1 = 0xdeadbeef ^ seed,
		h2 = 0x41c6ce57 ^ seed;

	for ( var i=0, ch; i<str.length; i++ ) {

		ch = str.charCodeAt( i );
		h1 = Math.imul( h1^ch, 2654435761 );
		h2 = Math.imul( h2^ch, 1597334677 );

	}

	h1 = Math.imul( h1^( h1 >>> 16 ), 2246822507 ) ^ Math.imul( h2^( h2 >>> 13 ), 3266489909 );
	h2 = Math.imul( h2^( h2 >>> 16 ), 2246822507 ) ^ Math.imul( h1^( h1 >>> 13 ), 3266489909 );

	return 4294967296*( 2097151 & h2 ) + ( h1 >>> 0 );

}




function addShadow( object ) {

	object.threejs.castShadow = true;
	object.threejs.receiveShadow = true;
	if ( object instanceof Group )
		for ( var obj of object.groupElements ) addShadow( obj );

}


window.onSuicaCreated = function ( suica ) {

	var id = suica.suicaTag.getAttribute( 'fn' );
	if ( !id ) id='.'+'.'+'.';

	var elem = document.createElement( 'span' );
	suica.suicaTag.appendChild( elem );
	elem.innerHTML = id;
	elem.style="position: absolute; left:1px; top:1px; border-radius: 0 0 0.5em 0; color: crimson; background: pink; padding: 0.2em 0.6em; font-family: Calibri; text-transform: capitalize;";
	if ( id.replace( /\D/g, '' ).length > 4 ) {

		elem.style.background='lightgreen';
		elem.style.color='darkgreen';

	}

	//id = '#' + id;

	//function random( a, b ) {
	//
	//	id += 'x';
	//	return cyrb53( id )%( b-a+1 ) + a;
	//
	//}

	elem = element( 'buttons' );
	if ( elem ) elem.style = 'text-align: center; padding: 0; position: absolute; top: 1px; left: 0; width: 100%; z-index: 1000;';

	for ( let elem of document.querySelectorAll( 'button' ) ) {

		elem.style = 'width: 8em; padding: 0.5; border: none; border-radius: 0 0 0.5em 0.5em; color: black; background: rgba(0,0,0,0.1); padding: 0.2em 0.6em; font-family: Calibri; text-transform: uppercase; cursor: pointer; font-weight: bold;';

		elem.addEventListener( 'pointerover', () => {

			elem.style.backgroundColor='white';

		} );
		elem.addEventListener( 'pointerout', () => {

			elem.style.backgroundColor='rgba(0,0,0,0.1)';

		} );

	}

	suica0.raycaster.params.Point = 0;
	suica0.raycaster.params.Line = 0;

	// allow shadows
	suica0.renderer.shadowMap.enabled = true;
	suica0.renderer.shadowMap.type = THREE.VSMShadowMap;

	var light = new THREE.DirectionalLight( 'white', 0.5 );
	light.position.set( 20, 15, 10 );
	light.target = suica0.scene;
	light.castShadow = true;

	light.shadow.mapSize.width = 512*4;
	light.shadow.mapSize.height = 512*4;
	light.shadow.bias = -0.002;
	light.shadow.radius = 1;
	light.shadow.camera.left = -30;
	light.shadow.camera.right = 30;
	light.shadow.camera.bottom = -30;
	light.shadow.camera.top = 30;
	light.shadow.camera.near = 1;
	light.shadow.camera.far = 50;

	var light2 = new THREE.DirectionalLight( 'white', 0.4 );
	light2.position.set( -10, 15, 10 );
	light2.target = suica0.scene;

	suica0.scene.add( light, light2 );

	this.shadowLight = light;
	suica0.light.intensity = 0;

	var BS = 64,
		border = drawing( BS, BS, 'white' );
	border.moveTo( 0, 0, BS, 0, BS, BS, 0, BS, 0, 0 );
	border.stroke( 'black', 2 );

	var framed = { image: border };

	// небе
	cube([ 0, 0, 0 ], 11 ); its.threejs.material = new THREE.MeshBasicMaterial( {
		color: 'LightSteelBlue',
		side: THREE.BackSide,
		polygonOffset: true,
		polygonOffsetFactor: 10000,
		polygonOffsetUnits: 10000,
	} );

	// рамка и трева
	cube([ 0, 0, 0 ], 11, 'black' ); its.wireframe = true;
	function TH( x, z ) {

		return ( x*x==25 || z*z==25 ) && ( ( x+z )%2==0 ) ? -3 : -4;

	}

	T = group( );
	for ( var x=-5; x<=5; x++ )
		for ( var z=-5; z<=5; z++ )
			for ( var y=-5; y<=TH( x, z )-1; y++ ) {

				if ( y==-4 )
					T.add( cube([ x, y-0.4, z ], [ 1, 0.2, 1 ], 'DarkGreen' ).style( framed ) );
				else
					T.add( cube([ x, y, z ], 1, 'AntiqueWhite' ).style( framed ) );

			}

	for ( var x=-1; x<=1; x++ )
		for ( var z=-1; z<=1; z++ ) {

			T.add( cube([ x, -4, z ], 1, 'AntiqueWhite' ).style( framed ) );

		}

	addShadow( T );

	// цветенце
	C = group(
		cube([ 0, 0.25, 0 ], [ 0.05, 1.5, 0.05 ], 'lime' ).style( framed ),
		cube([ 0, 1, 0 ], 0.2, 'yellow' ).style( framed ),
		cube([ 0, 0.95, 0 ], [ 0.2, 0.2, 0.6 ], 'crimson' ).style( framed ),
		cube([ 0, 0.95, 0 ], [ 0.6, 0.2, 0.2 ], 'crimson' ).style( framed ),
		prism( 4, [ 0.17, 0.4, 0 ], [ 0.6, 0.05, 0.2 ], 'lime' ).style( { spinS: 60 } ),
		its.clone.style( { wireframe: true, color: 'darkgreen' } ),
		prism( 4, [ -0.17, 0.4, 0 ], [ 0.6, 0.05, 0.2 ], 'lime' ).style( { spinS: -60 } ),
		its.clone.style( { wireframe: true, color: 'darkgreen' } ),
	);




	// слонче
	A = group(
		// телце
		cube([ 0, 0, 0 ], 1, 'gray' ).style( framed ),
		cube([ 0, 1.3, 0 ], 1.8, 'gray' ).style( framed ),
		// очички
		sphere([ 0.9, 1.5, 0.25 ], [ 0.1, 0.4, 0.4 ], 'white' ),
		sphere([ 0.9, 1.5, -0.25 ], [ 0.1, 0.4, 0.4 ], 'white' ),
		sphere([ 0.9, 1.5, 0.25 ], [ 0.2, 0.2, 0.2 ], 'black' ),
		sphere([ 0.9, 1.5, -0.25 ], [ 0.2, 0.2, 0.2 ], 'black' ),
		// опашчица
		cube([ -1.05, 0.5, 0 ], [ 0.2, 1, 0.2 ], 'gray' ),
		its.clone.style( { color: 'black', wireframe: true } ),
		// хоботче
		cube([ 1.0, 1.1, 0 ], [ 0.3, 0.3, 0.3 ], 'gray' ),
		its.clone.style( { color: 'black', wireframe: true } ),
		// ушички
		cube([ 0.4, 1.3, 1.6 ], [ 0.2, 1.4, 1.4 ], 'gray' ).style( framed ),
		cube([ 0.41, 1.3, 1.6 ], [ 0.2, 1.1, 1.1 ], 'lightgray' ),
		cube([ 0.4, 1.3, -1.6 ], [ 0.2, 1.4, 1.4 ], 'gray' ).style( framed ),
		cube([ 0.41, 1.3, -1.6 ], [ 0.2, 1.1, 1.1 ], 'lightgray' ),
		// бивнички
		cone([ 0.8, 0.9, 0.45 ], [ 0.3, 1 ], 'white' ).style( { spinH: 90, spinV: 110 } ),
		cone([ 0.8, 0.9, -0.45 ], [ 0.3, 1 ], 'white' ).style( { spinH: 90, spinV: 110 } ),

	);
	A.spinH = -90;


	var instructions = drawing( 512, 512, 'black' );

	square([ 0, -5.51, 0 ], 9, 'white' );
	its.threejs.material = new THREE.MeshBasicMaterial();
	its.spinV = 90;
	its.image = instructions;
	var y = 512;

	function title( text ) {

		y = y-50;
		instructions.fillText( 10, y, text, 'white', 'bold 24px Calibri' );

	}

	function item( text ) {

		y = y-30;
		instructions.fillText( 30, y, text, 'white', '22px Calibri' );

	}

	title( 'СЛОНЧЕТО' );
	item( '1. има хоботче от 3 части (едната вече я има)' );
	item( '2. с кликване по слончето хоботчето се движи' );
	item( '3. последната част на хоботчето е водоравна' );
	item( '4. с повторно кликване хоботчето спира' );
	title( 'БУТОНИТЕ' );
	item( '5. [легни] накланя слончето наляво на 45°' );
	item( '6. [стани] изправя слончето и го завърта надясно' );
	item( '7. [салто] слончето прави салто (дори и полегнало)' );
	title( 'ЦВЕТЯТА' );
	item( '8. има по едно цвете на всеки от зелените храсти' );
	item( '9. с кликване по цвете то се мести в хоботчето' );
	item( '10. движи се заедно с движението на хоботчето' );

};
