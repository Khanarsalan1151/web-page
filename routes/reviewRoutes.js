const express= require("express");
const router = express.Router({mergeParams: true});
const listing = require("../models/listing.js");
const Review = require("../models/review.js")
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");




const validateReview = (req,res,next) =>{
   
    let {error}= reviewSchema.validate(req.body);

    if(error){
        let errordetailes = error.details.map((el)=> el.message).join(",")
        throw new ExpressError(400, error)
    }else{
        next();
    } 
}


router.post("/", validateReview,wrapAsync(async (req,res,next)=>{
    let selectedList = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    let {id} = req.params
    selectedList.reviews.push(newReview);

    await newReview.save();
    await selectedList.save();

    req.flash("success","New review has been created")
    res.redirect(`/listings/${id}`)
}));


// Delete review route

router.delete("/:reviewId", wrapAsync(async(req,res,next)=>{
    let{id, reviewId} = req.params;
    await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted")
    res.redirect(`/listings/${id}`)
}))


module.exports= router