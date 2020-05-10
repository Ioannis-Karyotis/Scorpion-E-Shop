const express 		= require("express"),
	app				= express(),
	path 			= require('path'),
	bodyParser 		= require("body-parser"),
	cors 			= require("cors"),
	cookieParser 	= require("cookie-parser"),
	expressSanitizer= require("express-sanitizer"),
	mongoose 		= require("mongoose"),
	passport 		= require("passport"),
	LocalStrategy   = require("passport-local"),
	FaceBookTokenStrategy = require("passport-facebook-token"),
	methodOverride  = require("method-override"),
	flash			= require("connect-flash"),
	jquery 			= require('jquery'),
	User 	    	= require("./models/user"),
	Product			= require("./models/product"),
	seedDB			= require("./seeds"),
	session			= require("express-session"),
	mongoStore		= require('connect-mongo')(session);
	stripe 			= require("stripe")("sk_test_KxwzeISn0eOZSyvQCSSHW6WQ00fsMakJLv");


const indexRoutes 	 = require("./routes/index"),
	  productRoutes  = require("./routes/products"),
	  stripeRoutes 	 = require("./routes/stripe"),
	  config 		 = require("./configuration/passport");



app.use(cookieParser());
app.use(
  express.json({
    // We need the raw body to verify webhook signatures.
    // Let's compute it only when hitting the Stripe webhook endpoint.
    verify: function(req, res, buf) {
      if (req.originalUrl.startsWith("/webhook")) {
        req.rawBody = buf.toString();
      }
    }
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use("/",express.static(__dirname + "/public"));
app.use(express.static('files'));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine","ejs");
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/Scorpion",{ useNewUrlParser: true, useUnifiedTopology:true  });
seedDB(); //seed the database with products



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
	res.locals.currentUser = req.user;
	res.locals.session 	   = req.session; //so I can access session from all the views
	res.locals.error       = req.flash("error");
	res.locals.regError    = req.flash("regError");
	res.locals.genError    = req.flash("genError");
	res.locals.genSuccess  = req.flash("genSuccess");
	next();
});

app.use(indexRoutes);
app.use(productRoutes);
app.use(stripeRoutes);

module.exports = app;
