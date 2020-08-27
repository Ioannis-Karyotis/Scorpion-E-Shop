const app 	 	= require('./app'),
	  dotenv 	= require('dotenv'),
	  Untracked = require("./models/untrackedPayment"),
	  User 		= require("./models/user"),
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
      var date = new Date();
      User.find({"local.forgotValidUntil" : { $lt : date}},function(err, users){
      	if(err){
          	console.log(err)
      	}else{
      		users.forEach(async function(user){
      			user.local.forgotPassHash = null;
 				user.local.forgotPassSalt = null;
 				user.local.forgotValidUntil = null;
 				user.save();
      		})
      	}
      });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port);
console.log(`Server listening at ${port}`);
