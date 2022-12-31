const jwt=require("jsonwebtoken")
const bcrypt =require("bcrypt")
const Store =require("../model/Store")
const Product=require("../model/Product")
// import bcrypt from "bcrypt"
// import jwt from "jsonwebtoken"
// import Store  from "../model/Store"
// import Product from "../model/Product"
// export const addStore=async(req,res)=>{

//     const store = new Store({
//         branchName:req.body.branchName,
//         cordinate:[{longitude:req.body.longitude,lattitude:req.body.lattitude}],
//         locationByCity:req.body.locationByCity,
//         locationByCountry:req.body.locationByCountry,
//         openingTime:req.body.openingTime,
//         closingTime:req.body.closingTime
//     })
//     try{
//     const s= await store.save()
//     res.status(200).send("store saved")
//     }
//     catch(err){
//           res.status(400).send(err)
//     }
// }
// export const addProduct =async(req,res)=>{
//     const prod= new Product({
//         name:req.body.name,
//     })
// }
