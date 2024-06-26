const express= require("express");
const router = express.Router({mergeParams: true});
const listing = require("../models/listing.js");
const Review = require("../models/review.js")
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isLoggedInsidelist, isReviewAuthor} = require("../middleware.js")



router.post("/",isLoggedIn, validateReview,wrapAsync(async (req,res,next)=>{
    let {id} = req.params
    let selectedList = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;

    
    selectedList.reviews.push(newReview);

    await newReview.save();
    await selectedList.save();

    req.flash("success","New review has been created")
    res.redirect(`/listings/${id}`)
}));


// Delete review route

router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(async(req,res,next)=>{
    let{id, reviewId} = req.params;
    await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})

    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted")
    res.redirect(`/listings/${id}`);

}))


module.exports= router