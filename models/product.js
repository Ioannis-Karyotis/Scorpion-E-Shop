var mongoose = require("mongoose");
//const Comment = require('./comment');

var ProductSchema = new mongoose.Schema({
   name: String,
   price: String,
   image: String,
   description: String
});

module.exports = mongoose.model("Product", ProductSchema);
