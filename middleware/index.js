//All middleware
var Campground=require("../models/campgrounds");
var Comment=require("../models/comment");

var middlewareObj={};

middlewareObj.checkCampgroundOwnership= function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err,campground){
            if(err){
                req.flash("error","Campground not found");
                res.redirect("back");
            } else{
                //does user own the campground?
             if(campground.author.id.equals(req.user._id)){
                 next();
              }else{
                    req.flash("error","Access denied!");
                    res.redirect("back");
                }
             }
         });
        }  else{
                req.flash("error","Please login!");
                res.redirect("back");
    }
}
    


middlewareObj.checkCommentOwnership= function(req,res,next){
    
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err,foundComment){
            if(err){
                req.flash("error","Campground not found");
                res.redirect("back");
            } else{
                //does user own the campground?
             if(foundComment.author.id.equals(req.user._id)){
                 next();
              }else{
                    req.flash("error","Access denied!");
                    res.redirect("back");
                }
             }
         });
        }  else{
                req.flash("error","Please Login!");
                res.redirect("back");
    }
}
    
middlewareObj.isLoggedIn= function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please login!");
    res.redirect("/login");
}



module.exports= middlewareObj;