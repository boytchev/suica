//
// Suica 2.0 Helper
// CC-3.0-SA-NC
//
//===================================================


help = new class Help
{
	static showJS = true;
	static showHTML = true;

	get js()
	{
		Help.showJS = true;
		Help.showHTML = false;
		return '';
	}
	
	get html()
	{
		Help.showJS = false;
		Help.showHTML = true;
	}
	
	get cube()
	{
		var s = '';
		if( Help.showJS ) s += 'cube( 𝑐𝑒𝑛𝑡𝑒𝑟, 𝑠𝑖𝑧𝑒, 𝑐𝑜𝑙𝑜𝑟 )\n';
		if( Help.showHTML ) s += '<cube id="..." center="..." size="..." color="...">\n';
		console.log( '\n'+s+'\n' );
		return '';
	}
}
