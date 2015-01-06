// ==UserScript==
// @name        MyView
// @namespace   http://totl.net/
// @include     https://myview.soton.ac.uk/*
// @version     1
// @grant       none
// @require     http://code.jquery.com/jquery-1.10.2.min.js
// ==/UserScript==

$('.buttonSuppressSpaceOne').css( "float","none" );
$('#pageButtons td').css( "text-align","left" );
$('#pageButtons').css( "text-align","left" );
$('#linkButton').css( "text-align","left" );


$('#HOLTYPE').val( 'ANN' );
//$('body').append( $( '<link rel="stylesheet" type="text/css" href="https://secure.ecs.soton.ac.uk/devel/myview.css"  />') );
var title = $(".moduleTitle").html().trim();
if( title == "Holiday" || title == "Holiday Request" )
{
	$('#channelBodyWhite').append( $('#pageButtons') );
}