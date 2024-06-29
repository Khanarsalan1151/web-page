// Constant requirements
if(process.env.NODE_ENV != "production"){
    require("dotenv").config();

}

const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const url = process.env.ATLASDB_URL;
const ExpressError = require("./utils/ExpressError.js");
const listingsRoute = require("./routes/listingRout.js")
const reviewRoute = require("./routes/reviewRoutes.js")
const userRoute = require("./routes/userRoutes.js");
const session = require("express-session");
const MongoStore = require("connect-mongo")
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const {isLoggedIn} = require("./middleware.js");


// starting the database connection
main().then(()=>{
    console.log("connected to DB")
}).catch((err)=>{
    console.log(err)
});

//Function to start a database connection;

async function main(){
   await mongoose.connect(url);
}

//Functionalities of app

app.use(methodOverride('_method'));
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs", ejsMate);

// Using multer;

const store = MongoStore.create({
    mongourl: url,
    crypto:{
        secret:process.env.SECRET},
    touchAfter: 24*3600

})

store.on("error", ()=>{
    console.log("ERROR in MONGO SESSION STORE", err)
})



const sessionOptions ={
    store,

    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7*27*60*60*1000,
        maxAge: 7*27*60*60*1000,
        httpOnly : true,
    }
}

app.use(session(sessionOptions));
app.use(flash());


// Initalizing passport here 

app.use(passport.initialize());

app.use(passport.session());

passport.use( new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error")
    res.locals.currentUser = req.user;
    next();
})



// HAndling listings
app.get("/",(req,res)=>{[
    res.send("this is the home")
]})

app.use("/listings", listingsRoute);

// handling review Routes
app.use("/listings/:id/review", reviewRoute)

// Signup route here 

app.use("/", userRoute)
// Error Handling Error

app.all("*",(req,res,next) =>{
    next(new ExpressError(404,"Page Not Found"));
})

app.use((err,req,res,next)=>{
    let{statusCode = 500, message ="Something went wrong"} = err
    res.render("./listings/error.ejs", {err})
})


app.listen(port, ()=>{
    console.log(`The app is listening in the port ${port}`)
});