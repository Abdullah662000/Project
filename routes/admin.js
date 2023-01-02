const router =require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {addStore,getStore,getAllStores,getStoreByLocation}=require("../controller/adminController")
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

router.post("/addStore",addStore)
router.get("/getStore",getStore)
router.get("/getAllStores",getAllStores)
router.get("/getStoreByLocation",getStoreByLocation)
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