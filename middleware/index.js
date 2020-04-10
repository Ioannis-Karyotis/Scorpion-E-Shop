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

middlewareObj.email = function (req , res ,  next){
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email))
  	{
    	return next();
  	}else{
  		req.flash("regError","Please , Write a valid email form");
		res.redirect("back");   
  	}   	
}

middlewareObj.password = function (req , res ,  next){
	if (req.body.password === req.body.password2)
  	{
    	return next();
  	}else{
  		req.flash("regError","The password fields do not match with eachother");
		res.redirect("back");   
  	}   	
}



module.exports = middlewareObj;