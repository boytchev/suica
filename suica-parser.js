//
// Suica 2.0 Parser
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

		this.openGroups = [];
		this.openDrawings = [];
		
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

			//console.log('tagName=',tagName);
			
			var parseMethod = this['parseTag'+tagName];
			if( parseMethod )
			{
				newObject = parseMethod( this.suica, tagElement );
				
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

			// if this tag is <drawing> then mark the drawing as open
			// new drawing commands will be automatically added to the latest open drawing
			if( tagName == 'DRAWING' )
			{
				this.openDrawings.push( newObject );
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

			// is this tag is </drawing> then close the drawing
			if( tagName == 'DRAWING' )
			{
				this.openDrawings.pop( );
			}

		}
	} // HTMLParser.parseTagsInElement
		
	parseTagBUTTON( suica, elem ) {}
	parseTagCANVAS( suica, elem ) {}
	parseTagDIV( suica, elem ) {}
	parseTagSPAN( suica, elem ) {}
	
	// <oxyz size="..." color="...">
	parseTagOXYZ( suica, elem )
	{
		suica.oxyz(
			elem.getAttribute('size'),
			elem.getAttribute('color')
		);
	} // HTMLParser.parseTagOXYZ
	
	
	// <demo distance="..." altitude="...">
	parseTagDEMO( suica, elem )
	{
		suica.demo(
			elem.getAttribute('distance'),
			elem.getAttribute('altitude')
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
	
	
	// <proactive>
	parseTagPROACTIVE( suica, elem )
	{
		suica.proactive();
	} // HTMLParser.parseTagPROACTIVE
	
	
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
			elem.getAttribute('color')
		);
	} // HTMLParser.parseTagBACKGROUND
	
		
	
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
			if( elem.hasAttribute('spinH') ) object.spinH = elem.getAttribute('spinH'); 
			if( elem.hasAttribute('spinV') ) object.spinV = elem.getAttribute('spinV'); 
			if( elem.hasAttribute('spinT') ) object.spinT = elem.getAttribute('spinT'); 
		}
		
		if( parseOptions.wireframe )
		{
			if( elem.hasAttribute('wireframe') ) object.wireframe = ['','true','yes','1'].indexOf(elem.getAttribute('wireframe').toLowerCase()) >= 0;
		}


		
		// parse id
		var id = elem.getAttribute('id');
		if( id )
		{
			window[id] = object;
			object.id = id;
		}
		
		this.parseEvents( elem, object );
	}
	
	
	parseEvents( tag, object, suica=null )
	{
		// parse events
		function parseEvent( actualName, name )
		{
			if( tag.hasAttribute(name) )
			{
		
				object[actualName] = tag.getAttribute(name);

				// if event is set to Suica.canvas, it cannot be set as a string,
				// (the browser just ignores this value), so we add a custom
				// event handler that creates the event handler the first time
				// it is called
				if( !object[actualName] )
				{
					object[actualName] = function(event)
					{
						object[actualName] = window[tag.getAttribute(name)];
						object[actualName]( event );
					}
				}
			}
		}
		
		parseEvent( 'onmousemove',	'onmousemove' );
		parseEvent( 'onmouseleave',	'onmouseleave' );
		parseEvent( 'onmouseenter', 'onmouseenter' );
		parseEvent( 'onmousedown',	'onmousedown' );
		parseEvent( 'onmouseup',	'onmouseup' );
		parseEvent( 'onclick',		'onclick' );
		//parseEvent( 'ondblclick',	'ondblclick' );

		parseEvent( 'onmousemove',	'mousemove' );
		parseEvent( 'onmouseleave',	'mouseleave' );
		parseEvent( 'onmouseenter', 'mouseenter' );
		parseEvent( 'onmousedown',	'mousedown' );
		parseEvent( 'onmouseup',	'mouseup' );
		parseEvent( 'onclick',		'click' );
		//parseEvent( 'ondblclick',	'dblclick' );
		
		if( suica )
		{
			object = suica;
			parseEvent( 'ontime',	'ontime' );
			parseEvent( 'ontime',	'time' );
		}
	}
	
	
	// <point id="..." center="..." color="..." size="...">
	parseTagPOINT( suica, elem )
	{
		var p = suica.point(
			elem.getAttribute('center'),
			elem.getAttribute('size'),
			elem.getAttribute('color')
		);
		
		suica.parserReadonly.parseAttributes( elem, p );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagPOINT
	
	
	// <line id="..." center="..." color="..." to="...">
	parseTagLINE( suica, elem )
	{
		var p = suica.line(
			elem.getAttribute('center') || elem.getAttribute('from'),
			elem.getAttribute('to'),
			elem.getAttribute('color')
		);

		suica.parserReadonly.parseAttributes( elem, p );

		var id = elem.getAttribute('id');
		if( id ) window[id] = p;
		
		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagLINE
	
	
	// <square id="..." center="..." color="..." size="..." wireframe="...">
	parseTagSQUARE( suica, elem )
	{
		var p = suica.square(
			elem.getAttribute('center'),
			elem.getAttribute('size'),
			elem.getAttribute('color')
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, wireframe:true, spin:true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagSQUARE
	
	
	// <cube id="..." center="..." color="..." size="..." wireframe="...">
	parseTagCUBE( suica, elem )
	{
		var p = suica.cube(
			elem.getAttribute('center'),
			elem.getAttribute('size'),
			elem.getAttribute('color')
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, wireframe:true, spin:true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagCUBE
	
	
	// <circle id="..." center="..." color="..." size="..." wireframe="...">
	parseTagCIRCLE( suica, elem )
	{
		var p = suica.circle(
			elem.getAttribute('center'),
			elem.getAttribute('size'),
			elem.getAttribute('color')
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, wireframe:true, spin:true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagCIRCLE
	
	
	// <polygon id="..." center="..." color="..." size="..." count="..." wireframe="...">
	parseTagPOLYGON( suica, elem )
	{
		var p = suica.polygon(
			elem.getAttribute('count'),
			elem.getAttribute('center'),
			elem.getAttribute('size'),
			elem.getAttribute('color')
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, wireframe:true, spin:true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagPOLYGON
	

	// <sphere id="..." center="..." color="..." size="...">
	parseTagSPHERE( suica, elem )
	{
		var p = suica.sphere(
			elem.getAttribute('center'),
			elem.getAttribute('size'),
			elem.getAttribute('color')
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, spin:true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagSPHERE
	
	
	// <cylinder id="..." center="..." color="..." size="...">
	parseTagCYLINDER( suica, elem )
	{
		var p = suica.cylinder(
			elem.getAttribute('center'),
			elem.getAttribute('size'),
			elem.getAttribute('color')
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, spin:true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagCYLINDER
	
	
	// <prism id="..." center="..." color="..." size="..." count="..." wireframe="...">
	parseTagPRISM( suica, elem )
	{
		var p = suica.prism(
			elem.getAttribute('count'),
			elem.getAttribute('center'),
			elem.getAttribute('size'),
			elem.getAttribute('color')
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, wireframe:true, spin:true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagPRISM
	
	
	// <cone id="..." center="..." color="..." size="...">
	parseTagCONE( suica, elem )
	{
		var p = suica.cone(
			elem.getAttribute('center'),
			elem.getAttribute('size'),
			elem.getAttribute('color')
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, spin:true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagCONE
	
	
	// <pyramid id="..." center="..." color="..." size="..." count="..." wireframe="...">
	parseTagPYRAMID( suica, elem )
	{
		var p = suica.pyramid(
			elem.getAttribute('count'),
			elem.getAttribute('center'),
			elem.getAttribute('size'),
			elem.getAttribute('color')
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, wireframe:true, spin:true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagPYRAMID


	// <tube id="..." center="..." curve="..." radius="..." count="..." color="..." size="...">
	parseTagTUBE( suica, elem )
	{
		var p = suica.tube(
			elem.getAttribute('center'),
			elem.getAttribute('curve'),
			elem.getAttribute('radius'),
			elem.getAttribute('count'),
			elem.getAttribute('size'),
			elem.getAttribute('color')
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, spin:true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagTUBE


	// <spline src="x,y,z; x,y,z; x,y,z; ..." interpolating="..." approximating="..." open="..." closed="...">
	// <spline src="func_name" interpolating="..." approximating="..." open="..." closed="...">
	parseTagSPLINE( suica, elem )
	{
		var src = elem.getAttribute('src') || Suica.DEFAULT.SPLINE.POINTS,
			closed = Drawing.parseBool( elem, 'closed', 'open', Suica.DEFAULT.SPLINE.CLOSED ),
			interpolating = Drawing.parseBool( elem, 'interpolating', 'approximating', Suica.DEFAULT.SPLINE.INTERPOLANT );
		
		var p = spline( src, closed, interpolating );
		
		suica.parserReadonly.parseAttributes( elem, p, {} );

		//elem.suicaObject = p; <-- now, spline is not an object
		
		return p;
	} // HTMLParser.parseTagSPLINE


	
	// <group id="..." center="..." color="..." size="..." spin="...">
	parseTagGROUP( suica, elem )
	{
		var p = suica.group();
		
		if( elem.hasAttribute('center') ) p.center = elem.getAttribute('center');
		if( elem.hasAttribute('size') ) p.size = elem.getAttribute('size');
		if( elem.hasAttribute('spin') ) p.spin = elem.getAttribute('spin');

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

	
	// <drawing id="..." color="..." size="..." width="..." height="...">
	parseTagDRAWING( suica, elem )
	{
		var color = elem.getAttribute('color') || Drawing.COLOR;
		var width = elem.getAttribute('width') || Drawing.SIZE;
		var height = elem.getAttribute('height') || width;

		// process size=n and size=n,m
		if( elem.hasAttribute('size') )
		{
			var size = Suica.parseSize( elem.getAttribute('size') );
			if( Array.isArray(size) )
			{
				if( size.length==1 )
					width = height = size[0];
				else
				if( size.length==2 )
				{
					width = size[0];
					height = size[1];
				}
			}
			else
			{
				width = height = size;
			}
		}

		var p = drawing( width, height, color );

		var id = elem.getAttribute('id');
		if( id ) window[id] = p;

		elem.suicaObject = p;		
		
		return p;
		
	} // HTMLParser.parseTagDRAWING


	
	// <moveto center="x,y">
	// <moveto x="..." y="...">
	parseTagMOVETO( suica, elem )
	{
		moveTo( ...Drawing.parseXY( elem, 'center', 'x', 'y' ) );
	} // HTMLParser.parseTagMOVETO


	// <lineto center="x,y">
	// <lineto x="..." y="...">
	parseTagLINETO( suica, elem )
	{
		lineTo( ...Drawing.parseXY( elem, 'center', 'x', 'y' ) );
	} // HTMLParser.parseTagLINETO


	// <curveto m="mx,my" center="x,y">
	// <curveto mx="..." my="..." x="..." y="...">
	parseTagCURVETO( suica, elem )
	{
		var m = Drawing.parseXY( elem, 'm', 'mx', 'my' );
		curveTo( ...m, ...Drawing.parseXY( elem, 'center', 'x', 'y' ) );
	} // HTMLParser.parseTagCURVETO


	// <arc center="..." x="..." y="..." radius="..." from="..." to="..." cw cw="..." ccw ccw="ccw">
	parseTagARC( suica, elem )
	{
		var radius = Drawing.parseN( elem, 'radius', Drawing.ARC_RADIUS ),
			from = Drawing.parseN( elem, 'from', Drawing.ARC_FROM ),
			to = Drawing.parseN( elem, 'to', Drawing.ARC_TO );

		arc(
			...Drawing.parseXY( elem, 'center', 'x', 'y' ),
			radius,
			from,
			to,
			Drawing.parseBool( elem, 'cw', 'ccw', Drawing.ARC_CW ) 
		);
	} // HTMLParser.parseTagARC


	// <stroke color="..." width="..." close close="...">
	parseTagSTROKE( suica, elem )
	{
		var color = elem.getAttribute('color') || Suica.DEFAULT.STROKE.COLOR,
			width = Drawing.parseN( elem, 'width', Drawing.STROKE_WIDTH ),
			close = Drawing.parseBool( elem, 'close', '', Drawing.STROKE_CLOSE );
		
		if( elem.hasAttribute('close') && elem.getAttribute('close')=="") close = true;

		stroke( color, width, close );
	} // HTMLParser.parseTagSTROKE


	// <fill color="...">
	parseTagFILL( suica, elem )
	{
		var color = elem.getAttribute('color') || Drawing.FILL_COLOR;

		fill( color );
	} // HTMLParser.parseTagFILL


	// <fillText center="..." x="..." y="..." text="..." color="..." font="...">
	parseTagFILLTEXT( suica, elem )
	{
		var text = elem.getAttribute('text') || '',
			color = elem.getAttribute('color') || Drawing.FILL_COLOR,
			font = elem.getAttribute('font') || Drawing.FONT;
		
		fillText( ...Drawing.parseXY( elem, 'center', 'x', 'y' ), text, color, font );
	} // HTMLParser.parseTagFILLTEXT


	// <clear color="...">
	parseTagCLEAR( suica, elem )
	{
		var color = elem.getAttribute('color') || elem.getAttribute('background');

		clear( color );
	} // HTMLParser.parseTagCLEAR

	
} // HTMLParser

