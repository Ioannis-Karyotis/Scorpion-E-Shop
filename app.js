const express 		= require("express"),
	app				= express(),
	path 			= require('path'),
	bodyParser 		= require("body-parser"),
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
	seedDB			= require("./seeds");

const indexRoutes 	 = require("./routes/index"),
	  productRoutes  = require("./routes/products"),
	  config 		 = require("./configuration/passport");

app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use("/",express.static(__dirname + "/public"));
app.use(express.static('files'))
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine","ejs");
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
mongoose.connect("mongodb://localhost/Scorpion",{ useNewUrlParser: true, useUnifiedTopology:true  });
seedDB(); //seed the database with products


app.use(require("express-session")({
	secret: "testing the authentication",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());



app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error       = req.flash("error");
	res.locals.regError    = req.flash("regError");
	res.locals.genError    = req.flash("genError");
	res.locals.genSuccess  = req.flash("genSuccess");
	next();
});


app.use(indexRoutes);
app.use(productRoutes);

module.exports = app;

