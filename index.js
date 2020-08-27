const app 	 	= require('./app'),
	  dotenv 	= require('dotenv'),
	  Untracked = require("./models/untrackedPayment"),
	  cron 	 	= require("node-cron"),
	  {SECRET_STRIPE} = require('./configuration'),
	  stripesk  = require("stripe")(SECRET_STRIPE),
	  fs 	 	= require("fs");

dotenv.config();

cron.schedule("0 */2 * * *", function() {
      Untracked.find({},function(err,untrackedPaymentIntents){
      	if(err){
          	console.log(err)
      	}else{
      		console.log(untrackedPaymentIntents);
      		untrackedPaymentIntents.forEach(async function(track){
      			await stripesk.paymentIntents.cancel(track.paymentIntentId);
      			await Untracked.deleteOne(track);
      		})
      	}
      })
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port);
console.log(`Server listening at ${port}`);
