//===================================================
//
// Library:	Suica 1.0
// Module:	Cylinder (Prism, Cylinder, Cylindroid)
// License:	Creative Commons 3.0 share alike, non-commercial
//
// {<object> =} new Suica.Prism(<center>,<radius>,<height>,<count>)
//		<prism>.center = <vector>
//		<prism>.radius = <vector>
//		<prism>.height = <vector>
//		<prism>.count = <vector>
//		<prism>.origin = <vector>				default:[0,0,0]
//		<prism>.color  = <vector>				default:[1,0,0.5]
//		<prism>.mode   = <POINT|LINE|SOLID>		default:Suica.SOLID
//		<prism>.light  = <boolean>				default:true
//		<prism>.visible = <boolean>			default:true
//		<prism>.hollow = <boolean>				default:false
//		<prism>.pointSize = <number>			default:3.0
//		<prism>.focus	= <vector>				default:[0,0,1]
//		<prism>.spin		= <number>			default:0
//		<prism>.image	= <image>
//		<prism>.drawObject()
//		<prism>.custom(<properties>)
//
// {<object> =} prism(<center>,<radius>,<height>,<count>)
// {<object> =} cylinder(<center>,<radius>,<height>)
// {<object> =} cylindroid(<center>,<radii>,<height>)
//===================================================


Suica.PRECISION_CYLINDER = 8*Math.floor(Suica.PRECISION/8);	// multiple of 8
Suica.PRECISION_CYLINDER_WF = Suica.PRECISION_CYLINDER/8;	// 8 wireframe sections

Suica.SolidPrismMesh = function(ctx,count)
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
		var nc1,nc3,ns1,ns3;
		if (count==Suica.PRECISION_CYLINDER)
			{ nc1=c1; nc3=c3; ns1=s1; ns3=s3; }
		else
			{ nc1=c2; nc3=c2; ns1=s2; ns3=s2; }

		data.push(0.5*c1,0.5*s1,1,	t,1,	nc1,ns1,0);	// top periphery
		data.push(0.5*c1,0.5*s1,0,	t,0,	nc1,ns1,0);	// bottom periphery
		data.push(0.5*c3,0.5*s3,0,	t+dt,0,	nc3,ns3,0);	// bottom periphery
		data.push(0.5*c1,0.5*s1,1,	t,1,	nc1,ns1,0);	// top periphery
		data.push(0.5*c3,0.5*s3,0,	t+dt,0,	nc3,ns3,0);	// bottom periphery
		data.push(0.5*c3,0.5*s3,1,	t+dt,1,	nc3,ns3,0);	// top periphery
		a += da;
		t += dt;
	}

	// top base
	a = 0;
	t = 0;
	for( var i=0; i<count; i++ )
	{
		var c1 = Math.cos(a);
		var s1 = Math.sin(a);
		var c3 = Math.cos(a+da);
		var s3 = Math.sin(a+da);
		data.push(0.5*c1,0.5*s1,1,	t,0,		0,0,1);// bottom periphery
		data.push(0.5*c3,0.5*s3,1,	t+dt,0,		0,0,1);// bottom periphery
		data.push(0,0,1,			t+dt/2,1,	0,0,1);// bottom center
		a += da;
		t += dt;
	}
	// bottom base
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
		data.push(0,0,0,	t+dt/2,1,	0,0,-1);// bottom center
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

Suica.SolidPrismMesh.prototype.drawMesh = function(obj,count)
{
	var gl = this.ctx.gl;
	var hasTexture = (obj.image && Suica.texturesReady() && Suica.normalRender);

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
	gl.drawArrays(gl.TRIANGLES,0,2*3*this.count); // draw side surface
	if (!obj.hollow)
	{
		if (hasTexture && obj.image.baseScale)
		{
			gl.uniform2fv(this.ctx.uTexScale,obj.image.baseScale);
		}
		gl.drawArrays(gl.TRIANGLES,2*3*this.count,3*this.count); // draw top base
		gl.drawArrays(gl.TRIANGLES,3*3*this.count,3*this.count); // draw bottom base
	}
	gl.disable(gl.POLYGON_OFFSET_FILL);

	if (hasTexture)
	{
		gl.bindTexture(gl.TEXTURE_2D,null);
		gl.uniform1i(this.ctx.uTexture,false);
		gl.disableVertexAttribArray(this.ctx.aTexCoord);
	}
}

Suica.WireframePrismMesh = function(ctx,count)
{
	var gl = ctx.gl;
	
	var data = [];
	var a = 0;
	var da = 2*Math.PI/count;
	for( var i=0; i<count; i++ )
	{
		data.push(0.5*Math.cos(a),0.5*Math.sin(a),0);
		a += da;
	}
	for( var i=0; i<count; i++ )
	{
		data.push(0.5*Math.cos(a),0.5*Math.sin(a),1);
		a += da;
	}

	this.edgeCount = (count==Suica.PRECISION_CYLINDER)?Suica.PRECISION_CYLINDER_WF:count;
	for( var i=0; i<this.edgeCount; i++ )
	{
		var c = Math.cos(a);
		var s = Math.sin(a);
		data.push(0.5*c,0.5*s,0);
		data.push(0.5*c,0.5*s,1);
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

Suica.WireframePrismMesh.prototype.drawMesh = function(obj)
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
		gl.drawArrays(gl.POINTS,0,2*this.count);
	}
	else
	{
		gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,3*Suica.FLOATS,0*Suica.FLOATS);
		gl.drawArrays(gl.LINE_LOOP,0,this.count);
		gl.drawArrays(gl.LINE_LOOP,this.count,this.count);
		gl.drawArrays(gl.LINES,2*this.count,this.edgeCount*2);
	}
}


Suica.Prism = function(center,radius,height,count)
{
	Suica.Object.apply(this,arguments);
	this.color = [1,0,0.5];
	this.center = center;
	if (radius) this.radius = radius;
	this.height = height;
	this.count = count?count:Suica.PRECISION_CYLINDER;

	if (!this.ctx.wireframePrismMesh)
		this.ctx.wireframePrismMesh = [];
	if (!this.ctx.wireframePrismMesh[count])
		this.ctx.wireframePrismMesh[count] = new Suica.WireframePrismMesh(this.ctx,count);

	if (!this.ctx.solidPrismMesh)
		this.ctx.solidPrismMesh = [];
	if (!this.ctx.solidPrismMesh[count])
		this.ctx.solidPrismMesh[count] = new Suica.SolidPrismMesh(this.ctx,count);

	this.drawPoint = this.ctx.wireframePrismMesh[count];
	this.drawLine = this.ctx.wireframePrismMesh[count];
	this.drawSolid = this.ctx.solidPrismMesh[count];
}

Suica.Prism.prototype = Object.create(Suica.Object.prototype);

Suica.Prism.prototype.getSizes = function()
{
	return [2*this.radius,2*this.radius,this.height];
}

Suica.Cylinder = function(center,radius,height)
{
	Suica.Prism.call(this,center,radius,height,Suica.PRECISION_CYLINDER);
}

Suica.Cylinder.prototype = Object.create(Suica.Object.prototype);

Suica.Cylinder.prototype.getSizes = function()
{
	return [2*this.radius,2*this.radius,this.height];
}

Suica.Cylindroid = function(center,radii,height)
{
	Suica.Cylinder.call(this,center,undefined,height,Suica.PRECISION_CYLINDER);
	this.radii = radii;
}

Suica.Cylindroid.prototype = Object.create(Suica.Prism.prototype);

Suica.Cylindroid.prototype.getSizes = function()
{
	return [2*this.radii[0],2*this.radii[1],this.height];
}

function prism(center,radius,height,count)
{
	return new Suica.Prism(center,radius,height,count);
}

function cylinder(center,radius,height)
{
	return new Suica.Cylinder(center,radius,height);
}

function cylindroid(center,radii,height)
{
	return new Suica.Cylindroid(center,radii,height);
}
