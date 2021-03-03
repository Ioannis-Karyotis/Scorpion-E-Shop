const express 	    = require("express"),
      router 		    = express.Router(),
      middleware    = require("../middleware/index.js"),
      config 	      = require('../configuration'),
      User 		      = require("../models/user"),
      sanitization  = require('express-autosanitizer'),
      nodemailer    = require('nodemailer'),
      dotenv        = require('dotenv'),
      logger        = require('simple-node-logger').createSimpleLogger('Logs.log'),
      transporter = nodemailer.createTransport
        ({
          host: "smtp.zoho.eu",
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user:  String(config.EMAIL),
            pass: String(config.EMAIL_PASSWORD)
          }
        });

router.use(function(req, res, next) {
res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        next();
})

dotenv.config();

function trimBody(inside){

  Object.keys(inside).forEach(function(key,index) {
    inside[key] = inside[key].trim();
  });
  return inside;
}

router.get("/contact" , function(req, res){
	if(req.app.locals.specialContext!= null){
    var validated = req.app.locals.specialContext;
    res.render("contact",{user: null , method : null, validated : validated});
  }else{
    var validated = {};
    req.app.locals.specialContext = null;
    if(req.user){
      res.render('contact',{user: req.user, method : req.user.methods,validated : validated});
    }else{
      res.render('contact',{user: null , method : null, validated : validated});
    }
  }
});


router.post("/contact",sanitization.route,middleware.namesur , middleware.email ,function(req, res){
  req.autosan.body = trimBody(req.autosan.body);
	var mailOptions = {
	  from: String(config.EMAIL),
	  to: String(config.EMAIL),
	  subject: 'Εισερχόμενο Μήνυμα',
	  html: '<h2>Όνομα: '+req.autosan.body.name+'</h2><h2>Επίθετο: '+req.autosan.body.surname+'</h2><h2>E-mail: '+req.autosan.body.email+'</h2><p><h3>Μήνυμα: </h3>'+req.autosan.body.description+'</p>'
	};
	transporter.sendMail(mailOptions, function(error, info){
	  	if (error) {
        logger.error("Error: ", error);
	  	} else {
        logger.info("Email sent: ",  info.response);

	    	req.flash("genSuccess","Το μήνυμα σας στάλθηκε με επιτυχία")
	    	res.redirect('back');    		
	  	}
	});
});


module.exports = router;
