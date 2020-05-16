var express 	= require("express");
var router     	= express.Router();
var Product     = require("../models/product");
var Review 		= require("../models/review");
var middleware  = require("../middleware/index.js");
var Cart		= require("../models/cart");
var passport 	= require("passport");
const multer 	= require('multer');
const path 		= require('path');
const sanitization	= require('express-autosanitizer');


//===================
// Product ROUTES
//===================
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./public/images/");
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


router.get("/products/:type", function(req, res, next){
	var wantedType = req.params.type;
  	Product.find({ type : wantedType }, function(err , foundProducts ){
      	if(err){
          	console.log(err)
      	}else{
	      	passport.authenticate('jwtAdmin', function(err, admin, info) {
		    	if (err) { return next(err); }
		    	if (!admin) { 
		    		return	res.render("products", {products : foundProducts , admin :null});
		    	}
		        return res.render("products", {products : foundProducts , admin : "admin" , type: req.params.type});
	    	})(req , res, next)
	    }
	});
});	

router.get("/products/:type/add",passport.authenticate('jwtAdmin', { session: false }), function(req, res, next){
	res.render("products/add",{type: req.params.type});
});

router.post("/products/:type/add",passport.authenticate('jwtAdmin', { session: false }),multer({ storage: storage, fileFilter: imageFilter }).array("profile_pic"), function(req, res, next){

		var newProduct = new Product({
			name    : req.body.name,
			price : req.body.price,
			description : req.body.description,
			type : req.params.type,
			reviews: [],
        	rating: 0,
        	reviewCount: 0,
        	status : "active"
		});

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.files) {
            return res.send('Please select an image to upload');
        }
        req.files.forEach(function(file){
        	var str = file.path
			var str2 = str.replace("public", "");
  			var final = str2.replace(/\\/g,"/");
  			image={url : "http://localhost:3000" + final };
			newProduct.images.push(image);
        });
        
		newProduct.save(function(err){
			if(err){
				console.log(err.message);
			}
			res.redirect("/products/"+ req.params.type);
		});	
})				
      
router.get("/products/:type/:id", function(req ,res){
	Product.findById(req.params.id).populate("reviews").exec(function(err, foundProduct){
		if(err){
			console.log(err);
		} else {
		    if(foundProduct!= null){
			    var images = foundProduct.images;
			    res.render("products/show", {product: foundProduct, images :images});							
		    } else{
		        res.redirect("back");
		    }
		}
	});
});


router.delete("/products/:type/:id/delete" ,  function(req, res){
	Product.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/products/"+ req.params.type);
		} else{
			res.redirect("/products/"+ req.params.type);
		}
	});
});


router.post("/products/:type/:id/hide" ,  function(req, res){
	Product.findById(req.params.id,function(err, foundProduct){
		if(err){
			console.log(err);
		} else {
			if(foundProduct.status == "active"){	
				foundProduct.status = "hidden";
				foundProduct.save();
			}else{
				foundProduct.status = "active";
				foundProduct.save();
			}
			res.redirect('products/'+ req.params.type)
		}
	});
});


router.post("/products/:type/:id/review",sanitization.route, function(req,res){
	
	Product.findById(req.body.productId, function(err, foundProduct){
		if(err){
			console.log(err);
		} else {
		    if(foundProduct!= null){
		    		if(req.user){
		    			var name =  req.user[req.user.methods].name ;
						var surname =  req.user[req.user.methods].surname; 
		    		}else{
		    			var name = req.autosan.body.author;
						var surname =  "";
		    		}
					var today = new Date();
					var dd = String(today.getDate()).padStart(2, '0');
					var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
					var yyyy = today.getFullYear();
					today = dd + '-' + mm + '-' + yyyy;

					Review.create(
						{
							author: name + " " + surname,
							description: req.autosan.body.description,
							date: today,
							rating: req.autosan.body.rating
						}, function(err, review){
							if(err){
								console.log(err);
							}else{
								foundProduct.reviews.push(review);
								foundProduct.reviewCount = foundProduct.reviewCount + 1;
								foundProduct.rating = ((foundProduct.rating * (foundProduct.reviewCount - 1)) + 	(review.rating / 2)) / foundProduct.reviewCount;
								foundProduct.save();
								console.log("created a review  fdgfdgfd");
								res.redirect('back');
							}
						}
					);
		    } else{
		        res.redirect("back");
		    }
		}
	});
});
//Ενδεχεται να μεταφερθει
router.get("/products/:type/:id/add", function(req, res){
	Product.findById(req.params.id, function(err, foundProduct){
		if(err){
			console.log(err);
		} else {
				if(foundProduct!=null){
					var cart = new Cart(req.session.cart ? req.session.cart : {});
					cart.add(foundProduct);
					req.session.cart = cart;
					req.session.productList = cart.productList();

					console.log("_SessionCart_");
					console.log(req.session.cart);
					console.log("_ProductList_");
					console.log(req.session.productList);

					res.redirect("back");
				}
		}
	});
});

module.exports = router;
