//===================================================
//
// Library:	Suica 1.0
// Module:	Object
// License:	Creative Commons 3.0 share alike, non-commercial
//
// {<object> =} {new Suica.}Object()
//		<object>.center = <vector>
//		<object>.origin = <vector>					default:[0,0,0]
//		<object>.color  = <vector>					default:[0,0,0]
//		<object>.mode   = <POINT|LINE|SOLID>		default:Suica.SOLID
//		<object>.light  = <boolean>					default:true
//		<object>.visible = <boolean>				default:true
//		<object>.hollow = <boolean>					default:false
//		<object>.interactive = <boolean>			default:false
//		<object>.pointSize = <number>				default:3.0
//		<object>.focus	= <vector>					default:[0,0,1]
//		<object>.spin	= <number>					default:0
//		<object>.clipPlanes = [{<vector>{,<vector>}}] default:null;
//		<object>.image  = <image>
//		<object>.drawObject()
//		<object>.custom(<properties>)
//		<object>.getPosition()
//
// {<image> =} new Suica.Image(<url>{,<scale>{,<offset>}})
//		<image>.url		= <string>
//		<image>.scale	= <number>|<vector>		default:[1,1]
//		<image>.baseScale = <vector>			default:[1,1]
//		<image>.offset	= <vector>				default:[0,0]
//===================================================

Suica.Object = function()
{
	Suica.id += 3;
	this.id = Suica.id;
	this.idColor = [
		(this.id & 0xff)/255,
		((this.id>>8) & 0xff)/255,
		((this.id>>16) & 0xff)/255 ];
	this.ctx = Suica.lastContext;
	this.color = [0,0,0];
	this.origin = [0,0,0];
	this.light = true;
	this.visible = true;
	this.hollow = false;
	this.interactive = false;
	this.mode = Suica.SOLID;
	this.pointSize = 3.0;
	this.focus = null; //[0,0,1];
	this.spin = null; //0
	this.image = null;
	Suica.lastContext.objectList.push(this);
}

Suica.Object.prototype.drawObject = function()
{
	// exit immediately if:
	// 1. the object is invisible
	// 2. the type of the object is not correct
	// 3. if rendering for selection mode and the object is not interactive
	if (!this.visible) return;

	if (this.mode==Suica.POINT)
	{
		this.ctx.hasPoints = true;
	}

	if (this instanceof Suica.Group)
	{
		// groups cannot be eliminated, because they may contain object
		// of various types, so let groups recurse into themselves...
	}
	else
	{
		if (this.ctx.renderMode==Suica.POINT && this.mode!=Suica.POINT) return;
		if (this.ctx.renderMode==Suica.NONPOINT && this.mode==Suica.POINT) return;
//	console.log('drawing ',this.mode,'(point=',Suica.POINT,') ',this);
//	console.log(this.ctx.renderMode==Suica.POINT,this.mode!=Suica.POINT,this.ctx.renderMode==Suica.NONPOINT,this.mode==Suica.POINT);
//	console.log('DUMP ',this.ctx.renderMode,Suica.POINT,Suica.NONPOINT);
	}

	if (!Suica.normalRender && !this.interactive) return;

	// enable back face culling only if
	//		1. object is not hollow
	//		2. there are no clipping planes
	//		3. the light is 3-component
	if (!this.hollow)
		if (!this.clipPlanes || !this.clipPlanes.length)
			if (!this.color || this.color.length<4)
				this.ctx.gl.enable(this.ctx.gl.CULL_FACE);

	// colour of object
	if (Suica.normalRender)
	{
		if (this.color) this.ctx.gl.vertexAttrib3fv(this.ctx.aColor,this.color);
	}
	else
	{
		this.ctx.gl.vertexAttrib3fv(this.ctx.aColor,this.idColor);
	}
	
	// position in space
	this.ctx.pushMatrix();
	if (this.center)
	{
		this.ctx.translate(this.center);
	}

	// orientation in space
	if (this.focus)
	{
		var xy = Math.sqrt(this.focus[0]*this.focus[0]+this.focus[1]*this.focus[1]);
		var beta = Math.atan2(xy,this.focus[2]);
		var alpha = Math.atan2(this.focus[1],this.focus[0]);
		this.ctx.zRotate(-alpha);
		this.ctx.yRotate(beta);
	}

	// spin around local Z
	if (this.spin)
	{
		this.ctx.zRotate(this.spin);
	}
	
	// size of object
	if (this.getSizes)
	{
		this.ctx.scale(this.getSizes());	
	}
	
	// internal offset of object (center delocation)
	this.ctx.translate([-this.origin[0],-this.origin[1],-this.origin[2]]);
	this.ctx.useModelMatrix();

	// clip planes
	if (this.clipPlanes)
	{
		var n = this.clipPlanes.length;
		if (n>2) n=2;
		this.ctx.gl.uniform1i(this.ctx.uClipPlanes,n);

		var a = this.clipPlanes[0];
		if (n>1) a=a.concat(this.clipPlanes[1]);
		this.ctx.gl.uniform4fv(this.ctx.uClipPlane,a);
	}
	else
		this.ctx.gl.uniform1i(this.ctx.uClipPlanes,0);
	
	switch (this.mode)
	{
		case Suica.POINT:
			this.drawPoint.drawMesh(this);
			break;
		case Suica.LINE:
			this.drawLine.drawMesh(this);
			break;
		case Suica.SOLID:
			this.drawSolid.drawMesh(this);
			break;
	}
	this.ctx.popMatrix();
	this.ctx.gl.disable(this.ctx.gl.CULL_FACE);
}

Suica.Object.prototype.custom = function(properties)
{
	for(var n in properties) this[n]=properties[n];
	return this;
}

Suica.Object.prototype.getPosition = function()
{
	var m = this.ctx.matrixMultiply(this.ctx.projectionMatrix,this.ctx.matrixMultiply(this.ctx.viewMatrix,this.ctx.modelMatrix));
	var c = this.center;
	var x = m[0]*c[0]+m[4]*c[1]+m[8]*c[2]+m[12];
	var y = m[1]*c[0]+m[5]*c[1]+m[9]*c[2]+m[13];
	var w = m[3]*c[0]+m[7]*c[1]+m[11]*c[2]+m[15];

	var p = this.ctx.gl.canvas;
	var br = p.getBoundingClientRect();
	x = x*p.width/w/2;
	y = y*p.height/w/2;
	return [br.left+x+p.width/2+Suica.scrollLeft(), br.top-y+p.height/2+Suica.scrollTop()];
}

Suica.Image = function(url,scale,offset)
{
	this.ctx = Suica.lastContext;
	this.url = url;
	if (scale instanceof Array)
		this.scale = scale;
	else
		if (scale==undefined)
			this.scale = [1,1];
		else
			this.scale = [scale,scale];
	if (offset instanceof Array)
		this.offset = offset;
	else
		this.offset = [0,0];
	this.baseScale = null;
	this.texture = this.ctx.gl.createTexture();
	Suica.loadImageForTexture(this.ctx.gl,this.url,this.texture);
}

Suica.ongoingImageLoads = [];
Suica.loadImageForTexture = function(gl,url,texture)
{
	var image = new Image();
//	image.crossOrigin = 'anonymous';
	image.onload = function() {
		Suica.ongoingImageLoads.splice(Suica.ongoingImageLoads.indexOf(image),1);
		Suica.textureFinishedLoading(gl,url,image,texture);
	}
	Suica.ongoingImageLoads.push(image);
	image.src=url;
}

Suica.textureFinishedLoading = function(gl,url,image,texture)
{
	gl.bindTexture(gl.TEXTURE_2D,texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
	gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);
	gl.bindTexture(gl.TEXTURE_2D,null);
}

Suica.texturesReady = function()
{
	return Suica.ongoingImageLoads.length==0;
}