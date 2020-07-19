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
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
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
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
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
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
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
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
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
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
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
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
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
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
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
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
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
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
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
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
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
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
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
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
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
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
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
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
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
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "XXL",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000016"),
        name: "Example 1",
        type: "isothermika" ,
        price: 15,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "S",
        sizeStatus: "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000017"),
        name: "Example 1",
        type: "isothermika" ,
        price: 15,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "M",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000018"),
        name: "Example 1",
        type: "isothermika" ,
        price: 15,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "L",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000019"),
        name: "Example 1",
        type: "isothermika" ,
        price: 15,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "XL",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000020"),
        name: "Example 1",
        type: "isothermika" ,
        price: 15,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "XXL",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000021"),
        name: "Example 2",
        type: "isothermika" ,
        price: 10,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "S",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000022"),
        name: "Example 2",
        type: "isothermika" ,
        price: 10,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "M",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000023"),
        name: "Example 2",
        type: "isothermika" ,
        price: 10,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "L",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000024"),
        name: "Example 2",
        type: "isothermika" ,
        price: 10,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "XL",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000025"),
        name: "Example 2",
        type: "isothermika" ,
        price: 10,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "XXL",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000026"),
        name: "Example 3",
        type: "isothermika" ,
        price: 20,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "S",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000027"),
        name: "Example 3",
        type: "isothermika" ,
        price: 20,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "M",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000028"),
        name: "Example 3",
        type: "isothermika" ,
        price: 20,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "L",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000029"),
        name: "Example 3",
        type: "isothermika" ,
        price: 20,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "XL",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000030"),
        name: "Example 3",
        type: "isothermika" ,
        price: 20,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "XXL",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000031"),
        name: "Example 1",
        type: "isothermika" ,
        price: 15,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "S",
        sizeStatus: "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000032"),
        name: "Example 1",
        type: "isothermika" ,
        price: 15,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "M",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000033"),
        name: "Example 1",
        type: "isothermika" ,
        price: 15,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "L",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000034"),
        name: "Example 1",
        type: "isothermika" ,
        price: 15,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "XL",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000035"),
        name: "Example 1",
        type: "isothermika" ,
        price: 15,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "XXL",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000036"),
        name: "Example 2",
        type: "isothermika" ,
        price: 10,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "S",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000037"),
        name: "Example 2",
        type: "isothermika" ,
        price: 10,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "M",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000038"),
        name: "Example 2",
        type: "isothermika" ,
        price: 10,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "L",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000039"),
        name: "Example 2",
        type: "isothermika" ,
        price: 10,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "XL",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000040"),
        name: "Example 2",
        type: "isothermika" ,
        price: 10,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "XXL",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000041"),
        name: "Example 3",
        type: "isothermika" ,
        price: 20,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "S",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000042"),
        name: "Example 3",
        type: "isothermika" ,
        price: 20,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "M",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000043"),
        name: "Example 3",
        type: "isothermika" ,
        price: 20,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "L",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000044"),
        name: "Example 3",
        type: "isothermika" ,
        price: 20,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        size: "XL",
        sizeStatus : "active",
        reviewCount: 0,
        status : "active"
    },
    {
        _id : ObjectId("000000000045"),
        name: "Example 3",
        type: "isothermika" ,
        price: 20,
        images: [{url: "http://localhost:3000/images/tshirt/example2.jpg"}, {url:"http://localhost:3000/images/tshirt/example1.jpg"}],
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
