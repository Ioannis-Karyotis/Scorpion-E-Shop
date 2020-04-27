const middlewareObj = {};
      User          = require("../models/user");

// middlewareObj.checkCommentOwnership = function(req, res , next){
// 	if(req.isAuthenticated()){
// 		Comment.findById(req.params.comment_id, function(err, foundComment){
// 		if(err){
// 			res.redirect("back");
// 		} else{
// 			if(foundComment.author.id.equals(req.user._id)){
// 				next();
// 			} else{
// 				req.flash("error","You dont have permission to do that");
// 				res.redirect("back");
// 			}
// 		}
// 	});
// 	}else{
// 		req.flash("error","You need to be Logged in to do that");
// 		res.redirect("back");
// 	}	
// }

// middlewareObj.checkCampgroundOwnership = function (req, res , next){
// 	if(req.isAuthenticated()){
// 		Campground.findById(req.params.id, function(err, foundCampground){
// 		if(err){
// 			res.redirect("back");
// 		} else{
// 			if(foundCampground.author.id.equals(req.user._id)){
// 				next();
// 			} else{
// 				req.flash("error","You dont have permission to do that");
// 				res.redirect("back");
// 			}
// 		}
// 	});
// 	}else{
// 		req.flash("error","You need to be Logged in to do that");
// 		res.redirect("back");
// 	}	
// }


middlewareObj.namesur = function (req , res ,  next){
  if (/^[\u0000-~\u0080-ʓʕ-ʯͰ-ҁҊ-ԣԱ-Ֆա-ևႠ-Ⴥᴀ-ᴫᵢ-ᵷᵹ-ᶚḀ-῾ⁱⁿℂℇℊ-ℓℕℙ-ℝℤΩℨK-ℭℯ-ℴℹℼ-ℿⅅ-ⅉⅎↃ-ↄⰀ-Ⱞⰰ-ⱞⱠ-\u2c7eⲀ-ⳤⴀ-ⴥꙀ-ꙟꙢ-ꙭꚀ-ꚗ꜠-ꟾﬀ-ﬆﬓ-ﬗＡ-Ｚａ-ｚ]|\ud800[\udd40-\udd8e]|\ud801[\udc00-\udc4f]|\ud834[\ude00-\ude4e]|\ud835[\udc00-\udc54\udc56-\udc9c\udc9e-\udc9f\udca2\udca5-\udca6\udca9-\udcac\udcae-\udcb9\udcbb\udcbd-\udcc3\udcc5-\udd05\udd07-\udd0a\udd0d-\udd14\udd16-\udd1c\udd1e-\udd39\udd3b-\udd3e\udd40-\udd44\udd46\udd4a-\udd50\udd52-\udea5\udea8-\udec0\udec2-\udeda\udedc-\udefa\udefc-\udf14\udf16-\udf34\udf36-\udf4e\udf50-\udf6e\udf70-\udf88\udf8a-\udfa8\udfaa-\udfc2\udfc4-\udfcb]$/.test(req.body.name))
    {
      if (/^[\u0000-~\u0080-ʓʕ-ʯͰ-ҁҊ-ԣԱ-Ֆա-ևႠ-Ⴥᴀ-ᴫᵢ-ᵷᵹ-ᶚḀ-῾ⁱⁿℂℇℊ-ℓℕℙ-ℝℤΩℨK-ℭℯ-ℴℹℼ-ℿⅅ-ⅉⅎↃ-ↄⰀ-Ⱞⰰ-ⱞⱠ-\u2c7eⲀ-ⳤⴀ-ⴥꙀ-ꙟꙢ-ꙭꚀ-ꚗ꜠-ꟾﬀ-ﬆﬓ-ﬗＡ-Ｚａ-ｚ]|\ud800[\udd40-\udd8e]|\ud801[\udc00-\udc4f]|\ud834[\ude00-\ude4e]|\ud835[\udc00-\udc54\udc56-\udc9c\udc9e-\udc9f\udca2\udca5-\udca6\udca9-\udcac\udcae-\udcb9\udcbb\udcbd-\udcc3\udcc5-\udd05\udd07-\udd0a\udd0d-\udd14\udd16-\udd1c\udd1e-\udd39\udd3b-\udd3e\udd40-\udd44\udd46\udd4a-\udd50\udd52-\udea5\udea8-\udec0\udec2-\udeda\udedc-\udefa\udefc-\udf14\udf16-\udf34\udf36-\udf4e\udf50-\udf6e\udf70-\udf88\udf8a-\udfa8\udfaa-\udfc2\udfc4-\udfcb]$/.test(req.body.surname))
      {
        return next();
      }else{
        res.app.locals.specialContext = 
          {
            name : req.body.name,
            surname : "",
            password : req.body.password,
            password2 : req.body.password2,
            email : req.body.email
          }
        req.flash("regError","Το Επίθετο δεν έχει τη σωστή μορφή");
        res.redirect("back");  
      }
    }else{
      res.app.locals.specialContext = 
      {
          name : "",
          surname : req.body.surname,
          password : req.body.password,
          password2 : req.body.password2,
          email : req.body.email
        }
      req.flash("regError","Το Όνομα δεν έχει τη σωστή μορφή");
      res.redirect("back");   
    }     
}

middlewareObj.password = function (req , res ,  next){
  if (req.body.password === req.body.password2)
    {
      if (/^(?=.*\d)(?=.*[A-Z])(?=.*[!@#\$%\^\&*\)\(+=._-])[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{8,14}$/.test(req.body.password)){
        return next();
      }else{
        res.app.locals.specialContext = 
        {
          name : req.body.name,
          surname : req.body.surname,
          password : "",
          password2 : req.body.password2,
          email : req.body.email
        }
        req.flash("regError","Ο κωδικός δεν έχει τη σωστή μορφή");
        res.redirect("back"); 
      }
    }else{
      res.app.locals.specialContext = 
      {
          name : req.body.name,
          surname : req.body.surname,
          password : "",
          password2 : "",
          email : req.body.email
      }
      req.flash("regError","Τα πεδία των κωδικών δεν ταιριάζουν μεταξύ τους");
      res.redirect("back");   
    }     
}



middlewareObj.email = function (req , res ,  next){
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email))
  	{
    	return next();
  	}else{
      res.app.locals.specialContext = 
      {
          name : req.body.name,
          surname : req.body.surname,
          password : req.body.password,
          password2 : req.body.password2,
          email : ""
      }
  		req.flash("regError","To e-mail δεν έχει τη σωστή μορφή");
		  res.redirect("back");   
  	}   	
}



module.exports = middlewareObj;