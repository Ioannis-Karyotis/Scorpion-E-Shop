var middlewareObj = {};

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

middlewareObj.isLoggedIn = function (req, res , next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","Please Login First!");
	res.redirect("back");
}

middlewareObj.username = function (req , res ,  next){
  if (/^[a-zA-Z]\w{6,14}$/.test(req.body.username))
    {
      return next();
    }else{
      res.app.locals.specialContext = 
      {
          username : "",
          password : req.body.password,
          password2 : req.body.password2,
          email : req.body.email
        }
      req.flash("regError","Το Ψευδώνυμο δεν έχει τη σωστή μορφή");
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
          username : req.body.username,
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
          username : req.body.username,
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
          username : req.body.username,
          password : req.body.password,
          password2 : req.body.password2,
          email : ""
        }
  		req.flash("regError","Please ,To e-mail δεν έχει τη σωστή μορφή");
		  res.redirect("back");   
  	}   	
}




module.exports = middlewareObj;