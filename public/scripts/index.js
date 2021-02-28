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