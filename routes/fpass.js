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
	  objEncDec     = require('object-encrypt-decrypt'),
	  nodemailer 	= require('nodemailer'),
	  ejs       	= require("ejs"),
	  dotenv 		= require('dotenv'),
	  logger        = require('simple-node-logger').createSimpleLogger('Logs.log'),
	  transporter 	= nodemailer.createTransport({
							host: "smtp.zoho.eu",
							port: 465,
							secure: true, // true for 465, false for other ports
							auth: {
								user:  String(config.EMAIL),
								pass: String(config.EMAIL_PASSWORD)
							},
							tls: {
								rejectUnauthorized: false
							}					  
					  }),
	  attachments	= require('./../configuration/emailAttachments');

dotenv.config();	  

const signToken = function(hashobj) {
  return JWT.sign({
    iss: 'Scorpion',
    sub: hashobj,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
  }, JWT_SECRET);
}

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

router.get("/fpass",middleware.user ,function(req,res){
	res.render("fpass");
});


router.post('/fpass',sanitization.route, middleware.email,  middleware.emailExistsLocal, middleware.sameEmail, async function(req, res, next) {
	var email = req.autosan.body.email

	var user = await User.findOne({ "local.email": email }).exec();

	var salt = crypto.randomBytes(16).toString('hex');
  	var hash = crypto.pbkdf2Sync(email, salt, 10000, 512, 'sha512').toString('hex');
  	var date = new Date();
    date.setTime(date.getTime() + (600 * 1000));
  
 	user.local.forgotPassHash = hash;
 	user.local.forgotPassSalt = salt;
 	user.local.forgotValidUntil = date;

 	var hashobj = {
 		hash : hash,
 		email : email
 	}
	
	hashobj = objEncDec.encrypt(hashobj);
 	user.save();

 	const token = signToken(hashobj);
	res.cookie('Change_Pass', token, {
		maxAge: 0.1 * 60 * 60 * 1000 ,
  		httpOnly: true,
		secure : true
	});

 	ejs.renderFile(__dirname + "/../views/mail2.ejs",{hashobj : hashobj , rootserver:  process.env.ROOT , option: "mail3" ,order :null } , function (err, data) {
	    if (err) {
			logger.error("Error: ", err);
	    } else {
	        var mainOptions = {
		  	from: String(config.EMAIL),
		  	to: String(req.autosan.body.email),
		  	subject: 'Αλλαγή Κωδικού Πρόσβασης',
		  	html : data,
		  	attachments: attachments
			};
			res.render('fpass/email');
			transporter.sendMail(mainOptions, function(error, info){
			  	if (error) {
					logger.error("Error: ", error);
				} else {
					logger.info("Email sent: ",  info.response);
				}
			});
	    }  
	})
});

router.get("/fpass/:hashobj", passport.authenticate('forgot_pass', { session: false }), function(req,res){
	res.render("fpass/add",{ email : req.params.hashobj});	
});

router.post("/fpass/:hashobj", sanitization.route, middleware.password ,passport.authenticate('forgot_pass', { session: false }),async function(req,res){
	req.autosan.body = trimBody(req.autosan.body);
	var hashobj = req.params.hashobj;
	hashobj = objEncDec.decrypt(hashobj);

	var user = await User.findOne({ "local.email": hashobj.email },function(err ,user){
		if(err || user == null || user == undefined){
			res.render('fpass/error');
		}else{
			var hash2 = crypto.pbkdf2Sync(user.local.email , user.local.forgotPassSalt, 10000, 512, 'sha512').toString('hex');
			
			if(hashobj.hash == hash2){
				user.setPassword(req.autosan.body.password);
				user.local.forgotPassHash = null;
 				user.local.forgotPassSalt = null;
 				user.local.forgotValidUntil = null;
				user.save();
				req.user = undefined;
				cookie = req.cookies;
			    for (var prop in cookie) {
			        if (!cookie.hasOwnProperty(prop)) {
			            continue;
			        }    
		        res.cookie(prop, '', {expires: new Date(0)});
		    	}
				res.render('fpass/success');

			}else{
				res.render('fpass/error');	
			}
		}
	});
	
});

module.exports = router;

