// ==UserScript==
// @name        Brandy
// @namespace   http://totl.net/
// @include     http://www.southampton.ac.uk/*
// @version     1
// @grant       none
// ==/UserScript==

var clicky = jQuery("<div id='clicky' style='font-size: 60%; background-color:#000;color:#fff;text-align:center; cursor:pointer'>clicky clicky clicky clicky clicky clicky clicky clicky clicky clicky clicky clicky clicky clicky clicky clicky</div>");
jQuery("body").prepend( clicky );
// find all the cruft and tag it

jQuery('header').addClass('fluff');
jQuery('.uos-tier-banner').addClass('fluff');
jQuery('.uos-campaign-slider').addClass('fluff');
jQuery('.uos-landing-title').addClass('fluff');


var showing_stuff=false;
jQuery('.fluff').hide();
clicky.click( function() { 
  if( showing_stuff )
  {
     jQuery('.fluff').hide();
     showing_stuff = false;
  }
  else
  {
     jQuery('.fluff').show();
     showing_stuff = true;
  }
} );

jQuery("body").append( jQuery( "<style>li { padding-bottom: 0.2em; }</style>" ));

