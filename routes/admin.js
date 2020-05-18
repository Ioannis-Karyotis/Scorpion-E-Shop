var express 	= require("express");
var router 		= express.Router();
var passport 	= require("passport");
const JWT 		= require('jsonwebtoken');
const config 	= require('../configuration');
var User 		= require("../models/user");
var Product = require("../models/product");
var Order = require("../models/order");
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


// passport.authenticate('jwtAdmin', { session: false })
router.get("/admin" ,passport.authenticate('jwtAdmin', { session: false }), function(req, res){
	Order.find({ }).populate("productList.product").exec(function(err , foundOrders ){
      	if(err){
          	console.log(err)
      	}else{
      		var orders = foundOrders.reverse();
	        return res.render("admin", {orders : orders });
	    }
	});
});


router.post("/admin/verifyOrder",sanitization.route, passport.authenticate('jwtAdmin', { session: false }), function(req, res){
	var mailOptions = {
	  from: String(config.EMAIL),
	  to: String(req.autosan.body.details.email),
	  subject: 'Λήψη παραγγελίας',
	  text: 'Η παραγγελία σας λήφθηκε με επιτυχία και ετοιμάζεται εντός των επόμενων ημερών'
	};
	transporter.sendMail(mailOptions, function(error, info){
	  	if (error) {
	    	console.log(error);
	  	} else {
	    	console.log('Email sent: ' + info.response);
	    	Order.findById(req.autosan.body._id,function(err, foundOrder){
				if(err){
					console.log(err);
				} else {
					foundOrder.confirm = true;
					foundOrder.save();
		    		res.redirect("/admin");
		    	}
		    })		
	  	}
	});
});

router.post("/admin/completeOrder",sanitization.route, passport.authenticate('jwtAdmin', { session: false }), function(req, res){
	Order.findById(req.autosan.body._id,function(err, foundOrder){
		if(err){
			console.log(err);
		} else {
			foundOrder.complete = true;
			foundOrder.save();
			res.redirect("/admin");
		}
	})			  
});


module.exports = router;
