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
		this.openDrawing = false;
		
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
//console.log('tagName=',tagName);
			
			var parseMethod = this['parseTag'+tagName];
			if( parseMethod )
			{
				newObject = parseMethod( this.suica, tagElement );
				
				// if there is open group, add the new object to the latest open group
				if( this.openGroups.length )
					this.openGroups[ this.openGroups.length-1 ].add( newObject );
			}
			// else
				// console.error( `error: unknown tag <${tagName}> in <${that.tagName}>` );

			// if this tag is <group> then mark the gorup as open
			// new objects will be automatically added to the latest open group
			if( tagName == 'GROUP' )
			{
				this.openGroups.push( newObject );
			}

			// if this tag is <drawing> then mark the drawing as open
			// new drawing commands will be automatically added to the latest open drawing
			if( tagName == 'DRAWING' || tagName == 'SHAPE' )
			{
				if( this.openDrawing ) throw 'Cannot start a drawing/shape inside another drawing/shape';
				
				this.openDrawing = true;
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
			if( tagName == 'DRAWING' || tagName == 'SHAPE' )
			{
				this.openDrawing = false;
			}

		}
	} // HTMLParser.parseTagsInElement
		
	// parseTagBUTTON( suica, elem ) {}
	// parseTagCANVAS( suica, elem ) {}
	// parseTagDIV( suica, elem ) {}
	// parseTagSPAN( suica, elem ) {}
	// parseTagIMG( suica, elem ) {}
	// parseTagBR( suica, elem ) {}
	// parseTagSMALL( suica, elem ) {}
	
	// <oxyz size="..." color="...">
	parseTagOXYZ( suica, elem )
	{
		suica.oxyz(
			elem.getAttribute('size'),
			elem.getAttribute('color')
		);
	} // HTMLParser.parseTagOXYZ
	
	
	// <demo distance="..." altitude="..." speed="...">
	parseTagDEMO( suica, elem )
	{
		suica.demo(
			elem.getAttribute('distance'),
			elem.getAttribute('altitude'),
			elem.getAttribute('speed'),
		);
	} // HTMLParser.parseTagDEMO
	
	
	// <orbit id="..." distance="..." altitude="..." speed="...">
	parseTagORBIT( suica, elem )
	{
		var p = suica.orbit(
			elem.getAttribute('distance'),
			elem.getAttribute('altitude'),
			elem.getAttribute('speed'),
		);

		// list of properties: https://threejs.org/docs/#examples/en/controls/OrbitControls
		var numericProperties = [ 'autoRotateSpeed', 'dampingFactor', 'keyPanSpeed', 'maxAzimuthAngle', 'maxDistance', 'maxPolarAngle', 'maxZoom', 'minAzimuthAngle', 'minDistance', 'minPolarAngle', 'minZoom', 'panSpeed', 'rotateSpeed', 'zoomSpeed' ];
		
		var name;
		
		for( name of numericProperties )
			if( elem.hasAttribute(name) ) p[name] = Number(elem.getAttribute(name));

		var booleanProperties = [ 'autoRotate', 'enabled', 'enableDamping', 'enablePan', 'enableRotate', 'enableZoom', 'screenSpacePanning' ];
		
		for( name of booleanProperties )
			if( elem.hasAttribute(name) ) p[name] = Drawing.parseBool( elem, name, null, true ); 

		suica.parserReadonly.parseAttributes( elem, p );

		elem.suicaObject = p;
		
		return p;
	} // HTMLParser.parseTagORBIT
	
	
	// <trackball id="..." distance="..." altitude="...">
	parseTagTRACKBALL( suica, elem )
	{
		var p = suica.trackball(
			elem.getAttribute('distance'),
			elem.getAttribute('altitude'),
		);

		// list of properties: https://threejs.org/docs/#examples/en/controls/TrackballControls
		var numericProperties = [ 'dynamicDampingFactor', 'maxDistance', 'minDistance', 'panSpeed', 'rotateSpeed', 'zoomSpeed'  ];
		
		var name;
		
		for( name of numericProperties )
			if( elem.hasAttribute(name) ) p[name] = Number(elem.getAttribute(name));

		var booleanProperties = [ 'enabled', 'noPan', 'noRotate', 'noZoom', 'staticMoving' ];
		
		for( name of booleanProperties )
			if( elem.hasAttribute(name) ) p[name] = Drawing.parseBool( elem, name, null, true ); 

		suica.parserReadonly.parseAttributes( elem, p );

		elem.suicaObject = p;
		
		return p;
	} // HTMLParser.parseTagTRACKBALL
	
	
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
			elem.getAttribute('distance') || Suica.ANAGLYPH.DISTANCE
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
			elem.getAttribute('distance') || Suica.STEREO.DISTANCE
		);
	} // HTMLParser.parseTagSTEREO
	
	
	// <perspective fov="..." near="..." far="...">
	parseTagPERSPECTIVE( suica, elem )
	{
		suica.perspective(
			elem.getAttribute('near') || Suica.PERSPECTIVE.NEAR,
			elem.getAttribute('far') || Suica.PERSPECTIVE.FAR,
			elem.getAttribute('fov') || Suica.PERSPECTIVE.FOV
		);
	} // HTMLParser.parseTagPERSPECTIVE
	
	
	// <orthographic near="..." far="...">
	parseTagORTHOGRAPHIC( suica, elem )
	{
		suica.perspective(
			elem.getAttribute('near') || Suica.ORTHOGRAPHIC.NEAR,
			elem.getAttribute('far') || Suica.ORTHOGRAPHIC.FAR
		);
	} // HTMLParser.parseTagORTHOGRAPHIC
	
	
	// <lookAt from="..." to="..." up="...">
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
		if( parseOptions.center )
		{
			if( elem.hasAttribute('center') ) object.center = elem.getAttribute('center'); 
		}

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
			if( elem.hasAttribute('spinS') ) object.spinS = elem.getAttribute('spinS'); 
		}
		
		if( parseOptions.wireframe )
		{
			if( elem.hasAttribute('wireframe') ) object.wireframe = ['','true','yes','1'].indexOf(elem.getAttribute('wireframe').toLowerCase()) >= 0;
		}
		
		if( parseOptions.visible )
		{
			if( elem.hasAttribute('visible') ) object.visible = ['','true','yes','1'].indexOf(elem.getAttribute('visible').toLowerCase()) >= 0;
			if( elem.hasAttribute('hidden') ) object.visible = ['','true','yes','1'].indexOf(elem.getAttribute('hidden').toLowerCase()) < 0;
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
		
		// onevent names
		parseEvent( 'onpointermove',	'onpointermove' );
		parseEvent( 'onpointerleave',	'onpointerleave' );
		parseEvent( 'onpointerenter',	'onpointerenter' );
		parseEvent( 'onpointerdown',	'onpointerdown' );
		parseEvent( 'onpointerup',		'onpointerup' );
		parseEvent( 'onclick',			'onclick' );
		parseEvent( 'onload',			'onload' );
		//parseEvent( 'ondblclick',		'ondblclick' );

		// event names
		parseEvent( 'onpointermove',	'pointermove' );
		parseEvent( 'onpointerleave',	'pointerleave' );
		parseEvent( 'onpointerenter',	'pointerenter' );
		parseEvent( 'onpointerdown',	'pointerdown' );
		parseEvent( 'onpointerup',		'pointerup' );
		parseEvent( 'onclick',			'click' );
		parseEvent( 'onload',			'load' );
//		//parseEvent( 'ondblclick',		'dblclick' );
		
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
		
		suica.parserReadonly.parseAttributes( elem, p, {visible: true} );

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

		suica.parserReadonly.parseAttributes( elem, p, {visible: true} );

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
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, wireframe:true, spin:true, visible: true} );

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
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, wireframe:true, spin:true, visible: true} );

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
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, wireframe:true, spin:true, visible: true} );

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
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, wireframe:true, spin:true, visible: true} );

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
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, spin:true, visible: true} );

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
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, spin:true, visible: true} );

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
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, wireframe:true, spin:true, visible: true} );

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
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, spin:true, visible: true} );

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
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, wireframe:true, spin:true, visible: true} );

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
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, spin:true, visible: true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagTUBE


	// <surface id="..." center="..." curve="..." count="..." color="..." size="...">
	parseTagSURFACE( suica, elem )
	{
		var p = suica.surface(
			elem.getAttribute('center'),
			elem.getAttribute('curve'),
			elem.getAttribute('count'),
			elem.getAttribute('size'),
			elem.getAttribute('color')
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, spin:true, visible: true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagSURFACE


	// <model id="..." src="..." center="..." size="...">
	parseTagMODEL( suica, elem )
	{
		var p = suica.model(
			elem.getAttribute('src'),
			elem.getAttribute('center'),
			elem.getAttribute('size')
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, spin:true, visible: true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagMODEL


	// <text3d id="..." text="..." font="..." center="..." size="..." color="...">
	parseTagTEXT3D( suica, elem )
	{
		var p = suica.text3d(
			elem.getAttribute('text'),
			elem.getAttribute('font'),
			elem.getAttribute('center'),
			elem.getAttribute('size'),
			elem.getAttribute('color'),
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, spin:true, visible: true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagTEXT3D


	// <capture src="..." time="..." fps="..." format="..." skipFrames="...">
	parseTagCAPTURE( suica, elem )
	{
		var p = suica.capture(
			elem.getAttribute('src'),
			elem.getAttribute('time'),
			elem.getAttribute('fps'),
			elem.getAttribute('format'),
			elem.getAttribute('skipFrames'),
		);
		
		// capture is not an object:
		//suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, spin:true} );
		//elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagCAPTURE


	// <construct id="..." src="..." center="..." size="..." color="...">
	parseTagCONSTRUCT( suica, elem )
	{
		var p = suica.construct(
			elem.getAttribute('src'),
			elem.getAttribute('size'),
			elem.getAttribute('color')
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, spin:true, center:true, visible: true} );

		elem.suicaObject = p;
		
		return p;
		
	} // HTMLParser.parseTagCONSTRUCT


	// <spline src="x,y,z; x,y,z; x,y,z; ..." interpolating="..." approximating="..." open="..." closed="...">
	// <spline src="func_name" interpolating="..." approximating="..." open="..." closed="...">
	parseTagSPLINE( suica, elem )
	{
		var src = elem.getAttribute('src') || Suica.SPLINE.POINTS,
			closed = Drawing.parseBool( elem, 'closed', 'open', Suica.SPLINE.CLOSED ),
			interpolating = Drawing.parseBool( elem, 'interpolating', 'approximating', Suica.SPLINE.INTERPOLANT );
		
		var p = spline( src, closed, interpolating );
		
		suica.parserReadonly.parseAttributes( elem, p, {} );

		//elem.suicaObject = p; <-- now, spline is not an object
		
		return p;
	} // HTMLParser.parseTagSPLINE


	// <splane src="x,y,z; x,y,z; | ..." interpolating="...,..." approximating="...,..." open="...,..." closed="...,...">
	// <spline src="func_name" interpolating="...,..." approximating="...,..." open="...,..." closed="...,...">
	parseTagSPLANE( suica, elem )
	{
		var src = elem.getAttribute('src') || Suica.SPLANE.POINTS,
			closed = Drawing.parseBoolArray( elem, 'closed', 'open', Suica.SPLANE.CLOSED ),
			interpolating = Drawing.parseBoolArray( elem, 'interpolating', 'approximating', Suica.SPLANE.INTERPOLANT );

		var p = splane( src, closed, interpolating );
		
		suica.parserReadonly.parseAttributes( elem, p, {} );

		//elem.suicaObject = p; <-- now, splane is not an object
		
		return p;
	} // HTMLParser.parseTagSPLANE


	
	// <group id="..." center="..." color="..." size="..." spin="...">
	parseTagGROUP( suica, elem )
	{
		var p = suica.group();
		
		if( elem.hasAttribute('center') ) p.center = elem.getAttribute('center');
		if( elem.hasAttribute('size') ) p.size = elem.getAttribute('size');
		if( elem.hasAttribute('spin') ) p.spin = elem.getAttribute('spin');

		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, spin:true, visible: true} );

		elem.suicaObject = p;		
		
		return p;
		
	} // HTMLParser.parseTagGROUP
	
	
	// <convex src="x,y,z; x,y,z; x,y,z; ..." center="..." size="..." color="...">
	parseTagCONVEX( suica, elem )
	{
		var points = elem.getAttribute('src');
			points = Suica.evaluate( '[['+points.replaceAll(';','],[')+']]' );

		var p = convex(
			points,
			elem.getAttribute('size'),
			elem.getAttribute('color')
		);
		
		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, spin:true, visible: true} );

		elem.suicaObject = p;
		
		return p;
	} // HTMLParser.parseTagCONVEX
	
	
	// <extrude src="shape, shape, ..." center size color radius offset count="..., ...">
	parseTagEXTRUDE( suica, elem )
	{
		var src = elem.getAttribute('src');
			src = Suica.evaluate( '['+src+']' );

		var p = extrude(
			src,
			elem.getAttribute('center'),
			elem.getAttribute('size'),
			elem.getAttribute('color')
		);
		
		p.radius = Drawing.parseN( elem, 'radius', Extrude.RADIUS );
		p.offset = Drawing.parseN( elem, 'offset', Extrude.OFFSET );
		p.count = Suica.parseSize( elem.getAttribute('count'), [Extrude.COUNT, Extrude.SHAPECOUNT] );

		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, spin:true, visible: true} );

		elem.suicaObject = p;
		
		return p;
	} // HTMLParser.parseTagEXTRUDE


	
	// <clone id="..." src="..." center="..." color="..." size="..." spin="...">
	parseTagCLONE( suica, elem )
	{
		var sourceId, p;
		
		if( elem.hasAttribute('src') )
		{
			sourceId = elem.getAttribute('src');
			if( !window[sourceId] )
			{
				console.error( `error: unknown object name '${sourceId}' in attribute 'src' of tag <clone>` );
				return;
			}

			p = window[sourceId].clone;
		}
		else
		{
			p = its.clone;
		}
		
		if( elem.hasAttribute('center') ) p.center = elem.getAttribute('center');
		if( elem.hasAttribute('size') ) p.size = Suica.parseSize( elem.getAttribute('size') );
		if( elem.hasAttribute('spin') ) p.spin = elem.getAttribute('spin');
		if( elem.hasAttribute('color') ) p.color = elem.getAttribute('color');

		suica.parserReadonly.parseAttributes( elem, p, {widthHeight:true, depth:true, spin:true, wireframe:true, visible: true} );

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


	
	// <drawing id="..." count="...">
	parseTagSHAPE( suica, elem )
	{
		var p = shape( elem.getAttribute('count') );

		var id = elem.getAttribute('id');
		if( id ) window[id] = p;

		elem.suicaObject = p;		
		
		return p;
		
	} // HTMLParser.parseTagSHAPE


	
	// <moveto point="x,y">
	// <moveto x="..." y="...">
	parseTagMOVETO( suica, elem )
	{
		moveTo( ...Drawing.parseXY( elem, 'point', 'x', 'y' ) );
	} // HTMLParser.parseTagMOVETO


	// <lineto point="x,y">
	// <lineto x="..." y="...">
	parseTagLINETO( suica, elem )
	{
		lineTo( ...Drawing.parseXY( elem, 'point', 'x', 'y' ) );
	} // HTMLParser.parseTagLINETO


	// <curveto m="mx,my" point="x,y">
	// <curveto mx="..." my="..." x="..." y="...">
	parseTagCURVETO( suica, elem )
	{
		var m = Drawing.parseXY( elem, 'm', 'mx', 'my' );
		curveTo( ...m, ...Drawing.parseXY( elem, 'point', 'x', 'y' ) );
	} // HTMLParser.parseTagCURVETO


	// <arc point="..." x="..." y="..." radius="..." from="..." to="..." cw cw="..." ccw ccw="ccw">
	parseTagARC( suica, elem )
	{
		var radius = Drawing.parseN( elem, 'radius', Drawing.ARC_RADIUS ),
			from = Drawing.parseN( elem, 'from', Drawing.ARC_FROM ),
			to = Drawing.parseN( elem, 'to', Drawing.ARC_TO );

		arc(
			...Drawing.parseXY( elem, 'point', 'x', 'y' ),
			radius,
			from,
			to,
			Drawing.parseBool( elem, 'cw', 'ccw', Drawing.ARC_CW ) 
		);
	} // HTMLParser.parseTagARC


	// <stroke color="..." width="..." closed closed="...">
	parseTagSTROKE( suica, elem )
	{
		var color = elem.getAttribute('color') || Suica.DEFAULT.STROKE.COLOR,
			width = Drawing.parseN( elem, 'width', Drawing.STROKE_WIDTH ),
			closed = Drawing.parseBool( elem, 'closed', '', Drawing.STROKE_CLOSED );
		
		if( elem.hasAttribute('closed') && elem.getAttribute('closed')=="") closed = true;

		stroke( color, width, closed );
	} // HTMLParser.parseTagSTROKE


	// <fill color="...">
	parseTagFILL( suica, elem )
	{
		var color = elem.getAttribute('color') || Drawing.FILL_COLOR;

		fill( color );
	} // HTMLParser.parseTagFILL


	// <fillText point="..." x="..." y="..." text="..." color="..." font="...">
	parseTagFILLTEXT( suica, elem )
	{
		var text = elem.getAttribute('text') || '',
			color = elem.getAttribute('color') || Drawing.FILL_COLOR,
			font = elem.getAttribute('font') || Drawing.FONT;
		
		fillText( ...Drawing.parseXY( elem, 'point', 'x', 'y' ), text, color, font );
	} // HTMLParser.parseTagFILLTEXT


	// <clear color="...">
	parseTagCLEAR( suica, elem )
	{
		var color = elem.getAttribute('color') || elem.getAttribute('background');

		clear( color );
	} // HTMLParser.parseTagCLEAR

	
	// <scorm name="...">
	parseTagSCORM( suica, elem )
	{
		HTMLParser.parseTagSCORM( elem );
	}
	static parseTagSCORM( elem )
	{
		var name = elem.innerHTML,
			value = '';
		
		if( scorm.api )
		{
			value = scorm[name] || scorm.getValue( name );
		}
		
		elem.innerHTML = value;
	} // HTMLParser.parseTagSCORM

} // HTMLParser


	
