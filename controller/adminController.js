const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Store = require("../model/Store");
const ParentStore = require("../model/ParentStore");
const Product = require("../model/Product");
const Admin = require("../model/Admin");
const multer = require("multer");
//
const Offers = require("../model/Offers");
const cron = require("node-cron");
const { find } = require("../model/Store");
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
// parent store mangement
exports.addParentStore = async (req, res) => {
  try {
    const store = await ParentStore.create(req.body);
    res.status(200).send("store Saved");
  } catch (err) {
    res.status(400).send(err);
  }
};
exports.getParentStore = async (req, res) => {
  try {
    const store = await ParentStore.findById({ _id: req.body.id });
    if (store) {
      res.status(200).send(store);
    } else {
      res.status(404).send("no store found");
    }
  } catch (err) {
    res.status(400).send(err);
  }
};
exports.getAllParentStore = async (req, res) => {
  try {
    const store = await ParentStore.find();
    if (store) {
      res.status(200).send(store);
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
    if (store) {
      res.status(200).send(store);
    } else {
      res.status(404).send("no store found");
    }
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
exports.getStoreByCity = async (req, res) => {
  try {
    const store = await Store.find({ locationByCity: req.body.locationByCity });
    if (store) {
      res.status(200).send(store);
    } else {
      res.send(404).send("No Stores in stated city");
    }
  } catch (err) {
    res.status(400).send(err);
  }
};
exports.getStoreByLocation = async (req, res) => {
  try {
    const { lattitude, longnitude } = req.body;
    const options = {
      location: {
        $geoWithin: {
          $centerSphere: [[lattitude, longnitude], 3.106 / 3963.2],
        },
      },
    };
    const store = await Store.find(options);
    res.send(store);
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

    if (prod) {
      res.status(200).send(prod);
    } else {
      res.status(404).send("No products available");
    }
  } catch (err) {}
};
//offermanagement
exports.addOffer = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      res.send(err);
    } else {
      try {
        const offer = new Offers({
          name: req.body.name,
          image: {
            data: req.file.filename,
            contentType: "image/png",
          },
          price: req.body.price,
          offerPrice: req.body.offerPrice,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          storeId: req.body.storeId,
          productId: req.body.productId,
        });
        var endDate = new Date(req.body.endDate);
        var day = endDate.getDate();
        var month = endDate.getMonth();
        var hour = endDate.getHours();
        var minutes = endDate.getMinutes();
        var seconds = endDate.getSeconds();
        var seconds = 10;
        const s = await offer.save();
        cron.schedule(`${seconds}  * * * * `, async () => {
          await Offers.deleteOne({ _id: s._id });
        });
        res.status(200).send(s);
      } catch (err) {
        console.log(err);
        res.send(err);
      }
    }
  });
};
exports.getOffer = async (req, res) => {
  try {
    const offer = await Offers.find();
    if (offer) {
      res.status(200).send(offer);
    } else {
      res.status(404).send("no offers found");
    }
  } catch (err) {
    res.status(400).send(err);
  }
};
