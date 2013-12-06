// ==UserScript==
// @name        Horsepaint
// @namespace   http://totl.net/
// @include     https://groupsite.soton.ac.uk/*
// @include     https://intranet.soton.ac.uk/*
// @version     1
// @grant       none
// ==/UserScript==


var popup = jQuery( "<div id='cjg_popup' style='display:none;'></div>" );
jQuery("body").prepend( popup );
var clicky = jQuery("<div id='clicky' style='font-size: 60%; background-color:#000;color:#fff;text-align:center; cursor:pointer'>clicky clicky clicky clicky clicky clicky clicky clicky clicky clicky clicky clicky clicky clicky clicky clicky</div>");
jQuery("body").prepend( clicky );
popup.append( jQuery("#v5-global") );
clicky.click( function() { popup.toggle(); } );

jQuery("body").append( jQuery( "<style>.ms_cui_tt { height:21px;} .ms-cui-tt a { margin-top: 0; font-size: 6pt; }.ms-cui-tts {height: 22px; }.ms-cui-topBar2 { height: 23px; } .ms-cui-cg-i {display: none; } #s4-workspace {margin-top:-21px;} #s4-ribbonrow { margin-top:0px;} #v5-header-title { display:none} #v5-header{height:22px} #v5-header-profile{height:auto;margin-top:0}  #v5-header-profile .image {display:none} #v5-header-breadcrumb { height: auto} #v5-header-breadcrumb ul.breadcrumb { margin-top:5px} #v5-search { top: 5px } </style>" ));

