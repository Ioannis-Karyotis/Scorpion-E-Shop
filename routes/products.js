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
            res.render("products", {products : foundProducts });
        }
    });
});


module.exports = router;