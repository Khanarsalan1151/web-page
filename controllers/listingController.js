const listing = require("../models/listing.js")



module.exports.index = async(req,res) =>{
    const printinglistings =await listing.find({})
    res.render("listings/index.ejs",{printinglistings})
};


module.exports.renderNewForm = (req,res)=>{
    res.render("listings/form.ejs");
}

module.exports.showIndividualListing = async (req,res)=>{
    let {id} = req.params;
    const selectedList =  await listing.findById(`${id}`)
    .populate({path: "reviews",
        populate:{
            path:"author"
        }
    })
    .populate("owner")


    if(!selectedList){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings")
    }else{
        res.render("listings/show.ejs", {selectedList});
    }
    
};


module.exports.createNewList = async (req,res,next)=>{

    let{title, description, img, price, country, location} = req.body;
  
    const newlisting = new listing({
    title:title,
    description:description,
    img:img,
    price:price,
    location:location,
    country:country,
    });

    newlisting.owner = req.user._id;
    // PAssport by default req.user mein info aayega usko hum ._id ko addd kr diya

    await newlisting.save();

    req.flash("success","New list has been created")

    res.redirect("/listings");  
}


module.exports.editListForm = async (req,res)=>{
    let{id}= req.params;

    let selectedList = await listing.findById(`${id}`);

    if(!selectedList){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings")
    }else{
        res.render("listings/updateform.ejs",{selectedList})
    };

    
}

module.exports.editList= async (req,res)=>{
    let {id} = req.params;
    let{title : newTitle, description : newDescription, img: newImg, price: newPrice, country: newCountry, location: newLocation} = req.body;
    
    await listing.findByIdAndUpdate(id, {
        title:newTitle,
        description: newDescription,
        img:newImg,
        price:newPrice,
        location:newLocation,
        country:newCountry,
    });


    req.flash("success","List updated");
    res.redirect("/listings");

};

module.exports.deleteList = async (req,res)=>{
    let {id} = req.params;
    let{title : newTitle, description : newDescription, img: newImg, price: newPrice, country: newCountry, location: newLocation} = req.body;
    
    await listing.findByIdAndUpdate(id, {
        title:newTitle,
        description: newDescription,
        img:newImg,
        price:newPrice,
        location:newLocation,
        country:newCountry,
    });


    req.flash("success","List updated");
    res.redirect("/listings");

}