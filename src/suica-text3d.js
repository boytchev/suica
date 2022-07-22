//
// Suica 2.0 Text3D
// CC-3.0-SA-NC
//
//
//===================================================


class Text3D extends Mesh
{
	static SIZE = 1;
	static COLOR = 'lightsalmon';
	
	static fontLoader = new THREE.FontLoader();
	static fontsCache = {};
	static waitingList = [];
	
	constructor( suica, text, fontName, center, size, color )
	{
		suica.parser?.parseTags();
		suica.debugCall( 'text3d', text, fontName, center, size, color );

		// create empty object, it will be set when the font is loaded
		super( suica, 
			new THREE.Mesh( new THREE.BufferGeometry, Mesh.solidMaterial.clone() ),
			null, // no wireframe
		);

		this._text = '';
		this._font = undefined;
		
		this.font = fontName; // must be before text
		this.text = text;
		this.center = Suica.parseCenter( center );
		this.size = Suica.parseSize( size, Text3D.SIZE );
		this.color = Suica.parseColor( color, Text3D.COLOR);
		
		
	} // Text3D.constructor

	
	
	get text( )
	{
		return this._text;
	} // Text3D.text
	
	
	set text( text )
	{
		text = ''+text;
		
		if( this._text == text ) return;

		this._text = text;
		this.regenerateGeometry( );
	} // Text3D.text(...)
	
	
	get font( )
	{
		return this._fontName;
	} // Text3D.fontName
	
	
	set font( fontName )
	{
		var that = this;
		
		if( this._fontName == fontName ) return;

		this._fontName = fontName;
		this._font = undefined;
		
//console.log('::fontName',fontName,'cache',Text3D.fontsCache[fontName]);		
		if( Text3D.fontsCache[fontName] )
		{
			if( Text3D.fontsCache[fontName].isFont )
			{
				// font exists
				//console.log('cached font',fontName);
				this._font = Text3D.fontsCache[fontName];
				this.regenerateGeometry( );
				Suica.onLoad( this );
			}
			else
			{
				//console.log('font',fontName,'is requested, but still not available');
				Text3D.waitingList.push( this );
			}
		}
		else
		{
			//console.log('loading font',fontName);
			
			Text3D.fontsCache[fontName] = 'loading';
			
			Text3D.fontLoader.load( fontName, function ( font )
				{
					//console.log('loading font',fontName,'done');
					Text3D.fontsCache[fontName] = font;
					that._font = font;
					that.regenerateGeometry( );
			
					Suica.onLoad( that );
					
					// a geometry is loaded, scan all objects waiting for this font
					//console.log('waiting list',Text3D.waitingList);
					for( var i in Text3D.waitingList )
					{
						var obj = Text3D.waitingList[i];
						if( Text3D.fontsCache[obj._fontName]?.isFont )
						{
							obj._font = Text3D.fontsCache[obj._fontName];
							obj.regenerateGeometry();
							delete Text3D.waitingList[i];
							Suica.onLoad( obj );
						}
					}
					Text3D.waitingList = Text3D.waitingList.filter( value=>value );
				} );
		}
	} // Text3D.fontName(...)
	
	
	regenerateGeometry( )
	{
		this.solidMesh.geometry.dispose();
		this.solidMesh.geometry = new THREE.TextGeometry( this.text, {
			font: this._font,
			size: 1,
			height: 1,
			curveSegments: 8,
			bevelEnabled: !true,
			// bevelThickness: 0.2,
			// bevelSize: 0.2,
			// bevelOffset: -0.2,
			// bevelSegments: 3
		} );
	} // Text3D.fontLoaded


	get clone( )
	{
		var object = new Text3D( this.suica, this.text, this.font, this.center, this.size, this.color );
		
		object.spin = this.spin;
		object.image = this.image;
		object.visible = this.visible;

		Suica.cloneEvents( object, this );
		
		return object;
	} // Text3D.clone

	
	
} // class Text3D
