const express 			  = require("express"),
 	    router    		  = express.Router(),
 	    Product 			  = require("../models/product"),
      Order           = require("../models/order"),
      Cart            = require("../models/cart"),
      Untracked       = require("../models/untrackedPayment"),
	    {SECRET_STRIPE} = require('../configuration'),
	    {PUBLIC_STRIPE}	= require('../configuration'),
	    {WEBHOOK_SECRET}= require('../configuration'),
	   	stripesk 		    = require("stripe")(SECRET_STRIPE),
 		  stripepk 		    = require('stripe')(PUBLIC_STRIPE),
      middleware      = require("../middleware/index.js"),
      sanitization    = require('express-autosanitizer'),
      dotenv          = require('dotenv'),
      logger          = require('simple-node-logger').createSimpleLogger('Logs.log'),
      objEncDec       = require('object-encrypt-decrypt');
      
dotenv.config();

router.use(function(req, res, next) {
res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        next();
})

function calculatePrice(ProductsPrice) {
  var exodaApostol = 2.5
  if(ProductsPrice >= 30){
    exodaApostol = 0
  }
  finalPrice = (ProductsPrice + exodaApostol) * 100;
  return finalPrice;
}


router.post("/check_cart",middleware.calculateDatabasePrice, middleware.validateCartOrderComplete, middleware.validateCartVariantsOrderComplete,sanitization.route, async function(req,res){
  res.send({result : "succeeded"});
}) 

router.post("/post_order",middleware.calculateDatabasePrice, middleware.validateCartOrderComplete, middleware.validateCartVariantsOrderComplete, sanitization.route, async function(req,res){

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
        totalPrice :  (req.autosan.body.paymentIntent.amount / 100)
      },
      async function(err, order){
        if(err){
          logger.error("Error: ", err);
        } else {
          var products= cart.products;
          var product_ids = await Object.keys(products);
          for(i=0; i<product_ids.length; i++){
            products[product_ids[i]].variants.forEach(function(item){
              var product = {
                product : products[product_ids[i]].product,
                quantity : item.quantity,
                size : item.size,
                color : item.color
              }
              totalPrice =+ product.quantity * product.product.price;
              order.productList.push(product);
            })
          }
          order.save();  
        }
      });
  var paymentIntent =  objEncDec.decrypt(req.cookies["stripe-gate"]);
  await Untracked.deleteOne({paymentIntentId : paymentIntent.id});

  req.session.cart = null;
  req.session.productList = null
  req.app.locals.specialContext = null;
  res.clearCookie('stripe-gate');
  res.send({result : "succeeded"});
})

router.post("/post_order_sent",middleware.calculateDatabasePrice,middleware.validateCartOrderComplete,middleware.validateCartVariantsOrderComplete, sanitization.route,async function(req,res){
  var method = "";
  if(req.autosan.body.method==="3"){
    method = "Παραλαβή από το κατάστημα"
  }else{
    method = "Αποστολή με αντικαταβολή"
  }

  if(req.cookies["stripe-gate"] != undefined){
    var paymentIntent =  objEncDec.decrypt(req.cookies["stripe-gate"]);
    await stripesk.paymentIntents.cancel(paymentIntent.id);
    await Untracked.deleteOne({paymentIntentId : paymentIntent.id});
  }

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
        }
      },
      async function(err, order){
        if(err){
          logger.error("Error: ", err);
        } else {
          var products= cart.products;
          var totalPrice = 0;
          var product_ids = await Object.keys(products);
          for(i=0; i<product_ids.length; i++){
            products[product_ids[i]].variants.forEach(function(item){
              var product = {
                product : products[product_ids[i]].product,
                quantity : item.quantity,
                size : item.size,
                color : item.color
              }
              totalPrice =+ product.quantity * product.product.price;
              order.productList.push(product);
            })
          }
          order.totalPrice = (totalPrice) + 4;
          order.save();  
        }
      });
  req.session.cart = null;
  req.session.productList = null
  req.app.locals.specialContext = null;
  res.clearCookie('stripe-gate');
  res.send({result : "succeeded"});
})



router.post("/create-order",sanitization.route,middleware.namesur , middleware.email , middleware.phone ,middleware.address, function(req,res){
    res.send({result:"success"});
})


router.post("/create-payment-intent",sanitization.route, middleware.calculateDatabasePrice,middleware.validateCartOrderComplete,middleware.validateCartVariantsOrderComplete, async (req, res) => {
  const { currency } = req.autosan.body;
  const total = calculatePrice(req.session.cart.totalPrice);
  var paymentIntent = null;
  var untracked = await Untracked.count();
  try{
    if(req.cookies["stripe-gate"] === undefined){
      paymentIntent = await stripesk.paymentIntents.create({
        amount: total,
        currency: currency
      });

      var date = new Date();
      date.setTime(date.getTime() + (600 * 1000));
      res.cookie('stripe-gate', objEncDec.encrypt(paymentIntent) , {
        expires: date,
        httpOnly: true
      });
      var trackPaymentIntent = {
        paymentIntentId : paymentIntent.id,
        date : date
      }
      await Untracked.create(trackPaymentIntent);

    // }else if(req.cookies["stripe-gate"] != undefined && untracked == 0){
      
    //   console.log("Got into new case");

    //   var date = new Date();
    //   date.setTime(date.getTime() + (600 * 1000));

    //   paymentIntent = await stripesk.paymentIntents.create({
    //     amount: total,
    //     currency: currency
    //   });

    //   res.cookie('stripe-gate', objEncDec.encrypt(paymentIntent) , {
    //     expires: date,
    //     httpOnly: true,
    //     overwrite: true
    //   });
      
    //   var trackPaymentIntent = {
    //     paymentIntentId : paymentIntent.id,
    //     date : date
    //   }
    //   await Untracked.create(trackPaymentIntent);

    // 
    }else if(req.cookies["stripe-gate"] && objEncDec.decrypt(req.cookies["stripe-gate"]).amount != total){
      paymentIntent = objEncDec.decrypt(req.cookies["stripe-gate"]);
      paymentIntent = await stripesk.paymentIntents.update(paymentIntent.id,
        {
          amount : total,
          currency : currency
        });
      var date = new Date();
      date.setTime(date.getTime() + (600 * 1000));
      res.cookie('stripe-gate', paymentIntent , {
        expires: date,
        httpOnly: true,
        overwrite: true
      });
    }else if(req.cookies["stripe-gate"] != undefined){
       paymentIntent = objEncDec.decrypt(req.cookies["stripe-gate"]);
    }

    // Send publishable key and PaymentIntent details to client
    res.send({
      publishableKey: PUBLIC_STRIPE,
      clientSecret: paymentIntent.client_secret
    });
  }
  catch(error){
    res.send({
      error : error
    });
  }
  
});

// Expose a endpoint as a webhook handler for asynchronous events.
// Configure your webhook in the stripe developer dashboard
// https://dashboard.stripe.com/test/webhooks
// router.post("/webhook", async (req, res) => {
//   if (WEBHOOK_SECRET) {
      // Retrieve the event by verifying the signature using the raw body and secret.
    //   let event;
    //   let signature = req.headers["stripe-signature"];
    //   try {
    //     event = stripe.webhooks.constructEvent(
    //       req.rawBody,
    //       signature,
    //       WEBHOOK_SECRET
    //     );
    //   } catch (err) {
    //     console.log(`⚠️  Webhook signature verification failed.`);
    //     return res.sendStatus(400);
    //   }
    //   data = event.data;
    //   eventType = event.type;
    // } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // we can retrieve the event data directly from the request body.
    //   data = req.body.data;
    //   eventType = req.body.type;
    // }

    // if (eventType === "payment_intent.succeeded") {
      
    //   console.log("💰 Payment captured!");
    // } else if (eventType === "payment_intent.payment_failed") {
    //   Order.findOneAndRemove({paymentIntent : req.body.data.object.id }, function(err , found){});
    //   console.log("❌ Payment failed.");
    // }
    // res.sendStatus(200);
  // })
  // .catch(function(err) { console.log(err.message); }); 
// });

router.get('/delete_cookie', function (req, res){

  res.clearCookie('stripe-gate');
  res.clearCookie('token');
  return res.status(200).redirect('/checkout');
});


router.get('/checkout', middleware.validateCart, middleware.validateCartVariants , function (req, res){
  var discount = false;
  if(req.session.cart !=null && req.session.cart.totalPrice >= 30){
    discount = true;
  }

  if(req.app.locals.specialContext!= null){
    var validated = req.app.locals.specialContext;
    req.flash(validated.error.type,validated.error.message);
    res.render("checkout",{user: null , method : null, validated : validated , discount : discount});
  }else{
    var validated = {};
    req.app.locals.specialContext = null;
    if(req.user){
      res.render('checkout',{user: req.user, method : req.user.methods,validated : validated, discount : discount});
    }else{
      res.render('checkout',{user: null , method : null, validated : validated, discount : discount});
    }
  }
});



module.exports = router;