const express 		= require("express"),
	  router 		= express.Router(),
	  passport 		= require("passport"),
	  User 			= require("../models/user"),
      Order 		= require("../models/order"),
	  middleware  	= require("../middleware/index.js"),
	  sanitization	= require('express-autosanitizer'),
	  JWT 			= require('jsonwebtoken'),
	  {JWT_SECRET} 	= require('../configuration'),
	  fs 			= require('fs'),
	  multer 		= require('multer'),
	  dotenv 		= require('dotenv'),
	  path 			= require('path'),
	  logger        = require('simple-node-logger').createSimpleLogger('Logs.log'),
	  storage 		= multer.diskStorage({
						destination: function(req, file, cb) {
							cb(null, "./public/images/profile-pictures");
						},
						filename: function(req, file, cb) {
							cb(null, req.user._id+".jpg");
						}
					});

dotenv.config();

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

// passport.authenticate('jwt', { session: false })
router.get("/user" ,passport.authenticate('jwt', { session: false }), function(req, res){
		if(req.user){
			res.render("user");
		}else{
			req.flash("genSuccess","Παρακαλώ συνδεθείτε ξανα , για να ισχύσουν οι αλλαγές");
			redirect("login");
		}		
});

// passport.authenticate('jwt', { session: false })
router.get("/user/orders" ,passport.authenticate('jwt', { session: false }), function(req, res){
	if(req.user){
		User.findById(req.session.user._id, function(err , foundUser){
			if(err){
				logger.error("Error: ", err);
				res.redirect("back");
			}	
			Order.find({ 'details.email': foundUser[foundUser.methods].email , 'complete':false }).populate("productList.product").exec(function(err , foundOrders ){
		      	if(err){
					logger.error("Error: ", err);
				}else{
		      		var orders = foundOrders.reverse();
			        return res.render("user/show", {orders : orders });
			    }
			});
		});	
	}else{
		redirect("login");
	}	
});


router.put("/user/changeInitials" ,sanitization.route,  middleware.namesur , middleware.email ,passport.authenticate('jwt', { session: false }), function(req, res){
	req.autosan.body = trimBody(req.autosan.body);
	User.findById(req.session.user._id, function(err , foundUser){
		if(err){
			logger.error("Error: ", err);
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

router.put("/user/changePassword" ,sanitization.route,middleware.password, passport.authenticate('jwt', { session: false }), function(req, res){
	req.autosan.body = trimBody(req.autosan.body);
	User.findById(req.session.user._id, function(err , foundUser){
		if(err){
			logger.error("Error: ", err);
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


router.put("/user/changeImage" ,sanitization.route, multer({ storage: storage, fileFilter: imageFilter }).single("profile_pic"), passport.authenticate('jwt', { session: false }), function(req, res){
	if (req.fileValidationError) {
        return res.send(req.fileValidationError);
    }
    else if (!req.file) {
        return res.send('Please select an image to upload');
    }
	var str = req.file.path;
	var str2 = str.replace("public", "");
	var final = str2.replace(/\\/g,"/");
	var image= process.env.ROOT + final;	
	User.findById(req.session.user._id, function(err , foundUser){
		if(err){
			logger.error("Error: ", err);
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


router.delete("/user/deleteProfile",sanitization.route, middleware.checkOrigin, passport.authenticate('jwt', { session: false }), function(req, res){
	req.autosan.body = trimBody(req.autosan.body);
	User.remove({ _id: req.autosan.body.id },async function(err) {
	    if (err) {
			logger.error("Error: ", err);
	    }
	    else {
	    	const path = "./public/images/profile-pictures/"+req.autosan.body.id+".jpg";

		    if (fs.existsSync(path)) {
	   			await fs.unlink(path ,function(err){
					if(err){
						logger.error("Error: ", err);
					}
				});
	  		}
	    }
	});
	req.logout();
	req.user = undefined;
	cookie = req.cookies;
    for (var prop in cookie) {
        if (!cookie.hasOwnProperty(prop)) {
            continue;
        }    
        res.cookie(prop, '', {expires: new Date(0)});
    }
	res.header("x-api-key", req.session.xkey)
    res.send("ok");
});

module.exports = router;