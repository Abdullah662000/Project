const jwt=require("jsonwebtoken")
const bcrypt =require("bcrypt")
const Store =require("../model/Store")
const Product=require("../model/Product")
// import bcrypt from "bcrypt"
// import jwt from "jsonwebtoken"
// import Store  from "../model/Store"
// import Product from "../model/Product"
// export const addStore=async(req,res)=>{


exports.addStore=async(req,res)=>{
try{
    const store = await Store.create(req.body) 
    res.status(200).send("store saved")
    }
    catch(err){
          res.status(400).send(err)
    }
}
exports.getStore=async(req,res)=>{
    try{
    const store =  await Store.findById({_id:req.body.id})
    res.status(200).send(store)
    }
    catch(err){
        res.send(err)
    }
}
exports.getAllStores=async (req,res)=>{
    try{
     const stores = await Store.find()
     res.status(200).send(stores)
    }
    catch(err){
        res.send(err)
    }
}
exports.getStoreByLocation=async(req,res)=>{
    try{
        const latitude = 28.626137;
        const longitude = 79.821602;
        const distance = 1;
        const unitValue = 1000;
        const stores = await Store.aggregate([{
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                },
                query: { 
                    status: true 
                },
                maxDistance: distance * unitValue,
                distanceField: 'distance',
                distanceMultiplier: 1 / unitValue
            }
        },
        {
            $project: {
                _id: 1, 
                distance: 1
            }
        },
        {
            $sort: {
                distance: 1
            }
        },
        { $limit: 5 }])
        res.status(200).send(stores)

    }
    catch(err){
      res.status(400).send(err)
    }
}
// export const addProduct =async(req,res)=>{
//     const prod= new Product({
//         name:req.body.name,
//     })
// }
