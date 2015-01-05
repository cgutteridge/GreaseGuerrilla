// ==UserScript==
// @name        CanHazServiceNow
// @namespace   http://totl.net/
// @description Service Now Ticket Page Deshonkification
// @include     https://sotonproduction.service-now.com/incident.do*
// @version     1
// @grant       none
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// ==/UserScript==
$.noConflict();
jQuery( document ).ready(function( $ ) {

  $('select').css( 'width','95%');

  // work out width for reference input fields
  $('.vsplit').each( function( i,e ) { 
    e=$(e);
    var w = e.find( "select" ).width();
    if(w>150)
    {
      e.find( ".element_reference_input" ).css('width',""+(w-50)+"px");
    }
  });

  $('#header_attachment').after( 
    $('<div style="font-size:150%;font-weight:bold;text-align:center">'+$('#incident\\.short_description').val()+'</div>')
  );

  var table=$('<table></table>');
  $('.activity_table').before( table );
  $('.activity_table .activity_header').addClass( 'isol_activity_row' );
  $('.activity_table .activity_data').addClass( 'isol_activity_row' );

  var nrow;
  var prevdatetxt='9999-99-99';
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
        table.append( $('<tr><td colspan="4" style="font-size:120%;font-weight:bold;padding-top: 20px">'+d_names[date.getDay()]+', '+d[0]+' '+m_names[d[1]-1]+'</td></tr>' ));
      }
      prevdatetxt=datetxt;

      nrow = $('<tr><td class="isol_act_time">'+d[3]+':'+d[4]+'</td><td> - </td><td class="isol_act_title"></td><td class="isol_act_data"><table></table></td></tr>');
      row.find('.activity_date').remove();
      nrow.find('.isol_act_title').append( row.find( 'span' ) );
      table.append( nrow );
    }

    if( row.hasClass('activity_data') )
    {
      var tr = $('<tr><td></td><td></td></tr>');
      var td = $('<td colspan="2"></td>');
      tr.append(td);
      table.append(tr);
      row.find('td td table').appendTo(td);
      nrow.find('.isol_act_data>table').append( row.find('td tr') );
      var h="";
      row.find('td .activity_field').each( function(i,e){
        e=$(e);
        h+=e.html();
      });
      var html = "<div>"+h+"</div>";
      html = html.replace( /(<br>(\s|&nbsp;)*)+<br>/g, '<br><br>' );
      var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
      html = html.replace(exp,"<a target='_blank' style='text-decoration: underline' href='$1'>$1</a>"); 
      td.append($(html));
    }
  });


  // resolve button

  $('#clone_incident_ps').after( $('<button id="resolve_button" class="form_action_button header action_context" type="submit">Resolve</button>') );
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
      }, 500 );
    },500 );

    $('#incident\\.form_scroll').scrollTop($("#tabs2_section").offset().top);
 
    $('#incident\\.close_notes').focus();	
  });

  // Rename Update
  $('#sysverb_update').text('Save and Exit');

});