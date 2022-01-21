//
// Suica 2.0 Parser
//
// Parses custom tags inside <suica-canvas>.
//
// <background color="...">
// <oxyz size="..." color="...">
// <animate src="...">
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
		this.parseTag.CANVAS = this.parseTagCANVAS;
		this.parseTag.OXYZ = this.parseTagOXYZ;
		this.parseTag.BACKGROUND = this.parseTagBACKGROUND;
		this.parseTag.ANIMATE = this.parseTagANIMATE;
		this.parseTag.POINT = this.parseTagPOINT;
		
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
		

	// <canvas>
	parseTagCANVAS( suica, elem )
	{
		// skip this tag
	} // HTMLParser.parseTagCANVAS
	
	
	// <oxyz size="..." color="...">
	parseTagOXYZ( suica, elem )
	{
		suica.oxyz(
			elem.getAttribute('size') || Suica.DEFAULT.OXYZ.SIZE,
			elem.getAttribute('color') || Suica.DEFAULT.OXYZ.COLOR
		);
	} // HTMLParser.parseTagOXYZ
	
	
	// <background color="...">
	parseTagBACKGROUND( suica, elem )
	{
		suica.background(
			elem.getAttribute('color') || Suica.DEFAULT.BACKGROUND.COLOR
		);
	} // HTMLParser.parseTagBACKGROUND
	
	
	// <animate src="...">
	parseTagANIMATE( suica, elem )
	{
		suica.nextFrame = elem.getAttribute('src') || Suica.DEFAULT.ANIMATE.SRC;
	} // HTMLParser.parseTagANIMATE
	
	
	// <point id="..." center="..." color="..." size="...">
	parseTagPOINT( suica, elem )
	{
		var p = suica.point(
			elem.getAttribute('center').split(',') || Suica.DEFAULT.POINT.CENTER,
			elem.getAttribute('size') || Suica.DEFAULT.POINT.SIZE,
			elem.getAttribute('color') || Suica.DEFAULT.POINT.COLOR
		);
		
		var id = elem.getAttribute('id');
		if( id ) window[id] = p;
		
	} // HTMLParser.parseTagPOINT
	
	
} // HTMLParser

