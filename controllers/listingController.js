const listing = require("../models/listing.js")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken : mapToken });

module.exports.index = async(req,res) =>{
    const printingListings =await listing.find({})
    res.render("listings/index.ejs",{printingListings})
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
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listings.location,
        limit: 1
    }).send()
    
    let url = req.file.path;

    let filename = req.file.filename;  

    const newlisting = new listing(req.body.listings);

    newlisting.owner = req.user._id;

    newlisting.img={url,filename};

    // PAssport by default req.user mein info aayega usko hum ._id ko addd kr diya
    newlisting.geometry= response.body.features[0].geometry;
    
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
        let originalImageurl = selectedList.img.url

        originalImageurl = originalImageurl.replace("/upload","/upload/w_250")
        console.log(originalImageurl)
        res.render("listings/updateform.ejs",{selectedList, originalImageurl})
    };

    
}

module.exports.editList= async (req,res)=>{
    let {id} = req.params;    
    let newlisting = await listing.findByIdAndUpdate(id, {...req.body.listings});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        newlisting.img ={url,filename};
        newlisting.save();
    }

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

};

module.exports.Search = async (req,res) =>{
    let {place} = req.query
    let printingListings = await listing.find({$or:[
        {location: {$regex : `${place}`, $options:"i"  }},
        {title: {$regex : `${place}`, $options:"i"  }},
        {country: {$regex : `${place}`, $options:"i"  }},
    ]})
    if(printingListings[0]){
        res.render("./listings/index.ejs",{printingListings})
    }else{
        req.flash("error","No such Place List found")
        res.redirect("/listings")
    }
    
}