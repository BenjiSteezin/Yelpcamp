var express= require("express");
var router= express.Router();
var Campground= require("../models/campgrounds");
var middleware = require("../middleware");


//Index route- shows all campgrounds
router.get("/", function(req,res){
   
    //Get all campgrounds from db
    Campground.find({},function(err,allCampgrounds){
        
        if(err){
            console.log(err);
        }else{
          res.render("campgrounds/index", {campgrounds:allCampgrounds});  
        }
    });
  
});


//Create route- Adds new campground to db
router.post("/",middleware.isLoggedIn, function(req,res){
    //get data from form and add to campgorunds array
    var name= req.body.name;
    var price= req.body.price;
    var image= req.body.image;
    var desc= req.body.description;
    var author={
        
        id: req.user._id,
        username: req.user.username
    };  
    var newCampground= {name:name,price:price, image:image, description: desc, author:author};
    //Create a new campground and save to DB
    Campground.create(newCampground,function(err,campground){
        
        if(err){
            console.log(err);
        }else{
            
             //redirect back to campgrounds page
             res.redirect("/campgrounds");
        }
        
        
    });
         //campgrounds.push(newCampground)
});

//New route- shows form to create new campground 
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});


//Show- Shows more info about one campground
router.get("/:id", function(req,res){
    
    //find cmapground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
            if(err){
                console.log(err);
            }   else{
                    //render show template with that campground
                    res.render("campgrounds/show",{campground: foundCampground});
            }   
    });
});

//edit campground route

router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req, res) {
        Campground.findById(req.params.id, function(err,campground){
            res.render("campgrounds/edit",{campground:campground}); 
     });
});



//update campground route
router.put("/:id",middleware.checkCampgroundOwnership, function(req,res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds")
        }else{
            //redirect somewhere(show page)
            res.redirect("/campgrounds/" + req.params.id );
        }
    })
    
});

//Destroy

router.delete("/:id",middleware.checkCampgroundOwnership, function(req,res){
    
   Campground.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.redirect("/campgrounds");
       }else{
           
           res.redirect("/campgrounds");
       }
       
   });
});


module.exports= router;
