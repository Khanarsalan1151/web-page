const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const forgetController = require("../controllers/forgotController.js");

router.route("/")
    .get(forgetController.forgotPassForm)
    .post(forgetController.forgotPassFunction);

router.route("/:user")
    .post(forgetController.setNewPass);

module.exports =  router