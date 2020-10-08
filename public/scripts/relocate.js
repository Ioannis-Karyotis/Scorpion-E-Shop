const dotenv = require('dotenv');
dotenv.config();

  setTimeout(function() {
      window.location.replace( process.env.ROOT +"/login");
    }, 3000);