var mongoose = require("mongoose");
//const Comment = require('./comment');

var ProductSchema = new mongoose.Schema({
   name: String,
   type: String,
   price: String,
   images: [{url : String}],
   description: String
});

module.exports = mongoose.model("Product", ProductSchema);
