const User = require("../models/user.js");

const SendEmail = require("../email.js")





module.exports.forgotPassForm =(req,res) =>{
    res.render("users/forgotPass.ejs")
}

module.exports.forgotPassFunction = async (req,res,next) =>{
    let {username, email} = req.body;
    let selectedList = await User.findOne({username: `${username}`})
    if(selectedList){
        res.render("./listings/newPass.ejs",{selectedList})
    }else{
        res.send("no such user found")
    }
    
}

module.exports.setNewPass = async(req,res)=>{
    let{password} = req.body;
    let{user} = req.params;
    let selectedList = await User.findOne({username: `${user}`})
    selectedList.setPassword(password, (err)=>{
        if(err){
            res.send(err)
        }else{
            selectedList.save();
        }
    })

    await SendEmail(selectedList.email,user);
    req.flash("success","Password successfully changed")
    res.redirect("/login")

}