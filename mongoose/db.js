const mongoose = require("mongoose");

require("dotenv").config();
mongoose.connect(process.env.MONGODBURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("Connected to mongodb");
})
.catch((err)=>{
    console.log(err,"Error");
});