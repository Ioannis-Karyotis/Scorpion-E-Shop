var mongoose = require("mongoose");
var Product = require("./models/product");
var Review = require("./models/review");
var Admin = require("./models/admin");

var sizes = [
                {
                    size : "S",
                    sizeStatus: "active",
                },
                {
                    size : "M",
                    sizeStatus: "active",
                },
                {
                    size : "L",
                    sizeStatus: "active",
                },
                {
                    size : "XL",
                    sizeStatus: "active",
                },
                {
                    size : "XXL",
                    sizeStatus: "active",
                },
            ];

var colors =    [
                    {
                        color : "Πράσινο", 
                        colorStatus: "active",
                        colorHex : "#466267"
                    },
                    {
                        color : "Μοβ", 
                        colorStatus: "active",
                        colorHex : "#905193"
                    },
                    {
                        color : "Κίτρινο", 
                        colorStatus: "active",
                        colorHex : "#ffff00"
                    },
                    {
                        color : "Κίτρινο", 
                        colorStatus: "active",
                        colorHex : "#ffff00"
                    }
                ];          

var data = [
    {
        name: "Example 1",
        type: "isothermika" ,
        price: 15,
        images: [
            {
                url: "https://scorpion-store.herokuapp.com/images/tshirt/example2.jpg",
                name: "example2"
            },
            {
                url:"https://scorpion-store.herokuapp.com/images/tshirt/example1.jpg",
                name : "example1"
            }
        ],
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews:[],
        rating: 0,
        colors: colors,
        sizes: sizes,
        reviewCount: 0,
        status : "active"
    },
    {
        name: "Example 2",
        type: "isothermika" ,
        price: 10,
        images: [
            {
                url: "https://scorpion-store.herokuapp.com/images/tshirt/example2.jpg",
                name: "example2"
            },
            {
                url:"https://scorpion-store.herokuapp.com/images/tshirt/example1.jpg",
                name : "example1"
            }
        ],        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        colors: colors,
        sizes: sizes,
        reviewCount: 0,
        status : "active"
    },
    {
        name: "Example 3",
        type: "isothermika" ,
        price: 20,
        images: [
            {
                url: "https://scorpion-store.herokuapp.com/images/tshirt/example2.jpg",
                name : "example2"
            },
            {
                url:"https://scorpion-store.herokuapp.com/images/tshirt/example1.jpg",
                name : "example1"
            }
        ],        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
        reviews: [],
        rating: 0,
        colors: colors,
        sizes: sizes,
        reviewCount: 0,
        status : "active"
    },
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
