const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user.js")

router.get("/signup", (req,res)=>{
    res.render("users/signup.ejs")
})

router.post("/signup", wrapAsync(async (req,res,next)=>{
    try{
        let{username, email, password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        req.flash("success", "Welcome to WanderLust");
        res.redirect("/listings");
    }catch(err){
        req.flash("error", err.message);
        res.redirect("/signup")
    }
   
}));


router.get("/login", (req,res)=>{
    res.render("users/login.ejs");
});

// passport authenticatr karega as a middleware passport.authenticate
router.post("/login",passport.authenticate('login',{failureRedirect: "/login", 
    failureFlash: true}),
    wrapAsync(async(req,res)=>{
        req.flash("success","Welcome to WanderLust! You are logged in");
        res.redirect("/listings")
}))

module.exports= router;