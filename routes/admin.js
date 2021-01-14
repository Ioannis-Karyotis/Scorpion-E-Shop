const express 		= require("express"),
	  router 		= express.Router(),
	  passport 		= require("passport"),
	  JWT 			= require('jsonwebtoken'),
	  config 		= require('../configuration'),
	  User 			= require("../models/user"),
	  Product   	= require("../models/product"),
	  dotenv 		= require('dotenv'),
	  Order     	= require("../models/order"),
	  sanitization	= require('express-autosanitizer'),
	  nodemailer 	= require('nodemailer'),
	  ejs       	= require("ejs"),
	  smtpTransport = require('nodemailer-smtp-transport'),
	  transporter 	= nodemailer.createTransport({
							host: "smtp.zoho.eu",
							port: 465,
							secure: true, // true for 465, false for other ports
							auth: {
								user:  String(config.EMAIL),
								pass: String(config.EMAIL_PASSWORD)
							}
					  }),
	  attachments	= require('./../configuration/emailAttachments');
dotenv.config();
	  
function trimBody(inside){

  Object.keys(inside).forEach(function(key,index) {
    inside[key] = inside[key].trim();
  });
  return inside;
}


router.use(function(req, res, next) {
res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        next();
})

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
	ejs.renderFile(__dirname + "/../views/mail.ejs",{msg : req.autosan.body } , function (err, data) {
	    if (err) {
			console.log(err);
			res.status(500).send("Failure Rendering ejs");
	    } else {
	        var mainOptions = {
		  	from: String(config.EMAIL),
		  	to: String(req.autosan.body.order.details.email),
		  	subject: 'Λήψη παραγγελίας',
		  	html : data,
		  	attachments: attachments
			};
			transporter.sendMail(mainOptions, function(error, info){
			  	if (error) {
					console.log(error);
					res.status(500).send("Failure");
			  	} else {
			    	console.log('Email sent: ' + info.response);
			    	Order.findById(req.autosan.body.order._id,function(err, foundOrder){
						if(err){
							console.log(err);
							res.status(500).send("Failure");
						} else {
							foundOrder.confirm = true;
							foundOrder.save();
				    		res.status(200).send("Success");
				    	}
				    })		
			  	}
			});
	    }  
	})
});

router.post("/admin/completeOrder",sanitization.route, passport.authenticate('jwtAdmin', { session: false }), function(req, res){
	ejs.renderFile(__dirname + "/../views/mail2.ejs",{order : req.autosan.body , option: "mail2" } , function (err, data) {
	    if (err) {
	        console.log(err);
	    } else {
	        var mainOptions = {
		  	from: String(config.EMAIL),
		  	to: String(req.autosan.body.details.email),
		  	subject: 'Ολοκλήρωση παραγγελίας',
		  	html : data,
		  	attachments: attachments
			};
			// console.log("html data ======================>", mainOptions.html);
			transporter.sendMail(mainOptions, function(error, info){
			  	if (error) {
			    	console.log(error);
			  	} else {
					Order.findById(req.autosan.body._id,function(err, foundOrder){
						if(err){
							console.log(err);
						} else {
							foundOrder.complete = true;
							foundOrder.save();
							res.redirect("/admin");
						}
					})			  
				}
			});
	    }  
	})
});

router.post("/admin/deleteOrder/:id",sanitization.route, passport.authenticate('jwtAdmin', { session: false }), function(req, res){
	//req.autosan.body = trimBody(req.autosan.body);
	//console.log(req.autosan.body);
	Order.deleteOne({ _id: req.params.id }, function(err) {
	    if (err) {
	        console.log(err.message);
	    }
	    else {
	        res.redirect("/admin");
	    }
	});
});

module.exports = router;
