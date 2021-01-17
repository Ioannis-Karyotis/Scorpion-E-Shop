var mongoose = require("mongoose");
var Product = require("./models/product");
var Review = require("./models/review");
var Admin = require("./models/admin");
var dotenv = require('dotenv');

dotenv.config();
if(process.env.ENV != "production") {
    sizes = require('./configuration/sizes');


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
            code : 1000,
            images: [
                {
                    url: process.env.ROOT + "/images/tshirt/example2.jpg",
                    urlSmall :process.env.ROOT + "/images/tshirt/example2.jpg",
                    name: "example2"
                },
                {
                    url: process.env.ROOT+ "/images/tshirt/example1.jpg",
                    urlSmall :process.env.ROOT + "/images/tshirt/example1.jpg",
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
            code : 1001,
            images: [
                {
                    url:  process.env.ROOT + "/images/tshirt/example2.jpg",
                    urlSmall :process.env.ROOT + "/images/tshirt/example2.jpg",
                    name: "example2"
                },
                {
                    url: process.env.ROOT+ "/images/tshirt/example1.jpg",
                    urlSmall :process.env.ROOT + "/images/tshirt/example1.jpg",
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
            code : 1002,
            images: [
                {
                    url:  process.env.ROOT + "/images/tshirt/example2.jpg",
                    urlSmall :process.env.ROOT + "/images/tshirt/example2.jpg",
                    name : "example2"
                },
                {
                    url: process.env.ROOT + "/images/tshirt/example1.jpg",
                    urlSmall :process.env.ROOT + "/images/tshirt/example1.jpg",
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
}    

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

    if(process.env.ENV != "production") {
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
}

module.exports = seedDB;
