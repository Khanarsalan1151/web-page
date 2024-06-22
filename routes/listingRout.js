const express= require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");






// Joi validation using function as a middleware
const validatelisting = (req,res,next)=>{
    let {error}= listingSchema.validate(req.body);

    if(error){
        let errordetailes = error.details.map((el)=> el.message).join(",")
        throw new ExpressError(400, error)
    }else{
        next();
    }

}



// Index  route
router.get("/", wrapAsync(async (req,res)=>{
    const printinglistings =await listing.find({})
    res.render("listings/index.ejs",{printinglistings})
}));



// Create route
router.post("/", validatelisting, wrapAsync(async (req,res,next)=>{

    let{title, description, img, price, country, location} = req.body;
  
    const newlisting = new listing({
    title:title,
    description:description,
    img:img,
    price:price,
    location:location,
    country:country,
    });

    await newlisting.save();

    req.flash("success","New list has been created")

    res.redirect("/listings");  
}));





// Create new route form
router.get("/new", wrapAsync((req,res)=>{
    res.render("listings/form.ejs");
}));






// Show individual Route
router.get("/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const selectedList =  await listing.findById(`${id}`).populate("reviews")
  
    if(!selectedList){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings")
    }else{
        res.render("listings/show.ejs", {selectedList});
    }
    
}));




router.get("/:id/edit", wrapAsync(async (req,res)=>{
    let{id}= req.params;

    let selectedList = await listing.findById(`${id}`);

    if(!selectedList){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings")
    }else{
        res.render("listings/updateform.ejs",{selectedList})
    }

    
}))





router.patch("/:id",validatelisting, wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let{title : newTitle, description : newDescription, img: newImg, price: newPrice, country: newCountry, location: newLocation} = req.body;

    await listing.findByIdAndUpdate(id, {
        title:newTitle,
        description: newDescription,
        img:newImg,
        price:newPrice,
        location:newLocation,
        country:newCountry,
    })


    req.flash("success","List updated")
    res.redirect("/listings")

}))


// idhr each middleware call hogga listing .js ak

router.delete("/:id/remove",wrapAsync( async (req,res)=>{
    let {id} = req.params;
    await listing.findByIdAndDelete(id);

    req.flash("success","Your list has been succesfully deleted")

    res.redirect("/listings")
}))


module.exports= router