//
// Suica 2.0 Parser
//
// Parses custom tags inside <suica-canvas>.
//
// <vr>
// <fullscreen>
// <fullwindow>
// <anaglyph distance="...">
// <stereo distance="...">
// <perspective near="..." far="..." fov="...">
// <orthographic near="..." far="...">
// <background color="...">
// <oxyz size="..." color="...">
// <ontime src="...">
// <lookat from="..." to="..." up="...">
// <point id="..." center="..." color="..." size="...">
// <line id="..." center="..." color="..." to="...">
// <square id="..." center="..." color="..." size="..." wireframe="...">
// <cube id="..." center="..." color="..." size="..." wireframe="...">
// <circle id="..." center="..." color="..." size="..." wireframe="...">
// <polygon id="..." center="..." color="..." size="..." count="..." wireframe="...">
// <sphere id="..." center="..." color="..." size="...">
// <cylinder ...>
// <prism ...>
// <cone ...>
// <pyramid ...>
// <group>...</group>
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
		this.parseTag.LOOKAT = this.parseTagLOOKAT;
		this.parseTag.OXYZ = this.parseTagOXYZ;
		this.parseTag.DEMO = this.parseTagDEMO;
		this.parseTag.VR = this.parseTagVR;
		this.parseTag.FULLSCREEN = this.parseTagFULLSCREEN;
		this.parseTag.FULLWINDOW = this.parseTagFULLWINDOW;
		this.parseTag.ANAGLYPH = this.parseTagANAGLYPH;
		this.parseTag.STEREO = this.parseTagSTEREO;
		this.parseTag.PERSPECTIVE = this.parseTagPERSPECTIVE;
		this.parseTag.ORTHOGRAPHIC = this.parseTagORTHOGRAPHIC;
		this.parseTag.BACKGROUND = this.parseTagBACKGROUND;
		this.parseTag.ONTIME = this.parseTagONTIME;
		
		this.parseTag.POINT = this.parseTagPOINT;
		this.parseTag.LINE = this.parseTagLINE;
		this.parseTag.SQUARE = this.parseTagSQUARE;
		this.parseTag.CUBE = this.parseTagCUBE;
		this.parseTag.CIRCLE = this.parseTagCIRCLE;
		this.parseTag.POLYGON = this.parseTagPOLYGON;
		this.parseTag.SPHERE = this.parseTagSPHERE;
		this.parseTag.CYLINDER = this.parseTagCYLINDER;
		this.parseTag.PRISM = this.parseTagPRISM;
		this.parseTag.CONE = this.parseTagCONE;
		this.parseTag.PYRAMID = this.parseTagPYRAMID;
		this.parseTag.GROUP = this.parseTagGROUP;

		this.parseTag.CLONE = this.parseTagCLONE;
		
		this.parseTag.BUTTON = this.skipTag;
		this.parseTag.CANVAS = this.skipTagSilently;
		this.parseTag.DIV = this.skipTag;
		this.parseTag.SPAN = this.skipTag;

		this.openGroups = [];
		
	} // HTMLParser.constructor


	// executed once - parses <suica-canvas>
	parseTags( )
	{
		this.suica.debugCall( 'parseTags' );

		// unhook the parser
		this.suica.parser = null;
		this.suica.parserReadonly = this;

		this.parseTagsInElement( this.suica, this.suica.suicaTag );
		this.suica.render( );
		
	} // HTMLParser.parseTags


	// recursive parser
	parseTagsInElement( that, elem )
	{
		for( var i = 0; i<elem.children.length; i++ )
		{
			// execute tag
			var tagElement = elem.children[i];
			var tagName = tagElement.tagName;
			var newObject = null;
			if( this.parseTag[tagName] )
			{
				newObject = this.parseTag[tagName]( this.suica, tagElement );
				
				// if there is open group, add the new object to the latest open group
				if( this.openGroups.length )
					this.openGroups[ this.openGroups.length-1 ].add( newObject );
			}
			else
				console.error( `error: unknown tag <${tagName}> in <${that.tagName}>` );

			// if this tag is <group> then mark the gorup as open
			// new objects will be automatically added to the latest open group
			if( tagName == 'GROUP' )
			{
				this.openGroups.push( newObject );
			}

			// recurse into subtags
			this.parseTagsInElement( this.suica, tagElement );

			// is this tag is </group> then close the group
			if( tagName == 'GROUP' )
			{
				// post-process color
				var group = this.openGroups.pop( );
				
				if( tagElement.hasAttribute('color') )
				{
					group.color = tagElement.getAttribute('color');
				}
			}

		}
	} // HTMLParser.parseTagsInElement
		

	// <some-unknown-tag> <div>
	skipTag( suica, elem )
	{
		suica.debugCall( 'skipTag', elem.tagName ); // skip this tag
	} // HTMLParser.skipTag
	
	
	// <canvas> <div>
	skipTagSilently( suica, elem )
	{
	} // HTMLParser.skipTagSIlently
	
	
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
	
	
	// <vr>
	parseTagVR( suica, elem )
	{
		suica.vr(
		);
	} // HTMLParser.parseTagVR
	
	
	// <fullscreen>
	parseTagFULLSCREEN( suica, elem )
	{
		suica.fullScreen(
		);
	} // HTMLParser.parseTagFULLSCREEN
	
	
	// <fullwindow>
	parseTagFULLWINDOW( suica, elem )
	{
		suica.fullWindow(
		);
	} // HTMLParser.parseTagFULLWINDOW
	
	
	// <anaglyph distance="...">
	parseTagANAGLYPH( suica, elem )
	{
		suica.anaglyph(
			elem.getAttribute('distance') || Suica.DEFAULT.ANAGLYPH.DISTANCE
		);
	} // HTMLParser.parseTagANAGLYPH
	
	
	// <stereo distance="...">
	parseTagSTEREO( suica, elem )
	{
		suica.stereo(
			elem.getAttribute('distance') || Suica.DEFAULT.STEREO.DISTANCE
		);
	} // HTMLParser.parseTagSTEREO
	
	
	// <perspective fov="..." near="..." far="...">
	parseTagPERSPECTIVE( suica, elem )
	{
		suica.perspective(
			elem.getAttribute('near') || Suica.DEFAULT.PERSPECTIVE.NEAR,
			elem.getAttribute('far') || Suica.DEFAULT.PERSPECTIVE.FAR,
			elem.getAttribute('fov') || Suica.DEFAULT.PERSPECTIVE.FOV
		);
	} // HTMLParser.parseTagPERSPECTIVE
	
	
	// <orthographic near="..." far="...">
	parseTagORTHOGRAPHIC( suica, elem )
	{
		suica.perspective(
			elem.getAttribute('near') || Suica.DEFAULT.ORTHOGRAPHIC.NEAR,
			elem.getAttribute('far') || Suica.DEFAULT.ORTHOGRAPHIC.FAR
		);
	} // HTMLParser.parseTagORTHOGRAPHIC
	
	
	// <lookAt id="..." from="..." to="..." up="...">
	parseTagLOOKAT( suica, elem )
	{
		suica.lookAt(
			elem.getAttribute('from') || elem.getAttribute('center') || undefined,
			elem.getAttribute('to') || undefined,
			elem.getAttribute('up') || undefined
		);
		
	} // HTMLParser.parseTagLOOKAT
	
	
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
	
	
	parseAttributes( elem, object, parseOptions = {} )
	{
		if( elem.hasAttribute('x') ) object.x = Number(elem.getAttribute('x')); 
		if( elem.hasAttribute('y') ) object.y = Number(elem.getAttribute('y')); 
		if( elem.hasAttribute('z') ) object.z = Number(elem.getAttribute('z')); 

		if( elem.hasAttribute('images') ) object.images = elem.getAttribute('images');
		if( elem.hasAttribute('image') )
		{
			var imageName = elem.getAttribute('image');
			if( window[imageName] )
				object.image = window[imageName]; 
			else
				object.image = image(imageName);
		}
		
		if( parseOptions.widthHeight )
		{
			if( elem.hasAttribute('width') ) object.width = Number(elem.getAttribute('width')); 
			if( elem.hasAttribute('height') ) object.height = Number(elem.getAttribute('height')); 
		}
		
		if( parseOptions.depth )
		{
			if( elem.hasAttribute('depth') ) object.depth = Number(elem.getAttribute('depth')); 
		}
		
		if( parseOptions.spin )
		{
			if( elem.hasAttribute('spin') ) object.spin = elem.getAttribute('spin'); 
		}
		
		if( parseOptions.wireframe )
		{
			if( elem.hasAttribute('wireframe') ) object.wireframe = ['','true','yes','1'].indexOf(elem.getAttribute('wireframe').toLowerCase()) >= 0;
		}
		
		var id = elem.getAttribute('id');
		if( id ) window[id] = object;
	}
	
	
	// <point id="..." center="..." color="..." size="...">
	parseTagPOINT( suica, elem )
	{
		var p = suica.point(
			elem.getAttribute('center') || Suica.DEFAULT.POINT.CENTER,
			elem.getAttribute('size') || Suica.DEFAULT.POINT.SIZE,
			elem.getAttribute('color') || Suica.DEFAULT.POINT.COLOR
		);
		
		suica.parserReadonly.parseAttributes( elem, p );

		elem.suicaObject = p;
		
		return p;
		
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
		
		return p;
		
	} // HTMLParser.parseTagLINE
	
	
	// <square id="..." center="..." color="..." size="..." wireframe="...">
	parseTagSQUARE( suica, elem )
	{
		var p = suica.square(
			elem.getAttribute('center') || Suica.DEFAULT.SQUARE.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.SQUARE.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.SQUARE.COLOR
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, wireframe:true, spin:true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagSQUARE
	
	
	// <cube id="..." center="..." color="..." size="..." wireframe="...">
	parseTagCUBE( suica, elem )
	{
		var p = suica.cube(
			elem.getAttribute('center') || Suica.DEFAULT.CUBE.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.CUBE.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.CUBE.COLOR
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, wireframe:true, spin:true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagCUBE
	
	
	// <circle id="..." center="..." color="..." size="..." wireframe="...">
	parseTagCIRCLE( suica, elem )
	{
		var p = suica.circle(
			elem.getAttribute('center') || Suica.DEFAULT.CIRCLE.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.CIRCLE.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.CIRCLE.COLOR
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, wireframe:true, spin:true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagCIRCLE
	
	
	// <polygon id="..." center="..." color="..." size="..." count="..." wireframe="...">
	parseTagPOLYGON( suica, elem )
	{
		var p = suica.polygon(
			elem.getAttribute('count') || Suica.DEFAULT.POLYGON.COUNT,
			elem.getAttribute('center') || Suica.DEFAULT.POLYGON.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.POLYGON.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.POLYGON.COLOR
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, wireframe:true, spin:true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagPOLYGON
	

	// <sphere id="..." center="..." color="..." size="...">
	parseTagSPHERE( suica, elem )
	{
		var p = suica.sphere(
			elem.getAttribute('center') || Suica.DEFAULT.SPHERE.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.SPHERE.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.SPHERE.COLOR
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, spin:true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagSPHERE
	
	
	// <cylinder id="..." center="..." color="..." size="...">
	parseTagCYLINDER( suica, elem )
	{
		var p = suica.cylinder(
			elem.getAttribute('center') || Suica.DEFAULT.CYLINDER.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.CYLINDER.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.CYLINDER.COLOR
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, spin:true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagCYLINDER
	
	
	// <prism id="..." center="..." color="..." size="..." count="..." wireframe="...">
	parseTagPRISM( suica, elem )
	{
		var p = suica.prism(
			elem.getAttribute('count') || Suica.DEFAULT.PRISM.COUNT,
			elem.getAttribute('center') || Suica.DEFAULT.PRISM.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.PRISM.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.PRISM.COLOR
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, wireframe:true, spin:true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagPRISM
	
	
	// <cone id="..." center="..." color="..." size="...">
	parseTagCONE( suica, elem )
	{
		var p = suica.cone(
			elem.getAttribute('center') || Suica.DEFAULT.CONE.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.CONE.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.CONE.COLOR
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, spin:true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagCONE
	
	
	// <pyramid id="..." center="..." color="..." size="..." count="..." wireframe="...">
	parseTagPYRAMID( suica, elem )
	{
		var p = suica.pyramid(
			elem.getAttribute('count') || Suica.DEFAULT.PYRAMID.COUNT,
			elem.getAttribute('center') || Suica.DEFAULT.PYRAMID.CENTER,
			Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.PYRAMID.SIZE ),
			elem.getAttribute('color') || Suica.DEFAULT.PYRAMID.COLOR
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, wireframe:true, spin:true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagPYRAMID
	
	// <group id="..." center="..." color="..." size="..." spin="...">
	parseTagGROUP( suica, elem )
	{
		var p = suica.group();
		
		p.center = elem.getAttribute('center') || Suica.DEFAULT.GROUP.CENTER;
		p.size = Suica.parseSize( elem.getAttribute('size') || Suica.DEFAULT.GROUP.SIZE );
		p.spin = elem.getAttribute('spin') || Suica.DEFAULT.GROUP.SPIN;

		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, spin:true} );

		elem.suicaObject = p;		
		
		return p;
		
	} // HTMLParser.parseTagGROUP
	
	
	// <clone id="..." src="..." center="..." color="..." size="..." spin="...">
	parseTagCLONE( suica, elem )
	{
		var sourceId = elem.getAttribute('src');
		if( !window[sourceId] )
		{
			console.error( `error: unknown object name '${sourceId}' in attribute 'src' of tag <clone>` );
			return;
		}

		var p = window[sourceId].clone;

		if( elem.hasAttribute('center') ) p.center = elem.getAttribute('center');
		if( elem.hasAttribute('size') ) p.size = Suica.parseSize( elem.getAttribute('size') );
		if( elem.hasAttribute('spin') ) p.spin = elem.getAttribute('spin');
		if( elem.hasAttribute('color') ) p.color = elem.getAttribute('color');

		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, spin:true, wireframe:true} );

		elem.suicaObject = p;		
		
		return p;
		
	} // HTMLParser.parseTagGROUP
	
} // HTMLParser

