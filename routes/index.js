const express 			 = require("express"),
	  router 			 = express.Router(),
	  passport 			 = require("passport"),
	  JWT 				 = require('jsonwebtoken'),
	  {JWT_SECRET} 		 = require('../configuration'),
	  {JWT_SECRET_ADMIN} = require('../configuration'),
	  User 				 = require("../models/user"),
	  Product 			 = require("../models/product"),
	  Cart 				 = require("../models/cart"),
	  Order 			 = require("../models/order"),
	  middleware  		 = require("../middleware/index.js"),
	  bodyParser 		 = require("body-parser"),
	  dotenv 			 = require('dotenv'),
	  sanitization		 = require('express-autosanitizer'),
	  logger          	 = require('simple-node-logger').createSimpleLogger('Logs.log'),
	  bouncer 			 = require ("express-bouncer")(900000, 900000, 10);


const signToken = function(user) {
  return JWT.sign({
    iss: 'Scorpion',
    sub: user.id,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
  }, JWT_SECRET);
}

const signAdminToken = function(admin) {
  return JWT.sign({
    iss: 'Scorpion',
    sub: admin,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
  }, JWT_SECRET_ADMIN);
}

function trimBody(inside){

  Object.keys(inside).forEach(function(key,index) {
	inside[key] = inside[key].trim();
  });
  return inside;
}

bouncer.blocked = function (req, res, next, remaining)
{
	res.status(429);
	res.render('429.ejs', {title:'Too many requests'});
};

dotenv.config();

router.use(function(req, res, next) {
	res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
})

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


router.post("/register",sanitization.route, middleware.namesur , middleware.emailExists, middleware.email , middleware.password ,function(req,res){
	req.autosan.body = trimBody(req.autosan.body);
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
			logger.error("Error: ", err);
		}
		//Generate the token
    	const token = signToken(newUser);
    	// Send a cookie containing JWT
    	res.cookie('access_token', token, {
			secure: true,
      		httpOnly: true
    	});

		passport.authenticate("local")(req, res, function(){
			req.flash("genSuccess","You Successfully Signed Up");
			req.session.user = req.user;
			res.redirect("/user");
		});
	})
});

//===============
//	LOGIN ROUTE
//===============

router.get("/login",middleware.user ,function(req,res){
	res.render("login");
});


router.post('/login', bouncer.block, sanitization.route, passport.authenticate('local', { failWithError: true }),
	function(req, res, next) {
		// handle success
		if(req.user.local.priviledge == "Admin"){
			logger.info("Admin has logged in!!!");
			const token = signAdminToken(req.user);
			res.cookie('admin_token', token, {
				secure : true,
	  			httpOnly: true,
	  			maxAge: 2* 60 * 60 * 1000
			});
			logger.info("Created Admin Cookie");
			console.log(req.user);
			bouncer.reset(req);
			res.redirect('back');
		}else{
			const token = signToken(req.user);
			res.cookie('access_token', token, {
				secure : true,
				httpOnly: true,
				maxAge: 2* 60 * 60 * 1000
	
			});
			bouncer.reset(req);
			req.flash("genSuccess","You Successfully Logged In");
			req.session.user = req.user;
			return res.redirect("/user");
		}
	},
	function(err, req, res, next) {
		// handle error
		req.flash("error","Το E-mail ή ο κωδικός δεν είναι σωστά");
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
	req.session.user = undefined;
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
	  		req.session.user = req.user;
	    	res.cookie('access_token', token, {
	    		// expires: new Date(Date.now() + 10),
				secure: true,
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
			console.log("tried login to google");
	  		const token = signToken(req.user);
	  		req.session.user = req.user;
	    	res.cookie('access_token', token, {
				secure: true,
	      		httpOnly: true
	    	});
	    	res.redirect('/');
	  	}
);



module.exports = router;
