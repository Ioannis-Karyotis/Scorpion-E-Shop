var mongoose = require("mongoose");

var ProductSchema = new mongoose.Schema({
    name: String,
    type: String, //custom t-shirt type = custom
    kind : String,
    sizesTable : [[]],
    price: Number,
    code: String,
    images: [{
      url: String,
      name :String
    }],  //stamp for custom t-shirts placed here
    description: String,
    reviews: [
     {
       type: mongoose.Schema.Types.ObjectId,
       ref: "Review"
     }
    ],
    rating: Number,
    reviewCount: Number,
    colors : [{
      color : String, 
      colorStatus: String,
      colorHex : String,
    }],
    sizes : [{
      size : String,
      sizeStatus: String,
    }],
    status : String   
});

module.exports = mongoose.model("Product", ProductSchema);
