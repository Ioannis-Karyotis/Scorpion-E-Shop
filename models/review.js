var mongoose = require("mongoose");

var ReviewSchema = new mongoose.Schema({
  author: String,
  description: String,
  date: String,
  rating: Number,
  photo: String
});

module.exports = mongoose.model("Review", ReviewSchema);
