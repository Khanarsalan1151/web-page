module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        req.flash("error","You must be login");
        res.redirect("/listings")
    }
    next();
};



module.exports.isLoggedInsidelist = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You must be login");
        res.redirect(`back`)
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}