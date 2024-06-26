const express= require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isLoggedInsidelist, isOwner, validatelisting} = require("../middleware.js");
const listingController = require("../controllers/listingController.js");




// Index  route
router.get("/", wrapAsync(listingController.index))

// Create route
router.post("/", validatelisting, wrapAsync(listingController.createNewList));

// Create new route form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show individual Route
router.get("/:id", wrapAsync(listingController.showIndividualListing));

// Editing form of listing
router.get("/:id/edit",isLoggedInsidelist,isOwner,wrapAsync(listingController.editListForm));

// Editing Completion
router.patch("/:id",isLoggedInsidelist, isOwner, validatelisting, wrapAsync(listingController.editList))

// Delting the list
router.delete("/:id/remove",isLoggedInsidelist,isOwner, wrapAsync(listingController.deleteList))


module.exports= router