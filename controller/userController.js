const User =require("../model/User")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.userSignup=async(req,res)=>{
    try{
        const salt = await bcrypt.genSalt(10);
        const hashpass = await bcrypt.hash(req.body.password, salt);
        const user = new User({
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.body.email,
            password:hashpass
        })
        const find = await User.findOne({email:req.body.email})
        if(find){
            return res.status(400).send("user already exists");
        }
         const s= await user.save()
         res.status(200).send(s)
    }
    catch(err){
        res.status(400).send(err)

    }
}