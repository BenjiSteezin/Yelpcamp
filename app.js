var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require ("mongoose"),
    passport   = require("passport"),
    flash      = require("connect-flash"),
    localstrategy =require("passport-local"),
    methodOverride =require("method-override"),
    Campground = require("./models/campgrounds"),
    Comment    = require("./models/comment"),
    User       = require("./models/user"),
    seedDB     = require("./seeds")

//Requring Routes
var  commentRoutes     = require("./routes/comments"),
     campgroundRoutes  = require("./routes/campgrounds"),
     indexRoutes       = require("./routes/index")


//mongoose.connect("mongodb://localhost/yelpcampv13");
mongoose.connect("mongodb://onwukaeb:power123@ds245518.mlab.com:45518/benjidemoapp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the datbase

//Passport Config

app.use(require("express-session")({
    secret:"YelpCamp APP",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser= req.user;
    res.locals.error= req.flash("error");
    res.locals.success= req.flash("success");
    next();
    
});
    


app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT,process.env.IP, function(){
    
    console.log("YelpCamp server has Started");
});


