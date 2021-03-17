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
}); 

