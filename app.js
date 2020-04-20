var express 		= require("express");
	app				= express();
	path 			= require('path');
	bodyParser 		= require("body-parser");
	expressSanitizer= require("express-sanitizer");
	mongoose 		= require("mongoose");
	passport 		= require("passport");
	LocalStrategy   = require("passport-local");
	FaceBookTokenStrategy = require("passport-facebook-token");
	methodOverride  = require("method-override");
	flash			= require("connect-flash");
	jquery 			= require('jquery');
	User 	    	= require("./models/user");
	Product			= require("./models/product");
	seedDB			= require("./seeds");

var indexRoutes 	 = require("./routes/index");
var productRoutes 	 = require("./routes/products");

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

//======================
//PASSPORT CONFIGURATION
//======================

app.use(require("express-session")({
	secret: "testing the authentication",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// passport.use("faceBookToken", new FaceBookTokenStrategy({
// 	clientID: config.oauth.facebook.clientID,
// 	clientSecret: config.oauth.facebook.clientSecret,
// }, async(accessToken, refreshToken, profile, done) => {
// 	try{
// 		console.log('profile',profile);
// 		console.log('accessToken',accessToken);
// 		console.log('refreshToken',refreshToken);
// 	} catch{
// 		done(error, false , error.message);
// 	}
// }));


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


app.listen(3000,function(){
	console.log("Scorpion Server has started");
})
