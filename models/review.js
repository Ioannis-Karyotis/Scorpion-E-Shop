var mongoose = require("mongoose");

var ReviewSchema = new mongoose.Schema({
  author: String,
  description: String,
  date: Date,
  showDate : String,
  rating: Number,
  photo: String
});

module.exports = mongoose.model("Review", ReviewSchema);
