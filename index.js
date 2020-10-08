const   app 	 	= require('./app'),
	  dotenv 	      = require('dotenv'),
	  Untracked       = require("./models/untrackedPayment"),
	  User 		= require("./models/user"),
	  cron 	 	= require("node-cron"),
	  {SECRET_STRIPE} = require('./configuration'),
	  stripesk        = require("stripe")(SECRET_STRIPE),
	  fs 	 	      = require("fs");

dotenv.config();

if (process.env.URL && process.env.CONTENT) {
  app.get(process.env.URL, function(req, res) {
    return res.send(process.env.CONTENT)
  });
}

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


if(process.env.ENV == "production") {
      // Certificate
      const privateKey = fs.readFileSync('/etc/letsencrypt/live/scorpionclothing.gr/privkey.pem', 'utf8');
      const certificate = fs.readFileSync('/etc/letsencrypt/live/scorpionclothing.gr/cert.pem', 'utf8');
      const ca = fs.readFileSync('/etc/letsencrypt/live/scorpionclothing.gr/chain.pem', 'utf8');

      const credentials = {
            key: privateKey,
            cert: certificate,
            ca: ca
      };

      // Starting both http & https servers
      const httpServer = http.createServer(app);
      const httpsServer = https.createServer(credentials, app);

      httpServer.listen(80, () => {
            console.log('HTTP Server running on port 80');
      });

      httpsServer.listen(443, () => {
            console.log('HTTPS Server running on port 443');
      });
}else{
      const port = process.env.PORT || 3000;
      app.listen(port);
      console.log(`Server listening at ${port}`);
} 


