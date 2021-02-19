const { count } = require("../models/product");

const express 		= require("express"),
	  router     	= express.Router(),
	  Product     	= require("../models/product"),
	  Review 		= require("../models/review"),
	  middleware 	= require("../middleware/index.js"),
	  Cart			= require("../models/cart"),
	  Order			= require("../models/order"),
	  passport 		= require("passport"),
	  multer 		= require('multer'),
	  fs 			= require('fs'),
	  sharp 		= require('sharp'),
	  dotenv 		= require('dotenv'),
	  path 			= require('path'),
	  sanitization	= require('express-autosanitizer'),
	  productsNames = require('../configuration/productNames'),
	  sizes 		= require('../configuration/sizes');
	  var width, height = null;


	  storage = multer.diskStorage({
	    destination: function(req, file, cb) {
	        cb(null, "./public/images/"+req.params.type+"/");
	    },

	    // By default, multer removes file extensions so let's add them back
	    filename: function(req, file, cb) {
	        cb(null, req.params.id + '-' + Date.now() + path.extname(file.originalname));
	    }
	  }),
	  storageNewItem = multer.diskStorage({
	    destination: function(req, file, cb) {
	        cb(null, "./public/images/"+req.params.type+"/");
	    },

	    // By default, multer removes file extensions so let's add them back
	    filename: function(req, file, cb ) {
	    	cb(null, req.id + '-' + Date.now() + path.extname(file.originalname));
	    }
	  });

dotenv.config();

const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

function trimBody(inside){

  Object.keys(inside).forEach(function(key,index) {
    inside[key] = inside[key].trim();
  });
  return inside;
}

router.use(function(req, res, next) {
	res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
})

router.post("/get/resolution", function(req,res,next){
	width = req.body.w;
	height = req.body.h;

	res.json({success : true});
})

router.get("/products/:type", function(req, res, next){
	var wantedType = req.params.type;
	Product.find({ type : wantedType}, function(err , foundProducts ){
      	if(err){
          	console.log(err)
      	}else{
	      	passport.authenticate('jwtAdmin',async function(err, admin, info) {
		    	if (err) { return next(err); }

		    	if(!admin){
		    		foundProducts = await Product.find({ type : wantedType, status : 'active'}).exec();
				}
				
				foundProducts.sort((a, b) => (a.showing > b.showing) ? 1 : -1)
	      		var itemCount = foundProducts.length;
	      		var showing = [];
	      		var div = (itemCount / 8);
	      		var pages = 0;
	      		if(div != 1 && div > 1){
	      			pages = parseInt(div) + 1;
	      		}      		
	      		console.log(pages);
	      		for (i = (req.query.page * 8) ; i < (req.query.page * 8) + 8; i++) {
	      			if(foundProducts[i] == undefined){
	      				break;
	      			}else{
	      				showing.push(foundProducts[i]);	
	      			}
				}
		    	if (!admin) {
		    		return	res.render("products", {products : showing , allProducts: foundProducts, pages : pages, page : req.query.page, name : productsNames[wantedType], admin :null,type: req.params.type });
		    	}
		        return res.render("products", {products : showing , allProducts: foundProducts ,pages : pages, page : req.query.page, name : productsNames[wantedType], admin : "admin" , type: req.params.type});
	    	})(req , res, next)
	    }
	});
});

router.get("/products/:type/add",passport.authenticate('jwtAdmin', { session: false }), function(req, res, next){
	res.render("products/add",{type: req.params.type});
});

router.post("/products/:type/add",passport.authenticate('jwtAdmin', { session: false }) ,middleware.addPrd,	 multer({ storage: storageNewItem, fileFilter: imageFilter }).array("profile_pic"),async function(req, res, next){
	
	Product.findOne({_id :req.id}, async function(err,newProduct){
		newProduct.name =  req.body.name;
		newProduct.price =  req.body.price;
		newProduct.description =  req.body.description;
		newProduct.colors =  {color : req.body.color ,colorStatus: "active", colorHex : req.body.colorHex};
		newProduct.code =  req.body.code;
		newProduct.kind = req.body.kind;

		let errCount,countTypes = await Product.count({type : req.params.type});
		console.log(countTypes);
		newProduct.showing = countTypes;

		sizesSearch = require('../configuration/sizesTables');
		newProduct.sizesTable = sizesSearch[req.params.type + "_" + newProduct.kind];

		console.log(newProduct);
		if (req.fileValidationError) {
        return res.send(req.fileValidationError);
	    }
	    else if (!req.files) {
	        return res.send('Please select an image to upload');
	    }
	    req.files.forEach(function(file){
			var str = file.path;
			console.log(file.path)
		  	var str2 = str.replace("public", "");
			var final = str2.replace(/\\/g,"/");
			var last = final.split("/");
			var last2 = last.pop();
			var name = last2.split(".");
			
			let smallProccess = final.split(".");
			let finalSmall = smallProccess[0] + "_small." + smallProccess[1];
			let Readfile = file.path.split(".");
			
			sharp(fs.readFileSync(file.path))
			.resize(603, 723)
			.toFile(Readfile[0] + "_small." + Readfile[1], (err, info) => { 
				if(err){
					console.log(err);
				}
			});

			image = { 
				url : process.env.ROOT + final,
				urlSmall : process.env.ROOT + finalSmall,
				name : name[0] 
			};
			console.log(finalSmall);
			newProduct.images.push(image);
		});
		console.log("Got here before");
		await newProduct.save();
		res.redirect("/products/"+ req.params.type+"?page=0");
	})
})

router.get("/products/:type/:id/addColors",passport.authenticate('jwtAdmin', { session: false }), function(req, res, next){
	res.render("products/addColors",{type: req.params.type ,id : req.params.id});
});

router.post("/products/:type/:id/addColors" ,passport.authenticate('jwtAdmin', { session: false }), function(req, res, next){
	Product.findById(req.params.id,function(err, foundProduct){
		if(err){
			console.log(err);
		} else {
			var newColor = {
				color : req.body.color,
				colorStatus: "active",
				colorHex : req.body.colorHex,
			}
			foundProduct.colors.push(newColor);
			foundProduct.save();
			res.redirect('/products/'+ req.params.type + '/' + req.params.id );
		}
	});
})

router.get("/products/:type/:id/addImages",passport.authenticate('jwtAdmin', { session: false }), function(req, res, next){
	res.render("products/addImages",{type: req.params.type ,id : req.params.id});
});

router.post("/products/:type/:id/addImages" ,multer({ storage: storage, fileFilter: imageFilter }).single("image") ,passport.authenticate('jwtAdmin', { session: false }), function(req, res, next){
	Product.findById(req.params.id,function(err, foundProduct){
		if(err){
			console.log(err);
		} else {
	        if (req.fileValidationError) {
		        return res.send(req.fileValidationError);
		    }
		    else if (!req.file) {
		        return res.send('Please select an image to upload');
		    }
			var str = req.file.path;
			console.log(str);
			var str2 = str.replace("public", "");
			var final = str2.replace(/\\/g,"/");
			var last = final.split("/");
			var last2 = last.pop();
			var name = last2.split(".")

			let smallProccess = final.split(".");
			let finalSmall = smallProccess[0] + "_small." + smallProccess[1];
			let Readfile = req.file.path.split(".");
			
			sharp(fs.readFileSync(req.file.path))
			.resize(603, 723)
			.toFile(Readfile[0] + "_small." + Readfile[1], (err, info) => { 
				if(err){
					console.log(err);
				}
			});
			
			image = { 
				url : process.env.ROOT + final,
				urlSmall : process.env.ROOT + finalSmall,
				name : name[0] 
			};

			foundProduct.images.push(image);
			  
			foundProduct.save();
			res.redirect("/products/"+ req.params.type + "/" + foundProduct._id);
		}
	});
})

router.post("/products/:type/:id/deleteImage/:name" , function(req, res, next){
	Product.findById(req.params.id,function(err, foundProduct){
		if(err){
			console.log(err);
		} else {
			console.log(foundProduct);
			var index = 0
			foundProduct.images.forEach(async function(img){
				if (img.name == req.params.name) {
					foundProduct.images.splice(index,1);
					var url = img.url.split("/");
					var path = "./public/images/"+ req.params.type + "/" + url.pop();
					await fs.unlink(path ,function(err){
						if(err){
							console.log(err);
						}
					});
					foundProduct.save();
				}
				index = index + 1;
			})
			res.redirect("/products/"+ req.params.type + "/" + foundProduct._id);
		}
	});
})




router.get("/products/:type/:id", function(req ,res,next){
	Product.find({_id : req.params.id }).populate("reviews").exec(async function(err, foundProducts){
		if(err){
			console.log(err);
		} else {
		    if(foundProducts[0]!= null){
		    	var sortedReviews = foundProducts[0].reviews.sort((a, b) => b.date - a.date);
		    	var lastReviews = sortedReviews.slice(0, 3);
		    	var countReviews = foundProducts[0].reviewCount;
		    	var validated = {};
		    	if (req.app.locals.specialContext != null) {
		    		validated = req.app.locals.specialContext;
		    		
		    		req.app.locals.specialContext = null;
		    	}
				
				var n = 1;
				if(width > 775){
					n = 3;
				}

			    var images = foundProducts[0].images;
				var err,recommendedP = await Product.find({}).sort({"rating": -1}).limit(6).exec();

				var recommendedResult = new Array(Math.ceil(recommendedP.length / n))
				.fill()
				.map(_ => recommendedP.splice(0,n));

				    passport.authenticate('jwtAdmin', function(err, admin, info) {
			    	if (err) { return next(err); }
			    	if (!admin) {
			    		return	res.render("products/show", {product: foundProducts[0], reviews : lastReviews, revCount : countReviews, images :images,admin:null, validated :validated, recommended : recommendedResult});
			    	}			    	
			        return res.render("products/show", {product: foundProducts[0],reviews : lastReviews, revCount : countReviews, images :images ,admin:"admin" , validated :validated ,recommended : recommendedResult});
		    	})(req , res, next)
		    } else{
		        res.redirect("back");
		    }
		}
	});
});


router.delete("/products/:type/:id/delete" ,passport.authenticate('jwtAdmin', { session: false }),async function(req, res){
	console.log(req.params.id);
	var orders = await Order.find({}).populate("productList.product").exec();
	var count = 0;
	orders.forEach(function(order){
		order.productList.forEach(function(productlist){
			if(productlist.product._id == req.params.id && productlist.product.type == req.params.type){
				count = count + 1;
			}
		})	
	})	
	if(count == 0){
		Product.findById(req.params.id,function(err, foundProduct){
			if(err){
				console.log(err);
			} else {
				foundProduct.images.forEach(async function(img){
					var url = img.url.split("/");
					var path = "./public/images/"+ req.params.type + "/" + url.pop();
					await fs.unlink(path ,function(err){
						if(err){
							console.log(err);
						}
					});
				})
			}
		});
		Product.deleteOne({type: req.params.type, _id : req.params.id}, function(err){
			if(err){
				res.send({ success:  "success" });
			} else{
				res.send({ success:  "success" });
			}
		});
	}else{
		res.send({ error: "Το Προιον υπάρχει σε Αναμένουσα παραγγελία" });
	}	
});

router.get("/products/:type/:id/edit",passport.authenticate('jwtAdmin', { session: false }), function(req ,res,next){
	Product.find({_id : req.params.id }).populate("reviews").exec(async function(err, foundProducts){
		if(err){
			console.log(err);
		} else {
		    if(foundProducts[0]!= null){
		    	console.log(foundProducts[0]);
			    var images = foundProducts[0].images;  		    	
			    return res.render("products/edit", {product: foundProducts[0],images :images});
		    } else{
		        res.redirect("back");
		    }
		}
	});
});



router.put("/products/:type/:id/edit" ,sanitization.route, passport.authenticate('jwtAdmin', { session: false }), async function(req, res){
	req.autosan.body = trimBody(req.autosan.body);
	sizesSearch = require('../configuration/sizesTables');
	req.autosan.body.sizesTable = sizesSearch[req.params.type + "_" + req.autosan.body.kind];

	let err,prdWithCurrentPosition = await Product.findOne({type : req.params.type, showing : req.autosan.body.showing });
	let err2,prdToBeUpd = await Product.findOne({type : req.params.type, _id : req.params.id });

	prdWithCurrentPosition.showing = prdToBeUpd.showing;
	await prdWithCurrentPosition.save();

	Product.update({type: req.params.type, _id : req.params.id}, req.autosan.body, function(err , updateProduct){
		if(err){
			console.log("Got to error");
			res.redirect("back");
		}else{
			//console.log(updateProduct);
			res.redirect("/products/"+ req.params.type+"?page=0");
		}
	});
});



router.post("/products/:type/:id/hide" ,passport.authenticate('jwtAdmin', { session: false }),  function(req, res){
	Product.find({type: req.params.type, _id : req.params.id}, function(err, products){
		if(err){
			console.log(err);
		} else {
			console.log(products);
			products.forEach(function(foundProduct){
				if(foundProduct.status == "active"){
					foundProduct.status = "hidden";
					foundProduct.save();
				}else{
					foundProduct.status = "active";
					foundProduct.save();
				}
			})
			res.redirect('products/'+ req.params.type)
		}
	});
});


router.post("/products/:type/:id/hideSize/:size" ,passport.authenticate('jwtAdmin', { session: false }),  function(req, res){
	Product.findById(req.params.id,function(err, foundProduct){
		if(err){
			console.log(err);
		} else {
			foundProduct.sizes.forEach(function(size){
			if(size.size == req.params.size){	
					if(size.sizeStatus == "active"){
						size.sizeStatus = "hidden";
						foundProduct.save();
					}else{
						size.sizeStatus = "active";
						foundProduct.save();
					}
				}
			})
			res.redirect('products/'+ req.params.type + '/' + foundProduct.name);
		}
	});
});

router.post("/products/:type/:id/deleteColor/:color" ,passport.authenticate('jwtAdmin', { session: false }),async function(req, res){
	Product.findOne({type: req.params.type, _id : req.params.id}, function(err,product){
		if(err){
			res.redirect("/products/"+ req.params.type);
		} else{
			var index = 0
			product.colors.forEach(function(color){
				if (color.colorHex == "#"+req.params.color) {
					product.colors.splice(index,1);
					product.save();
				}
				index = index + 1;
			})
			res.redirect("/products/"+ req.params.type);
		}
	});;
});

router.post("/products/:type/:id/hideColor/:color" ,passport.authenticate('jwtAdmin', { session: false }),async function(req, res){
	Product.findOne({type: req.params.type, _id : req.params.id}, function(err,product){
		if(err){
			console.log(product);
			res.redirect("/products/"+ req.params.type);
		} else{
			console.log(product);
			product.colors.forEach(function(color){
				if(color.colorHex == "#"+req.params.color){	
					if(color.colorStatus == "active"){
						color.colorStatus = "hidden";
						product.save();
					}else{
						color.colorStatus = "active";
						product.save();
					}
				}
			})
			res.redirect("/products/"+ req.params.type);
		}
	});;
});


router.post("/products/:type/:id/review",sanitization.route, middleware.rating, function(req,res){
	req.autosan.body = trimBody(req.autosan.body);
	Product.find({_id : req.params.id}, function(err, foundProduct){
		if(err){
			console.log(err);
		} else {

		    if(foundProduct[0]!= null){
		    		if(req.user && req.user[req.user.methods].profile != null){
		    			var name =  req.user[req.user.methods].name ;
						var surname =  req.user[req.user.methods].surname;
						var photo = req.user[req.user.methods].profile;
		    		}else{
		    			var name = req.autosan.body.author;
						var surname =  "";
						var photo = process.env.ROOT + "/images/blank.png"
		    		}
					var today = new Date();

					var dd = String(today.getDate()).padStart(2, '0');
					var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
					var yyyy = today.getFullYear();
					var strToday = dd + '-' + mm + '-' + yyyy;

					Review.create(
						{
							author: name + " " + surname,
							description: req.autosan.body.description,
							date: today,
							showDate : strToday,
							photo : photo,
							rating: req.autosan.body.rating
						}, function(err, review){
							if(err){
								console.log(err);
							}else{
								foundProduct[0].reviews.push(review);
								foundProduct[0].reviewCount = foundProduct[0].reviewCount + 1;
								foundProduct[0].rating = ((foundProduct[0].rating * (foundProduct[0].reviewCount - 1)) + 	(review.rating / 2)) / foundProduct[0].reviewCount;
								foundProduct[0].save();
								req.flash("genSuccess","Επιτυχία");
								res.redirect('back');
							}
						}
					);
		    } else{
		        res.redirect("back");
		    }
		}
	});
});

router.post("/products/:type/:id/add" , sanitization.route, function(req, res){
	req.autosan.body = trimBody(req.autosan.body);
	Product.find( {_id : req.params.id}, function(err, foundProduct){
		if(err){
			console.log(err);
		} else {
			console.log(foundProduct);
			if(foundProduct[0]!=null){
				var cart = new Cart(req.session.cart ? req.session.cart : {});
          		var quantity = req.body.qty ? req.body.qty : 1;
          		let qty = quantity < 10 ? quantity % 10 : quantity % 100;
          		console.log("qty:"+qty);
				cart.add(foundProduct[0], qty , req.autosan.body.size , req.autosan.body.color);
				req.session.cart = cart;
				req.session.productList = cart.productList();

				console.log("_SessionCart_");
				console.log(req.session.cart);
				console.log("_ProductList_");
				console.log(req.session.productList);

				res.redirect("back");
			}
		}
	});
});


module.exports = router;
