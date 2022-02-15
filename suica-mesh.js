//
// Suica 2.0 Mesh
// CC-3.0-SA-NC
//
// new Mesh( suica, geometry, material, center, color )
//
//
//	center		center [x,y,z]
//	x			x coordinate of center
//	y			y coordinate of center
//	z			z coordinate of center
//	color		color [r,g,b]
//	size		size / [height,width,depth]
//	image		drawing or texture -- only for Mesh
//
//===================================================


class Mesh
{
	constructor( suica, solidMesh, frameMesh )
	{
		this.suica = suica;
		this.solidMesh = solidMesh;
		this.frameMesh = frameMesh;
		
		this.threejs = solidMesh;
		this.isWireframe = false;
		
		// [width, height, depth]
		this.meshSize = [null, null, null];

		suica.scene.add( solidMesh );
	}



	
	// create default materials for SUica objects
	static createMaterials( )
	{
		// point material
		var CANVAS_SIZE = 128;
		var canvas = document.createElement('canvas');
			canvas.width = CANVAS_SIZE;
			canvas.height = CANVAS_SIZE;
			
		var context = canvas.getContext('2d');
			context.fillStyle = 'white';
			
		var gradient = context.createRadialGradient(
				CANVAS_SIZE/2, CANVAS_SIZE/2, CANVAS_SIZE/2-5,
				CANVAS_SIZE/2, CANVAS_SIZE/2, CANVAS_SIZE/2
			);
			gradient.addColorStop(0, 'white');
			gradient.addColorStop(1, 'rgba(0,0,0,0)');
			context.fillStyle = gradient;

			context.beginPath( );
			context.arc( CANVAS_SIZE/2, CANVAS_SIZE/2, CANVAS_SIZE/2-2, 0, 2*Math.PI );
			context.fill( );

		Mesh.pointMaterial = new THREE.PointsMaterial( {
				color: 'white',
				size: 5,
				sizeAttenuation: true,
				map: new THREE.CanvasTexture( canvas ),
				transparent: true,
				alphaTest: 0.5,
			});

		// solid material
		Mesh.solidMaterial = new THREE.MeshStandardMaterial( {
				color: 'cornflowerblue',
				side: THREE.DoubleSide,
			});

		// solid flat material
		Mesh.flatMaterial = new THREE.MeshStandardMaterial( {
				color: 'cornflowerblue',
				side: THREE.DoubleSide,
				flatShading: true,
			});

		// line material
		CANVAS_SIZE = 4;
		var canvas2 = document.createElement('canvas');
			canvas2.width = CANVAS_SIZE;
			canvas2.height = 1;
			
		var context2 = canvas2.getContext('2d');
			context2.fillStyle = 'white';
			context2.fillRect( 0, 0, canvas2.width, canvas2.height );

		Mesh.lineMaterial = new THREE.MeshBasicMaterial( {
				color: 'black',
				transparent: true,
				map: new THREE.CanvasTexture( canvas2 ),
			});

		Mesh.lineMaterial.onBeforeCompile = shader => {
			shader.fragmentShader = shader.fragmentShader.replace(
				'#include <map_fragment>',
				`#ifdef USE_MAP
					vec4 texelColor = texture2D( map, vUv );
					diffuseColor *= texelColor;
				#endif`
			);
		}

	}




	get center()
	{
		this.suica.parser?.parseTags();

		return [this.threejs.position.x, this.threejs.position.y, this.threejs.position.z];
	}

	set center(center)
	{
		this.suica.parser?.parseTags();

		center = Suica.parseCenter( center );
		this.threejs.position.set( center[0], center[1], center[2] );
	}




	get x()
	{
		this.suica.parser?.parseTags();

		return this.threejs.position.x;
	}

	set x( x )
	{
		this.suica.parser?.parseTags();

		this.threejs.position.x = x;
	}




	get y()
	{
		this.suica.parser?.parseTags();

		return this.threejs.position.y;
	}

	set y( y )
	{
		this.suica.parser?.parseTags();

		this.threejs.position.y = y;
	}




	get z()
	{
		this.suica.parser?.parseTags();

		return this.threejs.position.z;
	}

	set z( z )
	{
		this.suica.parser?.parseTags();

		this.threejs.position.z = z;
	}




	get color()
	{
		this.suica.parser?.parseTags();
		
		var col = this.threejs.material.color;
		return [col.r, col.g, col.b];
	}

	set color( col )
	{
		this.suica.parser?.parseTags();

		this.threejs.material.color = Suica.parseColor(col);
		this.threejs.material.needsUpdate = true;
	}
	
	
	
	get image( )
	{
		return this.threejs.material.map;
	}
	
	set image( drawing )
	{
		this.suica.parser?.parseTags();

		if( !drawing )
		{
			delete this.threejs.material.map;
			this.threejs.material.transparent = false,
			this.threejs.material.needsUpdate = true;
			return;
		}

		if( drawing instanceof Drawing )
		{
			this.threejs.material.map = drawing.image;
			this.threejs.material.transparent = true,
			this.threejs.material.needsUpdate = true;
			return;
		}

		if( drawing instanceof THREE.Texture )
		{
			this.threejs.material.map = drawing;
			this.threejs.material.transparent = true,
			this.threejs.material.needsUpdate = true;
			return;
		}

		throw 'error: Parameter of `image` is not a drawing';
	}
	
	
	
	
	updateScale( )
	{
		var width = this.meshSize[0];
		var height = this.meshSize[1];
		var depth = this.meshSize[2];
		
		if( height===null ) height = width;
		if( depth===null ) depth = width;
				
		switch( this.suica.orientation )
		{
			case Suica.ORIENTATIONS.YXZ:
					this.threejs.scale.set( height, width, depth );
					break;
			case Suica.ORIENTATIONS.ZYX:
					this.threejs.scale.set( depth, height, width );
					break;
			case Suica.ORIENTATIONS.XZY:
					this.threejs.scale.set( width, depth, height );
					break;

			case Suica.ORIENTATIONS.ZXY:
					this.threejs.scale.set( height, depth, width );
					break;
			case Suica.ORIENTATIONS.XYZ:
					this.threejs.scale.set( width, height, depth );
					break;
			case Suica.ORIENTATIONS.YZX:
					this.threejs.scale.set( depth, width, height );
					break;
			default: throw 'error: unknown orientation';
		}
	}

	get width( )
	{
		return this.meshSize[0];
	}

	set width( width )
	{
		this.meshSize[0] = width;
		this.updateScale();
	}
	


	
	get height( )
	{
		return (this.meshSize[1]!==null) ? this.meshSize[1] : this.meshSize[0];
	}

	set height( height )
	{
		this.meshSize[1] = height;
		this.updateScale();
	}
	


	
	get depth( )
	{
		return (this.meshSize[2]!==null) ? this.meshSize[2] : this.meshSize[0];
	}

	set depth( depth )
	{
		this.meshSize[2] = depth;
		this.updateScale();
	}
	


	
	get size( )
	{
		this.suica.parser?.parseTags();

		if( this.meshSize[2]===null )
		{
			if( this.meshSize[1]===null )
				return this.meshSize[0];
			else
				return [this.meshSize[0], this.meshSize[1]];
		}
			
		return [this.meshSize[0], this.meshSize[1], this.meshSize[2]];
	}

	set size( size )
	{
		this.suica.parser?.parseTags();
		
		if( Array.isArray(size) )
		{
			if( size.length==0 )
				this.meshSize = [null, null, null];
			else
			if( size.length==1 )
				this.meshSize = [size[0], null, null];
			else
			if( size.length==2 )
				this.meshSize = [size[0], size[1], null];
			else
				this.meshSize = [size[0], size[1], size[2]];
		}
		else
		{
			this.meshSize = [size, null, null];
		}
		
		this.updateScale();
	}



	get wireframe( )
	{
		return this.isWireframe;
	}
	
	set wireframe( wireframe )
	{
		if( !this.frameMesh )
			throw 'error: wireframe property not available';
		
		this.isWireframe = wireframe;
		
		var oldMesh = this.threejs,
			newMesh = (wireframe===true) || (['','true','yes','1'].indexOf(String(wireframe).toLowerCase()) >= 0) ? this.frameMesh : this.solidMesh;

		// copy properties
		newMesh.position.copy( oldMesh.position );
		newMesh.scale.copy( oldMesh.scale );
		newMesh.material.color.copy( oldMesh.material.color );
		
		if( oldMesh.material.map )
		{
			newMesh.material.map = oldMesh.material.map;
			newMesh.material.transparent = oldMesh.material.transparent;
			newMesh.material.needsUpdate = true;
		}
		
		this.threejs = newMesh;
		
		this.suica.scene.remove( oldMesh );
		this.suica.scene.add( newMesh );

	}
	
	style( properties )
	{
		for( var n in properties ) this[n] = properties[n];
		return this;
		
	} // Mesh.style

} // class Mesh


Mesh.createMaterials();