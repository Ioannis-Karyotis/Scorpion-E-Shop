const express 		= require("express"),
	app				= express(),
	path 			= require('path'),
	favicon         = require('serve-favicon'),
	bodyParser 		= require("body-parser"),
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
	stripe 			= require("stripe")("sk_test_KxwzeISn0eOZSyvQCSSHW6WQ00fsMakJLv"),
	csp 			= require('helmet-csp'),
	crypto 			= require("crypto"),
	morgan 			= require('morgan'),
	fs  			= require('fs'),
	csrf 			= require('csurf'),
	cors 			= require('cors'),
	rfs 			= require('rotating-file-stream'),
	configENV 	      	= require('./configuration'),
	nodemailer   	= require('nodemailer'),
	dotenv        	= require('dotenv'),
	logger        	= require('simple-node-logger').createSimpleLogger('Logs.log'),
	transporter = nodemailer.createTransport
	  ({
		host: "smtp.zoho.eu",
		port: 465,
		secure: true, // true for 465, false for other ports
		auth: {
		  user:  String(configENV.EMAIL_ERRORS),
		  pass: String(configENV.EMAIL_PASSWORD_ERRORS)
		}
	  });

dotenv.config();

const indexRoutes 	 = require("./routes/index"),
	  userRoutes	 = require("./routes/user"),
	  productRoutes  = require("./routes/products"),
	  stripeRoutes 	 = require("./routes/checkout"),
	  adminRoutes    = require("./routes/admin"),
	  contactRoutes  = require("./routes/contact"),
	  cartRoutes	 = require("./routes/cart"),
	  customRoutes	 = require("./routes/custom"),
	  fpassRoutes 	 = require("./routes/fpass"),
	  userdataRoutes = require("./routes/userdata"),
	  config 		 = require("./configuration/passport");




/*app.use (function (req, res, next) {
	if(process.env.ENV == "production") {
	    if (req.secure) {
	            // request was via https, so do no special handling
	            next();
	    } else {
	            // request was via http, so redirect to https
	            res.redirect('https://' + req.headers.host + req.url);
	    }
	}else{
		next();
	}
});*/

//Setup session
var sess = {
	secret: require("./configuration/index").SESSION_SECRET,
	name: 'session_id',
    saveUninitialized: true,
    resave: false,
	proxy: true,
    cookie: {
	  httpOnly : true,
      sameSite: 'lax',
      maxAge: 3600000
    },
	store:	new mongoStore({	//for session
		mongooseConnection: mongoose.connection
	})
}

if (process.env.ENV == "production") {
	app.set('trust proxy', 1) // trust first proxy
	sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess));

// create a rotating write stream
var accessLogStream = rfs.createStream('Access.log', {
	interval: '1d', // rotate daily
	path: path.join(__dirname, 'log')
})

// setup the logger
app.use(morgan('dev', { stream: accessLogStream }))

//Use favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//Parsers
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser(require("./configuration/index").SESSION_SECRET));
app.use(express.urlencoded());

//More configs
app.use("/",express.static(__dirname + "/public"));
app.use(express.static('files'));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine","ejs");
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

//Mongoose connect
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/Scorpion",{ useNewUrlParser: true, useUnifiedTopology:true  });

//Seed with fake data
//seedDB(); //seed the database with products

//Passport config
app.use(passport.initialize());
app.use(passport.session());

//Cors and Csrf
app.use(cors());
app.use(csrf({ cookie: true }))

app.use(function(req, res, next){
	console.log("access token : " + req.cookies['access_token']);
	console.log("user : " + req.session.user);
	if((req.user == undefined && req.cookies['access_token'] != undefined) || (req.user == undefined && req.cookies['admin_token'] != undefined)){
		req.session.user = undefined;
		res.clearCookie('access_token');
		res.clearCookie('admin_token');
		res.clearCookie('connect.sid');
		res.redirect('/expired');
	}else{
		next();
	}
})

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.session 	   = req.session; //so I can access session from all the views
	res.locals.root 	   = process.env.ROOT;
	res.locals.error       = req.flash("error");
	res.locals.regError    = req.flash("regError");
	res.locals.genError    = req.flash("genError");
	res.locals.genSuccess  = req.flash("genSuccess");
	res.locals.nonce 	   = crypto.randomBytes(16).toString("hex");
	res.locals.csrfToken   = req.csrfToken();
	
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	next();
});

app.use((req, res, next) => {
	csp({
	  directives: {
		"default-src": ["'self'",
					"https://ipinfo.io/",
					"https://fonts.gstatic.com",
					"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/webfonts/",
					"http://netdna.bootstrapcdn.com/font-awesome/3.2.1/font/",
					"https://js.stripe.com/v3/",
					"https://www.google.com/"],
		"style-src" : ["'self'",
					"https://maxcdn.bootstrapcdn.com/",
					"https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.css",
					"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css",
					"https://fonts.googleapis.com/",
					"https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.css",
					"http://netdna.bootstrapcdn.com/font-awesome/3.2.1/css/font-awesome.css",
					"https://fonts.gstatic.com/",
					"http://netdna.bootstrapcdn.com/font-awesome/3.2.1/font/",
					"'unsafe-inline'"],
		"img-src": ["'self'","data:","https://scorpionclothing.gr/",
				"https://platform-lookaside.fbsbx.com/platform/profilepic/",
				"https://lh3.googleusercontent.com/"],
		"script-src": [`'nonce-${res.locals.nonce}'`,"https://js.stripe.com/v3/fingerprinted/js/trusted-types-checker-9cf6818a8cc69f2c5311a01d85d95c32.js"],
		"object-src" : ["'none'"],
		"base-uri" : ["'self'"]
		}
	})(req, res, next);
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
app.use(userdataRoutes);


app.post("/initializeClient", function(req,res,next){
	req.session.width = req.body.w;
	req.session.height = req.body.h;
	req.session.xkey = crypto.randomBytes(20).toString("hex");
	
	res.header("x-api-key", req.session.xkey)
	res.json({success : true});
})

app.get('/expired' ,function(req, res){
	res.render('expired');
})
app.get('/Privacy_Policy' ,function(req, res){
	res.render('Privacy_Policy');
})
app.get('/Terms_Of_Service' ,function(req, res){
	res.render('Terms_Of_Service');
})


// Handle 401 withi 404
app.use(function(req, res) {
	res.status(404);
   	res.render('404.ejs', {title: '404: File Not Found'});
});

//Handle 500
// app.use(function(error, req, res, next) {
// 	console.log(configENV.EMAIL_ERRORS.EMAIL_ERRORS);
// 	console.log(error);
	// var mailOptions = {
	// 	from: String(configENV.EMAIL_ERRORS),
	// 	to: String(configENV.EMAIL_ERRORS),
	// 	subject: '500 error',
	// 	html: '<h5>Error Message: '+ error.message+'</h5><p><h3>Error: </h3>'+error+'</p>'
	// };
	// transporter.sendMail(mailOptions, function(error, info){
	// 	if (error) {
	// 	logger.error("Error: ", error);
	// 	} else {
	// 	logger.info("Email sent: ",  info.response);
	// 		logger.info("Error sent to private email");	
	// 	}
	// });
//   	res.status(500);
// 	res.render('500.ejs', {title:'500: Internal Server Error', error: error});
// });

module.exports = app;
