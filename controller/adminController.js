const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Store = require("../model/Store");
const Product = require("../model/Product");
const Admin = require("../model/Admin");
const multer = require("multer");
const path = require("path");
//Admin login Signup
exports.adminSignup = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash(req.body.password, salt);
    const user = new Admin({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashpass,
    });
    const find = await Admin.findOne({ email: req.body.email });
    if (find) {
      return res.status(400).send("user already exists");
    }
    const s = await user.save();
    res.status(200).send(s);
  } catch (err) {
    res.status(400).send(err);
  }
};
exports.adminSignin = async (req, res) => {
  try {
    const user = await Admin.findOne({ email: req.body.email });
    if (user) {
      const pass = await bcrypt.compare(req.body.password, user.password);
      if (pass) {
        const token = await jwt.sign(
          { _id: user._id },
          process.env.TOKEN_SECRET
        );
        res.header(token, "auth-token");
        res.send(token);
      } else {
        res.status(400).send("email or pass incorrect");
      }
    } else {
      res.status(400).send("email or pass incorrect");
    }
  } catch (err) {
    res.status(400).send(err);
  }
};
//Store Management
exports.addStore = async (req, res) => {
  try {
    const store = await Store.create(req.body);
    res.status(200).send("store saved");
  } catch (err) {
    res.status(400).send(err);
  }
};
exports.getStore = async (req, res) => {
  try {
    const store = await Store.findById({ _id: req.body.id });
    res.status(200).send(store);
  } catch (err) {
    res.send(err);
  }
};
exports.getAllStores = async (req, res) => {
  try {
    const stores = await Store.find();
    res.status(200).send(stores);
  } catch (err) {
    res.send(err);
  }
};
exports.getStoreByLocation = async (req, res) => {
  try {
    const latitude = 28.626137;
    const longitude = 79.821602;
    const distance = 1;
    const unitValue = 1000;
    const stores = await Store.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          query: {
            status: true,
          },
          maxDistance: distance * unitValue,
          distanceField: "distance",
          distanceMultiplier: 1 / unitValue,
        },
      },
      {
        $project: {
          _id: 1,
          distance: 1,
        },
      },
      {
        $sort: {
          distance: 1,
        },
      },
      { $limit: 5 },
    ]);
    res.status(200).send(stores);
  } catch (err) {
    res.status(400).send(err);
  }
};
const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: Storage }).single("testImage");
//Products Management
exports.addProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      res.send(err);
    } else {
      try {
        const prod = new Product({
          name: req.body.name,
          image: {
            data: req.file.filename,
            contentType: "image/png",
          },
          orignalPrice: req.body.orignalPrice,
          offerPrice: req.body.offerPrice,
          storeId: req.body.storeId,
        });
        const s = await prod.save();
        res.send(s).status(200);
      } catch (err) {
        res.status(400).send(err);
      }
    }
  });
};
exports.getSpecProduct = async (req, res) => {
  try {
    const prod = await Product.findById({ _id: req.body.id });
    if (prod) {
      res.status(200).send(prod);
    } else {
      res.status(404).send("Product not found");
    }
  } catch (err) {
    res.status(400).send(err);
  }
};
exports.getAllProducts = async (req, res) => {
  try {
    const prod = await Product.find();
    console.log(prod);
    if (prod) {
      res.status(200).send(prod);
    } else {
      res.status(404).send("No products available");
    }
  } catch (err) {}
};

// export const addProduct =async(req,res)=>{
//     const prod= new Product({
//         name:req.body.name,
//     })
// }
