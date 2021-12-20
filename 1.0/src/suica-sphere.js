//===================================================
//
// Library:	Suica 1.0
// Module:	Sphere (Spheroid)
// License:	Creative Commons 3.0 share alike, non-commercial
//
// {<object> =} new Suica.Sphere(<center>,<radius>)
//		<sphere>.center = <vector>
//		<sphere>.radius = <number>
//		<sphere>.height = <vector>
//		<sphere>.count = <vector>
//		<sphere>.origin = <vector>				default:[0,0,0]
//		<sphere>.color  = <vector>				default:[1,0,0.5]
//		<sphere>.mode   = <POINT|LINE|SOLID>		default:Suica.SOLID
//		<sphere>.light  = <boolean>				default:true
//		<sphere>.visible = <boolean>			default:true
//		<sphere>.hollow = <boolean>				default:false
//		<sphere>.pointSize = <number>			default:3.0
//		<sphere>.focus	= <vector>				default:[0,0,1]
//		<sphere>.spin		= <number>			default:0
//		<sphere>.image	= <image>
//		<sphere>.drawObject()
//		<sphere>.custom(<properties>)
//
// {<object> =} sphere(<center>,<radius>)
// {<object> =} spheroid(<center>,<radii>)
//===================================================


Suica.PRECISION_SPHERE_U = 4*Math.floor(Suica.PRECISION/4);	// multiple of 4
Suica.PRECISION_SPHERE_V = Suica.PRECISION_SPHERE_U/2;
Suica.PRECISION_SPHERE_WF_U = Suica.PRECISION_SPHERE_U/4;	// 48/4 wireframe sections
Suica.PRECISION_SPHERE_WF_V = Suica.PRECISION_SPHERE_WF_U/2;

Suica.SolidSphereMesh = function(ctx)
{
	var gl = ctx.gl;
	
	var data = [];

	var b = -Math.PI/2;
	var db = Math.PI/Suica.PRECISION_SPHERE_V;
	var tv = 0;
	var dtv = 1/Suica.PRECISION_SPHERE_V;

	for( var j=0; j<Suica.PRECISION_SPHERE_V; j++ )
	{
		var a = 0;
		var da = 2*Math.PI/Suica.PRECISION_SPHERE_U;
		var tu = 0;
		var dtu = 1/Suica.PRECISION_SPHERE_U;
	
		for( var i=0; i<Suica.PRECISION_SPHERE_U+1; i++ )
		{
			var x = 0.5*Math.cos(a)*Math.cos(b+db);
			var y = 0.5*Math.sin(a)*Math.cos(b+db);
			var z = 0.5*Math.sin(b+db); 

			data.push(x,y,z, tu,tv+dtv,	x,y,z);

			x = 0.5*Math.cos(a)*Math.cos(b);
			y = 0.5*Math.sin(a)*Math.cos(b);
			z = 0.5*Math.sin(b); 

			data.push(x,y,z, tu,tv,	x,y,z);

			a += da;
			tu += dtu;
		}

		b += db;
		tv += dtv;
	}

	var mesh = new Float32Array(data);

	this.ctx = ctx;
	this.length = mesh.length;
	this.buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
	gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);
}

Suica.SolidSphereMesh.prototype.drawMesh = function(obj)
{
	var gl = this.ctx.gl;
	var hasTexture = (obj.image && Suica.texturesReady());

	gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
	gl.enableVertexAttribArray(this.ctx.aXYZ);
    gl.vertexAttribPointer(this.ctx.aXYZ,3,     gl.FLOAT,false,8*Suica.FLOATS,0*Suica.FLOATS);

	if (Suica.normalRender)
	{
		gl.uniform1i(this.ctx.uLight,obj.light);
		gl.uniform1i(this.ctx.uTexture,obj.image!=null);

		gl.enableVertexAttribArray(this.ctx.aNormal);
		gl.vertexAttribPointer(this.ctx.aNormal,3,     gl.FLOAT,false,8*Suica.FLOATS,5*Suica.FLOATS);

		if (hasTexture)
		{
			gl.enableVertexAttribArray(this.ctx.aTexCoord);
			gl.vertexAttribPointer(this.ctx.aTexCoord,2,gl.FLOAT,false,8*Suica.FLOATS,3*Suica.FLOATS);

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D,obj.image.texture);
			gl.uniform1i(this.ctx.uTexture,true);
			gl.uniform2fv(this.ctx.uTexScale,obj.image.scale);
			gl.uniform2fv(this.ctx.uTexOffset,obj.image.offset);
		}
	}
	
	gl.enable(gl.POLYGON_OFFSET_FILL);
	gl.polygonOffset(1,0);

	if (obj.radii && Suica.normalRender)
	{
		this.ctx.transposeInverse();
		gl.uniformMatrix3fv(this.ctx.uNormalMatrix,false,this.ctx.normalMatrix);
		gl.uniform1i(this.ctx.uUseNormal,true);
	}
	
	for( var j=0; j<Suica.PRECISION_SPHERE_V; j++ )
	{
		gl.drawArrays(gl.TRIANGLE_STRIP,(2*Suica.PRECISION_SPHERE_U+2)*j,2*Suica.PRECISION_SPHERE_U+2); // draw horizontal band
	}
	gl.disable(gl.POLYGON_OFFSET_FILL);

	if (Suica.normalRender)
	{
		gl.uniform1i(this.ctx.uUseNormal,false);
		
		if (hasTexture)
		{
			gl.bindTexture(gl.TEXTURE_2D,null);
			gl.uniform1i(this.ctx.uTexture,false);
			gl.disableVertexAttribArray(this.ctx.aTexCoord);
		}
	}
}

Suica.WireframeSphereMesh = function(ctx)
{
	var gl = ctx.gl;
	
	var data = [];

	var db = Math.PI/(Suica.PRECISION_SPHERE_WF_V+1);
	var b = -Math.PI/2+db;
	for( var j=0; j<Suica.PRECISION_SPHERE_WF_V; j++ )
	{
		var a = 0;
		var da = 2*Math.PI/Suica.PRECISION_SPHERE_WF_U;
		for( var i=0; i<Suica.PRECISION_SPHERE_WF_U+1; i++ )
		{
			var x = 0.5*Math.cos(a)*Math.cos(b);
			var y = 0.5*Math.sin(a)*Math.cos(b);
			var z = 0.5*Math.sin(b); 

			data.push(x,y,z);

			a += da;
		}

		b += db;
	}

	var db = Math.PI/(Suica.PRECISION_SPHERE_WF_V+1);
	var b = -Math.PI/2+db;
	for( var j=0; j<Suica.PRECISION_SPHERE_WF_V; j++ )
	{
		var a = 0;
		var da = 2*Math.PI/Suica.PRECISION_SPHERE_U;
		for( var i=0; i<Suica.PRECISION_SPHERE_U+1; i++ )
		{
			var x = 0.5*Math.cos(a)*Math.cos(b);
			var y = 0.5*Math.sin(a)*Math.cos(b);
			var z = 0.5*Math.sin(b); 

			data.push(x,y,z);

			a += da;
		}

		b += db;
	}

	var a = 0;
	var da = Math.PI/Suica.PRECISION_SPHERE_WF_V;
	for( var i=0; i<Suica.PRECISION_SPHERE_WF_V; i++ )
	{
		var db = 2*Math.PI/Suica.PRECISION_SPHERE_U;
		var b = 0;
		for( var j=0; j<=Suica.PRECISION_SPHERE_U; j++ )
		{
			var x = 0.5*Math.cos(a)*Math.cos(b);
			var y = 0.5*Math.sin(a)*Math.cos(b);
			var z = 0.5*Math.sin(b); 

			data.push(x,y,z);

			b += db;
		}

		a += da;
	}

	var mesh = new Float32Array(data);

	this.ctx = ctx;
	this.length = mesh.length;
	this.buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
	gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);
}

Suica.WireframeSphereMesh.prototype.drawMesh = function(obj)
{
	var gl = this.ctx.gl;
	
	gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
	gl.enableVertexAttribArray(this.ctx.aXYZ);

	if (Suica.normalRender)
	{
		gl.disableVertexAttribArray(this.ctx.aNormal);
		gl.uniform1i(this.ctx.uLight,false);
	}
	
	if (obj.mode==Suica.POINT)
	{
		gl.uniform1f(this.ctx.uPointSize,obj.pointSize);
		gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,3*Suica.FLOATS,0*Suica.FLOATS);
		gl.drawArrays(gl.POINTS,0,(Suica.PRECISION_SPHERE_WF_U+1)*Suica.PRECISION_SPHERE_WF_V);

		//		for( var i=0; i<Suica.PRECISION_SPHERE_WF_V; i++ )
		//	gl.drawArrays(gl.POINTS,(Suica.PRECISION_SPHERE_U+1)*i,Suica.PRECISION_SPHERE_U+1);
		//var n = (Suica.PRECISION_SPHERE_U+1)*Suica.PRECISION_SPHERE_WF_V;
		//for( var i=0; i<Suica.PRECISION_SPHERE_WF_V; i++ )
		//	gl.drawArrays(gl.POINTS,n+(Suica.PRECISION_SPHERE_U+1)*i,Suica.PRECISION_SPHERE_U+1);

	}
	else
	{
		var skipPoints = (Suica.PRECISION_SPHERE_WF_U+1)*Suica.PRECISION_SPHERE_WF_V;
		gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,3*Suica.FLOATS,0*Suica.FLOATS);
		for( var i=0; i<Suica.PRECISION_SPHERE_WF_V; i++ )
			gl.drawArrays(gl.LINE_LOOP,skipPoints+(Suica.PRECISION_SPHERE_U+1)*i,Suica.PRECISION_SPHERE_U+1);
		var n = (Suica.PRECISION_SPHERE_U+1)*Suica.PRECISION_SPHERE_WF_V;
		for( var i=0; i<Suica.PRECISION_SPHERE_WF_V; i++ )
			gl.drawArrays(gl.LINE_LOOP,skipPoints+n+(Suica.PRECISION_SPHERE_U+1)*i,Suica.PRECISION_SPHERE_U+1);
	}
}


Suica.Sphere = function(center,radius)
{
	Suica.Object.apply(this,arguments);
	this.color = [1,0,0.5];
	this.center = center;
	if (radius) this.radius = radius;

	if (!this.ctx.wireframeSphereMesh)
		this.ctx.wireframeSphereMesh = new Suica.WireframeSphereMesh(this.ctx);

	if (!this.ctx.solidSphereMesh)
		this.ctx.solidSphereMesh = new Suica.SolidSphereMesh(this.ctx);

	this.drawPoint = this.ctx.wireframeSphereMesh;
	this.drawLine = this.ctx.wireframeSphereMesh;
	this.drawSolid = this.ctx.solidSphereMesh;
}

Suica.Sphere.prototype = Object.create(Suica.Object.prototype);

Suica.Sphere.prototype.getSizes = function()
{
	return [2*this.radius,2*this.radius,2*this.radius];
}

Suica.Spheroid = function(center,radii)
{
	Suica.Sphere.call(this,center,undefined);
	this.radii = radii;
}

Suica.Spheroid.prototype = Object.create(Suica.Sphere.prototype);

Suica.Spheroid.prototype.getSizes = function()
{
	return [2*this.radii[0],2*this.radii[1],2*this.radii[2]];
}

function sphere(center,radius)
{
	return new Suica.Sphere(center,radius);
}

function spheroid(center,radii)
{
	return new Suica.Spheroid(center,radii);
}
