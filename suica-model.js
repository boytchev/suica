//
// Suica 2.0 Model
// CC-3.0-SA-NC
//
//
//===================================================


class Model extends Mesh
{
	static SIZE = 1;

	constructor( suica, src, center, size )
	{
		suica.parser?.parseTags();
		suica.debugCall( 'model', src, center, size );

		// create empty object, it will be set when the model is loaded
		super( suica, 
			new THREE.Mesh( ),
			null, // no wireframe
		);
		
		this.ready = false;
		
		this.src = src;
		this.center = Suica.parseCenter( center );
		this.size = Suica.parseSize( size, Tube.SIZE );
		
		this.waitingList = [];
		
	} // Model.constructor

	
	get src( )
	{
		return this._src;
	}
	
	
	set src( src )
	{
		if( !src ) return;
		
		var that = this;

		// if( src instanceof Mesh )
		// {
			// this._src = src._src;
			// replaceObject( src.threejs.clone() );
			// return;
		// }
		
		this._src = src;
		
		
		// check file extension
		var fileExt = src.split('.').pop().toUpperCase();

		switch( fileExt )
		{
			case 'GLTF':
			case 'GLB':
				new THREE.GLTFLoader().load( src, objectLoadedGLTF );
				break;
			
			default:
				throw `error: ${fileExt} models cannot be loaded`;
		}
		
		
		function objectLoadedGLTF( object )
		{
			object = object.scene;

			// scan all meshes in GLTF model and change metalness to 0
			// because it is always set to 1 and it makes very dark colors
			
			object.traverse( noMetal );
		
			function noMetal( child )
			{
				if( child.isMesh ) child.material.metalness = 0;
				if( child.children.lenhth ) child.traverse( noMetal );
			}

			replaceObject( object );
			that.ready = true;
			
			// check whether othe objects are waiting for the same model
			for( var waiting of that.waitingList )
			{
				waiting.threejs.add( object.clone() );
			}
			that.waitingList = [];
		} // Model.src.objectLoadedGLTF
		
		
		function replaceObject( object )
		{
			// remove current object
			if( that.threejs.children.length) that.threejs.remove( that.threejs.children[0] );
			
			// add new object
			that.threejs.add( object );
			
		} // Model.src.replaceObject
		
		
	}
	
	
	get clone( )
	{
		var object = new Model( this.suica, '', this.center, this.size );
		
		if( this.ready )
		{
			// object is ready, clone it
			object.threejs.add( this.threejs.children[0].clone() );
		}
		else
		{
			// object is not ready, add to waiting list
			this.waitingList.push( object );
		}
		
		
		object.spin = this.spin;
		object.image = this.image;

		Suica.cloneEvents( object, this );
			
		return object;
		
	} // Model.clone
	
	
	static save( fileName, suicaObjects )
	{
		// if no objects then use all objects
		if( !suicaObjects ) suicaObjects = allObjects();
		
		var objects = [];
		for( var obj of suicaObjects )
			objects.push( obj.threejs );
		
		var exporter = new THREE.GLTFExporter(),
			result = '';
		
		try
		{
			// if no fileName, return GLTF text
			if( !fileName )
			{
				exporter.parse( objects,
					(data) => result = data,
					null,
					{binary: false}
				);
			}
		}
		finally
		{
			return result;
		}
	} // Model.save
	
	
} // class Model
