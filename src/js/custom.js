'use strict';

/* global jQuery:false */

(function($){

  $(function() {
  // document is ready

    var $form = $( '#contact-form' );
    var $summary = $( '#contact-summary' );
    var $summaryCopy = $( '#contact-summary p:first-child' );

    $form.submit(function(e) {
      var opt = $('input[type="radio"][name="optionsRadios"]:checked');
      toggleSection($form, $summary);
      getContent(opt);
      e.preventDefault();
    });    

    function toggleSection($previousSection, $newSection) {
      $previousSection.fadeOut(function(){
        $newSection.fadeIn();
      });
    }

    function getContent(key) {
      if ( key.length > 0 ) {
        $summaryCopy.append(copyA);
      } else {
        $summaryCopy.append(copyB);
      }
    }

    function sendTo(address) {
      return '<a href="mailto:' + address + '">' + address + '</a>';
    }

    function copyA() {
      return 'Thank you for your inquiry!';
    }

    // get the contents of the title tag and build contact
    function copyB() {
      var name = $('title').html().slice(0, 15).replace(/\s/, '').toLowerCase();
      return sendTo(name.concat('author','&#6','4;','gm','ail','.','com'));
    }

  });

})(jQuery);