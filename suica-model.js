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
		this._src = src;
		
		var loader = new THREE.GLTFLoader().load( src, objectLoaded );
		var that = this;
		
		function objectLoaded( object )
		{
			that.suica.scene.remove( that.threejs );
object.scene.scale.set(10,10,10);			
			that.solidMesh = object.scene;
			that.threejs = object.scene;
			
			that.suica.scene.add( that.threejs );
		}
		
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
