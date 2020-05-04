const express 			= require("express"),
 	  router    		= express.Router(),
	{ SECRET_STRIPE } 	= require('../configuration'),
	{ PUBLIC_STRIPE }	= require('../configuration'),
	{ WEBHOOK_SECRET}	= require('../configuration'),
		stripesk 		= require("stripe")(SECRET_STRIPE);
 		stripepk 		= require('stripe')(PUBLIC_STRIPE);




const calculateOrderAmount = function(items) {
  // Replace this constant with a calculation of the order's amount
  // You should always calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

router.post("/create-payment-intent", async (req, res) => {
  const { items, currency } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripesk.paymentIntents.create({
    amount: calculateOrderAmount(items),
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
  res.render('checkout');
});



module.exports = router;