var mongoose = require("mongoose");

var ProductSchema = new mongoose.Schema({
   name: String,
   type: String,
   price: Number,
   images: [{}],
   description: String,
   reviews: [
     {
       type: mongoose.Schema.Types.ObjectId,
       ref: "Review"
     }
   ],
   rating: Number,
   reviewCount: Number
});

module.exports = mongoose.model("Product", ProductSchema);
