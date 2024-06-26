const listing = require('./models/listing')
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");
const Review = require('./models/review.js');

module.exports.isLoggedIn = (req,res,next)=>{

    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        req.flash("error","You must be login");
        return res.redirect("back")
    }
    next();
};



module.exports.isLoggedInsidelist = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You must be login");
        return res.redirect(`back`)
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next) =>{
    let {id} = req.params;
    let findedlisting= await listing.findById(id);
    
    if(!findedlisting.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the owner of this list");
        return res.redirect(`/listings/${id}`);
    }
    
    next();
}

module.exports.validatelisting = (req,res,next)=>{
    let {error}= listingSchema.validate(req.body);

    if(error){
        let errordetailes = error.details.map((el)=> el.message).join(",")
        throw new ExpressError(400, errordetailes)

    }else{
        next();
    }

}

module.exports.validateReview = (req,res,next) =>{
   
    let {error}= reviewSchema.validate(req.body);

    if(error){
        let errordetailes = error.details.map((el)=> el.message).join(",")
        throw new ExpressError(400, errordetailes)
    }else{
        next();
    } 
};

module.exports.isReviewAuthor = async (req,res,next) =>{
    let {id, reviewId} = req.params;
    let review= await Review.findById(reviewId);
    res.locals.reviewAuthor = review.author
        if(!review.author.equals(res.locals.currentUser)){
            req.flash("error","You are not the author of the review");
            return res.redirect(`/listings/${id}`);
        }
 
    next();
}
