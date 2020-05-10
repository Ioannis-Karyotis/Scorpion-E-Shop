const express 			= require("express"),
 	  router    		= express.Router(),
 	  Product 			= require("../models/product"),
	{ SECRET_STRIPE } 	= require('../configuration'),
	{ PUBLIC_STRIPE }	= require('../configuration'),
	{ WEBHOOK_SECRET}	= require('../configuration'),
		stripesk 		= require("stripe")(SECRET_STRIPE),
 		stripepk 		= require('stripe')(PUBLIC_STRIPE),
    middleware  = require("../middleware/index.js");

const calculateDatabasePrice = async function(cart) {	
	try {
		var products= cart.products;
		var total = 0
		var product_ids = await Object.keys(products);
		for(i=0; i<product_ids.length; i++){
			var quantity = products[product_ids[i]].quantity;
			var err,product = await Product.findById(product_ids[i]); 
			var add = quantity * product.price;
			total = total + add;
		}
		if(total === cart.totalPrice){
			return total * 100;
		}else{
			console.log("Total prices do not match with each other");
		}
	}catch(err){
		console.log(err);
	}
}			



router.post("/create-order",middleware.namesur , middleware.email , middleware.phone ,middleware.address, function(req,res){
    console.log("passed all middleware");
    res.send({result:"success"});
})


router.post("/create-payment-intent", async (req, res) => {
  const { currency } = req.body;
  const cart = req.session.cart;
  const total =await calculateDatabasePrice(cart);
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripesk.paymentIntents.create({
    amount: total,
    currency: currency
  });
  // Send publishable key and PaymentIntent details to client
  res.send({
    publishableKey: PUBLIC_STRIPE,
    clientSecret: paymentIntent.client_secret
  });
});

// Expose a endpoint as a webhook handler for asynchronous events.
// Configure your webhook in the stripe developer dashboard
// https://dashboard.stripe.com/test/webhooks
router.post("/webhook", async (req, res) => {
  let data, eventType;

  // Check if webhook signing is configured.
  if (WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // we can retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  if (eventType === "payment_intent.succeeded") {
    // Funds have been captured
    // Fulfill any orders, e-mail receipts, etc
    // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
    console.log("💰 Payment captured!");
  } else if (eventType === "payment_intent.payment_failed") {
    console.log("❌ Payment failed.");
  }
  res.sendStatus(200);
});


router.get('/checkout', function (req, res){
  console.log("eisai malakas 1");
  console.log(req.app.locals.specialContext);
  console.log("eisai malakas 2");
  if(req.app.locals.specialContext!= null){
    var validated = req.app.locals.specialContext;
    req.flash(validated.error.type,validated.error.message);
    res.render("checkout",{user: null , method : null, validated : validated});
  }else{
    var validated = {};
    req.app.locals.specialContext = null;
    if(req.user){
      res.render('checkout',{user: req.user, method : req.user.methods,validated : validated});
    }else{
      res.render('checkout',{user: null , method : null, validated : validated});
    }
  }
});



module.exports = router;