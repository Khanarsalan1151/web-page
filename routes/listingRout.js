const express= require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isLoggedInsidelist, isOwner, validatelisting} = require("../middleware.js");
const listingController = require("../controllers/listingController.js");
// Putting multer 

const multer = require("multer");

const {storage} = require("../cloudCongif.js")

const upload = multer({storage})

router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,
    upload.single('listings[img]'),
    validatelisting,
    wrapAsync(listingController.createNewList))



router.get("/new", isLoggedIn, listingController.renderNewForm);

router.get("/search", wrapAsync(listingController.Search) )

router
.route("/:id")
.get(wrapAsync(listingController.showIndividualListing))
.patch(isLoggedInsidelist, isOwner,upload.single('listings[img]'), validatelisting, wrapAsync(listingController.editList))
.delete(isLoggedInsidelist,isOwner, wrapAsync(listingController.deleteList))

// Editing form of listing
router.get("/:id/edit",isLoggedInsidelist,isOwner,wrapAsync(listingController.editListForm));




module.exports= router