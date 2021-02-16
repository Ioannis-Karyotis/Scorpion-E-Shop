var mongoose = require("mongoose");

var dataDeletionsHistorySchema = new mongoose.Schema({
  completed : Boolean,
  source : String,
  sourceId : String,
  date : Date
});

module.exports = mongoose.model("DataDeletionsHistory", dataDeletionsHistorySchema);
