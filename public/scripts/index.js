$(document).ready(function() {   
    $.ajax({
        type: 'POST',
        url: '/get/resolution',
        data: {
            w: window.screen.width,
            h: window.screen.height
        },
    });
  }); 

$( "html" ).click(function(e) {
    if($(event.target).attr('class') != "openOnDemand" || $(event.target).attr('id') == "CartToggle"){
        $('.openOnDemand').removeClass("show");
        $('#CartToggle').attr("aria-expanded","false");
    }
});  