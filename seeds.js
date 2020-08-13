var mongoose = require("mongoose");
var Product = require("./models/product");
var Review = require("./models/review");
var Admin = require("./models/admin");
var ObjectId = require('mongodb').ObjectID;

var data = [
    {
        _id : ObjectId("000000000001"),
        name: "Example 1",
        type: "isothermika" ,
        price: 15,
        images: [{url: "https://scorpion-store.herokuapp.com/images/tshirt/example2.jpg"}, {url:"https://scorpion-store.herokuapp.com/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "S",
        sizeStatus: "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000002"),
        name: "Example 1",
        type: "isothermika" ,
        price: 15,
        images: [{url: "https://scorpion-store.herokuapp.com/images/tshirt/example2.jpg"}, {url:"https://scorpion-store.herokuapp.com/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "M",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000003"),
        name: "Example 1",
        type: "isothermika" ,
        price: 15,
        images: [{url: "https://scorpion-store.herokuapp.com/images/tshirt/example2.jpg"}, {url:"https://scorpion-store.herokuapp.com/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "L",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000004"),
        name: "Example 1",
        type: "isothermika" ,
        price: 15,
        images: [{url: "https://scorpion-store.herokuapp.com/images/tshirt/example2.jpg"}, {url:"https://scorpion-store.herokuapp.com/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "XL",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000005"),
        name: "Example 1",
        type: "isothermika" ,
        price: 15,
        images: [{url: "https://scorpion-store.herokuapp.com/images/tshirt/example2.jpg"}, {url:"https://scorpion-store.herokuapp.com/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "XXL",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000006"),
        name: "Example 2",
        type: "isothermika" ,
        price: 10,
        images: [{url: "https://scorpion-store.herokuapp.com/images/tshirt/example2.jpg"}, {url:"https://scorpion-store.herokuapp.com/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "S",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000007"),
        name: "Example 2",
        type: "isothermika" ,
        price: 10,
        images: [{url: "https://scorpion-store.herokuapp.com/images/tshirt/example2.jpg"}, {url:"https://scorpion-store.herokuapp.com/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "M",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000008"),
        name: "Example 2",
        type: "isothermika" ,
        price: 10,
        images: [{url: "https://scorpion-store.herokuapp.com/images/tshirt/example2.jpg"}, {url:"https://scorpion-store.herokuapp.com/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "L",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000009"),
        name: "Example 2",
        type: "isothermika" ,
        price: 10,
        images: [{url: "https://scorpion-store.herokuapp.com/images/tshirt/example2.jpg"}, {url:"https://scorpion-store.herokuapp.com/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "XL",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000010"),
        name: "Example 2",
        type: "isothermika" ,
        price: 10,
        images: [{url: "https://scorpion-store.herokuapp.com/images/tshirt/example2.jpg"}, {url:"https://scorpion-store.herokuapp.com/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "XXL",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000011"),
        name: "Example 3",
        type: "isothermika" ,
        price: 20,
        images: [{url: "https://scorpion-store.herokuapp.com/images/tshirt/example2.jpg"}, {url:"https://scorpion-store.herokuapp.com/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "S",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000012"),
        name: "Example 3",
        type: "isothermika" ,
        price: 20,
        images: [{url: "https://scorpion-store.herokuapp.com/images/tshirt/example2.jpg"}, {url:"https://scorpion-store.herokuapp.com/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "M",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000013"),
        name: "Example 3",
        type: "isothermika" ,
        price: 20,
        images: [{url: "https://scorpion-store.herokuapp.com/images/tshirt/example2.jpg"}, {url:"https://scorpion-store.herokuapp.com/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "L",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000014"),
        name: "Example 3",
        type: "isothermika" ,
        price: 20,
        images: [{url: "https://scorpion-store.herokuapp.com/images/tshirt/example2.jpg"}, {url:"https://scorpion-store.herokuapp.com/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "XL",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000015"),
        name: "Example 3",
        type: "isothermika" ,
        price: 20,
        images: [{url: "https://scorpion-store.herokuapp.com/images/tshirt/example2.jpg"}, {url:"https://scorpion-store.herokuapp.com/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "XXL",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    }
]

function seedDB(){
  Admin.remove({}, function(err){
    if(err){
      console.log(err)
    }
    console.log("removed admin");
    Admin.create(
      { 
        methods: "local",
        local: {
          name: "Admin",
          email: "scorpion.storethess@gmail.com",
          priviledge : "Admin"
        }
      },function(err , admin){
        admin.setAdminPassword("administrator");
        admin.setPassword("Winston_100!");
        admin.save();
      }
    )
    console.log("Admin Created");
  })




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
                 }

             });
         });
       });
    });
}

module.exports = seedDB;
