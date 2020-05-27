var express 	= require("express");
var router 		= express.Router();
var Product     = require("../models/product");
var Cart		= require("../models/cart");
const sanitization	= require('express-autosanitizer');
const multer 	= require('multer');
const path 		= require('path');

router.use(function(req, res, next) {
res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        next();
})
//===================
// Product ROUTES
//===================
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./public/images/stamps");
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
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


//Custom T-Shirt//
router.get("/custom", function(req,res){
  res.render("custom");
});


router.post("/custom/new", multer({ storage: storage, fileFilter: imageFilter }).single('image'), function(req, res, next){

		var newProduct = new Product({
			name    : "Custom T-Shirt",
			price : req.body.price,
      description : "Custom μπλουζάκι με στάμπα",
			type : "custom",
      size : req.body.size,
      color : req.body.color
		});

    if (req.fileValidationError) {
        return res.send(req.fileValidationError);
    }else if (!req.file) {
      return res.send('Please select an image to upload');
    }
    console.log(req.file.path);
      var str = req.file.path;
			var str2 = str.replace("public", "");
  		var final = str2.replace(/\\/g,"/");
  		image={url : "http://localhost:3000" + final };
			newProduct.images.push(image);


		newProduct.save(function(err){
			if(err){
				console.log(err.message);
			}

      //add it to the cart
      var cart = new Cart(req.session.cart ? req.session.cart : {});
      cart.add(newProduct, 1);
      req.session.cart = cart;
      req.session.productList = cart.productList();

			res.redirect("back");
		});
});

module.exports = router;