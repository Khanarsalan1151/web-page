// const listing = require("../models/listing.js")
// // const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// // const mapToken = process.env.MAP_TOKEN;
// // const geocodingClient = mbxGeocoding({accessToken : mapToken });

module.exports.index = async(req,res) =>{
    // const printingListings =await listing.find({})
    res.render("listings/index.ejs")
};


// module.exports.renderNewForm = (req,res)=>{
//     res.render("listings/form.ejs");
// }




module.exports.createNewList = async (req,res,next)=>{
    req.flash("success","New list has been created")
    res.redirect("/listings");  
}



