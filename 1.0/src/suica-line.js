//===================================================
//
// Library:	Suica 1.0
// Module:	Line
// License:	Creative Commons 3.0 share alike, non-commercial
//
// {<object> =} new Suica.Line(<from>,<to>)
//		<line>.from = <vector>
//		<line>.to = <vector>
//		<line>.color  = <vector>				default:[0,0.5,0]
//		<line>.visible = <boolean>			default:true
//		<line>.drawObject()
//		<line>.custom(<properties>)
//		<line>.getSizes()
//
// <ray>
// <segment>
//===================================================


Suica.WireframeLineMesh = function(ctx,kFrom,kTo)
{
	var gl = ctx.gl;

	this.kFrom = kFrom;
	this.kTo = kTo;
	this.ctx = ctx;
	this.mesh = new Float32Array([0,0,0,0,0,0]);
	this.length = this.mesh.length;
	this.buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
	gl.bufferData(gl.ARRAY_BUFFER,this.mesh,gl.DYNAMIC_DRAW);
}

Suica.WireframeLineMesh.prototype.drawMesh = function(obj)
{
	var gl = this.ctx.gl;

	if (Suica.normalRender)
	{
		gl.uniform1i(this.ctx.uLight,false);
		gl.uniform1i(this.ctx.uTexture,false);

		gl.disableVertexAttribArray(this.ctx.aTexCoord);

		gl.disableVertexAttribArray(this.ctx.aNormal);
	}
	
	gl.uniform1f(this.ctx.uPointSize,obj.pointSize);

	var v = unitVector(vectorPoints(obj.to,obj.from));
	this.mesh[0] = obj.from[0]-this.kFrom*v[0];
	this.mesh[1] = obj.from[1]-this.kFrom*v[1];
	this.mesh[2] = obj.from[2]-this.kFrom*v[2];
	this.mesh[3] = obj.to[0]+this.kTo*v[0];
	this.mesh[4] = obj.to[1]+this.kTo*v[1];
	this.mesh[5] = obj.to[2]+this.kTo*v[2];

	gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
	gl.bufferSubData(gl.ARRAY_BUFFER,0,this.mesh);
	gl.enableVertexAttribArray(this.ctx.aXYZ);
	gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,3*Suica.FLOATS,0*Suica.FLOATS);

	if (obj.mode==Suica.POINT)
	{
		gl.uniform1f(this.ctx.uPointSize,obj.pointSize);
		gl.drawArrays(gl.POINTS,0,2);
	}
	else
	{
		gl.drawArrays(gl.LINES,0,2);
	}
}

Suica.Line = function(from,to)
{
	Suica.Object.apply(this,arguments);
	this.color = [0,0.5,0];
	this.from = from;
	this.to = to;
	this.mode = Suica.LINE;
	
	if (!this.ctx.lineMesh)
		this.ctx.lineMesh = new Suica.WireframeLineMesh(this.ctx,1E6,1E6);

	this.drawPoint = this.ctx.lineMesh;
	this.drawLine = this.ctx.lineMesh;
	this.drawSolid = this.ctx.lineMesh;
}

Suica.Line.prototype = Object.create(Suica.Object.prototype);


function line(from,to)
{
	return new Suica.Line(from,to);
}


Suica.Ray = function(from,to)
{
	Suica.Object.apply(this,arguments);
	this.color = [0,0.5,0];
	this.from = from;
	this.to = to;
	this.mode = Suica.LINE;
	
	if (!this.ctx.rayMesh)
		this.ctx.rayMesh = new Suica.WireframeLineMesh(this.ctx,0,1E6);

	this.drawPoint = this.ctx.rayMesh;
	this.drawLine = this.ctx.rayMesh;
	this.drawSolid = this.ctx.rayMesh;
}

Suica.Ray.prototype = Object.create(Suica.Object.prototype);


function ray(from,to)
{
	return new Suica.Ray(from,to);
}


Suica.Segment = function(from,to)
{
	Suica.Object.apply(this,arguments);
	this.color = [0,0.5,0];
	this.from = from;
	this.to = to;
	this.mode = Suica.LINE;
	
	if (!this.ctx.segmentMesh)
		this.ctx.segmentMesh = new Suica.WireframeLineMesh(this.ctx,0,0);

	this.drawPoint = this.ctx.segmentMesh;
	this.drawLine = this.ctx.segmentMesh;
	this.drawSolid = this.ctx.segmentMesh;
}

Suica.Segment.prototype = Object.create(Suica.Object.prototype);


function segment(from,to)
{
	return new Suica.Segment(from,to);
}
