var express 	= require("express");
var router 		= express.Router();
var passport 	= require("passport");
const JWT 		= require('jsonwebtoken');
const { JWT_SECRET } = require('../configuration');
var User 		= require("../models/user");
var Product = require("../models/product");
var middleware  = require("../middleware/index.js");


signToken = function(user) {
  return JWT.sign({
    iss: 'Scorpion',
    sub: user.id,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
  }, JWT_SECRET);
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
router.get("/register",function(req,res){
	if(req.app.locals.specialContext!= null){
		var rest = req.app.locals.specialContext;
		req.app.locals.specialContext = null;
		res.render("register",{rest : rest});
	}else{
		var rest = {};
		res.render("register",{rest : rest});
	}
})


router.post("/register",middleware.namesur , middleware.email , middleware.password ,function(req,res){
	var newUser = new User({
	methods: ['local'],
	local:{
		name    : req.body.name,
		surname : req.body.surname,
		email : req.body.email
		}
	});
	newUser.setPassword(req.body.password);
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
			res.redirect("/");
		});
	})
});

//===============
//	LOGIN ROUTE
//===============

router.get("/login",function(req,res){
	res.render("login");
});


router.post('/login',passport.authenticate('local', { failWithError: true }),
	function(req, res, next) {
		// handle success
		console.log(req.user);
		const token = signToken(req.user);
		res.cookie('access_token', token, {
	  		httpOnly: true
		});
		req.flash("genSuccess","You Successfully Logged In");
		return res.redirect("/"); 
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
	res.clearCookie('access_token');
	res.redirect("back");

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
	      		httpOnly: true
	    	});
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
