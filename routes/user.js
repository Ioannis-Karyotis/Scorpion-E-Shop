const express 		= require("express"),
	  router 		= express.Router(),
	  passport 		= require("passport"),
	  User 			= require("../models/user"),
      Order 		= require("../models/order"),
	  middleware  	= require("../middleware/index.js"),
	  sanitization	= require('express-autosanitizer'),
	  JWT 			= require('jsonwebtoken'),
	  {JWT_SECRET} 	= require('../configuration'),
	  multer 		= require('multer'),
	  path 			= require('path'),
	  storage 		= multer.diskStorage({
						destination: function(req, file, cb) {
							cb(null, "./public/images/");
						},
						filename: function(req, file, cb) {
							cb(null, req.user._id+".jpg");
						}
					});

const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const signToken = function(user) {
  return JWT.sign({
    iss: 'Scorpion',
    sub: user.id,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
  }, JWT_SECRET);
}

router.use(function(req, res, next) {
res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        next();
})

// passport.authenticate('jwt', { session: false })
router.get("/user/:id" ,passport.authenticate('jwt', { session: false }), function(req, res){
		if(req.user){
			res.render("user");
		}else{
			req.flash("genSuccess","Παρακαλώ συνδεθείτε ξανα , για να ισχύσουν οι αλλαγές");
			redirect("login");
		}		
});

// passport.authenticate('jwt', { session: false })
router.get("/user/:id/orders" ,passport.authenticate('jwt', { session: false }), function(req, res){
	if(req.user){
		User.findById(req.params.id, function(err , foundUser){
			if(err){
				console.log(err)
				res.redirect("back");
			}	
			Order.find({ 'details.email': foundUser[foundUser.methods].email , 'complete':false }).populate("productList.product").exec(function(err , foundOrders ){
		      	if(err){
		          	console.log(err)
		      	}else{
		      		console.log(foundOrders);
		      		var orders = foundOrders.reverse();
			        return res.render("user/show", {orders : orders });
			    }
			});
		});	
	}else{
		redirect("login");
	}	
});


router.put("/user/:id/changeInitials" ,sanitization.route,  middleware.namesur , middleware.email ,passport.authenticate('jwt', { session: false }), function(req, res){
	User.findById(req.params.id, function(err , foundUser){
		if(err){
			console.log(err)
			res.redirect("back");
		}else{
			req.logout();
			res.clearCookie('access_token');
			foundUser.local.name = req.autosan.body.name;
			foundUser.local.surname = req.autosan.body.surname;
			foundUser.local.email = req.autosan.body.email;
			foundUser.save();
			req.flash("genSuccess","Παρακαλώ συνδεθείτε ξανα , για να δείτε τις αλλαγές");
			res.redirect("/login");
		}
	});
});

router.put("/user/:id/changePassword" ,sanitization.route,middleware.password, passport.authenticate('jwt', { session: false }), function(req, res){
	User.findById(req.params.id, function(err , foundUser){
		if(err){
			console.log(err)
			res.redirect("back");
		}else{
			req.logout();
			res.clearCookie('access_token');
			foundUser.setPassword(req.autosan.body.passwordnew);
			foundUser.save();
			req.flash("genSuccess","Παρακαλώ συνδεθείτε ξανα , για να δείτε τις αλλαγές");
			res.redirect("/login");
		}
	});
});


router.put("/user/:id/changeImage" ,sanitization.route, multer({ storage: storage, fileFilter: imageFilter }).single("profile_pic"), passport.authenticate('jwt', { session: false }), function(req, res){
	if (req.fileValidationError) {
        return res.send(req.fileValidationError);
    }
    else if (!req.file) {
        return res.send('Please select an image to upload');
    }
	var str = req.file.path;
	console.log(str);
	var str2 = str.replace("public", "");
	var final = str2.replace(/\\/g,"/");
	var image="https://scorpion-store.herokuapp.com" + final;	
	User.findById(req.params.id, function(err , foundUser){
		if(err){
			console.log(err)
			res.redirect("back");
		}else{
			req.logout();
			res.clearCookie('access_token');
			foundUser[foundUser.methods].profile = image;
			foundUser.save();
			req.flash("genSuccess","Παρακαλώ συνδεθείτε ξανα , για να δείτε τις αλλαγές");
			res.redirect("/login");
		}
	});
});

router.get("/user/forgotYourPassword/:fpass" ,passport.authenticate('jwt', { session: false }), function(req, res){
		
});


module.exports = router;