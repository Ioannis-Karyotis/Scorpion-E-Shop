var express 	= require("express");
var router 		= express.Router();
var passport 	= require("passport");
var User 		= require("../models/user");
var middleware  = require("../middleware/index.js");



router.get("/", function(req, res){
	res.render("landing");
});


//======================
// AUTHENTICATION ROUTES
//======================


router.post("/register",middleware.password,middleware.email,function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser , req.body.password , function(err,user){
		if(err){
			req.flash("regError",err.message);
			res.redirect('back');
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("genSuccess","You Successfully Signed Up");
			res.redirect("back");
		});
	});
});

//===============
//	LOGIN ROUTE
//===============

router.post("/login",passport.authenticate("local",
	{
		successRedirect: "back",
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


module.exports = router;