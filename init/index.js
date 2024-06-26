const mongoose = require("mongoose");

const initdata = require("./data.js");

const listing = require("../models/listing.js")

const url = "mongodb://127.0.0.1:27017/wanderlust"

main().then(()=>{
    console.log("connected to DB")
}).catch((err)=>{
    console.log(err)
});

async function main(){
   await mongoose.connect(url);
}

const initDB = async() =>{
    await listing.deleteMany({});
    initdata.data= initdata.data.map((obj) => (
        {...obj, owner :"66768e7926156d3313f6e22c"}
    )
    );
    await listing.insertMany(initdata.data);
    console.log("data was initializd");
}

initDB();