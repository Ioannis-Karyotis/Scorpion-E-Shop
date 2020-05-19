var mongoose = require("mongoose");

var ProductSchema = new mongoose.Schema({
   name: String,
   type: String, //custom t-shirt type = custom
   price: Number,
   images: [{}],  //stamp for custom t-shirts placed here
   description: String,
   reviews: [
     {
       type: mongoose.Schema.Types.ObjectId,
       ref: "Review"
     }
   ],
   rating: Number,
   reviewCount: Number,
   status : String,
   size : String,
   color : String //custom t-shirts have color
});

module.exports = mongoose.model("Product", ProductSchema);
