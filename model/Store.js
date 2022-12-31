const mongoose=require("mongoose");
const schema =mongoose.Schema({
    branchName:String,
    cordinate:[
        {longitude:Number,lattitude:Number}
    ],
    locationByCity:{type:String,required:true},
    locationByCountry:{type:String,required:true},
    openingTime:{type:Date,required:false},
    closingTime:{type:Date,required:false}
})
module.exports=mongoose.model("Store",schema)