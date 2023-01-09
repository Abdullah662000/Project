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
const { find, findById, updateOne } = require("../model/Store");
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
      return res.status(400).json("user already exists");
    }
    const s = await user.save();
    res.status(200).json(s);
  } catch (err) {
    res.status(400).json(err);
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
        res.json(token);
      } else {
        res.status(400).json("email or pass incorrect");
      }
    } else {
      res.status(400).json("email or pass incorrect");
    }
  } catch (err) {
    res.status(400).json(err);
  }
};
// parent store mangement
exports.addParentStore = async (req, res) => {
  try {
    const store = await ParentStore.create(req.body);
    res.status(200).json("store Saved");
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.getParentStore = async (req, res) => {
  try {
    const store = await ParentStore.findById({ _id: req.body.id });
    if (store) {
      res.status(200).json(store);
    } else {
      res.status(404).json("no store found");
    }
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.getAllParentStore = async (req, res) => {
  try {
    const store = await ParentStore.find();
    if (store) {
      res.status(200).json(store);
    }
  } catch (err) {
    res.status(400).json(err);
  }
};
//Store Management
exports.addStore = async (req, res) => {
  try {
    const store = await Store.create(req.body);
    res.status(200).json("store saved");
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.getStore = async (req, res) => {
  try {
    const store = await Store.findById({ _id: req.body.id });
    if (store) {
      res.status(200).json(store);
    } else {
      res.status(404).json("no store found");
    }
  } catch (err) {
    res.json(err);
  }
};
exports.getAllStores = async (req, res) => {
  try {
    const stores = await Store.find();
    res.status(200).json(stores);
  } catch (err) {
    res.json(err);
  }
};
exports.getStoreByCity = async (req, res) => {
  try {
    const store = await Store.find({ locationByCity: req.body.locationByCity });
    if (store) {
      res.status(200).json(store);
    } else {
      res.json(404).json("No Stores in stated city");
    }
  } catch (err) {
    res.status(400).json(err);
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
    res.json(store);
  } catch (err) {
    res.status(400).json(err);
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
      res.json(err);
    } else {
      try {
        const prod = new Product({
          name: req.body.name,
          branchId: req.body.branchId,
          image: {
            data: req.file.filename,
            contentType: "image/png",
          },
          orignalPrice: req.body.orignalPrice,
          offerPrice: req.body.offerPrice,
          offerName: req.body.offerName,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          status: req.body.status,
        });
        const s = await prod.save();
        res.json("product saved").status(200);
      } catch (err) {
        res.status(400).json(err);
      }
    }
  });
};
exports.getSpecProduct = async (req, res) => {
  try {
    const prod = await Product.findById({ _id: req.body.id });
    if (prod) {
      res.status(200).json(prod);
    } else {
      res.status(404).json("Product not found");
    }
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.getAllProducts = async (req, res) => {
  try {
    const prod = await Product.find();

    if (prod) {
      res.status(200).json(prod);
    } else {
      res.status(404).json("No products available");
    }
  } catch (err) {}
};
//offermanagement
// exports.addOffer = async (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       res.json(err);
//     } else {
//       try {
//         const offer = new Offers({
//           name: req.body.name,
//           image: {
//             data: req.file.filename,
//             contentType: "image/png",
//           },
//           price: req.body.price,
//           offerPrice: req.body.offerPrice,
//           startDate: req.body.startDate,
//           endDate: req.body.endDate,
//           storeId: req.body.storeId,
//           productId: req.body.productId,
//         });
//         var endDate = new Date(req.body.endDate);
//         var day = endDate.getDate();
//         var month = endDate.getMonth();
//         var hour = endDate.getHours();
//         var minutes = endDate.getMinutes();
//         var seconds = endDate.getSeconds();
//         var seconds = 10;
//         const s = await offer.save();
//         cron.schedule(`${seconds}  * * * * `, async () => {
//           await Offers.deleteOne({ _id: s._id });
//         });
//         res.status(200).json(s);
//       } catch (err) {
//         console.log(err);
//         res.json(err);
//       }
//     }
//   });
// };
exports.addOfferByBranch = async (req, res) => {
  try {
    const store = await Store.findById({ _id: req.body.id });
    //console.log(store);
    if (store.status == false) {
      const s = await Store.updateOne(
        { _id: store._id },
        {
          $set: {
            offerName: req.body.offerName,
            status: true,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
          },
        }
      );
      var endDate = new Date(req.body.endDate);
      var day = endDate.getDate();
      var month = endDate.getMonth();
      var hour = endDate.getHours();
      var minutes = endDate.getMinutes();
      var seconds = endDate.getSeconds();
      cron.schedule(
        `${seconds} ${minutes} ${hour} ${day} ${month} * `,
        async () => {
          await Store.updateOne(
            { _id: store._id },
            { $set: { status: false } }
          );
        }
      );
      res.status(200).json(s);
    } else {
      res.json("offer already active ");
    }
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.addOfferOnStore = async (req, res) => {
  try {
    const store = await ParentStore.findById({ _id: req.body.id });
    if (store) {
      const stores = await Store.updateMany(
        { storeId: store._id },
        {
          $set: {
            offerName: req.body.offerName,
            status: true,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
          },
        }
      );
      var endDate = new Date(req.body.endDate);
      var day = endDate.getDate();
      var month = endDate.getMonth();
      var hour = endDate.getHours();
      var minutes = endDate.getMinutes();
      var seconds = endDate.getSeconds();
      cron.schedule(
        `${seconds} ${minutes} ${hour} ${day} ${month} * `,
        async () => {
          await Store.updateMany(
            { storeId: store._id },
            { $set: { status: false } }
          );
        }
      );
      res.status(200).json(stores);
    } else {
      res.status(400).json("store not found");
    }
  } catch (err) {
    res.status(400).json(err);
  }
};
// exports.getOffer = async (req, res) => {
//   try {
//     const offer = await Offers.find();
//     if (offer) {
//       res.status(200).json(offer);
//     } else {
//       res.status(404).json("no offers found");
//     }
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };
exports.addOfferOnProduct = async (req, res) => {
  try {
    const prod = await Product.find({ _id: req.body.productId });
    console.log(prod._id);
    if (prod) {
      const p = await Product.updateOne(
        { _id: req.body.productId },
        {
          $set: {
            offerName: req.body.offerName,
            status: true,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
          },
        }
      );
      res.status(200).json(p);
    } else {
      res.status(400).json("product not found");
    }
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.getNearbyOffer = async (req, res) => {
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
    for (let i = 0; i < store.length; i++) {
      if (store[i].status == false) {
        store.splice(i, 1);
      }
    }
    res.status(200).json(store);
  } catch (err) {
    res.status(400).json(err);
  }
};
