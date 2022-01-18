
// Suica 2.0
// CC-3.0-SA-NC
//
//
//		{suica.}background( color )
//		{suica.}oxyz( length=30, color='black' )


//		{Suica.}random(<from>,<to>)
//		{Suica.}radians(<degrees>)
//		{Suica.}unitVector(<vector>)
//		{Suica.}vectorProduct(<vector>,<vector>)
//		{Suica.}scalarProduct(<vector>,<vector>)
//		{Suica.}vectorPoints(<vector-point>,<vector-point>)
//		{Suica.}sameAs(<object>)
//		{Suica.}sameAs(<array>)
//		{Suica.}getPosition(<vector>)
//
// mainAnimationLoop()
//
//		{<canvas>.}lookAt(<eye>,<target>,<up>)				default:[100,100,30],[0,0,0],[0,0,1]
//		{<canvas>.}demo(<distance>{,<speed>{,<height>{,{<target>}}})
//		{<canvas>.}perspective(<angle>,<near>,<far>)		default:30,1,40000
//		{<canvas>.}orthographic(<near>,<far>)
//		
//===================================================
//
// History
//	2.0.00 (220118)	initiation
//
//===================================================


if( typeof THREE === 'undefined' ) throw 'error: Three.js must be loaded before Suica.js';

console.log( `Suica 2.0.0 (220118) :: r${THREE.REVISION}` );

class Suica extends HTMLElement
{
	static current;
	
	constructor( )
	{
		super( );
	}

	
	connectedCallback( )
	{
		this.style.display = 'inline-block';
		this.style.boxSizing = 'border-box';
		
		this.createCanvas( ); // creates this.canvas
		this.createRenderer( ); // creates this.rendered, this.scene, this.camera
		
		Suica.current = this;
	}
	
	
	// create canvas element inside suica-canvas
	
	createCanvas()
	{
		// create a shadow root
		this.attachShadow({mode: 'open'}); // sets and returns 'this.shadowRoot'

		if( this.clientWidth < 1 )
			this.style.width = (this.getAttribute('width') || 500) + 'px';

		if( this.clientHeight < 1 )
			this.style.height = (this.getAttribute('height') || 300) + 'px';
		

		// create canvas elements
		this.canvas = document.createElement( 'canvas' );
		this.canvas.width = this.clientWidth;
		this.canvas.height = this.clientHeight;


		// create some CSS to apply to the shadow dom
		var style = document.createElement( 'style' );
			style.textContent = `canvas {
				border: none;
				width: 100%;
				height: 100%;
				box-sizing: border-box;
			}`;

		// attach the created elements to the shadow DOM
		this.shadowRoot.append( style, this.canvas );
	}
	
	
	
	get canvasAspect( )
	{
		return this.canvas.width / this.canvas.height;
	}
	
	
	
	// create Three.js renderer
	
	createRenderer( )
	{
		this.renderer = new THREE.WebGLRenderer( {
							canvas: this.canvas,
							alpha: true,
							antialias: true
						} );

		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color( getComputedStyle(this).backgroundColor );

		this.camera = new THREE.PerspectiveCamera( 40, this.canvasAspect, 1, 1000 );
		this.camera.position.set( 0, 0, 100 );
		this.camera.lookAt( this.scene.position );

		this.renderer.render( this.scene, this.camera );
		
		var light = new THREE.PointLight( 'white', 1 );
			light.position.set( 100, 150, 300 );
			this.scene.add( light );
			
		this.mesh = new THREE.Mesh(
			new THREE.BoxGeometry( 30, 30, 30 ),
			new THREE.MeshLambertMaterial( {color: 'peru'} )
		);
		this.scene.add( this.mesh );
		
		
		var that = this;
		this.renderer.setAnimationLoop( function(t){that.tick(t/1000)} );

	}

	tick( t )
	{
		this.mesh.rotation.set( t, t/2, 0 );
		this.renderer.render( this.scene, this.camera );
	}
	
	
	background( color )
	{
		this.scene.background = new THREE.Color( color );
	}
	
	
	oxyz( length=30, color='black' )
	{
		var axes = new THREE.AxesHelper( length )
			axes.setColors( color, color, color );
		this.scene.add( axes );
	}
	
	static precheck()
	{
		if( !(Suica.current instanceof Suica) )
			throw 'error: No Suica instance is active';
	}
	
	
	static tagId( id )
	{
		return document.getElementById( id );
	}
}

customElements.define('suica-canvas', Suica);


function background( color )
{
	Suica.precheck();
	Suica.current.background( color );
}

function oxyz( length=30, color='black' )
{
	Suica.precheck();
	Suica.current.oxyz( length, color );
}

tagId = Suica.tagId;


//===================================================
//
// SUICA OBJECT
//
//===================================================

/*
Suica.startTime = (new Date()).getTime(); // SUICA start time (in ms)
Suica.time = 0;
Suica.dTime = 0;

Suica.POINT = 1;
Suica.LINE = 2;
Suica.SOLID = 3;
Suica.ALL = 4;
Suica.NONPOINT = 5;

Suica.PRECISION = 48;

Suica.prototype.perspective = function(angle,near,far)
{
	var aspect = this.gl.canvas.clientWidth/this.gl.canvas.clientHeight;
	var fov = 1/Math.tan(radians(angle)/2);
	this.projectionMatrix = new Float32Array([
		fov/aspect, 0, 0, 0,
		0, fov, 0, 0,
		0, 0, (far+near)/(near-far), -1,
		0, 0, 2.0*near*far/(near-far), 0]);
	this.gl.uniformMatrix4fv(this.uProjectionMatrix,false,this.projectionMatrix);
}

function perspective(angle,near,far)
{
	if (Suica.lastContext) Suica.lastContext.perspective(angle,near,far);
}


Suica.prototype.orthographic = function(near,far)
{
	var width = this.gl.canvas.clientWidth;
	var height = this.gl.canvas.clientHeight;
	this.projectionMatrix = new Float32Array([
		2.0/width, 0, 0, 0,
		0, 2.0/height, 0, 0,
		0, 0, 2.0/(near-far), 0,
		0, 0, (far+near)/(near-far), 1]);
	this.gl.uniformMatrix4fv(this.uProjectionMatrix,false,this.projectionMatrix);
}

function orthographic(near,far)
{
	if (Suica.lastContext) Suica.lastContext.orthographic(near,far);
}


Suica.prototype.lookAt = function(eye,target,up)
{
	var z = Suica.unitVector(Suica.vectorPoints(eye,target));
	var x = Suica.unitVector(Suica.vectorProduct(up,z));
	var y = Suica.unitVector(Suica.vectorProduct(z,x));
	this.viewMatrix = new Float32Array([
		x[0], y[0], z[0], 0,
		x[1], y[1], z[1], 0,
		x[2], y[2], z[2], 0,
		-Suica.scalarProduct(x,eye),
		-Suica.scalarProduct(y,eye),
		-Suica.scalarProduct(z,eye), 1 ]);
	this.gl.uniformMatrix4fv(this.uViewMatrix,false,this.viewMatrix);
}


function lookAt(eye,target,up)
{
	if (Suica.lastContext) Suica.lastContext.lookAt(eye,target,up);
}


Suica.prototype.oxyz = function(length)
{
	if (!length) length=30;
	
	point( [0,0,0] ).custom({pointSize:6, color: [0,0,0]});
	segment( [0,0,0], [length,0,0] ).custom({color: [0,0,0]});
	segment( [0,0,0], [0,length,0] ).custom({color: [0,0,0]});
	segment( [0,0,0], [0,0,length] ).custom({color: [0,0,0]});
}


function oxyz(length)
{
	if (Suica.lastContext)
		Suica.lastContext.oxyz(length);
}


Suica.prototype.demo = function(distance,speed,height,target)
{
	distance = distance||100;
	speed = speed||1;
	if (height===undefined) {height = 0.3};
	if (target===undefined) {target = 0.0};
	
	// a full circle for 20 seconds if speed==1
	speed = speed*Math.PI/10;
	this.demoViewPoint = {distance:distance, speed:speed, height:height, target:target};
}


function demo(distance,speed,height,target)
{
	if( Suica.lastContext ) Suica.lastContext.demo(distance,speed,height,target);
}



Suica.prototype.redrawFrame = function()
{
	this.gl.clearColor(this.backgroundColor[0],this.backgroundColor[1],this.backgroundColor[2],1);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT+this.gl.DEPTH_BUFFER_BIT);
	if (this.demoViewPoint != null)
	{
		this.lookAt( [ this.demoViewPoint.distance*Math.sin(this.demoViewPoint.speed*Suica.time),
					   this.demoViewPoint.distance*Math.cos(this.demoViewPoint.speed*Suica.time),
					   this.demoViewPoint.distance*this.demoViewPoint.height],
					 [0,0,this.demoViewPoint.distance*this.demoViewPoint.target], [0,0,1] );  
	}
	if (this.nextFrame) this.nextFrame();
}

Suica.prototype.objectAtPoint = function(x,y)
{
	var rec = this.gl.canvas.getBoundingClientRect();
	
	this.useShader(this.shaderProgramSelect);
	
	// redraw all elements
	this.gl.clearColor(1,1,1,1);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT+this.gl.DEPTH_BUFFER_BIT);
	for (var i=0; i<this.objectList.length; i++)
		this.objectList[i].drawObject();

	var pixelValues = new Uint8Array(4);//*2*2);
	this.gl.readPixels(	x-rec.left, rec.bottom-y, 1, 1, this.gl.RGBA, this.gl.UNSIGNED_BYTE, pixelValues);

	var id = pixelValues[0]+(pixelValues[1]<<8)+(pixelValues[2]<<16); 

	var foundObject = null;
	if (id<=Suica.id)
	{
		for (var i=0; i<this.objectList.length; i++)
			if (this.objectList[i].interactive)
				if (this.objectList[i].id==id)
					{	// maybe object [i] is the correct? we may get wrong result because
						// of antialiasing, so check again, but draw only the suspected object
						this.gl.clearColor(1,1,1,1);
						this.gl.clear(this.gl.COLOR_BUFFER_BIT+this.gl.DEPTH_BUFFER_BIT);
						this.objectList[i].drawObject();
						this.gl.readPixels(	x-rec.left, rec.bottom-y, 1, 1, this.gl.RGBA, this.gl.UNSIGNED_BYTE, pixelValues);
						var checkedId = pixelValues[0]+(pixelValues[1]<<8)+(pixelValues[2]<<16); 
						if (id==checkedId)
						{	// Yes!!!
							foundObject=this.objectList[i];
							break;
						}
					}
	}
	
	this.useShader(this.shaderProgram);
	return foundObject;
}

Suica.prototype.getPosition = function(center)
{
	var m = this.matrixMultiply(this.projectionMatrix,this.viewMatrix);
	var c = center;
	var x = m[0]*c[0]+m[4]*c[1]+m[8]*c[2]+m[12];
	var y = m[1]*c[0]+m[5]*c[1]+m[9]*c[2]+m[13];
	var w = m[3]*c[0]+m[7]*c[1]+m[11]*c[2]+m[15];

	var p = this.gl.canvas;
	var br = p.getBoundingClientRect();
	x = x*p.width/w/2;
	y = y*p.height/w/2;
	return [br.left+x+p.width/2+Suica.scrollLeft(), br.top-y+p.height/2+Suica.scrollTop()];
}

function getPosition(center)
{
	if (Suica.lastContext) return Suica.lastContext.getPosition(center);
}

function mainAnimationLoop()
{
	var time = new Date();
	time = (time.getTime()-Suica.startTime)/1000; // milliseconds->seconds
	Suica.dTime = time-Suica.time;
	Suica.time = time;
	
	// update objects from all suicas
	for (var s=0; s<Suica.contextList.length; s++)
	{
		Suica.contextList[s].redrawFrame(time);
	}
	
	// draw objects from all suicas
	for (var s=0; s<Suica.contextList.length; s++)
	{
		var suica = Suica.contextList[s];

		// draw all normal objects
		suica.renderMode = Suica.NONPOINT;
		suica.hasPoints = false;
		for (var i=0; i<suica.objectList.length; i++)
			suica.objectList[i].drawObject();
		
		// draw all POINT objects
		if (suica.hasPoints)
		{
			suica.useShader(suica.shaderProgramPoints);
			suica.renderMode = Suica.POINT;
			for (var i=0; i<suica.objectList.length; i++)
				suica.objectList[i].drawObject();
			suica.useShader(suica.shaderProgram);
		}
		
		suica.renderMode = Suica.ALL;
	}
	
	requestAnimationFrame(mainAnimationLoop);
}

Suica.random = function(a,b)
{
	return a+(b-a)*Math.random();
}


Suica.radians = function(degrees)
{
	return degrees*Math.PI/180;
}

Suica.unitVector = function(x)
{
	var len = 1/Math.sqrt( x[0]*x[0]+x[1]*x[1]+x[2]*x[2] );
	return [ len*x[0], len*x[1], len*x[2] ];
}


Suica.vectorProduct = function(x,y)
{
	return [
		x[1]*y[2]-x[2]*y[1],
		x[2]*y[0]-x[0]*y[2],
		x[0]*y[1]-x[1]*y[0] ];
}


Suica.scalarProduct = function(x,y)
{
	return x[0]*y[0] + x[1]*y[1] + x[2]*y[2];
}


Suica.vectorPoints = function(x,y)
{
	return [ x[0]-y[0], x[1]-y[1], x[2]-y[2] ];
}


Suica.sameAs = function(obj)
{
	if (obj instanceof Array)
	{
		return obj.slice(0);
	}
	else
	{
		var result={};
		for(var n in obj) result[n]=obj[n];
		obj.ctx.objectList.push(result);
		return result;
	}
}


var random = Suica.random;
var radians = Suica.radians;
var unitVector = Suica.unitVector;
var vectorProduct = Suica.vectorProduct;
var scalarProduct = Suica.scalarProduct;
var vectorPoints = Suica.vectorPoints;
var sameAs = Suica.sameAs;

mainAnimationLoop();
*/