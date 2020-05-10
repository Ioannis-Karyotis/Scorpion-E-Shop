var express 		= require("express");
var router     	= express.Router();
var Product     = require("../models/product");
var Review 			= require("../models/review");
var middleware  = require("../middleware/index.js");
var Cart				= require("../models/cart");
//===================
// Product ROUTES
//===================

router.get("/products/:type", function(req, res){
	var wantedType = req.params.type;
  Product.find({ type : wantedType }, function(err , foundProducts ){
      if(err){
          console.log(err)
      } else{
          res.render("products", {products : foundProducts});
        }
    });
});

router.get("/products/:type/:id", function(req ,res){
	Product.findById(req.params.id).populate("reviews").exec(function(err, foundProduct){
		if(err){
			console.log(err);
		} else {
		    if(foundProduct!= null){
			    var images = foundProduct.images;
			    console.log(images);
			    res.render("products/show", {product: foundProduct, images :images});
		    } else{
		        res.redirect("back");
		    }
		}
	});
});

router.post("/products/:type/:id/review", function(req,res){
	Product.findById(req.body.productId, function(err, foundProduct){
		if(err){
			console.log(err);
		} else {
		    if(foundProduct!= null){
					var name = req.body.author || req.user[req.user.methods].name || req.user[req.user.methods].name || req.user[req.user.methods].name
					var surname =  req.user[req.user.methods].surname || req.user[req.user.methods].surname || req.user[req.user.methods].surname
					var today = new Date();
					var dd = String(today.getDate()).padStart(2, '0');
					var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
					var yyyy = today.getFullYear();
					today = dd + '-' + mm + '-' + yyyy;

					Review.create(
						{
							author: name + " " + surname,
							description: req.body.description,
							date: today,
							rating: req.body.rating
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
