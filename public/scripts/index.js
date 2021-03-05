$(document).ready(function() {   
    $.ajax({
        type: 'POST',
        url: '/initializeClient',
        data: {
            w: window.screen.width,
            h: window.screen.height
        },
        success: function(data, textStatus, request){
            window.sessionStorage.setItem('x-api-key',request.getResponseHeader('x-api-key'));  
        },
    });
}); 

$( "html" ).click(function(e) {
    if($(event.target).attr('class') != "openOnDemand" || $(event.target).attr('id') == "CartToggle"){
        $('.openOnDemand').removeClass("show");
        $('#CartToggle').attr("aria-expanded","false");
    }
});  