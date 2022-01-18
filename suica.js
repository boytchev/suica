
// Suica 2.0
// CC-3.0-SA-NC
//
//
// Suica
//		Suica.version
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
// {<canvas> =} new Suica(<canvas-id>)
//		{<canvas>.}background(<color>)						default:[1,1,1]
//		{<canvas>.}lookAt(<eye>,<target>,<up>)				default:[100,100,30],[0,0,0],[0,0,1]
//		{<canvas>.}demo(<distance>{,<speed>{,<height>{,{<target>}}})
//		{<canvas>.}perspective(<angle>,<near>,<far>)		default:30,1,40000
//		{<canvas>.}orthographic(<near>,<far>)
//		{<canvas>.}oxyz({<length>})
//		
//===================================================
//
// History
//	2.0.00 (220118)	initiation
//
//===================================================


if( typeof THREE === 'undefined' ) throw 'error: Three.js must be loaded before Suica.js';

console.log( `Suica 2.0.0 (220118) :: r${THREE.REVISION}` );


class SuicaCanvas extends HTMLElement
{
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
}

customElements.define('suica-canvas', SuicaCanvas);


//===================================================
//
// SUICA OBJECT
//
//===================================================

/*
function suica( canvasId )
{
	// make sure body exists
	if( !document.body )
	{
		if( Suica.waitingPeriod < Suica.waitingTimeout )
		{
			setTimeout( Suica.init, Suica.waitingPeriod );
			Suica.waitingPeriod = 2*Suica.waitingPeriod;
		}
		else
			console.warning( 'Suica was not able to identify when the page is completely loaded.' );

		return;
	} // !document.body
}
suica.waitingPeriod = 1;
suica.waitingTimeout = 10*1000; // 10 seconds
*/
/*
// library activation (wating for document.body)

	static init()
	{
		if( !document.body )
		{
			if( Suica.waitingPeriod < Suica.waitingTimeout )
			{
				setTimeout( Suica.init, Suica.waitingPeriod );
				Suica.waitingPeriod = 2*Suica.waitingPeriod;
			}
			else
				console.warning( 'Suica was not able to identify when the page is completely loaded.' );

			return;
		} // !document.body
		
		console.log( `Suica ${Suica.VERSION} ` );
		
		var id = 1;
		
		for( var suica of document.getElementsByTagName( 'suica' ) )
		{
			var canvas = document.createElement( 'canvas' );
				canvas.setAttribute( 'id', suica.getAttribute('id') || `suica${id++}` );
				canvas.setAttribute( 'width', suica.getAttribute('width') || 300 );
				canvas.setAttribute( 'height', suica.getAttribute('height') || 150 );
				canvas.style = suica.style.cssText;

			suica.after( canvas );
			suica.style.display = 'none';
			
			window[canvas.getAttribute('id')] = new Suica( canvas );
		}
	}
*/

/*


Suica.contextList = [];	// global list of all SUICA contexts
Suica.lastContext = null;
Suica.startTime = (new Date()).getTime(); // SUICA start time (in ms)
Suica.time = 0;
Suica.dTime = 0;

Suica.POINT = 1;
Suica.LINE = 2;
Suica.SOLID = 3;
Suica.ALL = 4;
Suica.NONPOINT = 5;

Suica.PRECISION = 48;
Suica.id = 0;




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


Suica.prototype.background = function(color)
{
	this.backgroundColor = color;
}


function background(color)
{
	if (Suica.lastContext) Suica.lastContext.background(color);
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


Suica.prototype.identityMatrix = function()
{
	return new Float32Array( [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1] );
}
	

Suica.prototype.identity = function()
{
	this.newModelMatrix = true;
	this.modelMatrix = this.identityMatrix();
}
	

Suica.prototype.scale = function(v)
{
	this.newModelMatrix = true;

	var m = this.modelMatrix;

	m[0] *= v[0];
	m[1] *= v[0];
	m[2] *= v[0];
	
	m[4] *= v[1];
	m[5] *= v[1];
	m[6] *= v[1];
	
	m[8] *= v[2];
	m[9] *= v[2];
	m[10] *= v[2];
}


Suica.prototype.translate = function(v)
{
	this.newModelMatrix = true;

	var m = this.modelMatrix;

	m[12] += m[0]*v[0]+m[4]*v[1]+m[8]*v[2];
	m[13] += m[1]*v[0]+m[5]*v[1]+m[9]*v[2];
	m[14] += m[2]*v[0]+m[6]*v[1]+m[10]*v[2];
}


Suica.prototype.yRotate = function(a)
{
	this.newModelMatrix = true;

	var m = this.modelMatrix;

//	a = radians(a);
	var s = Math.sin(a);
	var c = Math.cos(a);
	
	a = m[0]*s+m[8]*c;
	m[0]=m[0]*c-m[8]*s;
	m[8]=a;
	
	a = m[1]*s+m[9]*c;
	m[1]=m[1]*c-m[9]*s;
	m[9]=a;
	
	a = m[2]*s+m[10]*c;
	m[2]=m[2]*c-m[10]*s;
	m[10]=a;
}

Suica.prototype.zRotate = function(a)
{
	this.newModelMatrix = true;

	var m = this.modelMatrix;

//	a = radians(a);
	var s = Math.sin(a);
	var c = Math.cos(a);
	
	a = m[0]*s+m[4]*c;
	m[0]=m[0]*c-m[4]*s;
	m[4]=a;
	
	a = m[1]*s+m[5]*c;
	m[1]=m[1]*c-m[5]*s;
	m[5]=a;
	
	a = m[2]*s+m[6]*c;
	m[2]=m[2]*c-m[6]*s;
	m[6]=a;
}


Suica.prototype.matrixMultiply = function(a,b)
{
	var res=[];
    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];  
    res[0] = b0*a[0] + b1*a[4] + b2*a[8] + b3*a[12];
    res[1] = b0*a[1] + b1*a[5] + b2*a[9] + b3*a[13];
    res[2] = b0*a[2] + b1*a[6] + b2*a[10] + b3*a[14];
    res[3] = b0*a[3] + b1*a[7] + b2*a[11] + b3*a[15];

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    res[4] = b0*a[0] + b1*a[4] + b2*a[8] + b3*a[12];
    res[5] = b0*a[1] + b1*a[5] + b2*a[9] + b3*a[13];
    res[6] = b0*a[2] + b1*a[6] + b2*a[10] + b3*a[14];
    res[7] = b0*a[3] + b1*a[7] + b2*a[11] + b3*a[15];

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    res[8] = b0*a[0] + b1*a[4] + b2*a[8] + b3*a[12];
    res[9] = b0*a[1] + b1*a[5] + b2*a[9] + b3*a[13];
    res[10] = b0*a[2] + b1*a[6] + b2*a[10] + b3*a[14];
    res[11] = b0*a[3] + b1*a[7] + b2*a[11] + b3*a[15];

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    res[12] = b0*a[0] + b1*a[4] + b2*a[8] + b3*a[12];
    res[13] = b0*a[1] + b1*a[5] + b2*a[9] + b3*a[13];
    res[14] = b0*a[2] + b1*a[6] + b2*a[10] + b3*a[14];
    res[15] = b0*a[3] + b1*a[7] + b2*a[11] + b3*a[15];
    return res;
};

Suica.prototype.transposeInverse = function()
{
	var a = this.matrixMultiply(this.viewMatrix,this.modelMatrix);
	
    var b00 =  a[0]*a[5]  -  a[1]*a[4],
        b01 =  a[0]*a[6]  -  a[2]*a[4],
        b02 =  a[0]*a[7]  -  a[3]*a[4],
        b03 =  a[1]*a[6]  -  a[2]*a[5],
        b04 =  a[1]*a[7]  -  a[3]*a[5],
        b05 =  a[2]*a[7]  -  a[3]*a[6],
        b06 =  a[8]*a[13] -  a[9]*a[12],
        b07 =  a[8]*a[14] - a[10]*a[12],
        b08 =  a[8]*a[15] - a[11]*a[12],
        b09 =  a[9]*a[14] - a[10]*a[13],
        b10 =  a[9]*a[15] - a[11]*a[13],
        b11 = a[10]*a[15] - a[11]*a[14],
        det = 1/(b00*b11 - b01*b10 + b02*b09 + b03*b08 - b04*b07 + b05*b06);

	this.normalMatrix[0] = (a[5] * b11 - a[6] * b10 + a[7] * b09) * det;
    this.normalMatrix[1] = (a[6] * b08 - a[4] * b11 - a[7] * b07) * det;
    this.normalMatrix[2] = (a[4] * b10 - a[5] * b08 + a[7] * b06) * det;

    this.normalMatrix[3] = (a[2] * b10 - a[1] * b11 - a[3] * b09) * det;
    this.normalMatrix[4] = (a[0] * b11 - a[2] * b08 + a[3] * b07) * det;
    this.normalMatrix[5] = (a[1] * b08 - a[0] * b10 - a[3] * b06) * det;

    this.normalMatrix[6] = (a[13] * b05 - a[14] * b04 + a[15] * b03) * det;
    this.normalMatrix[7] = (a[14] * b02 - a[12] * b05 - a[15] * b01) * det;
    this.normalMatrix[8] = (a[12] * b04 - a[13] * b02 + a[15] * b00) * det;
	
};

Suica.prototype.cloneMatrix = function(a)
{
	var b = new Float32Array(a.length);
	b.set(a);
	return b;
}


Suica.prototype.pushMatrix = function()
{
	this.modelMatrixStack.push(this.cloneMatrix(this.modelMatrix));
}


Suica.prototype.popMatrix = function()
{
	this.newModelMatrix = true;
	if (this.modelMatrix.length)
		this.modelMatrix = this.modelMatrixStack.pop();
	else
		identity();
}


Suica.prototype.useModelMatrix = function()
{
	if (this.newModelMatrix)
	{
		this.newModelMatrix = false;
		this.gl.uniformMatrix4fv(this.uModelMatrix,false,this.modelMatrix);
	}
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

Suica.scrollLeft = function() {
	return Math.max (
		window.pageXOffset ? window.pageXOffset : 0,
		document.documentElement ? document.documentElement.scrollLeft : 0,
		document.body ? document.body.scrollLeft : 0
	);
}

Suica.scrollTop = function() {
	return Math.max (
		window.pageYOffset ? window.pageYOffset : 0,
		document.documentElement ? document.documentElement.scrollTop : 0,
		document.body ? document.body.scrollTop : 0
	);
}

var random = Suica.random;
var radians = Suica.radians;
var unitVector = Suica.unitVector;
var vectorProduct = Suica.vectorProduct;
var scalarProduct = Suica.scalarProduct;
var vectorPoints = Suica.vectorPoints;
var sameAs = Suica.sameAs;

mainAnimationLoop();

Suica.version = '1.12 (151028)';
*/