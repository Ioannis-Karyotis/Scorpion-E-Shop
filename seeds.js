var mongoose = require("mongoose");
var Product = require("./models/product");
var Review = require("./models/review");

var data = [
    {
        name: "Example 1",
        type: "isothermika" ,
        price: 15,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        reviewCount: 0
    },
    {
        name: "Example 2",
        type: "isothermika" ,
        price: 10,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        reviewCount: 0
    },
    {
        name: "Example 3",
        type: "isothermika" ,
        price: 20,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        reviewCount: 0
    }
]

function seedDB(){
   //Remove all campgrounds
   Product.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed products!");
        Review.remove({}, function(err){
          if(err){
            console.log(err);
          }
          //add a few campgrounds
         data.forEach(function(seed){
             Product.create(seed, function(err, product){
                 if(err){
                     console.log(err)
                 } else {
                     console.log("added a Product");
                     Review.create(
                       {
                         author: "Giorno Giovanna",
                         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                         rating: 7,
                         date: "25-05-2020"
                       }, function(err, review){
                         if(err){
                           console.log(err);
                         }else{
                           product.reviews.push(review);
                           product.rating = review.rating/2;
                           product.reviewCount++;
                           product.save();
                           console.log("created a review");
                         }
                       }
                     );
                 }
             });
         });
       });
    });
}

module.exports = seedDB;
