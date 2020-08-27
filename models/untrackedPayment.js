var mongoose = require("mongoose");

var untrackedPaymentSchema = new mongoose.Schema({
  paymentIntentId: String,
  date : Date
});

module.exports = mongoose.model("UntrackedPayments", untrackedPaymentSchema);
