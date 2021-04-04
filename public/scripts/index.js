$(document).ready(function() {
    var token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')   
    $.ajax({
        type: 'POST',
        url: '/initializeClient',
        headers:{
            'CSRF-Token': token
        },
        data: {
            w: window.screen.width,
            h: window.screen.height
        },
        success: function(data, textStatus, request){
            window.sessionStorage.setItem('x-api-key',request.getResponseHeader('x-api-key'));  
        },
    });

    $('.carousel1').carousel({
        interval : 2000
    })
    $('.carousel2').carousel({
        interval : 4000
    })
    $('.carousel5').carousel({
        interval : 2500
    })
    $('.carousel6').carousel({
        interval : 3500
    })
}); 

