
const listing = require("../models/listing.js")
const User = require("../models/user.js");
const nodemailer = require("nodemailer");

module.exports.signupPage = (req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signUpfunction = async (req,res,next)=>{
    try{
        let{username, email, password} = req.body;
        const newUser = new User({email,username})
        const registeredUser = await User.register(newUser,password);
        console.log(newUser)
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err)

            }else{
                req.flash("success", "Welcome to WanderLust");
                res.redirect("/listings");
            }
        })

       
    }catch(err){
        req.flash("error", err.message);
        res.redirect("/signup")
    }
   
};

module.exports.logInPage = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.logInFuntionality = async(req,res)=>{
    req.flash("success","Welcome to WanderLust! You are logged in");
    let redirectUrl = res.locals.redirectUrl || "/listings" ;

    res.redirect(redirectUrl)
};

module.exports.logOutFunctionality = (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }else{
            req.flash("success","You are logged out");
            res.redirect("/listings");
        }
})};

