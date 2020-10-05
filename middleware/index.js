const middlewareObj = {},
      User          = require("../models/user"),
      Cart          = require("../models/cart"),
      Product       = require("../models/product");
      sizes = [
              {
                  size : "S",
                  sizeStatus: "active",
              },
              {
                  size : "M",
                  sizeStatus: "active",
              },
              {
                  size : "L",
                  sizeStatus: "active",
              },
              {
                  size : "XL",
                  sizeStatus: "active",
              },
              {
                  size : "XXL",
                  sizeStatus: "active",
              },
          ]

function existCase(item, product){
    var colorExist = searchColor(item.color , product.colors);
    var colorHidden = searchHiddenColor(item.color , product.colors);
    var sizeHidden = searchHiddensize(item.size , product.sizes);
    if (colorExist || colorHidden || sizeHidden) {
      return true;
    }else{
      return false;
    }
}

function searchColor(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].colorHex === nameKey) {
            return false;
        }
    }
    return true;
}

function searchHiddenColor(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].colorHex === nameKey && myArray[i].colorStatus == "hidden") {
            return true;
        }
    }
    return false;
}
function searchHiddensize(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].size === nameKey && myArray[i].sizeStatus == "hidden") {
            return true;
        }
    }
    return false;
}
function trimBody(inside){

  Object.keys(inside).forEach(function(key,index) {
    inside[key].trim();
  });
  console.log("inside: " + inside);
  return inside;
}

middlewareObj.cart = function (req , res ,  next){
  req.body = trimBody(req.body);
  cart = req.session.cart;
  console.log(cart);
  body = req.body
  res.send({cart : cart , body : body });
}

middlewareObj.addPrd = async function (req , res ,  next){
  req.body = trimBody(req.body);
  var newProduct = new Product({
        name    : req.body.name,
        price : req.body.price,
        description : req.body.description,
        type : req.params.type,
        reviews: [],
          rating: 0,
          size : sizes,
            colors: {color : req.body.color ,colorStatus: "active", colorHex : req.body.colorHex},
            sizes: sizes,
          reviewCount: 0,
          status : "active"
      });
  await newProduct.save();
  req.id = newProduct._id;
  next();
}



middlewareObj.namesur = function (req , res ,  next){

  req.autosan.body = trimBody(req.autosan.body);
  if (/^[\u0000-~\u0080-ʓʕ-ʯͰ-ҁҊ-ԣԱ-Ֆա-ևႠ-Ⴥᴀ-ᴫᵢ-ᵷᵹ-ᶚḀ-῾ⁱⁿℂℇℊ-ℓℕℙ-ℝℤΩℨK-ℭℯ-ℴℹℼ-ℿⅅ-ⅉⅎↃ-ↄⰀ-Ⱞⰰ-ⱞⱠ-\u2c7eⲀ-ⳤⴀ-ⴥꙀ-ꙟꙢ-ꙭꚀ-ꚗ꜠-ꟾﬀ-ﬆﬓ-ﬗＡ-Ｚａ-ｚ]|\ud800[\udd40-\udd8e]|\ud801[\udc00-\udc4f]|\ud834[\ude00-\ude4e]|\ud835[\udc00-\udc54\udc56-\udc9c\udc9e-\udc9f\udca2\udca5-\udca6\udca9-\udcac\udcae-\udcb9\udcbb\udcbd-\udcc3\udcc5-\udd05\udd07-\udd0a\udd0d-\udd14\udd16-\udd1c\udd1e-\udd39\udd3b-\udd3e\udd40-\udd44\udd46\udd4a-\udd50\udd52-\udea5\udea8-\udec0\udec2-\udeda\udedc-\udefa\udefc-\udf14\udf16-\udf34\udf36-\udf4e\udf50-\udf6e\udf70-\udf88\udf8a-\udfa8\udfaa-\udfc2\udfc4-\udfcb]$/.test(req.autosan.body.name.trim()))
    {
      if (/^[\u0000-~\u0080-ʓʕ-ʯͰ-ҁҊ-ԣԱ-Ֆա-ևႠ-Ⴥᴀ-ᴫᵢ-ᵷᵹ-ᶚḀ-῾ⁱⁿℂℇℊ-ℓℕℙ-ℝℤΩℨK-ℭℯ-ℴℹℼ-ℿⅅ-ⅉⅎↃ-ↄⰀ-Ⱞⰰ-ⱞⱠ-\u2c7eⲀ-ⳤⴀ-ⴥꙀ-ꙟꙢ-ꙭꚀ-ꚗ꜠-ꟾﬀ-ﬆﬓ-ﬗＡ-Ｚａ-ｚ]|\ud800[\udd40-\udd8e]|\ud801[\udc00-\udc4f]|\ud834[\ude00-\ude4e]|\ud835[\udc00-\udc54\udc56-\udc9c\udc9e-\udc9f\udca2\udca5-\udca6\udca9-\udcac\udcae-\udcb9\udcbb\udcbd-\udcc3\udcc5-\udd05\udd07-\udd0a\udd0d-\udd14\udd16-\udd1c\udd1e-\udd39\udd3b-\udd3e\udd40-\udd44\udd46\udd4a-\udd50\udd52-\udea5\udea8-\udec0\udec2-\udeda\udedc-\udefa\udefc-\udf14\udf16-\udf34\udf36-\udf4e\udf50-\udf6e\udf70-\udf88\udf8a-\udfa8\udfaa-\udfc2\udfc4-\udfcb]$/.test(req.autosan.body.surname.trim()))
      {
        return next();
      }else{
        res.app.locals.specialContext = 
          {
            name : req.autosan.body.name,
            email : req.autosan.body.email,
            phone: req.autosan.body.phone,
            line1 : req.autosan.body.line1,
            city :req.autosan.body.city,
            zip : req.autosan.body.zip,
            state : req.autosan.body.state,
            error: {type : "regError" , message : "To Επίθετο δεν έχει τη σωστή μορφή" }
          }
        req.flash("regError","Το Επίθετο δεν έχει τη σωστή μορφή");
        res.redirect("back");  
      }
    }else{
      res.app.locals.specialContext = 
      {
          surname : req.autosan.body.surname,
          email : req.autosan.body.email,
          phone: req.autosan.body.phone,
          line1 : req.autosan.body.line1,
          city : req.autosan.body.city,
          zip : req.autosan.body.zip,
          state : req.autosan.body.state,
          error: {type : "regError" , message : "To Όνομα δεν έχει τη σωστή μορφή" }
        }
      req.flash("regError","Το Όνομα δεν έχει τη σωστή μορφή");
      res.redirect("back");   
    }     
}

middlewareObj.password = function (req , res ,  next){

  req.autosan.body = trimBody(req.autosan.body);
  if (req.autosan.body.password === req.autosan.body.password2)
    {
      if (/^(?=.*\d)(?=.*[A-Z])(?=.*[!@#\$%\^\&*\)\(+=._-])[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{8,14}$/.test(req.autosan.body.password)){
        return next();
      }else{
        res.app.locals.specialContext = 
        {
          name : req.autosan.body.name,
          surname : req.autosan.body.surname,
          email : req.autosan.body.email
        }
        req.flash("regError","Ο κωδικός δεν έχει τη σωστή μορφή");
        res.redirect("back"); 
      }
    }else{
      res.app.locals.specialContext = 
      {
          name : req.autosan.body.name,
          surname : req.autosan.body.surname,
          email : req.autosan.body.email
      }
      req.flash("regError","Τα πεδία των κωδικών δεν ταιριάζουν μεταξύ τους");
      res.redirect("back");   
    }     
}


middlewareObj.email = function (req , res ,  next){

  req.autosan.body = trimBody(req.autosan.body);
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.autosan.body.email))
  	{
    	return next();
  	}else{
      res.app.locals.specialContext = 
      {
          name : req.autosan.body.name,
          surname : req.autosan.body.surname,
          phone: req.autosan.body.phone,
          line1 : req.autosan.body.line1,
          city : req.autosan.body.city,
          zip : req.autosan.body.zip,
          state : req.autosan.body.state,
          error: {type : "regError" , message : "To e-mail δεν έχει τη σωστή μορφή" }
      }
  		req.flash("regError","To e-mail δεν έχει τη σωστή μορφή");
		  res.redirect("back");   
  	}   	
}


middlewareObj.emailExists = async function (req , res ,  next){

  req.autosan.body = trimBody(req.autosan.body);
  var google = await User.findOne({ "google.email": req.autosan.body.email});
  var facebook = await User.findOne({ "facebook.email": req.autosan.body.email});
  var local = await User.findOne({ "local.email": req.autosan.body.email});
  console.log("im here");
  if(!google && !facebook && !local){
     return next();
  }
  else{
    res.app.locals.specialContext = 
    {
        name : req.autosan.body.name,
        surname : req.autosan.body.surname,
        phone: req.autosan.body.phone,
        line1 : req.autosan.body.line1,
        city : req.autosan.body.city,
        zip : req.autosan.body.zip,
        state : req.autosan.body.state,
        error: {type : "regError" , message : "To e-mail χρησιμοποιήται ήδη από κάποιο χρήστη" }
    }
    req.flash("regError","To e-mail χρησιμοποιήται ήδη από κάποιο χρήστη");
    res.redirect("back");   
  }     
}

middlewareObj.emailExistsLocal = async function (req , res ,  next){

  req.autosan.body = trimBody(req.autosan.body);
  var google = await User.findOne({ "google.email": req.autosan.body.email});
  var facebook = await User.findOne({ "facebook.email": req.autosan.body.email});
  var local = await User.findOne({ "local.email": req.autosan.body.email});
  if(!google && !facebook && local){
     return next();
  }
  else{
    res.app.locals.specialContext = 
    {
        name : req.autosan.body.name,
        surname : req.autosan.body.surname,
        phone: req.autosan.body.phone,
        line1 : req.autosan.body.line1,
        city : req.autosan.body.city,
        zip : req.autosan.body.zip,
        state : req.autosan.body.state,
        error: {type : "regError" , message : "To e-mail δε χρησιμοποιήται από κάποιο χρήστη" }
    }
    req.flash("regError","To e-mail δε χρησιμοποιήται από κάποιο χρήστη");
    res.redirect("back");   
  }     
}

middlewareObj.phone = function (req , res ,  next){

  req.autosan.body = trimBody(req.autosan.body);
  if (/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(req.autosan.body.phone))
    {
      return next();
    }else{
      res.app.locals.specialContext = 
      {
          name : req.autosan.body.name,
          surname : req.autosan.body.surname,
          email : req.autosan.body.email,
          line1 : req.autosan.body.line1,
          city : req.autosan.body.city,
          zip : req.autosan.body.zip,
          state : req.autosan.body.state,
          method : req.autosan.body.method,
          error: {type : "regError" , message : "To τηλέφωνο δεν έχει τη σωστή μορφή" }
      }
      console.log(res.app.locals.specialContext);
      req.flash("regError","To τηλέφωνο δεν έχει τη σωστή μορφή");
      res.redirect("back");   
    }     
}

middlewareObj.address = function (req , res ,  next){
  
  req.autosan.body = trimBody(req.autosan.body);
  if(req.autosan.body.method === "3"){
    return next();
  }

  var line1 = /^[a-zA-Z0-9Ά-ωΑ-ώ\s,.'-]{3,}$/.test(req.autosan.body.line1);
  var city = /^[a-zA-Z0-9Ά-ωΑ-ώ\s,.'-]{3,}$/.test(req.autosan.body.city);
  var zip = /^[a-zA-Z0-9Ά-ωΑ-ώ\s,.'-]{3,}$/.test(req.autosan.body.zip);
  var state = /^[a-zA-Z0-9Ά-ωΑ-ώ\s,.'-]{3,}$/.test(req.autosan.body.state);

  if (line1 && city && zip && state)
    {
      return next();
    }else{
      res.app.locals.specialContext = 
      {
          name : req.autosan.body.name,
          surname : req.autosan.body.surname,
          email : req.autosan.body.email,
          phone: req.autosan.body.phone,
          error: {type : "regError" , message : "Η Διεύθυνση σας είναι ελλιπής" }
      }
      req.flash("regError","Η Διεύθυνση σας είναι ελλιπής");
      res.redirect("back");   
    }     
}

middlewareObj.rating = function (req , res ,  next){

  req.autosan.body = trimBody(req.autosan.body);
  if (req.autosan.body.rating != null && req.autosan.body.author != '')
    {
      return next();
    }else{
      res.app.locals.specialContext = 
      {
          author : req.autosan.body.author,
          description : req.autosan.body.description,
      }
      req.flash("genError","To Όνομα και η βαθμολογία είναι υποχρεωτικά");
      res.redirect("back");   
    }

}

middlewareObj.user = function (req , res ,  next){

  if (req.user ) {
        res.redirect("/");
    } else {
        next();
    }
}

middlewareObj.validateCart = async function (req , res ,  next){

  if (req.session.cart == undefined) {
    next();
  }

  var cart = req.session.cart;
  var products = cart.products;
  var product_ids = await Object.keys(products);
  var notExist = [];
  for(i=0; i<product_ids.length; i++){
    
    var err,product = await Product.findById(product_ids[i]);
    if(product == null || product.status == "hidden"){
      notExist.push(product_ids[i]);
    }
  }
  if(notExist.length == 0){
    next();
  }else{
    let vcart = new Cart(cart);
    console.log(notExist);
    console.log(vcart);
    notExist.forEach( function(id){
      vcart.removeWholeProduct(id);
      console.log(vcart);
    });
    console.log(vcart);
    req.session.cart = vcart;
    req.session.productList = vcart.productList();
    next();
  }
}

middlewareObj.validateCartVariants = async function (req , res ,  next){

  if (req.session.cart == undefined) {
    next();
  }

  var cart = req.session.cart;
  var products = cart.products;
  var product_ids = await Object.keys(products);
  var notExist = [];
  for(i=0; i<product_ids.length; i++){
    
    var err,product = await Product.findById(product_ids[i]);
    products[product_ids[i]].variants.forEach(function(item){
      var lol = false;
      lol = existCase(item, product);
      console.log(lol);
      if(lol){
        var id = [product_ids[i],item.size,item.color];
        notExist.push(id);
      }
    })
  }
  if(notExist.length == 0){
    next();
  }else{
    let vcart = new Cart(cart);
    notExist.forEach( function(id){
      vcart.removeProductVariants(id);  
    })
    req.session.cart = vcart;
    req.session.productList = vcart.productList();
    next();
  }
}

middlewareObj.validateCartOrderComplete = async function (req , res ,  next){

  if (req.session.cart == undefined) {
    next();
  }

  var cart = req.session.cart;
  var products = cart.products;
  var product_ids = await Object.keys(products);
  var notExist = [];
  for(i=0; i<product_ids.length; i++){
    
    var err,product = await Product.findById(product_ids[i]);
    if(product == null || product.status == "hidden"){
      notExist.push(product_ids[i]);
    }
  }
  if(notExist.length == 0){
    next();
  }else{
    res.send({
      error : {
        message : "Κάποια προϊόντα έχουν διαφοροποιηθεί από το διαχειρηστή"
      }
    });
  }
}

middlewareObj.validateCartVariantsOrderComplete = async function (req , res ,  next){

  if (req.session.cart == undefined) {
    next();
  }

  var cart = req.session.cart;
  var products = cart.products;
  var product_ids = await Object.keys(products);
  var notExist = [];
  for(i=0; i<product_ids.length; i++){
    
    var err,product = await Product.findById(product_ids[i]);
    products[product_ids[i]].variants.forEach(function(item){
      var lol = false;
      lol = existCase(item, product);
      console.log(lol);
      if(lol){
        var id = [product_ids[i],item.size,item.color];
        notExist.push(id);
      }
    })
  }
  if(notExist.length == 0){
    next();
  }else{
    res.send({
      error : {
        message : "Κάποια προϊόντα έχουν διαφοροποιηθεί από το διαχειρηστή"
      }
    });
  }
}



middlewareObj.calculateDatabasePrice = async function (req , res ,  next){

  var products= req.session.cart.products;
  var total = 0;
  var product_ids = await Object.keys(products);
  for(i=0; i<product_ids.length; i++){
    var quantity = 0;
    products[product_ids[i]].variants.forEach(function(item){
      quantity += item.quantity
    })
    var err,product = await Product.findById(product_ids[i]);
    if(product == null){
      total = total + 0;
    }else{
      var add = quantity * product.price;
      total = total + add;
    } 
  }
  if(total === req.session.cart.totalPrice){
    next();
  }else{
    console.log("Το καλάθι αγορών δεν είναι έγκυρο. Κάτι πήγε στραβά");
    req.session.cart = null;
    req.session.productList= null;
    res.send({
      error : {
        message : "Το καλάθι αγορών δεν είναι έγκυρο. Προσπαθήστε αργότερα."
      }
    });
  }
}


middlewareObj.sameEmail = async function (req , res ,  next){

  req.autosan.body = trimBody(req.autosan.body);
  if(req.autosan.body.email === req.autosan.body.email2){
    next();
  }
  else{
    req.flash("regError","Τα e-mail δεν ταιριάζουν μεταξύ τους");
    res.redirect("back");
  }
}


module.exports = middlewareObj;