var express = require("express");
var router     = express.Router();
var Product     = require("../models/product");
var middleware  = require("../middleware/index.js");

//===================
// Product ROUTES
//===================

router.get("/products", function(req, res){

    Product.find({}, function(err ,  ){
        if(err){
            console.log(err)
        } else{
            res.render("campgrounds/index", {campgrounds : allCampgrounds});
        }
    });
});
