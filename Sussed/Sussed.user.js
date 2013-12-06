// ==UserScript==
// @name        Sussed
// @namespace   http://totl.net/
// @include     http://sussed.soton.ac.uk/*
// @version     1
// @grant       none
// ==/UserScript==

var popup = $( "<div id='sussed_popup' style='background-color:white;position:absolute; left: 15%; width:70%;border:solid 4px #2e969e;'></div>" );
$("body").append( popup );
popup.append( $(".branding_bar") );
popup.append( $(".sussed_status_bar" ) );
var hpos = -4-popup.height();
popup.css( "top",hpos+"px" );
popup.append( $( "<div style='background-color: #2e969e; color: white;text-align:center'>Controls</div>" ) );

popup.click( function() { popup.animate( { top: "0px" } ); } );
popup.mouseleave( function() { popup.animate( { top: hpos+"px" } ); } );
