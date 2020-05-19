var express 	= require("express");
var router 		= express.Router();
var middleware  = require("../middleware/index.js");
const config 	= require('../configuration');
var User 		= require("../models/user");
const sanitization	= require('express-autosanitizer');
var nodemailer = require('nodemailer');
var smtpTransport = 	require('nodemailer-smtp-transport');


var transporter = nodemailer.createTransport(smtpTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user:  String(config.EMAIL),
    pass: String(config.EMAIL_PASSWORD)
  }
}));


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
	var mailOptions = {
	  from: String(config.EMAIL),
	  to: String(config.EMAIL),
	  subject: 'Εισερχόμενο Μήνυμα',
	  html: '<h2>Όνομα: '+req.autosan.body.name+'</h2><h2>Επίθετο: '+req.autosan.body.surname+'</h2><h2>E-mail: '+req.autosan.body.email+'</h2><p><h3>Μήνυμα: </h3>'+req.autosan.body.description+'</p>'
	};
	transporter.sendMail(mailOptions, function(error, info){
	  	if (error) {
	    	console.log(error);
	  	} else {
	    	console.log('Email sent: ' + info.response);
	    	req.flash("genSuccess","Το μήνυμα σας στάλθηκε με επιτυχία")
	    	res.redirect('back');    		
	  	}
	});
});


module.exports = router;
