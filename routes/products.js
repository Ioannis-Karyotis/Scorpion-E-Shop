var express 		= require("express");
var router     	= express.Router();
var Product     = require("../models/product");
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
	Product.findById(req.params.id ,function(err, foundProduct){
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
