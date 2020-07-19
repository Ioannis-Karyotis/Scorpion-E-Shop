var express 	= require("express");
var router 		= express.Router();
var passport 	= require("passport");
const JWT 		= require('jsonwebtoken');
const { JWT_SECRET } = require('../configuration');
const {JWT_SECRET_ADMIN} = require('../configuration');
var User 		= require("../models/user");
var Product = require("../models/product");
var Cart = require("../models/cart");
var Order = require("../models/order");
var middleware  = require("../middleware/index.js");
var bodyParser = require("body-parser");
const sanitization	= require('express-autosanitizer');

router.use(function(req, res, next) {
res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        next();
})

signToken = function(user) {
  return JWT.sign({
    iss: 'Scorpion',
    sub: user.id,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
  }, JWT_SECRET);
}

signAdminToken = function(admin) {
  return JWT.sign({
    iss: 'Scorpion',
    sub: admin,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
  }, JWT_SECRET_ADMIN);
}

router.get("/secret" ,passport.authenticate('jwt', { session: false }), function(req, res){
	res.redirect("/");
});


router.get("/",  function(req, res){
	res.render("landing");
});

//======================
// AUTHENTICATION ROUTES
//======================

router.get("/register",middleware.user,function(req,res){
	if(req.app.locals.specialContext!= null){
		var validated = req.app.locals.specialContext;
		req.app.locals.specialContext = null;
		res.render("register",{validated : validated});
	}else{
		var validated = {};
		res.render("register",{validated : validated});
	}
})


router.post("/register",sanitization.route, middleware.namesur , middleware.email , middleware.password ,function(req,res){
	var newUser = new User({
	methods: 'local',
	local:{
		name    : req.autosan.body.name,
		surname : req.autosan.body.surname,
		email : req.autosan.body.email,
		profile : null
		}
	});
	newUser.setPassword(req.autosan.body.password);
	newUser.save(function(err){
		if(err){
			console.log(err.message);
		}
		//Generate the token
    	const token = signToken(newUser);
    	// Send a cookie containing JWT
    	res.cookie('access_token', token, {
      		httpOnly: true
    	});

		passport.authenticate("local")(req, res, function(){
			req.flash("genSuccess","You Successfully Signed Up");
			res.redirect("/user/"+ req.user._id);
		});
	})
});

//===============
//	LOGIN ROUTE
//===============

router.get("/login",middleware.user ,function(req,res){
	res.render("login");
});


router.post('/login',sanitization.route, passport.authenticate('local', { failWithError: true }),
	function(req, res, next) {
		// handle success
		if(req.user.local.priviledge == "Admin"){
			console.log("inside");
			const token = signAdminToken(req.user);
			res.cookie('admin_token', token, {
	  			httpOnly: true
			});
			return res.redirect("/admin");
		}
		const token = signToken(req.user);
		res.cookie('access_token', token, {
	  		httpOnly: true
		});
		req.flash("genSuccess","You Successfully Logged In");
		return res.redirect("/user/"+ req.user._id);
	},
	function(err, req, res, next) {
		// handle error
		req.flash("error","Το E-mail δεν αντιστοιχεί σε κάποιο χρήστη");
		res.redirect('back');
	}
);



//===============
//	LOGOUT ROUTE
//===============

router.get("/logout",function(req,res){

	req.logout();
	req.flash("genSuccess","You Logged Out");
	req.user = undefined;
	cookie = req.cookies;
    for (var prop in cookie) {
        if (!cookie.hasOwnProperty(prop)) {
            continue;
        }    
        res.cookie(prop, '', {expires: new Date(0)});
    }
	res.redirect("/");

})

//===============
//FACEBOOK ROUTE
//===============

router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email'], failWithError: true }),
	function(req, res, next){
	}
);

router.get('/auth/facebook/callback',
  	passport.authenticate('facebook', { failureRedirect: '/login' }),
	  	function(req, res) {
	  		const token = signToken(req.user);
	    	res.cookie('access_token', token, {
	    		// expires: new Date(Date.now() + 10),
	      		httpOnly: true
	    	});
	    	console.log(req.cookies);
	    	res.redirect('/');
	  	}
);

//===============
//GOOGLE ROUTE
//===============

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/auth/google/callback',
	passport.authenticate('google', { failureRedirect: '/login' }),
	  	function(req, res) {
	  		const token = signToken(req.user);
	    	res.cookie('access_token', token, {
	      		httpOnly: true
	    	});
	    	res.redirect('/');
	  	}
);



module.exports = router;
