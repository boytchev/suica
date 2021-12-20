
// Suica 1.12
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
//	1.0.03 (150413)	added Ray, Segment, oxyz, parameter target of demo
//	1.0.02 (150412)	creation of canvas if missing, using first canvas if no Id
//	1.0.01 (150410)	merging into one source
//	1.0.00 (150401)	first version
//
//===================================================
//
// SUICA SHADERS
//
//===================================================

var vsSource = 
'	uniform mat4 uProjectionMatrix;	'+
'	uniform mat4 uViewMatrix;		'+
'	uniform mat4 uModelMatrix;		'+
'	uniform mat3 uNormalMatrix;		'+
'	uniform bool uUseNormal;		'+
'	uniform bool uLight;			'+
'	uniform   vec2 uTexScale;		'+
'	uniform   vec2 uTexOffset;		'+
'	uniform float uPointSize;		'+
'	attribute vec3 aXYZ;			'+
'	varying   vec4 vXYZT;			'+
'	attribute vec3 aNormal;			'+
'	varying   vec4 vNormal;			'+
'	attribute vec3 aColor;			'+
'	varying   vec3 vColor;			'+
'	attribute vec2 aTexCoord;		'+
'	varying   vec2 vTexCoord;		'+
'	void main ()					'+
'	{								'+
'		if (uLight) 				'+
'		{							'+
'			if (uUseNormal)			'+
'				vNormal = normalize(vec4(uNormalMatrix*aNormal,0)); 	'+
'			else					'+
'				vNormal = normalize(uViewMatrix * uModelMatrix * vec4(aNormal,0)); 	'+
'		}							'+
'		vColor = aColor;			'+
'		vTexCoord = aTexCoord*uTexScale-uTexOffset;	'+
'		vXYZT =  vec4(aXYZ,1);	'+
'		gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aXYZ,1);	'+
'		gl_PointSize = uPointSize;	'+
'	}								';

var fsSource =	
'		uniform sampler2D uSampler; 	'+
'		precision mediump float;		'+
'		uniform bool uLight;			'+
'		uniform bool uTexture;			'+
'		uniform int uClipPlanes;		'+
'		uniform vec4 uClipPlane[4];		'+
'		varying vec4 vXYZT;				'+
'		varying vec4 vNormal;			'+
'		varying vec3 vColor;			'+
'		varying vec2 vTexCoord;			'+
'		void main( )					'+
'		{								'+
'			if (uClipPlanes>0)			'+
'			{							'+
'				if (dot(vXYZT,uClipPlane[0])<0.0) discard;'+
'				if (uClipPlanes>1)		'+
'				{						'+
'					if (dot(vXYZT,uClipPlane[1])<0.0) discard;'+
'					if (uClipPlanes>2)	'+
'					{					'+
'						if (dot(vXYZT,uClipPlane[2])<0.0) discard;'+
'						if (uClipPlanes>3)	'+
'						{					'+
'							if (dot(vXYZT,uClipPlane[3])<0.0) discard;'+
'						}					'+
'					}					'+
'				}						'+
'			}							'+
//'			float diffLight = max(dot(normalize(vNormal),vec4(0,0,1,0)),0.0);	'+
'			vec4 color;														'+
'			if (uTexture)													'+
'				color = texture2D(uSampler,vTexCoord);						'+
'			else															'+
'				color = vec4(vColor,1.0);									'+
'			float diffLight = uLight?abs(vNormal.z):1.0;					'+
//'			float diffLight = uLight?max(vNormal.z,0.0):1.0;					'+
'			gl_FragColor = vec4((diffLight*0.8+0.2)*color.rgb,color.a);		'+
'		}																	';


var fsSourcePoints =	
'		uniform sampler2D uSampler; 	'+
'		precision mediump float;		'+
'		uniform bool uLight;			'+
'		uniform bool uTexture;			'+
'		uniform int uClipPlanes;		'+
'		uniform vec4 uClipPlane[3];		'+
'		uniform highp float uPointSize;		'+
'		varying vec4 vXYZT;				'+
'		varying vec4 vNormal;			'+
'		varying vec3 vColor;			'+
'		varying vec2 vTexCoord;			'+
'		void main( )					'+
'		{								'+
'			if (uClipPlanes>0)			'+
'			{							'+
'				if (dot(vXYZT,uClipPlane[0])<0.0) discard;'+
'				if (uClipPlanes>1)		'+
'				{						'+
'					if (dot(vXYZT,uClipPlane[1])<0.0) discard;'+
'					if (uClipPlanes>2)	'+
'					{					'+
'						if (dot(vXYZT,uClipPlane[2])<0.0) discard;'+
'					}					'+
'				}						'+
'			}							'+
'			float dist = distance( gl_PointCoord, vec2(0.5) );				'+
//'			float alpha = 1.0;'+
'			if (uPointSize>3.5)										'+
'			{	if (dist > 0.5) discard;										'+
//'				alpha = 1.0 - smoothstep(0.5*(uPointSize-2.0)/uPointSize,0.5,dist);					'+
'			}'+
'			vec4 color;														'+
'			if (uTexture)													'+
'				color = texture2D(uSampler,vTexCoord);						'+
'			else															'+
'				color = vec4(vColor,1.0);									'+
'			float diffLight = uLight?abs(vNormal.z):1.0;					'+
//'			gl_FragColor = vec4((diffLight*0.8+0.2)*color.rgb,color.a*alpha);		'+
'			gl_FragColor = vec4((diffLight*0.8+0.2)*color.rgb,color.a);		'+
'		}																	';


var vsSourceSelect = 
'	uniform mat4 uProjectionMatrix;	'+
'	uniform mat4 uViewMatrix;		'+
'	uniform mat4 uModelMatrix;		'+
'	uniform float uPointSize;		'+
'	attribute vec3 aXYZ;			'+
'	varying   vec4 vXYZT;			'+
'	attribute vec3 aColor;			'+
'	varying   vec3 vColor;			'+
'	void main ()					'+
'	{								'+
'		vColor = aColor;			'+
'		vXYZT =  vec4(aXYZ,1);	'+
'		gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aXYZ,1);	'+
'		gl_PointSize = uPointSize;	'+
'	}								';

var fsSourceSelect =	
'	precision mediump float;	'+
'	uniform int uClipPlanes;	'+
'	uniform vec4 uClipPlane[3];	'+
'	varying vec3 vColor;		'+
'	varying vec4 vXYZT;			'+
'	void main( )				'+
'	{							'+
'		if (uClipPlanes>0)		'+
'		{						'+
'			if (dot(vXYZT,uClipPlane[0])<0.0) discard;'+
'			if (uClipPlanes>1)	'+
'			{					'+
'				if (dot(vXYZT,uClipPlane[1])<0.0) discard;'+
'				if (uClipPlanes>2)'+
'				{				'+
'					if (dot(vXYZT,uClipPlane[2])<0.0) discard;'+
'				}				'+
'			}					'+
'		}						'+
'		gl_FragColor = vec4(vColor,1.0);'+
'	}							';


//===================================================
//
// SUICA OBJECT
//
//===================================================
var Suica = function( canvasId )
{
	// if no canvasId - use the first canvas
	if (!canvasId)
	{
		var cvx;
		var cvxs = document.getElementsByTagName('canvas');
		if (!cvxs.length)
		{	// no canvas? create one
			cvx = document.createElement('canvas');
			document.body.appendChild(cvx);
		}
		else
			cvx = cvxs[0];
		
		// if no Id, create id
		if (!cvx.id) cvx.id = 'suica_canvas';

		canvasId = cvx.id;
	}
	
	this.gl = Suica.getContext(canvasId,{
				//preserveDrawingBuffer: true,
				//premultipliedAlpha: false,
				antialias: true,
				alpha: true,
			});
	this.shaderProgram = Suica.getProgram(this.gl,vsSource,fsSource);
	this.shaderProgramPoints = Suica.getProgram(this.gl,vsSource,fsSourcePoints);
	this.shaderProgramSelect = Suica.getProgram(this.gl,vsSourceSelect,fsSourceSelect);

	this.viewMatrix = this.identityMatrix();
	this.modelMatrix = this.identityMatrix();
	this.projectionMatrix = this.identityMatrix();

	this.useShader(this.shaderProgram);

	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enableVertexAttribArray(this.aXYZ);
	this.gl.disable(this.gl.CULL_FACE);
	this.gl.cullFace(this.gl.BACK);

	
	this.newModelMatrix = true;
	this.modelMatrixStack = [];
	this.normalMatrix = new Float32Array(9);

	this.perspective(30,1,40000);
	this.lookAt([100*Math.cos(Math.PI/6),100*Math.sin(Math.PI/6),30],[0,0,0], [0,0,1]);

	this.demoViewPoint = null;
	this.backgroundColor = [1,1,1];

	this.nextFrame = null;
	
	Suica.contextList.push(this);
	Suica.lastContext = this;

	this.renderMode = Suica.ALL;
	this.hasPoints = false; // temporary flag while drawing
	
	this.objectList = [];	// local list of all context objects
}

// switch shaders
Suica.prototype.useShader = function(shader)
{
	if (shader==this.shaderProgram)
	{
		this.uProjectionMatrix	= this.gl.getUniformLocation(this.shaderProgram,"uProjectionMatrix");
		this.uViewMatrix		= this.gl.getUniformLocation(this.shaderProgram,"uViewMatrix");
		this.uModelMatrix		= this.gl.getUniformLocation(this.shaderProgram,"uModelMatrix");
		this.uNormalMatrix		= this.gl.getUniformLocation(this.shaderProgram,"uNormalMatrix");
		this.uUseNormal			= this.gl.getUniformLocation(this.shaderProgram,"uUseNormal");
		this.uLight				= this.gl.getUniformLocation(this.shaderProgram,"uLight");
		this.uPointSize			= this.gl.getUniformLocation(this.shaderProgram,"uPointSize");
		this.uTexture			= this.gl.getUniformLocation(this.shaderProgram,"uTexture");
		this.uSampler			= this.gl.getUniformLocation(this.shaderProgram,"uSampler");
		this.uTexScale			= this.gl.getUniformLocation(this.shaderProgram,"uTexScale");
		this.uTexOffset			= this.gl.getUniformLocation(this.shaderProgram,"uTexOffset");
		this.uClipPlanes		= this.gl.getUniformLocation(this.shaderProgram,"uClipPlanes");
		this.uClipPlane			= this.gl.getUniformLocation(this.shaderProgram,"uClipPlane");
		this.aXYZ				= this.gl.getAttribLocation(this.shaderProgram,"aXYZ");
		this.aNormal			= this.gl.getAttribLocation(this.shaderProgram,"aNormal");
		this.aColor				= this.gl.getAttribLocation(this.shaderProgram,"aColor");
		this.aTexCoord			= this.gl.getAttribLocation(this.shaderProgram,"aTexCoord");

		this.gl.useProgram(shader);
		this.gl.uniform1i(this.uUseNormal,false);
		this.gl.uniformMatrix4fv(this.uProjectionMatrix,false,this.projectionMatrix);
		this.gl.uniformMatrix4fv(this.uViewMatrix,false,this.viewMatrix);
		this.gl.uniformMatrix4fv(this.uModelMatrix,false,this.modelMatrix);

		Suica.normalRender = true;
		return;
	}

	if (shader==this.shaderProgramPoints)
	{
		this.uProjectionMatrix	= this.gl.getUniformLocation(this.shaderProgramPoints,"uProjectionMatrix");
		this.uViewMatrix		= this.gl.getUniformLocation(this.shaderProgramPoints,"uViewMatrix");
		this.uModelMatrix		= this.gl.getUniformLocation(this.shaderProgramPoints,"uModelMatrix");
		this.uNormalMatrix		= this.gl.getUniformLocation(this.shaderProgramPoints,"uNormalMatrix");
		this.uUseNormal			= this.gl.getUniformLocation(this.shaderProgramPoints,"uUseNormal");
		this.uLight				= this.gl.getUniformLocation(this.shaderProgramPoints,"uLight");
		this.uPointSize			= this.gl.getUniformLocation(this.shaderProgramPoints,"uPointSize");
		this.uTexture			= this.gl.getUniformLocation(this.shaderProgramPoints,"uTexture");
		this.uSampler			= this.gl.getUniformLocation(this.shaderProgramPoints,"uSampler");
		this.uTexScale			= this.gl.getUniformLocation(this.shaderProgramPoints,"uTexScale");
		this.uTexOffset			= this.gl.getUniformLocation(this.shaderProgramPoints,"uTexOffset");
		this.uClipPlanes		= this.gl.getUniformLocation(this.shaderProgramPoints,"uClipPlanes");
		this.uClipPlane			= this.gl.getUniformLocation(this.shaderProgramPoints,"uClipPlane");
		this.aXYZ				= this.gl.getAttribLocation(this.shaderProgramPoints,"aXYZ");
		this.aNormal			= this.gl.getAttribLocation(this.shaderProgramPoints,"aNormal");
		this.aColor				= this.gl.getAttribLocation(this.shaderProgramPoints,"aColor");
		this.aTexCoord			= this.gl.getAttribLocation(this.shaderProgramPoints,"aTexCoord");

		this.gl.useProgram(shader);
		this.gl.uniform1i(this.uUseNormal,false);
		this.gl.uniformMatrix4fv(this.uProjectionMatrix,false,this.projectionMatrix);
		this.gl.uniformMatrix4fv(this.uViewMatrix,false,this.viewMatrix);
		this.gl.uniformMatrix4fv(this.uModelMatrix,false,this.modelMatrix);

		Suica.normalRender = true;
		return;
	}

	if (shader==this.shaderProgramSelect)
	{
		this.gl.disableVertexAttribArray(this.aTexCoord);
		this.gl.disableVertexAttribArray(this.aNormal);

		this.uProjectionMatrix	= this.gl.getUniformLocation(this.shaderProgramSelect,"uProjectionMatrix");
		this.uViewMatrix		= this.gl.getUniformLocation(this.shaderProgramSelect,"uViewMatrix");
		this.uModelMatrix		= this.gl.getUniformLocation(this.shaderProgramSelect,"uModelMatrix");
		this.uPointSize			= this.gl.getUniformLocation(this.shaderProgramSelect,"uPointSize");
		this.uClipPlanes		= this.gl.getUniformLocation(this.shaderProgramSelect,"uClipPlanes");
		this.uClipPlane			= this.gl.getUniformLocation(this.shaderProgramSelect,"uClipPlane");
		this.aXYZ				= this.gl.getAttribLocation(this.shaderProgramSelect,"aXYZ");
		this.aColor				= this.gl.getAttribLocation(this.shaderProgramSelect,"aColor");

		this.gl.useProgram(this.shaderProgramSelect);
		this.gl.uniformMatrix4fv(this.uProjectionMatrix,false,this.projectionMatrix);
		this.gl.uniformMatrix4fv(this.uViewMatrix,false,this.viewMatrix);
		this.gl.uniformMatrix4fv(this.uModelMatrix,false,this.modelMatrix);

		Suica.normalRender = false;
		return;
	}
	
	console.log('suica.js: useShader(): invalid shader');
}

Suica.contextList = [];	// global list of all SUICA contexts
Suica.lastContext = null;
Suica.startTime = (new Date()).getTime(); // SUICA start time (in ms)
Suica.time = 0;
Suica.dTime = 0;
Suica.FLOATS = Float32Array.BYTES_PER_ELEMENT; // should be 4

Suica.normalRender = true; // false = render for object selection

Suica.POINT = 1;
Suica.LINE = 2;
Suica.SOLID = 3;
Suica.ALL = 4;
Suica.NONPOINT = 5;

Suica.PRECISION = 48;
Suica.id = 0;

Suica.getContext = function(canvasId)
{
	var canvas = document.getElementById(canvasId);
	if (!canvas)
	{
		alert('Не е намерен елемент canvas с id='+canvasId+' [getContext]');
		return null;
	}
	canvas.addEventListener('webglcontextlost',function(event){event.preventDefault();},false);
	canvas.addEventListener('webglcontextrestored',function(event){console.log('Boo!');},false);

	var context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
	if (!context)
	{
		alert('Не е създаден графичен контекст [getContext]');
	}
	
	return context;
}


Suica.getShader = function(gl,source,type)
{
	var shader = gl.createShader(type);

	gl.shaderSource(shader,source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader,gl.COMPILE_STATUS))
	{
		alert(gl.getShaderInfoLog(shader));
		return null;
	}
	
	return shader;
}


Suica.getProgram = function(gl,vsSource,fsSource)
{
	var vShader = Suica.getShader(gl,vsSource,gl.VERTEX_SHADER);
	var fShader = Suica.getShader(gl,fsSource,gl.FRAGMENT_SHADER);

	if (!vShader || !fShader) {return null;}
	
	var shaderProgram = gl.createProgram();
	gl.bindAttribLocation(shaderProgram,0,"aXYZ");

	gl.attachShader(shaderProgram,vShader);
	gl.attachShader(shaderProgram,fShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram,gl.LINK_STATUS))
	{
		alert(gl.getProgramInfoLog(shaderProgram));
		return null;
	}

	return shaderProgram;
}


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
