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
		
		this.src = src;
		this.center = Suica.parseCenter( center );
		this.size = Suica.parseSize( size, Tube.SIZE );
		
	} // Model.constructor

	
	get src( )
	{
		return this._src;
	}
	
	
	set src( src )
	{
		var that = this;

		this._src = src;
		
		// check file extension
		var fileExt = src.split('.').pop().toUpperCase(),
			loader;

		switch( fileExt )
		{
			case 'GLTF':
			case 'GLB':
				loader = new THREE.GLTFLoader().load( src, objectLoadedGLTF );
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
		} // Model.src.objectLoadedGLTF
		
		
		function replaceObject( object )
		{
			var pos = new THREE.Vector3();
				pos.copy( that.threejs.position );

			that.suica.scene.remove( that.threejs );

			that.solidMesh = object;
			that.threejs = object;
			
			that.suica.scene.add( that.threejs );
			
			that.threejs.position.copy( pos );
			that.updateScale();
			that.updateOrientation();
		} // Model.src.replaceObject
		
		
	}
	
	
	get clone( )
	{
		var object = new Model( this.suica, this.src, this.center, this.size );
		
		object.spin = this.spin;
		object.image = this.image;

		Suica.cloneEvents( object, this );
			
		return object;
		
	} // Model.clone
	
} // class Model
