const express 		= require("express"),
	app				= express(),
	path 			= require('path'),
	bodyParser 		= require("body-parser"),
	cors 			= require("cors"),
	cookieParser 	= require("cookie-parser"),
	sanitization	= require('express-autosanitizer'),
	mongoose 		= require("mongoose"),
	passport 		= require("passport"),
	LocalStrategy   = require("passport-local"),
	FaceBookTokenStrategy = require("passport-facebook-token"),
	methodOverride  = require("method-override"),
	flash			= require("connect-flash"),
	jquery 			= require('jquery'),
	multer 			= require('multer'),
	User 	    	= require("./models/user"),
	Product			= require("./models/product"),
	seedDB			= require("./seeds"),
	session			= require("express-session"),
	mongoStore		= require('connect-mongo')(session),
	stripe 			= require("stripe")("sk_test_KxwzeISn0eOZSyvQCSSHW6WQ00fsMakJLv");


const indexRoutes 	 = require("./routes/index"),
	  userRoutes	 = require("./routes/user"),
	  productRoutes  = require("./routes/products"),
	  stripeRoutes 	 = require("./routes/checkout"),
	  adminRoutes    = require("./routes/admin"),
	  contactRoutes  = require("./routes/contact"),
	  cartRoutes	 = require("./routes/cart"),
	  customRoutes	 = require("./routes/custom"),
	  fpassRoutes 	 = require("./routes/fpass"),	  
	  config 		 = require("./configuration/passport");


app.use(bodyParser.json({
  verify: (req, res, buf) => {
    if (req.originalUrl.startsWith('/webhook')) {
      req.rawBody = buf.toString()
    }
  }
}))
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());


app.use("/",express.static(__dirname + "/public"));
app.use(express.static('files'));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine","ejs");
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://tejohny:wq6gxGSwUFBocOrQ@scorpion-store-shard-00-00.gngrw.mongodb.net:27017,scorpion-store-shard-00-01.gngrw.mongodb.net:27017,scorpion-store-shard-00-02.gngrw.mongodb.net:27017/test?authSource=admin&replicaSet=atlas-130fer-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true",{ useNewUrlParser: true, useUnifiedTopology:true  });

//seedDB(); //seed the database with products



app.use(require("express-session")({
	secret: require("./configuration/index").SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
	store:	new mongoStore({	//for session
		mongooseConnection: mongoose.connection
	}),
	cookie: {maxAge: 10 * 60 * 1000} //session timeout at specified time

}));

app.use(passport.initialize());
app.use(passport.session());


app.use(function(req, res, next){
	if(req.user == undefined){
		if(req.cookies['access_token'])	{
			res.clearCookie('access_token');
			res.clearCookie('admin_token');

		}
		else if(req.cookies['admin_token']){
			res.clearCookie('access_token');
			res.clearCookie('admin_token');
		}
	}
	
	res.locals.currentUser = req.user;
	res.locals.session 	   = req.session; //so I can access session from all the views
	res.locals.error       = req.flash("error");
	res.locals.regError    = req.flash("regError");
	res.locals.genError    = req.flash("genError");
	res.locals.genSuccess  = req.flash("genSuccess");
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	next();
});

app.use(indexRoutes);
app.use(userRoutes);
app.use(productRoutes);
app.use(stripeRoutes);
app.use(adminRoutes);
app.use(cartRoutes);
app.use(customRoutes);
app.use(contactRoutes);
app.use(fpassRoutes);


module.exports = app;
