'use strict';

/* global jQuery:false */

(function($){

  $(function() {
  // document is ready

    var $title = $('title');

    $( '#contact-form' ).on('submit', submitHandler);

    function submitHandler(event) {
      var formID = '#' + event.target.id;
      var option = event.target[0].checked;

      event.preventDefault();
      requestInfo(formID, option);
    }

    function requestInfo(htmlID, option) {
      var $requestor = $( htmlID );
      var $result = $requestor.next();
      var $targetLocation = $result.children();

      toggleSection($requestor, $result);
      getContent(option, $targetLocation);      
    }

    function toggleSection($previousSection, $newSection) {
      $previousSection.fadeOut(function(){
        $newSection.fadeIn();
      });
    }

    function getContent(key, $location) { // TODO test this
      if ( !key ) {
        $location.append(copyB);
      } else {
        $location.append(copyA);
      }
    }

    function sendTo(address) { // TODO test this returns a valid link
      return '<a href="mailto:' + address + '">' + address + '</a>';
    }

    function copyA() { // TODO test this returns a string
      return 'Thank you for your inquiry!';
    }

    // get the contents of the title tag and build contact
    function copyB() { // TODO test this returns a string
      var name = $title.html().slice(0, 15).replace(/\s/, '').toLowerCase();
      return sendTo(name.concat('author','&#6','4;','gm','ail','.','com'));
    }

  });

})(jQuery);