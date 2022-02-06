//
// Suica 2.0 Parser
//
// Parses custom tags inside <suica-canvas>.
//
// <background color="...">
// <oxyz size="..." color="...">
// <ontime src="...">
// <point id="..." center="..." color="..." size="...">
// <line id="..." center="..." color="..." to="...">
// <square id="..." center="..." color="..." size="...">
// <squareFrame id="..." center="..." color="..." size="...">
// <cube id="..." center="..." color="..." size="...">
// <cubeFrame id="..." center="..." color="..." size="...">
// <circle id="..." center="..." color="..." size="...">
// <circleFrame id="..." center="..." color="..." size="...">
// <polygon id="..." center="..." color="..." size="..." count="...">
// <polygonFrame id="..." center="..." color="..." size="..." count="...">
//



//========================================================================
//
// class HTMLParser( suica )
//
//========================================================================

class HTMLParser
{
	
	constructor( suica )
	{
		this.suica = suica;

		this.parseTag = {};
		this.parseTag.OXYZ = this.parseTagOXYZ;
		this.parseTag.DEMO = this.parseTagDEMO;
		this.parseTag.BACKGROUND = this.parseTagBACKGROUND;
		this.parseTag.ONTIME = this.parseTagONTIME;
		this.parseTag.POINT = this.parseTagPOINT;
		this.parseTag.LINE = this.parseTagLINE;
		this.parseTag.SQUARE = this.parseTagSQUARE;
		this.parseTag.SQUAREFRAME = this.parseTagSQUAREFRAME;
		this.parseTag.CUBE = this.parseTagCUBE;
		this.parseTag.CUBEFRAME = this.parseTagCUBEFRAME;
		this.parseTag.CIRCLE = this.parseTagCIRCLE;
		this.parseTag.CIRCLEFRAME = this.parseTagCIRCLEFRAME;
		this.parseTag.POLYGON = this.parseTagPOLYGON;
		this.parseTag.POLYGONFRAME = this.parseTagPOLYGONFRAME;
		
		this.parseTag.BUTTON = this.skipTag;
		this.parseTag.CANVAS = this.skipTag;
		this.parseTag.DIV = this.skipTag;
		this.parseTag.SPAN = this.skipTag;
		
	} // HTMLParser.constructor


	// executed once - parses <suica-canvas>
	parseTags( )
	{
		if( DEBUG_CALLS ) console.log(`:: ${this.suica.id}.parseTag( )`);

		// unhook the parser
		this.suica.parser = null;

		this.parseTagsInElement( this.suica, this.suica.suicaTag );
		this.suica.render( );
		
	} // HTMLParser.parseTags


	// recursive parser
	parseTagsInElement( that, elem )
	{
		for( var i = 0; i<elem.children.length; i++ )
		{
			// execute tag
			var tagName = elem.children[i].tagName;
			if( this.parseTag[tagName] )
				this.parseTag[tagName]( this.suica, elem.children[i] );
			else
				throw `error: unknown tag <${tagName}> in <${that.tagName}>`;

			// recurse into subtags
			this.parseTagsInElement( this.suica, elem.children[i] );
		}
	} // HTMLParser.parseTagsInElement
		

	// <canvas> <div>
	skipTag( suica, elem )
	{
		if( DEBUG_CALLS ) console.log(`:: ${suica.id}.skipTag( ${elem.tagName } )`);
		// skip this tag
	} // HTMLParser.skipTag
	
	
	// <oxyz size="..." color="...">
	parseTagOXYZ( suica, elem )
	{
		suica.oxyz(
			elem.getAttribute('size') || Suica.DEFAULT.OXYZ.SIZE,
			elem.getAttribute('color') || Suica.DEFAULT.OXYZ.COLOR
		);
	} // HTMLParser.parseTagOXYZ
	
	
	// <demo distance="..." altitude="...">
	parseTagDEMO( suica, elem )
	{
		suica.demo(
			elem.getAttribute('distance') || Suica.DEFAULT.DEMO.DISTANCE,
			elem.getAttribute('altitude') || Suica.DEFAULT.DEMO.ALTITUDE
		);
	} // HTMLParser.parseTagDEMO
	
	
	// <background color="...">
	parseTagBACKGROUND( suica, elem )
	{
		suica.background(
			elem.getAttribute('color') || Suica.DEFAULT.BACKGROUND.COLOR
		);
	} // HTMLParser.parseTagBACKGROUND
	
	
	// <ontime src="...">
	parseTagONTIME( suica, elem )
	{
		suica.onTime( elem.getAttribute('src') || Suica.DEFAULT.ONTIME.SRC );
	} // HTMLParser.parseTagONTIME
	
	
	// <point id="..." center="..." color="..." size="...">
	parseTagPOINT( suica, elem )
	{
		var p = suica.point(
			elem.getAttribute('center') || Suica.DEFAULT.POINT.CENTER,
			elem.getAttribute('size') || Suica.DEFAULT.POINT.SIZE,
			elem.getAttribute('color') || Suica.DEFAULT.POINT.COLOR
		);
		
		if( elem.hasAttribute('x') ) p.x = Number(elem.getAttribute('x')); 
		if( elem.hasAttribute('y') ) p.y = Number(elem.getAttribute('y')); 
		if( elem.hasAttribute('z') ) p.z = Number(elem.getAttribute('z')); 

		var id = elem.getAttribute('id');
		if( id ) window[id] = p;
		
		elem.suicaObject = p;
		
	} // HTMLParser.parseTagPOINT
	
	
	// <line id="..." center="..." color="..." to="...">
	parseTagLINE( suica, elem )
	{
		var p = suica.line(
			elem.getAttribute('center') || elem.getAttribute('from') || Suica.DEFAULT.LINE.CENTER,
			elem.getAttribute('to') || Suica.DEFAULT.LINE.TO,
			elem.getAttribute('color') || Suica.DEFAULT.LINE.COLOR
		);

		var id = elem.getAttribute('id');
		if( id ) window[id] = p;
		
		elem.suicaObject = p;
		
	} // HTMLParser.parseTagLINE
	
	
	// <square id="..." center="..." color="..." size="...">
	parseTagSQUARE( suica, elem )
	{
		var p = suica.square(
			elem.getAttribute('center') || Suica.DEFAULT.SQUARE.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.SQUARE.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.SQUARE.COLOR
		);
		
		if( elem.hasAttribute('x') ) p.x = Number(elem.getAttribute('x')); 
		if( elem.hasAttribute('y') ) p.y = Number(elem.getAttribute('y')); 
		if( elem.hasAttribute('z') ) p.z = Number(elem.getAttribute('z')); 

		if( elem.hasAttribute('width') ) p.width = Number(elem.getAttribute('width')); 
		if( elem.hasAttribute('height') ) p.height = Number(elem.getAttribute('height')); 
			
		var id = elem.getAttribute('id');
		if( id ) window[id] = p;

		elem.suicaObject = p;
		
	} // HTMLParser.parseTagSQUARE
	
	
	// <squareFrame id="..." center="..." color="..." size="...">
	parseTagSQUAREFRAME( suica, elem )
	{
		var p = suica.squareFrame(
			elem.getAttribute('center') || Suica.DEFAULT.SQUARE.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.SQUARE.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.SQUARE.COLORFRAME
		);
		
		if( elem.hasAttribute('x') ) p.x = Number(elem.getAttribute('x')); 
		if( elem.hasAttribute('y') ) p.y = Number(elem.getAttribute('y')); 
		if( elem.hasAttribute('z') ) p.z = Number(elem.getAttribute('z')); 
			
		if( elem.hasAttribute('width') ) p.width = Number(elem.getAttribute('width')); 
		if( elem.hasAttribute('height') ) p.height = Number(elem.getAttribute('height')); 

		var id = elem.getAttribute('id');
		if( id ) window[id] = p;

		elem.suicaObject = p;
		
	} // HTMLParser.parseTagSQUAREFRAME

	// <cube id="..." center="..." color="..." size="...">
	parseTagCUBE( suica, elem )
	{
		var p = suica.cube(
			elem.getAttribute('center') || Suica.DEFAULT.CUBE.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.CUBE.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.CUBE.COLOR
		);
		
		if( elem.hasAttribute('x') ) p.x = Number(elem.getAttribute('x')); 
		if( elem.hasAttribute('y') ) p.y = Number(elem.getAttribute('y')); 
		if( elem.hasAttribute('z') ) p.z = Number(elem.getAttribute('z')); 

		if( elem.hasAttribute('width') ) p.width = Number(elem.getAttribute('width')); 
		if( elem.hasAttribute('height') ) p.height = Number(elem.getAttribute('height')); 
		if( elem.hasAttribute('depth') ) p.depth = Number(elem.getAttribute('depth')); 
			
		var id = elem.getAttribute('id');
		if( id ) window[id] = p;

		elem.suicaObject = p;
		
	} // HTMLParser.parseTagCUBE
	
	
	// <cubeFrame id="..." center="..." color="..." size="...">
	parseTagCUBEFRAME( suica, elem )
	{
		var p = suica.cubeFrame(
			elem.getAttribute('center') || Suica.DEFAULT.CUBE.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.CUBE.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.CUBE.COLORFRAME
		);
		
		if( elem.hasAttribute('x') ) p.x = Number(elem.getAttribute('x')); 
		if( elem.hasAttribute('y') ) p.y = Number(elem.getAttribute('y')); 
		if( elem.hasAttribute('z') ) p.z = Number(elem.getAttribute('z')); 
			
		if( elem.hasAttribute('width') ) p.width = Number(elem.getAttribute('width')); 
		if( elem.hasAttribute('height') ) p.height = Number(elem.getAttribute('height')); 
		if( elem.hasAttribute('depth') ) p.depth = Number(elem.getAttribute('depth')); 

		var id = elem.getAttribute('id');
		if( id ) window[id] = p;

		elem.suicaObject = p;
		
	} // HTMLParser.parseTagCUBEFRAME
	
	
	// <circle id="..." center="..." color="..." size="...">
	parseTagCIRCLE( suica, elem )
	{
		var p = suica.circle(
			elem.getAttribute('center') || Suica.DEFAULT.CIRCLE.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.CIRCLE.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.CIRCLE.COLOR
		);
		
		if( elem.hasAttribute('x') ) p.x = Number(elem.getAttribute('x')); 
		if( elem.hasAttribute('y') ) p.y = Number(elem.getAttribute('y')); 
		if( elem.hasAttribute('z') ) p.z = Number(elem.getAttribute('z')); 

		if( elem.hasAttribute('width') ) p.width = Number(elem.getAttribute('width')); 
		if( elem.hasAttribute('height') ) p.height = Number(elem.getAttribute('height')); 
	
		var id = elem.getAttribute('id');
		if( id ) window[id] = p;

		elem.suicaObject = p;
		
	} // HTMLParser.parseTagCIRCLE
	
	
	// <squareFrame id="..." center="..." color="..." size="...">
	parseTagCIRCLEFRAME( suica, elem )
	{
		var p = suica.circleFrame(
			elem.getAttribute('center') || Suica.DEFAULT.CIRCLE.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.CIRCLE.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.CIRCLE.COLORFRAME
		);
		
		if( elem.hasAttribute('x') ) p.x = Number(elem.getAttribute('x')); 
		if( elem.hasAttribute('y') ) p.y = Number(elem.getAttribute('y')); 
		if( elem.hasAttribute('z') ) p.z = Number(elem.getAttribute('z')); 
			
		if( elem.hasAttribute('width') ) p.width = Number(elem.getAttribute('width')); 
		if( elem.hasAttribute('height') ) p.height = Number(elem.getAttribute('height')); 

		var id = elem.getAttribute('id');
		if( id ) window[id] = p;

		elem.suicaObject = p;
		
	} // HTMLParser.parseTagCIRCLEFRAME
	
	
	// <polygon id="..." center="..." color="..." size="..." count="...">
	parseTagPOLYGON( suica, elem )
	{
		var p = suica.polygon(
			elem.getAttribute('count') || Suica.DEFAULT.POLYGON.COUNT,
			elem.getAttribute('center') || Suica.DEFAULT.POLYGON.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.POLYGON.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.POLYGON.COLOR
		);
		
		if( elem.hasAttribute('x') ) p.x = Number(elem.getAttribute('x')); 
		if( elem.hasAttribute('y') ) p.y = Number(elem.getAttribute('y')); 
		if( elem.hasAttribute('z') ) p.z = Number(elem.getAttribute('z')); 

		if( elem.hasAttribute('width') ) p.width = Number(elem.getAttribute('width')); 
		if( elem.hasAttribute('height') ) p.height = Number(elem.getAttribute('height')); 
	
		var id = elem.getAttribute('id');
		if( id ) window[id] = p;

		elem.suicaObject = p;
		
	} // HTMLParser.parseTagPOLYGON
	
	
	// <squareFrame id="..." center="..." color="..." size="..." count="...">
	parseTagPOLYGONFRAME( suica, elem )
	{
		var p = suica.polygonFrame(
			elem.getAttribute('count') || Suica.DEFAULT.POLYGON.COUNT,
			elem.getAttribute('center') || Suica.DEFAULT.POLYGON.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.POLYGON.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.POLYGON.COLORFRAME
		);
		
		if( elem.hasAttribute('x') ) p.x = Number(elem.getAttribute('x')); 
		if( elem.hasAttribute('y') ) p.y = Number(elem.getAttribute('y')); 
		if( elem.hasAttribute('z') ) p.z = Number(elem.getAttribute('z')); 
			
		if( elem.hasAttribute('width') ) p.width = Number(elem.getAttribute('width')); 
		if( elem.hasAttribute('height') ) p.height = Number(elem.getAttribute('height')); 

		var id = elem.getAttribute('id');
		if( id ) window[id] = p;

		elem.suicaObject = p;
		
	} // HTMLParser.parseTagPOLYGONFRAME

} // HTMLParser

