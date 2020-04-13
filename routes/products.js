var express = require("express");
var router     = express.Router();
var Product     = require("../models/product");
var middleware  = require("../middleware/index.js");

//===================
// Product ROUTES
//===================

router.get("/products/:type", function(req, res){
	var wantedType = req.params.type;
    Product.find({ type : wantedType }, function(err , foundProducts ){
        if(err){
            console.log(err)
        } else{
        	var procount = 0;
        	var countArray=[];
        	foundProducts.forEach(function(){
        		countArray.push(procount);
        		procount = procount + 1;
        	})
        	console.log(countArray);
            res.render("products", {products : foundProducts , count : countArray});
        }
    });
});

router.get("/products/:type/:id", function(req ,res){
	Product.findById(req.params.id ,function(err, foundProduct){
		if(err){
			console.log(err);
		} else {
			var images = foundProduct.images;
			console.log(images);
			res.render("products/show", {product: foundProduct, images :images});
		}
	});
});


module.exports = router;