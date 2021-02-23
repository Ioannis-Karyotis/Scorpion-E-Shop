$(document).ready(function() {   
    $.ajax({
        type: 'POST',
        url: '/get/resolution',
        data: {
            w: window.screen.width,
            h: window.screen.height
        },
    });
    // window.cookieconsent.initialise({
    //     "palette": {
    //       "popup": {
    //         "background": "#3c404d",
    //         "text": "#d6d6d6"
    //       },
    //       "button": {
    //         "background": "#65a07b"
    //       }
    //     },
    //     "theme": "classic",
    //     "content": {
    //       "message": "Η Ιστοσελίδα scorpionclothing.gr χρησιμοποιεί cookies, έτσι ώστε να εξασφαλιστεί η βέλτιστη πιθανή εμπειρία χρήστη.",
    //       "dismiss": "Το κατάλαβα",
    //       "link": "Μάθε περισσότερα"
    //     }
    //   });
  }); 