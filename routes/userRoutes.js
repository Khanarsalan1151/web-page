const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user.js")
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/userController.js")

// SignUp page redering
router.get("/signup", userController.signupPage);

// Signup Page funtionality
router.post("/signup", wrapAsync(userController.signUpfunction));


router.get("/login", userController.logInPage);

// passport authenticatr karega as a middleware passport.authenticate
router.post("/login",saveRedirectUrl, passport.authenticate('local',{failureRedirect: "/login", 
    failureFlash: true}),
    wrapAsync(userController.logInFuntionality))

router.get("/logout", userController.logOutFunctionality)

module.exports= router;