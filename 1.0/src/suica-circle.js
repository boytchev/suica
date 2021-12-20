//===================================================
//
// Library:	Suica 1.0
// Module:	Circle (Polygon, Circle, Ellipse)
// License:	Creative Commons 3.0 share alike, non-commercial
//
// {<object> =} new Suica.Polygon(<center>,<radius>,<count>)
//		<polygon>.center = <vector>
//		<polygon>.count	 = <number>
//		<polygon>.radius = <number>
//		<polygon>.origin = <vector>				default:[0,0,0]
//		<polygon>.color  = <vector>				default:[0,0.5,1]
//		<polygon>.mode   = <POINT|LINE|SOLID>	default:Suica.SOLID
//		<polygon>.light  = <boolean>			default:true
//		<polygon>.visible = <boolean>			default:true
//		<polygon>.pointSize = <number>			default:3.0
//		<polygon>.focus	= <vector>				default:[0,0,1]
//		<polygon>.spin	= <number>				default:0
//		<polygon>.image	= <image>
//		<polygon>.drawObject()
//		<polygon>.custom(<properties>)
//
// {<object> =} new Suica.Circle(<center>,<radius>)
// {<object> =} new Suica.Ellipse(<center>,<radii>)
//		<ellipse>.radii = <vector>
//
// {<object> =} polygon(<center>,<radius>,<count>)
// {<object> =} circle(<center>,<radius>)
// {<object> =} ellipse(<center>,<radii>)
//===================================================

Suica.PRECISION_CIRCLE = Suica.PRECISION;

Suica.SolidPolygonMesh = function(ctx,count)
{
	var gl = ctx.gl;
	
	// polygon center and perimeter
	var data = [0,0,0];
	var a = 0;
	var da = 2*Math.PI/count;
	for( var i=0; i<count+1; i++ )
	{
		data.push(0.5*Math.cos(a),0.5*Math.sin(a),0);
		a += da;
	}

	var mesh = new Float32Array(data);

	this.ctx = ctx;
	this.length = mesh.length;
	this.buffer = gl.createBuffer();
	this.count = count;
	gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
	gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);
}

Suica.SolidPolygonMesh.prototype.drawMesh = function(obj)
{
	var gl = this.ctx.gl;
	var hasTexture = (obj.image && Suica.texturesReady());

	gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
	gl.enableVertexAttribArray(this.ctx.aXYZ);
    gl.vertexAttribPointer(this.ctx.aXYZ,3,     gl.FLOAT,false,3*Suica.FLOATS,0*Suica.FLOATS);

	if (Suica.normalRender)
	{
		gl.uniform1i(this.ctx.uLight,obj.light);
		gl.uniform1i(this.ctx.uTexture,obj.image!=null);

		gl.disableVertexAttribArray(this.ctx.aNormal);
		gl.vertexAttrib3f(this.ctx.aNormal,0,0,1);

		if (hasTexture)
		{
			gl.enableVertexAttribArray(this.ctx.aTexCoord);
			gl.vertexAttribPointer(this.ctx.aTexCoord,2,gl.FLOAT,false,3*Suica.FLOATS,0*Suica.FLOATS);

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D,obj.image.texture);
			gl.uniform1i(this.ctx.uTexture,true);
			gl.uniform2fv(this.ctx.uTexScale,obj.image.scale);
			gl.uniform2fv(this.ctx.uTexOffset,obj.image.offset);
		}
	}
	
	gl.enable(gl.POLYGON_OFFSET_FILL);
	gl.polygonOffset(1,0);
	gl.drawArrays(gl.TRIANGLE_FAN,0,this.count+2);
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

Suica.WireframePolygonMesh = function(ctx,count)
{
	var gl = ctx.gl;
	
	// circle perimeter
	var data = [];
	var a = 0;
	var da = 2*Math.PI/count;
	for( var i=0; i<count; i++ )
	{
		data.push(0.5*Math.cos(a),0.5*Math.sin(a),0);
		a += da;
	}
	
	var mesh = new Float32Array(data);

	this.ctx = ctx;
	this.length = mesh.length;
	this.buffer = gl.createBuffer();
	this.count = count;
	gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
	gl.bufferData(gl.ARRAY_BUFFER,mesh,gl.STATIC_DRAW);
}

Suica.WireframePolygonMesh.prototype.drawMesh = function(obj)
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
		gl.drawArrays(gl.POINTS,0,this.count);
	}
	else
	{
		gl.vertexAttribPointer(this.ctx.aXYZ,3,gl.FLOAT,false,3*Suica.FLOATS,0*Suica.FLOATS);
		gl.drawArrays(gl.LINE_LOOP,0,this.count);
	}
}


Suica.Polygon = function(center,radius,count)
{
	Suica.Object.apply(this,arguments);
	this.color = [0,0.5,1];
	this.center = center;
	if (radius) this.radius = radius;
	this.count = count?count:Suica.PRECISION_CIRCLE;
	this.hollow = true;
	
	if (!this.ctx.wireframePolygonMesh)
		this.ctx.wireframePolygonMesh = [];
	if (!this.ctx.wireframePolygonMesh[count])
		this.ctx.wireframePolygonMesh[count] = new Suica.WireframePolygonMesh(this.ctx,count);

	if (!this.ctx.solidPolygonMesh)
		this.ctx.solidPolygonMesh = [];
	if (!this.ctx.solidPolygonMesh[count])
		this.ctx.solidPolygonMesh[count] = new Suica.SolidPolygonMesh(this.ctx,count);

	this.drawPoint = this.ctx.wireframePolygonMesh[count];
	this.drawLine = this.ctx.wireframePolygonMesh[count];
	this.drawSolid = this.ctx.solidPolygonMesh[count];
}

Suica.Polygon.prototype = Object.create(Suica.Object.prototype);

Suica.Polygon.prototype.getSizes = function()
{
	return [2*this.radius,2*this.radius,1];
}

Suica.Circle = function(center,radius)
{
	Suica.Polygon.call(this,center,radius,Suica.PRECISION_CIRCLE);
}

Suica.Circle.prototype = Object.create(Suica.Polygon.prototype);

Suica.Circle.prototype.getSizes = function()
{
	return [2*this.radius,2*this.radius,1];
}

Suica.Ellipse = function(center,radii)
{
	Suica.Polygon.call(this,center,undefined,Suica.PRECISION_CIRCLE);
	this.radii = radii;
}

Suica.Ellipse.prototype = Object.create(Suica.Polygon.prototype);

Suica.Ellipse.prototype.getSizes = function()
{
	return [2*this.radii[0],2*this.radii[1],1];
}

function polygon(center,radius,count)
{
	return new Suica.Polygon(center,radius,count);
}

function circle(center,radius)
{
	return new Suica.Circle(center,radius);
}

function ellipse(center,radii)
{
	return new Suica.Ellipse(center,radii);
}
