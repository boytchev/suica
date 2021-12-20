//===================================================
//
// Library:	Suica 1.0
// Module:	Cone (Pyramid, Cone, Conoid)
// License:	Creative Commons 3.0 share alike, non-commercial
//
// {<object> =} new Suica.Pyramid(<center>,<radius>,<height>,<count>)
//		<pyramid>.center = <vector>
//		<pyramid>.radius = <vector>
//		<pyramid>.height = <vector>
//		<pyramid>.count  = <number>
//		<pyramid>.origin = <vector>				default:[0,0,0]
//		<pyramid>.color  = <vector>				default:[1,0,0.5]
//		<pyramid>.mode   = <POINT|LINE|SOLID>	default:Suica.SOLID
//		<pyramid>.light  = <boolean>			default:true
//		<pyramid>.visible = <boolean>			default:true
//		<pyramid>.hollow = <boolean>			default:false
//		<pyramid>.pointSize = <number>			default:3.0
//		<pyramid>.focus	 = <vector>				default:[0,0,1]
//		<pyramid>.spin	 = <number>				default:0
//		<pyramid>.image	 = <image>
//		<pyramid>.drawObject()
//		<pyramid>.custom(<properties>)
//
// {<object> =} pyramid(<center>,<radius>,<height>,<count>)
// {<object> =} cone(<center>,<radius>,<height>)
// {<object> =} conoid(<center>,<radii>,<height>)
//===================================================


Suica.PRECISION_CONE = 8*Math.floor(Suica.PRECISION/8);	// multiple of 8
Suica.PRECISION_CONE_WF = Suica.PRECISION_CONE/8;	// 8 wireframe sections

Suica.SolidPyramidMesh = function(ctx,count)
{
	var gl = ctx.gl;
	
	var data = [];
	var a = 0;
	var da = 2*Math.PI/count;
	var t = 0;
	var dt = 1/count;
	
	for( var i=0; i<count; i++ )
	{
		var c1 = Math.cos(a);
		var s1 = Math.sin(a);
		var c2 = Math.cos(a+da/2);
		var s2 = Math.sin(a+da/2);
		var c3 = Math.cos(a+da);
		var s3 = Math.sin(a+da);

		data.push(0,0,1,			t+dt/2,1,	c2,s2,1);	// top vertex
		
		data.push(0.5*c1,0.5*s1,0,	t,0);	// bottom periphery
		if (count==Suica.PRECISION_CONE) data.push(c1,s1,0); else data.push(c2,s2,0);

		data.push(0.5*c3,0.5*s3,0,	t+dt,0);	// bottom periphery
		if (count==Suica.PRECISION_CONE) data.push(c3,s3,0); else data.push(c2,s2,0);

		a += da;
		t += dt;
	}
	a = 0;
	t = 0;
	for( var i=0; i<count; i++ )
	{
		var c1 = Math.cos(a);
		var s1 = Math.sin(a);
		var c3 = Math.cos(a+da);
		var s3 = Math.sin(a+da);
		data.push(0.5*c3,0.5*s3,0,	t+dt,0,		0,0,-1);// bottom periphery
		data.push(0.5*c1,0.5*s1,0,	t,0,		0,0,-1);// bottom periphery
		data.push(0,0,0,			t+dt/2,1,	0,0,-1);// bottom center
		a += da;
		t += dt;
	}
	
	var mesh = new Float32Array(data);

	this.ctx = ctx;
	this.length = mesh.length;
	this.buffer = gl.createBuffer();
	this.count = count;
	gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
	gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);
}

Suica.SolidPyramidMesh.prototype.drawMesh = function(obj)
{
	var gl = this.ctx.gl;
	var hasTexture = (obj.image && Suica.texturesReady());

	gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
	gl.enableVertexAttribArray(this.ctx.aXYZ);
    gl.vertexAttribPointer(this.ctx.aXYZ,3, gl.FLOAT,false,8*Suica.FLOATS,0*Suica.FLOATS);

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
	gl.drawArrays(gl.TRIANGLES,0,this.count*3); // draw side surface

	if (!obj.hollow)
	{
		if (hasTexture && obj.image.baseScale && Suica.normalRender)
		{
			gl.uniform2fv(this.ctx.uTexScale,obj.image.baseScale);
		}
		gl.drawArrays(gl.TRIANGLES,this.count*3,this.count*3); // draw base
	}
	gl.disable(gl.POLYGON_OFFSET_FILL);

	if (Suica.normalRender)
	{
		if (hasTexture)
		{
			gl.bindTexture(gl.TEXTURE_2D,null);
			gl.uniform1i(this.ctx.uTexture,false);
			gl.disableVertexAttribArray(this.ctx.aTexCoord);
		}
	}
}

Suica.WireframePyramidMesh = function(ctx,count)
{
	var gl = ctx.gl;
	
	var data = [];
	var a = 0;
	var da = 2*Math.PI/count;
	data.push(0,0,1);
	for( var i=0; i<count; i++ )
	{
		data.push(0.5*Math.cos(a),0.5*Math.sin(a),0);
		a += da;
	}
	
	this.edgeCount = (count==Suica.PRECISION_CONE)?Suica.PRECISION_CONE_WF:count;
	var a = 0;
	for( var i=0; i<this.edgeCount; i++ )
	{
		var c = Math.cos(a);
		var s = Math.sin(a);
		data.push(0.5*c,0.5*s,0);
		data.push(0,0,1);
		a += da*count/this.edgeCount;
	}
	
	var mesh = new Float32Array(data);

	this.ctx = ctx;
	this.length = mesh.length;
	this.buffer = gl.createBuffer();
	this.count = count;
	gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
	gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);
}

Suica.WireframePyramidMesh.prototype.drawMesh = function(obj)
{
	var gl = this.ctx.gl;
	
	gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
	gl.enableVertexAttribArray(this.ctx.aXYZ);

	if (Suica.normalRender)
	{
		gl.uniform1i(this.ctx.uLight,false);
		gl.disableVertexAttribArray(this.ctx.aNormal);
	}
	
	if (obj.mode==Suica.POINT)
	{
		gl.uniform1f(this.ctx.uPointSize,obj.pointSize);
		gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,3*Suica.FLOATS,0*Suica.FLOATS);
		gl.drawArrays(gl.POINTS,0,this.count+1);
	}
	else
	{
		gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,3*Suica.FLOATS,0*Suica.FLOATS);
		gl.drawArrays(gl.LINE_LOOP,1,this.count);
		gl.drawArrays(gl.LINES,this.count+1,this.edgeCount*2);
	}
}


Suica.Pyramid = function(center,radius,height,count)
{
	Suica.Object.apply(this,arguments);
	this.color = [1,0,0.5];
	this.center = center;
	if (radius) this.radius = radius;
	this.height = height;
	this.count = count?count:Suica.PRECISION_CONE;

	if (!this.ctx.wireframePyramidMesh)
		this.ctx.wireframePyramidMesh = [];
	if (!this.ctx.wireframePyramidMesh[count])
		this.ctx.wireframePyramidMesh[count] = new Suica.WireframePyramidMesh(this.ctx,count);

	if (!this.ctx.solidPyramidMesh)
		this.ctx.solidPyramidMesh = [];
	if (!this.ctx.solidPyramidMesh[count])
		this.ctx.solidPyramidMesh[count] = new Suica.SolidPyramidMesh(this.ctx,count);

	this.drawPoint = this.ctx.wireframePyramidMesh[count];
	this.drawLine = this.ctx.wireframePyramidMesh[count];
	this.drawSolid = this.ctx.solidPyramidMesh[count];
}

Suica.Pyramid.prototype = Object.create(Suica.Object.prototype);

Suica.Pyramid.prototype.getSizes = function()
{
	return [2*this.radius,2*this.radius,this.height];
}

Suica.Cone = function(center,radius,height)
{
	Suica.Pyramid.call(this,center,radius,height,Suica.PRECISION_CONE);
}

Suica.Cone.prototype = Object.create(Suica.Pyramid.prototype);

Suica.Cone.prototype.getSizes = function()
{
	return [2*this.radius,2*this.radius,this.height];
}

Suica.Conoid = function(center,radii,height)
{
	Suica.Pyramid.call(this,center,undefined,height,Suica.PRECISION_CONE);
	this.radii = radii;
}

Suica.Conoid.prototype = Object.create(Suica.Pyramid.prototype);

Suica.Conoid.prototype.getSizes = function()
{
	return [2*this.radii[0],2*this.radii[1],this.height];
}

function pyramid(center,radius,height,count)
{
	return new Suica.Pyramid(center,radius,height,count);
}

function cone(center,radius,height)
{
	return new Suica.Cone(center,radius,height);
}

function conoid(center,radii,height)
{
	return new Suica.Conoid(center,radii,height);
}
