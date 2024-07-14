const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/userController.js")

// SignUp page 
router.route("/signup")
.get(userController.signupPage)
.post(wrapAsync(userController.signUpfunction));

// Login related
router.route("/login")
.get( userController.logInPage)
.post(saveRedirectUrl, passport.authenticate('local',{failureRedirect: "/login", 
failureFlash: true}),wrapAsync(userController.logInFuntionality));




router.get("/logout", userController.logOutFunctionality)

module.exports= router;