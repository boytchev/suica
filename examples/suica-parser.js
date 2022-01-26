//
// Suica 2.0 Parser
//
// Parses custom tags inside <suica-canvas>.
//
// <background color="...">
// <oxyz size="..." color="...">
// <ontime src="...">
// <point id="..." center="..." color="..." size="...">
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
		this.parseTag.CUBE = this.parseTagCUBE;
		
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
			elem.getAttribute('center')?.split(',') || Suica.DEFAULT.POINT.CENTER,
			elem.getAttribute('size') || Suica.DEFAULT.POINT.SIZE,
			elem.getAttribute('color') || Suica.DEFAULT.POINT.COLOR
		);
		
		if( elem.hasAttribute('x') ) p.position.x = Number(elem.getAttribute('x')); 
		if( elem.hasAttribute('y') ) p.position.y = Number(elem.getAttribute('y')); 
		if( elem.hasAttribute('z') ) p.position.z = Number(elem.getAttribute('z')); 

		var id = elem.getAttribute('id');
		if( id ) window[id] = p;
		
	} // HTMLParser.parseTagPOINT
	
	
	// <cube id="..." center="..." color="..." size="...">
	parseTagCUBE( suica, elem )
	{
		var p = suica.cube(
			elem.getAttribute('center')?.split(',') || Suica.DEFAULT.CUBE.CENTER,
			elem.getAttribute('size') || Suica.DEFAULT.CUBE.SIZE,
			elem.getAttribute('color') || Suica.DEFAULT.CUBE.COLOR
		);
		
		if( elem.hasAttribute('x') ) p.position.x = Number(elem.hasAttribute('x')); 
		if( elem.hasAttribute('y') ) p.position.y = Number(elem.hasAttribute('y')); 
		if( elem.hasAttribute('z') ) p.position.z = Number(elem.hasAttribute('z')); 
			
		var id = elem.getAttribute('id');
		if( id ) window[id] = p;
		
	} // HTMLParser.parseTagCUBE
	
	
} // HTMLParser

