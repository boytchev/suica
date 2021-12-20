//===================================================
//
// Library:	Suica 1.0
// Module:	Point
// License:	Creative Commons 3.0 share alike, non-commercial
//
// {<object> =} new Suica.Point(<center>,<pointSieze>)
//		<point>.center = <vector>
//		<point>.color  = <vector>				default:[1,0.2,0.2]
//		<point>.pointSize = <number>			default:3.0
//		<point>.visible = <boolean>			default:true
//		<point>.drawObject()
//		<point>.custom(<properties>)
//		<point>.getSizes()
//
//===================================================


Suica.PointMesh = function(ctx)
{
	var gl = ctx.gl;
	var mesh = new Float32Array([0,0,0,0,0,0]);

	this.ctx = ctx;
	this.length = mesh.length;
	this.buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
	gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);
}

Suica.PointMesh.prototype.drawMesh = function(obj)
{
	var gl = this.ctx.gl;

	gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
	gl.enableVertexAttribArray(this.ctx.aXYZ);
	gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,3*Suica.FLOATS,0*Suica.FLOATS);

	if (Suica.normalRender)
	{
		gl.uniform1i(this.ctx.uLight,false);
		gl.uniform1i(this.ctx.uTexture,false);
		gl.disableVertexAttribArray(this.ctx.aTexCoord);
		gl.disableVertexAttribArray(this.ctx.aNormal);
	}

	gl.uniform1f(this.ctx.uPointSize,obj.pointSize);
	
	gl.drawArrays(gl.POINTS,0,1);
}

Suica.Point = function(center)
{
	Suica.Object.apply(this,arguments);
	this.color = [1,0.2,0.2];
	this.center = center;
	this.mode = Suica.POINT;
	
	if (!this.ctx.pointMesh)
		this.ctx.pointMesh = new Suica.PointMesh(this.ctx);

	this.drawPoint = this.ctx.pointMesh;
	this.drawLine = this.ctx.pointMesh;
	this.drawSolid = this.ctx.pointMesh;
}

Suica.Point.prototype = Object.create(Suica.Object.prototype);


function point(center)
{
	return new Suica.Point(center);
}
