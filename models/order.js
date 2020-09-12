var mongoose = require("mongoose");

var OrderSchema = new mongoose.Schema({
    paymentIntent: String ,
    method: String,
    date : String,
    confirm: Boolean,
    complete : Boolean,
    details :{
      name : String,
      surname : String,
      email : String,
      phone : String,
      address: {
        line1 : String,
        city : String,
        zip : String,
        state : String
      }
    }, 
    productList:[{
      product: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      quantity: Number,
      size : String,
      color : String,
    }],
    extraFee: Number,
    totalPrice : Number
    
});

module.exports = mongoose.model("Order", OrderSchema);
