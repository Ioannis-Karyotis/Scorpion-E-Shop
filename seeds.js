var mongoose = require("mongoose");
var Product = require("./models/product");

var data = [
    {
        name: "Example 1",
        type: "isothermika" ,
        price: "15.00 $",
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit" 
    },
    {
        name: "Example 2",
        type: "isothermika" ,
        price: "10.00 $", 
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit"
    },
    {
        name: "Example 3",
        type: "isothermika" ,
        price: "22.00 $",
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit"
    }
]
 
function seedDB(){
   //Remove all campgrounds
   Product.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed products!");
         //add a few campgrounds
        data.forEach(function(seed){
            Product.create(seed, function(err, product){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a Product");
                }
            });
        });
    });
}
 
module.exports = seedDB;
