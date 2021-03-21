const express 		= require("express"),
	  router 		= express.Router(),
	  middleware    = require("../middleware/index.js"),
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
	  logger         = require('simple-node-logger').createSimpleLogger('Logs.log'),
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

router.get("/ShowOrder/:id" , function(req, res){
	Order.find({"_id" : req.params.id ,"archived" : false}).populate("productList.product").exec(function(err , foundOrders ){
      	if(err){
			logger.error("Error: ",err)
      	}else{
      		var orders = foundOrders.reverse();
	        return res.render("showOrder", {orders : orders });
	    }
	});
});



router.get("/admin" ,passport.authenticate('jwtAdmin', { session: false }), function(req, res){
	Order.find({ "archived" : false}).populate("productList.product").exec(function(err , foundOrders ){
      	if(err){
			logger.error("Error: ",err)
      	}else{
      		var orders = foundOrders.reverse();
	        return res.render("admin", {orders : orders });
	    }
	});
});


router.post("/admin/verifyOrder",sanitization.route, middleware.checkOrigin, passport.authenticate('jwtAdmin', { session: false }), function(req, res){	
	ejs.renderFile(__dirname + "/../views/mail.ejs",{msg : req.autosan.body, type : "recieved" } , function (err, data) {
	    if (err) {
			logger.error("Error: ",err)
			res.header("x-api-key", req.session.xkey)
			res.status(500).send("Failure Rendering ejs");
	    } else {
	        var mainOptions = {
		  	from: String(config.EMAIL),
		  	to: String(req.autosan.body.order.details.email),
		  	subject: 'Επιβεβαίωση παραγγελίας',
		  	html : data,
		  	attachments: attachments
			};
			transporter.sendMail(mainOptions, function(error, info){
			  	if (error) {
					logger.error("Error: ",error)
					res.header("x-api-key", req.session.xkey)
					res.status(500).send("Failure");
			  	} else {
					logger.info('Email sent: ' , info.response);
			    	Order.findById(req.autosan.body.order._id,function(err, foundOrder){
						if(err){
							logger.error("Error: ",err)
							res.header("x-api-key", req.session.xkey)
							res.status(500).send("Failure");
						} else {
							foundOrder.confirm = true;
							foundOrder.save();
							res.header("x-api-key", req.session.xkey)
				    		res.status(200).send("Success");
				    	}
				    })		
			  	}
			});
	    }  
	})
});

router.post("/admin/completeOrder",sanitization.route, middleware.checkOrigin, passport.authenticate('jwtAdmin', { session: false }), function(req, res){
	ejs.renderFile(__dirname + "/../views/mail2.ejs",{order : req.autosan.body.order , option: "mail2", trackingLink : req.autosan.body.link } , function (err, data) {
	    if (err) {
			logger.error("Error: ",err)
	    } else {
	        var mainOptions = {
		  	from: String(config.EMAIL),
		  	to: String(req.autosan.body.order.details.email),
		  	subject: 'Ολοκλήρωση παραγγελίας',
		  	html : data,
		  	attachments: attachments
			};
			transporter.sendMail(mainOptions, function(error, info){
			  	if (error) {
					logger.error("Error: ",error)
				} else {
					Order.findById(req.autosan.body.order._id,function(err, foundOrder){
						if(err){
							logger.error("Error: ",error)
						} else {
							foundOrder.complete = true;
							if( req.autosan.body.link != null){
								foundOrder.trackingLink = req.autosan.body.link;
							}
							foundOrder.save();
							res.redirect("/admin");
						}
					})			  
				}
			});
	    }  
	})
});

router.post("/admin/deleteOrder/:id",sanitization.route, middleware.checkOrigin, passport.authenticate('jwtAdmin', { session: false }), function(req, res){
	// Order.deleteOne({ _id: req.params.id }, function(err) {
	//     if (err) {
	// 		logger.error("Error: ",err)
	//     }
	//     else {
	//         res.redirect("/admin");
	//     }
	// });

	//Hide Order
	Order.findById(req.params.id,function(err, foundOrder){
		if(err){
			logger.error("Error: ",err)
			res.header("x-api-key", req.session.xkey)
			res.status(500).send("Failure");
		} else {
			foundOrder.archived = true;
			foundOrder.save();
			res.redirect("/admin");
		}
	})		
});

module.exports = router;
