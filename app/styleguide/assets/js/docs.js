$( window ).bind( "create.xrayhtml", function( e ) {
    $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
});

$(document).ready(function() {
    $(document).foundation();
})
