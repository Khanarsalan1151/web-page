const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title:{
        type:String,
    },
    description:{
        type:String,
        required:true,
    },
    img:{
        type:String,
        default:"https://plus.unsplash.com/premium_photo-1680883415362-238794b19dde?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) => v===""? "https://plus.unsplash.com/premium_photo-1680883415362-238794b19dde?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v
    },
    price:{
        type:Number, 
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
        
    
});



listingSchema.post("findOneAndDelete", async(LListing) =>{
    if(LListing){
        await Review.deleteMany({ _id : {$in: LListing.review}})
    }
    
})

const listing = mongoose.model("listing", listingSchema);

module.exports = listing;