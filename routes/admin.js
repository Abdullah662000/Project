const router =require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const addStore=require("../controller/adminController")
const Store =require("../model/Store")
const Product =require("../model/Product")
const multer =require("multer")
const fs = require('fs');
// import { Router } from "express"
// const router=Router()
// import bcrypt from "bcrypt"
// import jwt from "jsonwebtoken"
// import addStore from "../controller/adminController"
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../utils/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
var upload = multer({ storage: storage });

router.post("/addStore",async(req,res)=>{

    const store = new Store({
        branchName:req.body.branchName,
        cordinate:[{longitude:req.body.longitude,lattitude:req.body.lattitude}],
        locationByCity:req.body.locationByCity,
        locationByCountry:req.body.locationByCountry,
        openingTime:req.body.openingTime,
        closingTime:req.body.closingTime
    })
    try{
    const s= await store.save()
    res.status(200).send("store saved")
    }
    catch(err){
          res.status(400).send(err)
    }
})
router.post("/addProduct",upload.single('image'),async(req,res)=>{
    
    const prod = new Product({
        name:req.body.name,
        image: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
        ,
        orignalPrice:req.body.orignalPrice,
        offerPrice:req.body.offerPrice,
        storeId:req.body.storeId
    })
    try{
    let s=await prod.save()
    res.status(200).send(s)
    } 
    catch(err){
        res.status(400).send(err)
    }
})
router.get('/', (req, res) => {
    Product.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('imagesPage', { items: items.image });
        }
    });
});
module.exports=router