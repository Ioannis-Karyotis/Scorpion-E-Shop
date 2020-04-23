var express 	= require("express");
var router 		= express.Router();
var passport 	= require("passport");
var User 		= require("../models/user");
var Product = require("../models/product");
var middleware  = require("../middleware/index.js");



router.get("/", function(req, res){
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
		name    : req.body.name,
		surname : req.body.surname,
		email : req.body.email
	});
	console.log(newUser);
	newUser.setPassword(req.body.password);
	console.log(newUser);
	newUser.save(function(err){
		if(err){
			console.log(err.message);
		}
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
})

router.post("/login",passport.authenticate("local",
	{
		successRedirect: "/",
		failureRedirect: "back",
		failureFlash: true
	}), function(req,res){
});

//===============
//	LOGOUT ROUTE
//===============

router.get("/logout",function(req,res){
	req.logout();
	req.flash("genSuccess","You Logged Out");
	res.redirect("back");
})


//===============
//FACEBOOK ROUTE
//===============

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));


module.exports = router;
