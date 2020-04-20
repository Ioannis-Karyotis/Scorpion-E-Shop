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


router.post("/register",middleware.username , middleware.password , middleware.email,function(req,res){
	var newUser = new User({
		username: req.body.username,
		email   : req.body.email
	});
	User.register(newUser , req.body.password , function(err,user){
		if(err){
			req.flash("regError",err.message);
			res.redirect('back');
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("genSuccess","You Successfully Signed Up");
			res.redirect("/");
		});
	});
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

// router.route('/oauth/facebook')
// 	.post(passport.authenticate('facebookToken', {session:false}), UsersController.facebookOAuth);

module.exports = router;
