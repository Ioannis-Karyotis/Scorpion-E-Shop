$(document).ready(function() { 
    window.cookieconsent.initialise({
        container: document.getElementById("content"),
        "palette": {
            "popup": {
                "background": "#3c404d",
                "text": "#d6d6d6"
            },
            "button": {
                "background": "#65a07b"
            }
        },
        "theme": "classic",
        "content": {
        "message": "Η Ιστοσελίδα scorpionclothing.gr χρησιμοποιεί cookies, έτσι ώστε να εξασφαλιστεί η βέλτιστη πιθανή εμπειρία χρήστη.",
        "dismiss": "Το κατάλαβα",
        "link": "Μάθε περισσότερα"
        },
        "domain": "https://scorpionclothing.gr/",
        "secure": true,
        revokable:true,
        onStatusChange: function(status) {
            console.log(this.hasConsented() ? 'enable cookies' : 'disable cookies');
        },
        law: {
            regionalLaw: false,
        },
            location: true,
        });
})