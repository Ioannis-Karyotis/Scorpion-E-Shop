const express 		= require("express"),
	  router 		= express.Router(),
	  passport 		= require("passport"),
	  JWT 			= require('jsonwebtoken'),
	  config 		= require('../configuration'),
	  User 			= require("../models/user"),
	  Product   	= require("../models/product"),
	  Order     	= require("../models/order"),
	  sanitization	= require('express-autosanitizer'),
	  nodemailer 	= require('nodemailer'),
	  ejs       	= require("ejs"),
	  smtpTransport = require('nodemailer-smtp-transport'),
	  transporter 	= nodemailer.createTransport({
							host: "smtp.gmail.com",
							port: 465,
							secure: true, // true for 465, false for other ports
							auth: {
								user:  String(config.EMAIL),
								pass: String(config.EMAIL_PASSWORD)
							}
					  }),
	  attachments	= [ 
						{   
				            filename: '9640e6f2-8d98-4da8-a5e4-500581c22686.png',
				            path: './public/images/mail/9640e6f2-8d98-4da8-a5e4-500581c22686.png',
				            cid: 'background'
				        },
				        {   
				            filename: 'Bottom_round.png',
				            path: './public/images/mail/Bottom_round.png',
				            cid: 'bottom_round'
				        },
				        {   
				            filename: 'rounded_corner_1.png',
				            path: './public/images/mail/rounded_corner_1.png',
				            cid: 'rounded_corner'
				        },
				        {   
				            filename: 'Cart.gif',
				            path: './public/images/mail/Cart.gif',
				            cid: 'cart'
				        },
				        {   
				            filename: 'Facebook.png',
				            path: './public/images/mail/Facebook.png',
				            cid: 'facebook'
				        },
				        {   
				            filename: 'Instagram.png',
				            path: './public/images/mail/Instagram.png',
				            cid: 'instagram'
				        },
				        {   
				            filename: 'logo4.png',
				            path: './public/images/mail/logo4.png',
				            cid: 'logo'
			       		}
			        ];
	  
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
	req.autosan.body = trimBody(req.autosan.body);
	ejs.renderFile(__dirname + "/../views/mail.ejs",{msg : req.autosan.body } , function (err, data) {
	    if (err) {
	        console.log(err);
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
			  	} else {
			    	console.log('Email sent: ' + info.response);
			    	Order.findById(req.autosan.body.order._id,function(err, foundOrder){
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
	    }  
	})
});

router.post("/admin/completeOrder",sanitization.route, passport.authenticate('jwtAdmin', { session: false }), function(req, res){
	req.autosan.body = trimBody(req.autosan.body);
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

router.delete("/admin/deleteOrder",sanitization.route, passport.authenticate('jwtAdmin', { session: false }), function(req, res){
	req.autosan.body = trimBody(req.autosan.body);
	Order.remove({ _id: req.autosan.body._id }, function(err) {
	    if (err) {
	        console.log(err.message);
	    }
	    else {
	        res.redirect("/admin");
	    }
	});
});

module.exports = router;
