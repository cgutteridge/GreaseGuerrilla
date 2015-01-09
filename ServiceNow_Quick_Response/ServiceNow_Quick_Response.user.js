// ==UserScript==
// @name        ServiceNow Quick Response
// @namespace   http://totl.net/
// @include     https://sotonproduction.service-now.com/incident.do*
// @version     1
// @grant       none
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// ==/UserScript==

// you can add personal choices to augment the general list.
// however these will be erased if you upgrade the script so keep a backup somewhere safe.
// Make sure that you escape any ' with a backslash. eg. ain\'t. 
var personal_responses = [
 'Example personal response.',
 'Another example personal response.'
];

$.noConflict();
jQuery( document ).ready(function( $ ) {
  $('body').append( '<script src="https://secure.ecs.soton.ac.uk/data/faq.js"></script>' );

  var button = $("<button>Default Responses</button>");
  button.click( function() {
    var isol_responses = [];
    for( var i=0;i<personal_responses.length; ++i ) {
      isol_responses.push( personal_responses[i] );
    }
    for( var i=0;i<window.isol_responses.length; ++i ) {
      isol_responses.push( window.isol_responses[i] );
    }
    
    var popup = $('<div style=" height: 100%; width: 100%; font-size:130%; position: fixed; top: 0%; left: 0%; z-index: 2000; background-color: white; overflow: scroll"></div>');
    var closePopup = function() { 
      popup.remove(); 
      $('#incident\\.close_notes').focus();
    };


    var input = $('<input maxlength="255" size="23" value="" type="text" style="margin:1em">');

    // filter the list each time the search field changes
    input.keyup(function() {
      v = input.val();
      if( v == '' ) { 
        popup.children().show();
      } else {
        exp = new RegExp( v, 'i' ); //case insensitive
        popup.find('.isol_popup_result').each(function(i,res) {
          res = $(res);
          if( res.text().match( exp ) ) { 
            res.show();
          } else {
            res.hide();
          }
        } );
      }
      return true;
    });

    jQuery(popup).keydown(function(e) {
      // ESCAPE key pressed
      if (e.keyCode == 27) {
        closePopup();
      }
    });
  
    popup.append(input);
    popup.append( $('<div style="background-color: #fee;padding:2px;margin:1em;cursor:pointer">Cancel</div>').click( closePopup ) );
    for( var i=0; i<isol_responses.length; ++i )
    {
      popup.append( $('<div class="isol_popup_result" style="background-color: #eef;padding:2px;margin:1em;cursor:pointer"></div>').text(isol_responses[i]).click( function() { 
        // if this selection is clicked then set the textarea to the value and close the popup
        // adds a space after too, so you can just type another sentence if needed.
        $('#incident\\.close_notes').val( this+" " );
        closePopup();
      }.bind( isol_responses[i] )) ); // the bind sets 'this' in the function to be the text
    }

    $('body').append( popup );
    input.focus();
    return false; 
  });

  $('#element\\.incident\\.close_notes table').css( 'table-layout','auto');
  $('#label\\.incident\\.close_notes').append( button );
});

