require(["gitbook", "jQuery"], function(gitbook, $) {

  // Return true if sidebar is open
  function isOpen() {
      return gitbook.state.$book.hasClass('with-summary');
  }
  
  var i = 1;
  $( window ).keydown(function( event ) {
    console.log(event.which)
    // enter = 13
    // t = 84
    if ( event.which === 13 || event.which === 84) {
      if (i % 2 == 1) {
        $('.markdown-section > ul').first().show().addClass('toc2')
      } else {
        $('.markdown-section > ul').first().hide()
      }
      
      i++;
    }
    
    // h = hide
    if(event.which === 72){
      $('.markdown-section > ul').first().hide()
    }
  });
  
  
  gitbook.events.bind("page.change", function() {
  
  });
  
});
