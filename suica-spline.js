//
// Suica 2.0 Spline
// CC-3.0-SA-NC
//
//
//===================================================



class SuicaCurve extends THREE.Curve
{
	constructor( curve )
	{
		super();
		
		if( curve instanceof SuicaSplineCurve )
		{
			this.spline = curve;
		}
		else
		if( curve instanceof Array )
		{
			this.spline = new SuicaSplineCurve( curve );
		}
		else
		{
			this._getPoint = curve;
		}
	} // SuicaCurve.constructor

	
	getPoint( u, optionalTarget = new THREE.Vector3() )
	{
		var point = this.spline?.getPoint( u ) || this._getPoint( u );
		optionalTarget.set( point[0]||0, point[1]||0, point[2]||0 );
		optionalTarget.radius = point[3];
		return optionalTarget;
	} // SuicaCurve.getPoint
	
} // SuicaCurve




class SuicaSplineCurve extends THREE.Curve
{

	constructor( points=Suica.DEFAULT.SPLINE.POINTS, closed=Suica.DEFAULT.SPLINE.CLOSED, interpolant=Suica.DEFAULT.SPLINE.INTERPOLANT  )
	{

		super();
		
		if( !points.length ) points = Suica.DEFAULT.SPLINE.POINTS;
		
		this.closed = closed;
		this.interpolant = interpolant;
		this.points = points;
	} // SuicaSplineCurve.constructor


	getPoint( t )
	{

		var points = this.points,
			p = (points.length-(this.closed?0:1)) * t;
		var intPoint = Math.floor( p ),
			t = p - intPoint,
			t2 = t*t,
			t3 = t2*t;

		var p0, p1, p2, p3;
		
		if( this.closed )
		{
			p0 = points[ (intPoint+points.length-1)%points.length ];
			p1 = points[ (intPoint+points.length  )%points.length ];
			p2 = points[ (intPoint+points.length+1)%points.length ];
			p3 = points[ (intPoint+points.length+2)%points.length ];
		}
		else
		{
			p0 = points[ intPoint === 0 ? intPoint : intPoint-1 ];
			p1 = points[ intPoint ];
			p2 = points[ intPoint > points.length-2 ? points.length-1 : intPoint+1 ];
			p3 = points[ intPoint > points.length-3 ? points.length-1 : intPoint+2 ];
		}
		
		function catmullRom( p0, p1, p2, p3 )
		{
			var v0 = (p2-p0) * 0.5,
				v1 = (p3-p1) * 0.5;
			return (2*p1-2*p2+v0+v1)*t3 + (-3*p1+3*p2-2*v0-v1)*t2 + v0*t + p1;
		}

		function bSpline( p0, p1, p2, p3 )
		{
			return (p0*(1-3*t+3*t2-t3) + p1*(4-6*t2+3*t3) + p2*(1+3*t+3*t2-3*t3) + p3*t3)/6;
		}

		var splineFunction = this.interpolant ? catmullRom : bSpline;
		
		var point = [
			splineFunction( p0[0], p1[0], p2[0], p3[0] ),
			splineFunction( p0[1], p1[1], p2[1], p3[1] ),
			splineFunction( p0[2], p1[2], p2[2], p3[2] )	
		];

		if( typeof p0[3] !== 'undefined' )
			point.push( splineFunction( p0[3], p1[3], p2[3], p3[3] ) );
		
		return point;
	} // SuicaSplineCurve.getPoint
	
} // SuicaSplineCurve




window['spline'] = function( points, closed=Suica.DEFAULT.SPLINE.CLOSED, interpolant=Suica.DEFAULT.SPLINE.INTERPOLANT )
{
	return new SuicaSplineCurve( points, closed, interpolant );
}


