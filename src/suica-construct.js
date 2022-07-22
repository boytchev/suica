//
// Suica 2.0 Construct
// CC-3.0-SA-NC
//
//
//===================================================



class Construct extends Mesh
{
	static SIZE = [1,1,1];
	static COLOR = 'lightsalmon';

	constructor( suica, expression, size, color )
	{
		suica.parser?.parseTags();
		suica.debugCall( 'construct', expression, size, color );

		var p = new THREE.Mesh();
		
		if( expression )
		{
			expression = '('+expression+')';
			
			// tokenize
			
			var tokens = '';
			for( var i=0; i<expression.length; i++ )
			{
				var ch = expression[i];
				if( '*+-()'.indexOf(ch) > -1 ) ch = ' '+ch+' ';
				tokens += ch;
			}
			tokens = tokens.split(' ').filter( token => token );

			// parse

			var polish = [],
				stack = [],
				p, q, token;
				
			for( token of tokens )
			{
				switch( token )
				{
					case ')':
						while( p=stack.pop(), p != '(' )
							polish.push( p );
						break;

					case '+':
					case '-':
						while( p=stack.pop(), p == '*' || p == '+' || p == '-' )
							polish.push( p );
						if( p ) stack.push( p ); // no break!

					case '(':
					case '*':
						stack.push( token );
						break;

					default:
						polish.push( token );
				}
			}
					
	//console.log( expression );
	//console.log( tokens );
	//console.log( polish );
			
			// evaluate
			console.assert( stack.length==0 );

			var csg;
			stack = [];
			for( token of polish )
				switch( token )
				{
					case '*':
						csg = new CSG();
						q = stack.pop();
						p = stack.pop();
						stack.push( csg.intersect([p,q]).toMesh() );
						break;
					case '+':
						csg = new CSG();
						q = stack.pop();
						p = stack.pop();
						stack.push( csg.union([p,q]).toMesh() );
						break;
					case '-':
						csg = new CSG();
						q = stack.pop();
						p = stack.pop();
						stack.push( csg.subtract([p,q]).toMesh() );
						break;
					default:
						stack.push( Suica.evaluate(token).threejs );
				}
			
			p = stack.pop();
			p.material = p.material.clone();
		}
		
		super( suica, 
			p,
			null, // no wireframe
		);
		
		this.center = [0,0,0];
		this.size = Suica.parseSize( size, Construct.SIZE );
		this.color = Suica.parseColor( color, Construct.COLOR);

	} // Construct.constructor


	get clone( )
	{
		var object = new Construct( this.suica, '', this.size, this.color );
		
		object.threejs.material = this.threejs.material.clone();
		object.threejs.geometry = this.threejs.geometry.clone();
		
		object.spin = this.spin;
		object.image = this.image;
		object.visible = this.visible;

		Suica.cloneEvents( object, this );
		
		return object;
		
	} // Construct.clone


} // class Construct
