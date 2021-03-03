const   app 	 	= require('./app'),
	  dotenv 	      = require('dotenv'),
	  Untracked       = require("./models/untrackedPayment"),
	  User 		= require("./models/user"),
	  cron 	 	= require("node-cron"),
	  {SECRET_STRIPE} = require('./configuration'),
	  stripesk        = require("stripe")(SECRET_STRIPE),
	  fs 	 	      = require("fs"),
        http            = require('http'),
        logger          = require('simple-node-logger').createSimpleLogger('Logs.log'),
        https           = require('https');

dotenv.config();

if (process.env.URL && process.env.CONTENT) {
  app.get(process.env.URL, function(req, res) {
    return res.send(process.env.CONTENT)
  });
}

cron.schedule("0 */2 * * *", function() {
      Untracked.find({},function(err,untrackedPaymentIntents){
      	if(err){
                  logger.info("No untracked payment intents.")
      	}else{
      		logger.warn("Found untracked payment intents.")
      		untrackedPaymentIntents.forEach(async function(track){
      			await stripesk.paymentIntents.cancel(track.paymentIntentId);
      			await Untracked.deleteOne(track);
                        logger.info("Deleted : " + track);
      		})
      	}
      })
      var date = new Date();
      User.find({"local.forgotValidUntil" : { $lt : date}},function(err, users){
      	if(err){
                  logger.info("No Users pending for reset password : ");
      	}else{
      		users.forEach(async function(user){
      			user.local.forgotPassHash = null;
 				user.local.forgotPassSalt = null;
 				user.local.forgotValidUntil = null;
 				user.save();
                        logger.info("Deleted User's "+ user._id + "hashes for reset password");
      		})
      	}
      });
});


if(process.env.ENV == "production") {
      const httpServer = http.createServer(app);
      httpServer.listen(process.env.PORT, 'localhost', () => {
            logger.info("Running on Production at port: 8080");
      });

      

}else{
      const port = process.env.PORT || 3000;
      app.listen(port);
      logger.info("Running on Development at port: ",port);
} 


