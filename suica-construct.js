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
			p, q;
			
		for( var token of tokens )
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
		
		
console.log( expression );
console.log( tokens );
console.log( polish );
		
		// evaluate
		console.assert( stack.length==0 );
		stack = [];
		for( var token of polish )
			switch( token )
			{
				case '*':
					var csg = new CSG();
					q = stack.pop();
					p = stack.pop();
					stack.push( csg.intersect([p,q]).toMesh() );
					break;
				case '+':
					var csg = new CSG();
					q = stack.pop();
					p = stack.pop();
					stack.push( csg.union([p,q]).toMesh() );
					break;
				case '-':
					var csg = new CSG();
					q = stack.pop();
					p = stack.pop();
					stack.push( csg.subtract([p,q]).toMesh() );
					break;
				default:
					stack.push( Suica.evaluate(token).threejs );
			}
		// var geometry = Convex.generateGeometry( points );
		
		p = stack.pop();
		p.material = p.material.clone();
		
		super( suica, 
			p,
			null, // no wireframe
		);
		
		this.center = [0,0,0];
		this.size = Suica.parseSize( size, Construct.SIZE );
		this.color = Suica.parseColor( color, Construct.COLOR);

	} // Construct.constructor


} // class Construct
