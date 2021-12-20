//===================================================
//
// Library:	Suica 1.0
// Module:	Cube
// License:	Creative Commons 3.0 share alike, non-commercial
//
// {<object> =} new Suica.Cube(<center>,<size>)
//		<cube>.center = <vector>
//		<cube>.size   = <number>
//		<cube>.origin = <vector>				default:[0,0,0]
//		<cube>.color  = <vector>				default:[0,0.5,1]
//		<cube>.mode   = <POINT|LINE|SOLID>		default:Suica.SOLID
//		<cube>.light  = <boolean>				default:true
//		<cube>.visible = <boolean>				default:true
//		<cube>.hollow = <boolean>				default:false
//		<cube>.pointSize = <number>				default:3.0
//		<cube>.focus	= <vector>				default:[0,0,1]
//		<cube>.spin		= <number>				default:0
//		<cube>.image	= <image>
//		<cube>.drawObject()
//		<cube>.custom(<properties>)
//
// {<object> =} new Suica.Cuboid(<center>,<sizes>)
//		<cube>.sizes   = <vector>
//
// {<object> =} cube(<center>,<size>)
// {<object> =} cuboid(<center>,<sizes>)
//===================================================


Suica.SolidCubeMesh = function(ctx)
{
	//	  7-------6				Texture:
	//	 /|		 /|				
	//	4-------5 |				3---2
	//	| 3-----|-2				| / |
	//	|/	  	|/				0---1
	//	0-------1

	var gl = ctx.gl;
	
	// normals
	var nX = [+1,0,0], nY = [0,+1,0], nZ = [0,0,+1];
	var nx = [-1,0,0], ny = [0,-1,0], nz = [0,0,-1];
	// textures
	var t0 = [0,0], t1 = [1,0], t2 = [1,1], t3 = [0,1];
	// vertices
	var	v0 = [+0.5,-0.5,-0.5], v4 = [+0.5,-0.5,+0.5],
		v1 = [+0.5,+0.5,-0.5], v5 = [+0.5,+0.5,+0.5],
		v2 = [-0.5,+0.5,-0.5], v6 = [-0.5,+0.5,+0.5],
		v3 = [-0.5,-0.5,-0.5], v7 = [-0.5,-0.5,+0.5];

	var mesh = new Float32Array([].concat(
	// solid cube
		v0,t0,nX,	v1,t1,nX,	v4,t3,nX,	v4,t3,nX,	v1,t1,nX,	v5,t2,nX,	//front  X+
		v3,t1,nx,	v7,t2,nx,	v2,t0,nx,	v2,t0,nx,	v7,t2,nx,	v6,t3,nx,	//back   X-
		v5,t3,nY,	v1,t0,nY,	v6,t2,nY,	v6,t2,nY,	v1,t0,nY,	v2,t1,nY,	//right  Y+
		v7,t3,ny,	v3,t0,ny,	v4,t2,ny,	v4,t2,ny,	v3,t0,ny,	v0,t1,ny,	//left   Y-
		v4,t2,nZ,	v5,t3,nZ,	v7,t1,nZ,	v7,t1,nZ,	v5,t3,nZ,	v6,t0,nZ,	//top    Z+
		v0,t3,nz,	v3,t0,nz,	v1,t2,nz,	v1,t2,nz,	v3,t0,nz,	v2,t1,nz,	//bottom Z-
	[]));
	
	this.ctx = ctx;
	this.length = mesh.length;
	this.buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
	gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);
}

Suica.SolidCubeMesh.prototype.drawMesh = function(obj)
{
	var gl = this.ctx.gl;

	gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);

	gl.enableVertexAttribArray(this.ctx.aXYZ);
	gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,8*Suica.FLOATS,0*Suica.FLOATS);

	if (Suica.normalRender)
	{
		var hasTexture = (obj.image && Suica.texturesReady());
		gl.uniform1i(this.ctx.uLight,obj.light);
		gl.uniform1i(this.ctx.uTexture,obj.image!=null);


		gl.enableVertexAttribArray(this.ctx.aNormal);
		gl.vertexAttribPointer(this.ctx.aNormal,3,gl.FLOAT,false,8*Suica.FLOATS,5*Suica.FLOATS);

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
	gl.drawArrays(gl.TRIANGLES,0,this.length/8-(obj.hollow?12:0));
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

Suica.WireframeCubeMesh = function(ctx)
{
	//	  7-------6	
	//	 /|		 /|				
	//	4-------5 |	
	//	| 3-----|-2
	//	|/	  	|/
	//	0-------1

	var gl = ctx.gl;
	
	// vertices
	var	v0 = [+0.5,-0.5,-0.5], v4 = [+0.5,-0.5,+0.5],
		v1 = [+0.5,+0.5,-0.5], v5 = [+0.5,+0.5,+0.5],
		v2 = [-0.5,+0.5,-0.5], v6 = [-0.5,+0.5,+0.5],
		v3 = [-0.5,-0.5,-0.5], v7 = [-0.5,-0.5,+0.5];

	var mesh = new Float32Array([].concat(
	// wireframe cube
		v0,v4,v1,v5,v2,v6,v3,v7));
	
	this.ctx = ctx;
	this.length = mesh.length;
	this.buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
	gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);
}

Suica.WireframeCubeMesh.prototype.drawMesh = function(obj)
{
//for(var i=0; i<5; i++) console.log(i,this.ctx.gl.getActiveAttrib(this.ctx.shaderProgram,i));
	var gl = this.ctx.gl;
//console.log(this.ctx.aXYZ);	
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
		gl.drawArrays(gl.POINTS,0,8);
	}
	else
	{
		gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,3*Suica.FLOATS,0*Suica.FLOATS);
		gl.drawArrays(gl.LINES,0,8);
		gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,6*Suica.FLOATS,0*Suica.FLOATS);
		gl.drawArrays(gl.LINE_LOOP,0,4);
		gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,6*Suica.FLOATS,3*Suica.FLOATS);
		gl.drawArrays(gl.LINE_LOOP,0,4);
	}
}


Suica.Cube = function(center,size)
{
	Suica.Object.apply(this,arguments);
	this.color = [0,0.5,1];
	this.center = center;
	this.size = size;
	
	if (!this.ctx.wireframeCubeMesh)
		this.ctx.wireframeCubeMesh = new Suica.WireframeCubeMesh(this.ctx);
	if (!this.ctx.solidCubeMesh)
		this.ctx.solidCubeMesh = new Suica.SolidCubeMesh(this.ctx);
		
	this.drawPoint = this.ctx.wireframeCubeMesh;
	this.drawLine = this.ctx.wireframeCubeMesh;
	this.drawSolid = this.ctx.solidCubeMesh;
}

Suica.Cube.prototype = Object.create(Suica.Object.prototype);

Suica.Cube.prototype.getSizes = function()
{
	return [this.size,this.size,this.size];
}

Suica.Cuboid = function(center,sizes)
{
	Suica.Cube.apply(this,arguments);
	this.sizes = sizes;
}

Suica.Cuboid.prototype = Object.create(Suica.Cube.prototype);

Suica.Cuboid.prototype.getSizes = function()
{
	return this.sizes;
}

function cube(center,size)
{
	return new Suica.Cube(center,size);
}

function cuboid(center,sizes)
{
	return new Suica.Cuboid(center,sizes);
}
