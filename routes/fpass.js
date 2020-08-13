const express 		= require("express"),
	  router 		= express.Router(),
	  passport 		= require("passport"),
	  User 			= require("../models/user"),
	  Order 		= require("../models/order"),
	  middleware  	= require("../middleware/index.js"),
	  sanitization	= require('express-autosanitizer'),
	  JWT 			= require('jsonwebtoken'),
	  {JWT_SECRET}  = require('../configuration'),
 	  config 		= require('../configuration'),
	  crypto 		= require('crypto'),
	  nodemailer 	= require('nodemailer'),
	  ejs 			= require("ejs"),
	  smtpTransport = 	require('nodemailer-smtp-transport'),
	  transporter = nodemailer.createTransport({
		  host: "smtp.gmail.com",
		  port: 465,
		  secure: true, // true for 465, false for other ports
		  auth: {
		    user:  String(config.EMAIL),
		    pass: String(config.EMAIL_PASSWORD)
		  }
	  });

const signToken = function(email) {
  return JWT.sign({
    iss: 'Scorpion',
    sub: email,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
  }, JWT_SECRET);
}



router.use(function(req, res, next) {
res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        next();
})

router.get("/fpass",middleware.user ,function(req,res){
	res.render("fpass");
});


router.post('/fpass',sanitization.route, middleware.email,  middleware.emailExistsLocal, middleware.sameEmail, async function(req, res, next) {

	var email = req.autosan.body.email

	const token = signToken(email);
	res.cookie('Change_Pass', token, {
		maxAge: 0.1 * 60 * 60 * 1000 ,
  		httpOnly: true
	});

	var user = await User.findOne({ "local.email": email }).exec();

	var salt = crypto.randomBytes(16).toString('hex');
  	var hash = crypto.pbkdf2Sync(email, salt, 10000, 512, 'sha512').toString('hex');
  
 	user.local.forgotPassHash = hash;
 	user.local.forgotPassSalt = salt;
 	user.save();

	var mainOptions = {
	  	from: String(config.EMAIL),
	  	to: String(req.autosan.body.email),
	  	subject: 'Αλλαγή Κωδικού Πρόσβασης',
	  	html : '<div> <a href="https://scorpion-store.herokuapp.com/fpass/'+ hash +'">Link επιβεβαίωσης</a></div>'
	};
				
	transporter.sendMail(mainOptions, function(error, info){
	  	if (error) {
	    	console.log(error);
	  	} else {
			res.render('fpass/email');		  
		}
	});
});

router.get("/fpass/:emailHash", passport.authenticate('forgot_pass', { session: false }), function(req,res){
	res.render("fpass/add",{ email : req.params.emailHash});	
});

router.post("/fpass/:emailHash", sanitization.route, middleware.email,  middleware.emailExistsLocal, middleware.password ,passport.authenticate('forgot_pass', { session: false }),async function(req,res){
	var hash = req.params.emailHash;

	var user = await User.findOne({ "local.email": req.autosan.body.email }).exec();
	var hash2 = crypto.pbkdf2Sync(user.local.email , user.local.forgotPassSalt, 10000, 512, 'sha512').toString('hex');

	req.user = undefined;
	cookie = req.cookies;
    for (var prop in cookie) {
        if (!cookie.hasOwnProperty(prop)) {
            continue;
        }    
        res.cookie(prop, '', {expires: new Date(0)});
    }

	if(hash == hash2){
		user.setPassword(req.autosan.body.password);
		user.save();
		console.log("password changed");
		res.render('fpass/success');
	}else{
		console.log("password didnt change");
		res.render('fpass/error');	
	}
});

module.exports = router;

