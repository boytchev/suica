//===================================================
//
// Library:	Suica 1.0
// Module:	Segment
// License:	Creative Commons 3.0 share alike, non-commercial
//
// {<object> =} new Suica.Segment(<from>,<to>)
//		<segment>.from = <vector>
//		<segment>.to = <vector>
//		<segment>.color  = <vector>				default:[1,0.2,0.2]
//		<segment>.visible = <boolean>			default:true
//		<segment>.drawObject()
//		<segment>.custom(<properties>)
//		<segment>.getSizes()
//
//===================================================


Suica.WireframeSegmentMesh = function(ctx)
{
	var gl = ctx.gl;

	this.ctx = ctx;
	this.mesh = new Float32Array([0,0,0,0,0,0]);
	this.length = this.mesh.length;
	this.buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
	gl.bufferData(gl.ARRAY_BUFFER,this.mesh,gl.DYNAMIC_DRAW);
}

Suica.WireframeSegmentMesh.prototype.drawMesh = function(obj)
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

	this.mesh[0] = obj.from[0];
	this.mesh[1] = obj.from[1];
	this.mesh[2] = obj.from[2];
	this.mesh[3] = obj.to[0];
	this.mesh[4] = obj.to[1];
	this.mesh[5] = obj.to[2];

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

Suica.Segment = function(from,to)
{
	Suica.Object.apply(this,arguments);
	this.color = [0,0.5,0];
	this.from = from;
	this.to = to;
	this.mode = Suica.LINE;
	
	if (!this.ctx.segmentMesh)
		this.ctx.segmentMesh = new Suica.WireframeSegmentMesh(this.ctx);

	this.drawPoint = this.ctx.segmentMesh;
	this.drawLine = this.ctx.segmentMesh;
	this.drawSolid = this.ctx.segmentMesh;
}

Suica.Segment.prototype = Object.create(Suica.Object.prototype);


function segment(from,to)
{
	return new Suica.Segment(from,to);
}
