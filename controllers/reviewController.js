const Review = require("../models/review.js")
const listing = require("../models/listing.js")

module.exports.newReview = async (req,res,next)=>{
    let {id} = req.params
    let selectedList = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;

    
    selectedList.reviews.push(newReview);

    await newReview.save();
    await selectedList.save();

    req.flash("success","New review has been created")
    res.redirect(`/listings/${id}`)
};

module.exports.destroyReview = async(req,res,next)=>{
    let{id, reviewId} = req.params;
    await listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})

    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted")
    res.redirect(`/listings/${id}`);

}