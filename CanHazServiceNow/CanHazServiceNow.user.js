// ==UserScript==
// @name        CanHazServiceNow
// @namespace   http://totl.net/
// @description Service Now Ticket Page Deshonkification
// @include     https://sotonproduction.service-now.com/incident.do*
// @include     https://sotonpreproduction.service-now.com/incident.do*
// @version     2
// @grant       none
// ==/UserScript==

jQuery( document ).ready(function( $ ) {
//     https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
  var idCounter = 0;
  function rollUp( text,type )
  {
    // 'this' is set to the name of this rollup
    var id = 'isol_rollup_'+(idCounter++);

    return '<div id="'+id+'" data-type="'+type+'" class="isol_rollup">'+text+'</div>';  
  }

  // change column sizes in first section
  $('.col-sm-6 .form-group .control-label').removeClass('col-lg-4').addClass( 'col-lg-2').css( 'font-size','90%');
  $('.col-sm-6 .form-group .input_controls').removeClass('col-lg-5').addClass( 'col-lg-8');

  $('.mandatory_populated').addClass("isol_dull_field");
  $('#element\\.incident\\.number').addClass("isol_dull_field");
  $('#element\\.incident\\.u_logged_for').addClass("isol_dull_field");
  $('#element\\.incident\\.location').addClass("isol_dull_field");
  $('#element\\.incident\\.u_location_of_issue').addClass("isol_dull_field");
  $('#element\\.incident\\.u_room_of_issue').addClass("isol_dull_field");
  $('#element\\.incident\\.u_contact_number_of_issue').addClass("isol_dull_field");
  $('#element\\.incident\\.u_category').addClass("isol_dull_field");
  $('#element\\.incident\\.u_subcategory').addClass("isol_dull_field");
  $('#element\\.incident\\.impact').addClass("isol_dull_field");
  $('#element\\.incident\\.urgency').addClass("isol_dull_field");
  $('#element\\.incident\\.opened_by').addClass("isol_dull_field");
  $('#element\\.incident\\.sla_due').addClass("isol_dull_field");
  $('#element\\.incident\\.contact_type').addClass("isol_dull_field");
  $('#element\\.incident\\.substitute').addClass("isol_dull_field");
  $('#element\\.incident\\.time_worked').addClass("isol_dull_field");
  $('#element\\.incident\\.u_as_request').addClass("isol_dull_field");
 
  // add heading with ticket short desc to the top
  var titlediv = $('<div style="text-align:center"><span style="font-size:150%;font-weight:bold;">'+$('#incident\\.short_description').val()+'</span></div>');
  $('#header_attachment').after( titlediv );

  // Move back to the notes tab even if this has opened with a different tab open
  document.cookie = "__CJ_tabs2_section_incident=%220%22; path=/";

  // add some new css classes to make it easier to find all the rows we
  // want to get data from.

  var table=$('<table></table>');
  $('.activity_table').before( table );
  $('.activity_table .activity_header').addClass( 'isol_activity_row' );
  $('.activity_table .activity_data').addClass( 'isol_activity_row' );


  // build up a dataset (in grid) describing all the stuff so we can show it both ways 
  // around (chrono and rev chrono)
  var nrow;
  var prevdatetxt='9999-99-99';
  var grid = [];
  var gridThing;
  var lastThing;
  $('.activity_table .isol_activity_row').each( function(i,row) { 
    row=$(row);
    if( row.hasClass('activity_header') )
    {      
      var dtxt = row.find('.activity_date').text();
      var d = dtxt.split( /[-: ]/ );
      var datetxt = d[2]+"-"+d[1]+"-"+d[0];
      var date = new Date();
      date.setFullYear(d[2]);
      date.setMonth(d[1]-1);
      date.setDate(d[0]);
      date.setHours(d[3]);
      date.setMinutes(d[4]);
      if( datetxt != prevdatetxt )
      {
        var m_names = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
        var d_names = new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");

        gridThing = { 'date':null, 'notes':[] };
        grid.push(gridThing);
    
        gridThing.date = $('<tr><td colspan="4" style="font-size:120%;font-weight:bold;padding-top: 20px">'+d_names[date.getDay()]+', '+d[0]+' '+m_names[d[1]-1]+'</td></tr>' );
      }
      prevdatetxt=datetxt;

      nrow = $('<tr><td class="isol_act_time">'+d[3]+':'+d[4]+'</td><td>&nbsp;-&nbsp;</td><td class="isol_act_title"></td><td class="isol_act_data"><table></table></td></tr>');
      row.find('.activity_date').remove();
      var title = nrow.find('.isol_act_title');
      title.append( row.find( 'span' ) );
      if( title.html().match( /&nbsp;Email sent/ )) { nrow.addClass('isol_emailSent'); }
      lastThing = { 'head':nrow,'data':[] };
      gridThing.notes.push( lastThing );
    };

    if( row.hasClass('activity_data') )
    {
      var tr = $('<tr><td></td><td></td></tr>');
      var td = $('<td colspan="2"></td>');
      lastThing.data.push( tr );
      tr.append(td);
      row.find('td td table').appendTo(td);
      nrow.find('.isol_act_data>table').append( row.find('td tr') );
      var h="";
      row.find('.activity_field').each( function(i,e){
        e=$(e);
        h+="<div>"+e.html()+"</div>";
      });
      var html = "<div>"+h+"</div>";

      // clean up double blank lines
      html = html.replace( /(<br>(\s|&nbsp;)*)+<br>/g, '<br><br>' );

      // add CR after <br> to make it easier to work with lines of data
      html = html.replace( /<br>/g, '<br>\n' );


      // rollups
      // blocks starting with ">"
      html = html.replace( /((^\s*&gt;[^\n]*\n)+)/gm, function(text) { return rollUp( text, 'quoted text'); } );

      // quoted messages starting with From:
      var parts = html.split(/^\s*From:/m, 2 );
      if( parts.length == 2 )
      {
        html =  parts[0] + rollUp( 'From: ' + parts[1], 'quoted text' );
      }

      // signatures starting with --    
      var parts = html.split(/^--/m, 2 );
      if( parts.length == 2 )
      {
        html =  parts[0] + rollUp( '--' + parts[1], 'signature' );
      }

      // hyperlink URLs
      var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
      html = html.replace(exp,"<a target='_blank' style='text-decoration: underline' href='$1'>$1</a>"); 
      if( html.match( /email\.gifx/ )) { tr.addClass('isol_emailSent'); }

      td.append($(html));
    }

  });

  // render the 'grid' dataset onto the page
  tableDefault();

  function tableDefault()
  {
    for(var i=0;i<grid.length;i++)
    {
      table.append( grid[i].date );
      for(var j=0;j<grid[i].notes.length;j++)
      { 
        table.append( grid[i].notes[j].head);
        for(var k=0;k<grid[i].notes[j].data.length;k++)
        { 
          table.append( grid[i].notes[j].data[k]);
        }
      }
    }
  }
  function tableReverse()
  {
    for(var i=grid.length-1;i>=0;i--)
    {
      table.append( grid[i].date );
      for(var j=grid[i].notes.length-1;j>=0;j--)
      { 
        table.append( grid[i].notes[j].head);
        for(var k=grid[i].notes[j].data.length-1;k>=0;k--)
        { 
          table.append( grid[i].notes[j].data[k]);
        }
      }
    }
  }

  // remove default activity table
  $('.activity_table').remove();

  // add functions to rollups
  $('.isol_rollup').each( function(i,roll) { 
    roll = $(roll);
    var id = roll.attr("id");
    var type = roll.attr("data-type");
    roll.css({ 'border': 'solid 1px #88f','padding':'2px', 'background-color':'#e9e9ff'});
    var show = $('<div id="'+id+'_show">+ Show '+type+'</div>');
    var hide = $('<div id="'+id+'hide">- Hide '+type+'</div>');
    roll.before(show).before(hide);
    var css = {'background-color':'#88f', 'cursor':'pointer','color':'white','padding':'2px 8px 2px 4px','display':'inline-block','font-size':'80%' };
    show.css(css).click( function() { roll.show(); show.hide(); hide.show(); } );
    hide.css(css).click( function() { roll.hide(); show.show(); hide.hide(); } );
    roll.hide();
    hide.hide();    
  });
 
  function formScrollTo( thing )
  {
    var scrolled = $('#incident\\.do').offset().top;
    var pos = thing.offset().top - scrolled;
    $('#incident\\.form_scroll').scrollTop( pos - 40 ); // the 40 is to skip the top bar
  }
 
  // test button - uncomment for testing
  //$('#clone_incident_ps').after( $('<button id="test_button" class="form_action_button header action_context btn btn-default" type="submit">test</button>') );
  //$('#test_button').click( function(){ 
  //} );


  $('#sysverb_update').before( $('<button id="hidesent_button" class="form_action_button header action_context btn btn-default" type="">Hide Sent</button>') );
  $('#hidesent_button').click( function(){ 
    $('.isol_emailSent').hide();
    $('#hidesent_button').hide();
    $('#showsent_button').show();
    return false;
  });
  $('#hidesent_button').hide();
  $('#sysverb_update').before( $('<button id="showsent_button" class="form_action_button header action_context btn btn-default" type="">Show Sent</button>') );
  $('#showsent_button').click( function(){ 
    $('.isol_emailSent').show();
    $('#hidesent_button').show();
    $('#showsent_button').hide();
    return false;
  });

  titlediv.prepend( $('<button id="hidedull_button" class="form_action_button action_context btn btn-default" type="">Hide Fields</button>') );
  $('#hidedull_button').click( function(){ 
    $('.isol_dull_field').hide();
    $('#hidedull_button').hide();
    $('#showdull_button').show();
    return false;
  });
  titlediv.prepend( $('<button id="showdull_button" class="form_action_button action_context btn btn-default" type="">Show Fields</button>') );
  $('#showdull_button').click( function(){ 
    $('.isol_dull_field').show();
    $('#hidedull_button').show();
    $('#showdull_button').hide();
    return false;
  });

  // different behaviour on new tickets?
  $('.isol_dull_field').hide();
  $('#hidedull_button').hide();



  // notes buttons 
  $('#sysverb_update').before( $('<button id="rnotes_button" class="form_action_button header action_context btn btn-default" type="submit">Latest</button>') );
  $('#rnotes_button').click( function(){ 
    $('.tab_caption_text:contains("Notes")').click();
    tableDefault();
    formScrollTo( table );
    return false;
  } );
  $('#sysverb_update').before( $('<button id="notes_button" class="form_action_button header action_context btn btn-default" type="submit">Notes</button>') );
  $('#notes_button').click( function(){ 
    $('.tab_caption_text:contains("Notes")').click();
    tableReverse();
    formScrollTo( table );
    return false;
  } );

  // resolve button

  $('#clone_incident_ps').after( $('<button id="resolve_button" class="form_action_button header action_context btn btn-default" type="submit">Resolve</button>') );
  $('#resolve_button').click(function(){
    $('#incident\\.state').val( 6 );
    onChange('incident.state');

    $('#incident\\.u_close_category').val( $('#incident\\.category').val());
    onChange('incident.u_close_category');
    setTimeout( function() {
      $('#incident\\.u_close_subcategory').val( $('#incident\\.subcategory').val() );
      onChange('incident.u_close_subcategory');
      setTimeout( function() {
        $('#incident\\.u_close_item').val( $('#incident\\.u_item').val() );
        onChange('incident.u_close_item');
      }, 1000 );
    },1000 );

    $('.tab_caption_text:contains("Closure")').click();

    formScrollTo( $("#tabs2_section") );
 
    $('#incident\\.close_notes').focus();	
    return false;
  });

  // Remove email-sent rows as they are kinda useless. Maybe make this a toggle later.
  $('.isol_emailSent').hide();

  // Rename Update
  $('#sysverb_update').text('Save and Exit');

  // Move save buttons to end of list
  $('#resolve_button').after( $('#sysverb_update_and_stay') );
  $('#resolve_button').after( $('#sysverb_update') );

  // set top title to title of this iframe
  top.document.title=$('#sys_readonly\\.incident\\.number').val()+" "+$('#incident\\.short_description').val()

});
