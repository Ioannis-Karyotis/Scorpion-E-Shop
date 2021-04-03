// $(document).ready(function() { 
    // window.cookieconsent.initialise({
    //     container: document.getElementById("content"),
    //     "palette": {
    //         "popup": {
    //             "background": "#3c404d",
    //             "text": "#d6d6d6"
    //         },
    //         "button": {
    //             "background": "#65a07b"
    //         }
    //     },
    //     "theme": "classic",
    //     "content": {
    //     "message": "Η Ιστοσελίδα scorpionclothing.gr χρησιμοποιεί cookies, έτσι ώστε να εξασφαλιστεί η βέλτιστη πιθανή εμπειρία χρήστη.",
    //     "dismiss": "Το κατάλαβα",
    //     "link": "Μάθε περισσότερα"
    //     },
    //     "domain": "https://scorpionclothing.gr/",
    //     "secure": true,
    //     revokable:true,
    //     onStatusChange: function(status) {
    //         console.log(this.hasConsented() ? 'enable cookies' : 'disable cookies');
    //     },
    //     law: {
    //         regionalLaw: false,
    //     },
    //         location: true,
    //     });

    var cpm = {};
    (function(h,u,b){
    var d=h.getElementsByTagName("script")[0],e=h.createElement("script");
    e.async=true;e.src='https://cookiehub.net/c2/fc60c124.js';
    e.onload=function(){u.cookiehub.load(b);}
    d.parentNode.insertBefore(e,d);
    })(document,window,cpm);
// })