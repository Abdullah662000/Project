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
    res.status(200).json({
      status: "200",
      admin: s,
    });
  } catch (err) {
    res.status(400).json({
      status: "400",
      error: err,
    });
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
        const { firstName, lastName, email, _id } = user;
        res.header(token, "auth-token");
        res.status(200).json({
          status: "200",
          firstName,
          lastName,
          email,
          _id,
          token: token,
        });
      } else {
        res.status(400).json({
          status: "400",
          message: "Email or pass incorrect",
        });
      }
    } else {
      res.status(400).json({
        status: "400",
        message: "Email or password ",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "400",
      error: err,
    });
  }
};
// parent store mangement
exports.addParentStore = async (req, res) => {
  try {
    const store = await ParentStore.create(req.body);
    res.status(200).json({
      status: "200",
      message: "store saved",
    });
  } catch (err) {
    res.status(400).json({
      status: "400",
      error: err,
    });
  }
};
exports.getParentStore = async (req, res) => {
  try {
    const store = await ParentStore.findById({ _id: req.body.id });
    if (store) {
      res.status(200).json({
        status: "200",
        store: store,
      });
    } else {
      res.status(404).json({
        status: 404,
        message: "store not found",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "400",
      error: err,
    });
  }
};
exports.getAllParentStore = async (req, res) => {
  try {
    const store = await ParentStore.find();
    if (store) {
      res.status(200).json({
        status: "200",
        stores: store,
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "400",
      error: err,
    });
  }
};
//Store Management
exports.addStore = async (req, res) => {
  try {
    // let coordinates = JSON.parse(req.body.coordinates);
    // console.log(req.files[0].path);
    const [lat, long] = JSON.parse(req.body.coordinates);
    let coordinate = JSON.parse(req.body.coordinates);
    const store = new Store({
      storeId: req.body.storeId,
      branchId: req.body.branchId,
      image: req.files[0].path,
      location: { coordinates: [lat, long] },
      locationByCity: req.body.locationByCity,
      locationByCountry: req.body.locationByCountry,
      openingTime: req.body.openingTime,
      closingTime: req.body.closingTime,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      status: req.body.status,
    });
    const s = await store.save();
    res
      .json({
        status: "200",
        product: s,
        message: "store saved",
      })
      .status(200);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "400",
      error: err,
    });
  }
};

exports.getStore = async (req, res) => {
  try {
    const store = await Store.findById({ _id: req.body.id });
    if (store) {
      res.status(200).json({
        status: "200",
        store: store,
      });
    } else {
      res.status(404).json({
        status: 404,
        message: "no store found",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "400",
      error: err,
    });
  }
};
exports.getAllStores = async (req, res) => {
  try {
    const stores = await Store.find();
    res.status(200).json({
      status: "200",
      stores: stores,
    });
  } catch (err) {
    res.json(err);
  }
};
exports.getStoreByCity = async (req, res) => {
  try {
    const store = await Store.find({ locationByCity: req.body.locationByCity });
    if (store) {
      res.status(200).json({
        status: "200",
        store: store,
      });
    } else {
      res.json(404).json({
        status: 404,
        message: "no store found in stated area",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "400",
      error: err,
    });
  }
};
exports.getStoreByLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const query = {
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: 1 * 6000,
        },
      },
    };
    // const options = {
    //   location: {
    //     $geoWithin: {
    //       $centerSphere: [[lattitude, longnitude], 3.106 / 3963.2],
    //     },
    //   },
    // };
    const store = await Store.find(options);
    res.status(200).json({
      status: "200",
      store: store,
    });
  } catch (err) {
    res.status(400).json({
      status: "400",
      error: err,
    });
  }
};
// const Storage = multer.diskStorage({
//   destination: "uploads",
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });
// exports.upload = multer({ storage: Storage }).single("testImage");
//Products Management
exports.addProduct = async (req, res) => {
  try {
    const store = await Store.findById({ _id: req.body.branchId });
    let coordinates = store.location.coordinates;
    const prod = new Product({
      name: req.body.name,
      branchId: req.body.branchId,
      image: req.files[0].path,
      location: {
        coordinates: coordinates,
      },
      orignalPrice: req.body.orignalPrice,
      offerPrice: req.body.offerPrice,
      offerName: req.body.offerName,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      status: req.body.status,
      orignalPrice: req.body.orignalPrice,
    });

    const s = await prod.save();
    res
      .json({
        status: "200",
        product: s,
        message: "product saved",
      })
      .status(200);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "400",
      error: err,
    });
  }
};

exports.getSpecProduct = async (req, res) => {
  try {
    const prod = await Product.findById({ _id: req.body.id });
    if (prod) {
      res.status(200).json({
        status: "200",
        product: prod,
      });
    } else {
      res.status(404).json({
        status: 404,
        message: "product not found",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "400",
      error: err,
    });
  }
};
exports.getAllProducts = async (req, res) => {
  try {
    const prod = await Product.find();

    if (prod) {
      res.status(200).json({
        status: "200",
        products: prod,
      });
    } else {
      res.status(404).json({
        status: "404",
        message: "no products found",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "400",
      error: err,
    });
  }
};
exports.getProdByBranchId = async (req, res) => {
  try {
    const products = await Product.find({ branchId: req.body.branchId });
    if (products) {
      res.status(200).json({
        status: "200",
        products: products,
      });
    } else {
      res.status(404).json({
        status: "404",
        message: "no prods found",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "400",
      error: err,
    });
  }
};
exports.getNearbyProducts = async (req, res) => {
  try {
    const { lng, lat } = req.body;
    console.log(lng);
    const query = {
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: 1 * 6000,
        },
      },
    };

    // const options = {
    //   location: {
    //     $geoWithin: {
    //       $centerSphere: [[lattitude, longnitude], 3.106 / 3963.2],
    //     },
    //   },
    // };
    const products = await Product.find(query);
    if (products) {
      res.status(200).json({
        status: "200",
        products: products,
      });
    } else {
      res.status(404).json({
        status: "404",
        message: "no prods found",
      });
    }

    // let products = null;
    // let store = await Store.find(options);
    // for (let i = 0; i < store.length; i++) {
    //   if (store[i].status == false) {
    //     store.splice(i, 1);
    //   } else {
    //     let storeID;
    //     storeID = JSON.parse(JSON.stringify(store[i]._id));
    //     let prod = await Product.find({ branchId: storeID });
    //     console.log(prod);
    //     if (products == null) {
    //       products = new Array();
    //     }
    //     if (!prod) {
    //       if (prod[i].status == true) {
    //         products.push(prod);
    //       }
    //     }
    //   }
    // }
    // if (products) {
    //   res.status(200).json({
    //     status: "200",
    //     products: products,
    //   });
    // } else {
    //   res.status(404).json({
    //     status: "404",
    //     message: "no products found",
    //   });
    // }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "400",
      error: err,
    });
  }
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
//         res.status("200").json(s);
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
      res.status(200).json({
        status: "200",
        stores: s,
      });
    } else {
      res.json({
        status: "400",
        message: "no store found",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "400",
      error: err,
    });
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
      res.status(200).json({
        status: 200,
        stores: stores,
      });
    } else {
      res.status(400).json({
        status: "400",
        message: "stores not found",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "400",
      error: err,
    });
  }
};
// exports.getOffer = async (req, res) => {
//   try {
//     const offer = await Offers.find();
//     if (offer) {
//       res.status("200").json(offer);
//     } else {
//       res.status(404).json("no offers found");
//     }
//   } catch (err) {
//     res.status("400").json(err);
//   }
// };
exports.addOfferOnProduct = async (req, res) => {
  try {
    const prod = await Product.find({ _id: req.body.productId });
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
      res.status(200).json({
        status: "200",
        product: p,
      });
    } else {
      res.status(400).json({
        status: "400",
        message: "product not found",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "400",
      error: err,
    });
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
    res.status(200).json({
      status: "200",
      store: store,
    });
  } catch (err) {
    res.status(400).json({
      status: "400",
      error: err,
    });
  }
};
//
