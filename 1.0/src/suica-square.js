//===================================================
//
// Library:	Suica 1.0
// Module:	Square
// License:	Creative Commons 3.0 share alike, non-commercial
//
// {<object> =} new Suica.Square(<center>,<size>)
//		<square>.center = <vector>
//		<square>.size   = <number>
//		<square>.origin = <vector>				default:[0,0,0]
//		<square>.color  = <vector>				default:[0,0.5,1]
//		<square>.mode   = <POINT|LINE|SOLID>	default:Suica.SOLID
//		<square>.light  = <boolean>				default:true
//		<square>.visible = <boolean>			default:true
//		<square>.pointSize = <number>			default:3.0
//		<square>.focus	= <vector>				default:[0,0,1]
//		<square>.spin	= <number>				default:0
//		<square>.image	= <image>
//		<square>.drawObject()
//		<square>.custom(<properties>)
//
// {<object> =} new Suica.Rectangle(<center>,<sizes>)
//		<square>.sizes   = <vector-2d>
//
// {<object> =} square(<center>,<size>)
// {<object> =} rectangle(<center>,<sizes>)
//===================================================


Suica.SolidSquareMesh = function(ctx)
{
	//	3---2
	//	| / |
	//	0---1

	var gl = ctx.gl;
	
	// normals
	var nZ = [0,0,1];
	// textures
	var t0 = [0,0], t1 = [1,0], t2 = [1,1], t3 = [0,1];
	// vertices
	var	v0 = [+0.5,-0.5,0],	v1 = [+0.5,+0.5,0], 
		v2 = [-0.5,+0.5,0],	v3 = [-0.5,-0.5,0];

	// solid square
	var mesh = new Float32Array([].concat(
		v1,t1,nZ,	v2,t2,nZ,	v0,t0,nZ,
		v0,t0,nZ,	v2,t2,nZ,	v3,t3,nZ,
		[]));

	this.ctx = ctx;
	this.length = mesh.length;
	this.buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
	gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);
}

Suica.SolidSquareMesh.prototype.drawMesh = function(obj)
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
		gl.vertexAttribPointer(this.ctx.aNormal,3,  gl.FLOAT,false,8*Suica.FLOATS,5*Suica.FLOATS);

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
	gl.drawArrays(gl.TRIANGLES,0,this.length/8);
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

Suica.WireframeSquareMesh = function(ctx)
{
	//	3---2
	//	| / |
	//	0---1

	var gl = ctx.gl;
	
	// vertices
	var	v0 = [+0.5,-0.5,0],	v1 = [+0.5,+0.5,0], 
		v2 = [-0.5,+0.5,0],	v3 = [-0.5,-0.5,0];

	// wireframe square
	var mesh = new Float32Array([].concat(v0,v1,v2,v3));
	
	this.ctx = ctx;
	this.length = mesh.length;
	this.buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
	gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);
}

Suica.WireframeSquareMesh.prototype.drawMesh = function(obj)
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
		gl.drawArrays(gl.POINTS,0,4);
	}
	else
	{
		gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,3*Suica.FLOATS,0*Suica.FLOATS);
		gl.drawArrays(gl.LINE_LOOP,0,4);
	}
}


Suica.Square = function(center,size)
{
	Suica.Object.apply(this,arguments);
	this.color = [0,0.5,1];
	this.center = center;
	this.size = size;
	this.hollow = true;
	
	if (!this.ctx.wireframeSquareMesh)
		this.ctx.wireframeSquareMesh = new Suica.WireframeSquareMesh(this.ctx);
	if (!this.ctx.solidSquareMesh)
		this.ctx.solidSquareMesh = new Suica.SolidSquareMesh(this.ctx);

	this.drawPoint = this.ctx.wireframeSquareMesh;
	this.drawLine = this.ctx.wireframeSquareMesh;
	this.drawSolid = this.ctx.solidSquareMesh;
}

Suica.Square.prototype = Object.create(Suica.Object.prototype);

Suica.Square.prototype.getSizes = function()
{
	return [this.size,this.size,this.size];
}

Suica.Rectangle = function(center,sizes)
{
	Suica.Square.apply(this,arguments);
	this.sizes = sizes;
}

Suica.Rectangle.prototype = Object.create(Suica.Square.prototype);

Suica.Rectangle.prototype.getSizes = function()
{
	return [this.sizes[0],this.sizes[1],1];
}

function square(center,size)
{
	return new Suica.Square(center,size);
}

function rectangle(center,sizes)
{
	return new Suica.Rectangle(center,sizes);
}
