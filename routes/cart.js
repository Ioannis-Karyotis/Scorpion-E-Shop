const express 	  = require("express"),
      router 		  = express.Router(),
      Cart        = require("../models/cart"),
      middleware  = require("../middleware/index.js");


router.use(function(req, res, next) {
res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        next();
})

router.get("/cart",middleware.validateCart, express.json(), function(req, res){
  //console.log(JSON.stringify(req.body));
  res.render("cart");
});


router.post("/cart/update", function(req, res){
  console.log(JSON.stringify(req.body));
  let cart = new Cart(req.session.cart);
  let id = req.body.id;
  let qty = parseInt(req.body.qty);
  cart.updateQuantity(id,qty);
  req.session.cart = cart;
  req.session.productList = cart.productList();
  console.log(req.session.cart);
  res.send({price:cart.products[id].price, totalPrice:cart.totalPrice, totalQuantity:cart.totalQuantity});
});

//remove product
router.post("/cart/remove", function(req,res){
  console.log(JSON.stringify(req.body));
  let cart = new Cart(req.session.cart);
  let id = req.body.id;
  cart.removeProduct(id);
  req.session.cart = cart;
  req.session.productList = cart.productList();
  console.log(req.session.cart);
  console.log(req.session.productList);
  res.redirect('back');
});

module.exports = router;