var express 		= require("express");
	app				= express();
	bodyParser 		= require("body-parser");
	expressSanitizer= require("express-sanitizer");
	mongoose 		= require("mongoose");
	passport 		= require("passport");
	LocalStrategy   = require("passport-local");
	methodOverride  = require("method-override");
	flash			= require("connect-flash");
	jquery 			= require('jquery');
	User 	    	= require("./models/user");
	//seedDB			= require("./seeds");

var indexRoutes 	 = require("./routes/index");

app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(express.static(__dirname + "/public"));
app.use(express.static('files'))
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine","ejs");
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
mongoose.connect("mongodb://localhost/Scorpion",{ useNewUrlParser: true, useUnifiedTopology:true  });
// seedDB(); //seed the database

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


app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error       = req.flash("error");
	res.locals.regError    = req.flash("regError");
	res.locals.genError    = req.flash("genError");
	res.locals.genSuccess     = req.flash("genSuccess");
	next();

});


app.use(indexRoutes); 


app.listen(3000,function(){
	console.log("Scorpion Server has started");
})
