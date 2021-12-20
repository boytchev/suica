//===================================================
//
// Library:	Suica 1.0
// Module:	Group
// License:	Creative Commons 3.0 share alike, non-commercial
//
// {<object> =} new Suica.Group(<elements>)
//		<group>.elements = <vector-of-objects>
//		<group>.center = <vector>
//		<group>.sizes  = <number>
//		<group>.origin = <vector>				default:[0,0,0]
//		<group>.color  = <vector>				default:[0.5,0.5,0.5]
//		<group>.mode   = <POINT|LINE|SOLID>	default:Suica.SOLID
//		<group>.light  = <boolean>				default:true
//		<group>.visible = <boolean>				default:true
//		<group>.pointSize = <number>			default:3.0
//		<group>.focus	= <vector>				default:[0,0,1]
//		<group>.spin	= <number>				default:0
//		<group>.image	= <image>
//		<group>.add(<object>)
//		<group>.merge()
//		<group>.mergeColor()
//		<group>.drawObject()
//		<group>.custom(<properties>)
//
// {<object> =} group(<element>,<element>,...)
//===================================================

Suica.GroupMesh = function(ctx)
{
	this.ctx = ctx;
}

Suica.GroupMesh.prototype.drawMesh = function(obj)
{
	for (var i in obj.elements)
	{
		obj.elements[i].drawObject();
	}
}

Suica.Group = function(elements)
{
	Suica.Object.apply(this,arguments);
	this.color = [0.5,0.5,0.5];
	this.center = [0,0,0];
	this.sizes = [1,1,1];
	this.elements = elements?elements:[];

	// unhook elements from main list of objects
	for (var i in elements)
	{
		Suica.lastContext.objectList = Suica.lastContext.objectList.filter(function (e) {return e !== elements[i]});
	}
	
	this.drawGroup = new Suica.GroupMesh(this.ctx);
	
	this.drawPoint = this.drawGroup;
	this.drawLine = this.drawGroup;
	this.drawSolid = this.drawGroup;
}

Suica.Group.prototype = Object.create(Suica.Object.prototype);

Suica.Group.prototype.getSizes = function()
{
	return this.sizes;
}

Suica.Group.prototype.add = function(element)
{
	this.elements.push(element);
	
	// unhook element from main list of objects
	this.ctx.objectList = this.ctx.objectList.filter(function (e) {return e !== element});
}

Suica.Group.prototype.merge = function(element)
{
	for (var i in this.elements)
	{
		this.elements[i].id = this.id;
		this.elements[i].idColor = this.idColor;
		this.elements[i].interactive = this.interactive;
	}
}

Suica.Group.prototype.mergeColor = function(element)
{
	for (var i in this.elements)
	{
		delete this.elements[i].color;
	}
}


function group(elements)
{
	return new Suica.Group(elements);
}

