const express 			  = require("express"),
 	    router    		  = express.Router(),
 	    Product 			  = require("../models/product"),
      Order           = require("../models/order"),
      Cart            = require("../models/cart"),
	    {SECRET_STRIPE} = require('../configuration'),
	    {PUBLIC_STRIPE}	= require('../configuration'),
	    {WEBHOOK_SECRET}= require('../configuration'),
	   	stripesk 		    = require("stripe")(SECRET_STRIPE),
 		  stripepk 		    = require('stripe')(PUBLIC_STRIPE),
      middleware      = require("../middleware/index.js"),
      sanitization    = require('express-autosanitizer');

router.use(function(req, res, next) {
res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        next();
})


router.post("/post_order",sanitization.route, async function(req,res){
  var fullname = req.autosan.body.paymentIntent.shipping.name;
  var result = fullname.split(" ");
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = dd + '-' + mm + '-' + yyyy;
  cart = req.session.cart;
  Order.create(
      { 
        paymentIntent: req.autosan.body.paymentIntent.id,
        method : "Πληρωμή με κάρτα",
        date : today,
        confirm: false,
        complete: false,
        details :{
          name : result[0],
          surname: result[1],
          email : req.autosan.body.paymentIntent.receipt_email,
          phone : req.autosan.body.paymentIntent.shipping.phone,
          address: {
            line1 : req.autosan.body.paymentIntent.shipping.address.line1,
            city : req.autosan.body.paymentIntent.shipping.address.city,
            zip : req.autosan.body.paymentIntent.shipping.address.postal_code,
            state : req.autosan.body.paymentIntent.shipping.address.state
          }
        }, 
        extraFee : 4,
        totalPrice :  (req.autosan.body.paymentIntent.amount / 100) + 4
      },
      async function(err, order){
        if(err){
          console.log(err)
        } else {
          var products= cart.products;
          var product_ids = await Object.keys(products);
          for(i=0; i<product_ids.length; i++){
            var product = {
             product : products[product_ids[i]].product,
             quantity :  products[product_ids[i]].quantity
            }
            order.productList.push(product);
          }
        order.save();  
        }
      });
  req.session.cart = null;
  req.session.productList = null
  req.app.locals.specialContext = null;
  res.clearCookie('Payment_Intent');
  res.send({result : "succeeded"});
})

router.post("/post_order_sent",sanitization.route,async function(req,res){
  var method = "";
  if(req.autosan.body.method==="3"){
    method = "Παραλαβή από το κατάστημα"
  }else{
    method = "Αποστολή με αντικαταβολή"
  }
  console.log(req.autosan.body.payment_id);
  //lol = await stripesk.paymentIntents.cancel(req.autosan.body.payment_id);


  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = dd + '-' + mm + '-' + yyyy;
  cart = req.session.cart;
  Order.create(
      { 
        method : method,
        date : today,
        confirm: false,
        complete: false,
        details :{
          name : req.autosan.body.name,
          surname: req.autosan.body.surname,
          email : req.autosan.body.email,
          phone : req.autosan.body.phone,
          address: {
            line1 : req.autosan.body.line1,
            city : req.autosan.body.city,
            zip : req.autosan.body.zip,
            state : req.autosan.body.state
          }
        }, 
        extraFee : 4
      },
      async function(err, order){
        if(err){
          console.log(err)
        } else {
          var products= cart.products;
          var totalPrice = 0;
          var product_ids = await Object.keys(products);
          for(i=0; i<product_ids.length; i++){
            var product = {
             product : products[product_ids[i]].product,
             quantity :  products[product_ids[i]].quantity
            }
            totalPrice =+ product.quantity * products[product_ids[i]].price;
            order.productList.push(product);
          }
          order.totalPrice = (totalPrice) + 4;
          order.save();  
        }
      });
  req.session.cart = null;
  req.session.productList = null
  req.app.locals.specialContext = null;
  res.clearCookie('Payment_Intent');
  res.send({result : "succeeded"});
})



router.post("/create-order",sanitization.route,middleware.namesur , middleware.email , middleware.phone ,middleware.address, function(req,res){
    console.log("passed all middleware");
    res.send({result:"success"});
})


router.post("/create-payment-intent",sanitization.route, middleware.calculateDatabasePrice, async (req, res) => {
  const { currency } = req.autosan.body;
  const total = req.session.cart.totalPrice * 100;
  var paymentIntent = null;
  // Create a PaymentIntent with the order amount and currency
  if(req.cookies["Payment_Intent"] === undefined || req.cookies["Payment_Intent"].amount != total ){

    if(req.cookies["Payment_Intent"] && req.cookies["Payment_Intent"].amount != total){
      await stripesk.paymentIntents.cancel(req.cookies["Payment_Intent"].id);
    }

    paymentIntent = await stripesk.paymentIntents.create({
    amount: total,
    currency: currency
    });
    
    res.cookie('Payment_Intent', paymentIntent , {
        httpOnly: true
    });
  }else{
    paymentIntent = req.cookies["Payment_Intent"];
  }

  // Send publishable key and PaymentIntent details to client
  res.send({
    publishableKey: PUBLIC_STRIPE,
    clientSecret: paymentIntent.client_secret,
    id : paymentIntent.id,
  });

});

// Expose a endpoint as a webhook handler for asynchronous events.
// Configure your webhook in the stripe developer dashboard
// https://dashboard.stripe.com/test/webhooks
router.post("/webhook", async (req, res) => {
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
      
      console.log("💰 Payment captured!");
    } else if (eventType === "payment_intent.payment_failed") {
      Order.findOneAndRemove({paymentIntent : req.body.data.object.id }, function(err , found){});
      console.log("❌ Payment failed.");
    }
    res.sendStatus(200);
  // })
  // .catch(function(err) { console.log(err.message); }); 
});


router.get('/checkout', middleware.validateCart , function (req, res){
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