

var elem;

// <meta charset="utf-8">
elem = document.createElement( 'meta' );
elem.setAttribute( 'charset', 'utf-8' );
document.querySelector( 'head' ).appendChild( elem );

// <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
elem = document.createElement( 'meta' );
elem.setAttribute( 'name', 'viewport' );
elem.setAttribute( 'content', 'width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0' );
document.querySelector( 'head' ).appendChild( elem );

// <link rel="shortcut icon" type="image/png" href="logo.png"/>
elem = document.createElement( 'link' );
elem.setAttribute( 'rel', 'shortcut icon' );
elem.setAttribute( 'type', 'image/png' );
elem.href = 'logo.png';
document.querySelector( 'head' ).appendChild( elem );

// <link rel="preconnect" href="https://fonts.googleapis.com">
elem = document.createElement( 'link' );
elem.setAttribute( 'rel', 'preconnect' );
elem.href = 'https://fonts.googleapis.com';
document.querySelector( 'head' ).appendChild( elem );

// <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
elem = document.createElement( 'link' );
elem.setAttribute( 'rel', 'preconnect' );
elem.setAttribute( 'crossorigin', '' );
elem.href = 'https://fonts.gstatic.com';
document.querySelector( 'head' ).appendChild( elem );

// <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;700&display=swap" rel="stylesheet">
elem = document.createElement( 'link' );
elem.setAttribute( 'rel', 'stylesheet' );
elem.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;700&display=swap';
document.querySelector( 'head' ).appendChild( elem );

// <link rel="stylesheet" href="examples.css">
elem = document.createElement( 'link' );
elem.type = 'text/css';
elem.rel = 'stylesheet';
elem.href = 'examples.css';
document.head.appendChild( elem );
