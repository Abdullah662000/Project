const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Store = require("../model/Branch");
const ParentStore = require("../model/Store");
const Product = require("../model/Product");
const Admin = require("../model/Admin");
const multer = require("multer");
// const Deal = require("../model/Deal")
const Offers = require("../model/Offers");
const cron = require("node-cron");
const ProductInStore = require("../model/ProductInStore");
const { find, findById, updateOne } = require("../model/Store");
const Category = require("../model/Category");
const Branch = require("../model/Branch");
const Deal = require("../model/Deal");
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
exports.getCategories = async (req, res) => {
  try {

    const find = await Category.find();
    if (find.length > 0) {
      res.status(200).json({
        status: "200",
        categories: find,
      });
    }
    else {
      res.status(200).json({
        status: "200",
        message: "not found",
        categories: find,
      });
    }


  } catch (err) {
    res.status(400).json({
      status: "400",
      error: err,
    });
  }
};
exports.getBranchesByStoreId = async (req, res) => {
  try {

    const find = await Branch.find({ storeId: req.params.storeId });
    if (find.length > 0) {
      res.status(200).json({
        status: "200",
        branches: find,
      });
    }
    else {
      res.status(200).json({
        status: "200",
        message: "not found",
        branches: find,
      });
    }


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
    console.log(
      req.file.path
    );
    let text = req.file.path
    let text2 = text.split("uploads")
    let text3 = "uploads\\" + text2[1];
    console.log(text3);
    const obj = {
      storeImage: text3,
      storeName: req.body.storeName
    }
    const store = await ParentStore.create({ ...obj });
    res.status(200).json({
      status: "200",
      message: "store saved",
      store,
    });
  } catch (err) {
    console.log(err);
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
    // const [lat, long] = JSON.parse(req.body.coordinates);
    // let coordinate = JSON.parse(req.body.coordinates);
    // const store = new Store({
    //   storeId: req.body.storeId,
    //   branchId: req.body.branchId,
    //   image: req.files[0].path,
    //   location: JSON.parse(req.body.location),
    //   locationByCity: req.body.locationByCity,
    //   locationByCountry: req.body.locationByCountry,
    //   openingTime: req.body.openingTime,
    //   closingTime: req.body.closingTime,
    //   startDate: req.body.startDate,
    //   endDate: req.body.endDate,
    //   status: req.body.status,
    // });
    // console.log(req.file.path);
    const s = await Store.create({ ...req.body });
    res
      .json({
        status: "200",
        product: s,
        message: "branch saved",
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
    const stores = await Store.find().populate("storeId");
    res.status(200).json({
      status: "200",
      stores: stores,
    });
  } catch (err) {
    res.json(err);
  }
};
exports.getAllDeals = async (req, res) => {
  try {
    const stores = await Deal.find().populate("storeId");
    console.log(stores);
    if (stores.length > 0) {


      res.status(200).json({
        status: "200",
        deals: stores,
      });
    }
    else {

      res.status(200).json({
        status: "200",
        message: "Not Found"
      });
    }
  } catch (err) {
    res.json(err);
  }
};
exports.getProductsByStore = async (req, res) => {
  try {
    const products = await ProductInStore.find({ storeId: req.params.storeId }).populate("productId");
    if (products.length > 0) {


      res.status(200).json({
        status: "200",
        products: products,
      });
    }
    else {

      res.status(200).json({
        status: "200",
        message: "Not Found"
      });
    }
  } catch (err) {
    res.json(err);
  }
};
exports.getProductById = async (req, res) => {
  try {
    const products = await Product.findOne({ productId: req.params.productId });
    if (products) {


      res.status(200).json({
        status: "200",
        products: products,
      });
    }
    else {

      res.status(200).json({
        status: "200",
        message: "Not Found"
      });
    }
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
exports.getAllOffersData = async (req, res) => {
  try {
    const data = await Offers.find().populate({ path: "dealId", select: "name status" }).populate({ path: "storeId", select: "storeName" }).populate({ path: "productId", select: "image name orignalPrice" }).populate({ path: "branchId", select: "branchName" });
    if (data.length > 0) {
      res.status(200).json({
        status: "200",
        data: data,
      });
    } else {
      res.json(404).json({
        status: 404,
        message: "no data found",
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
exports.addCategory = async (req, res) => {
  try {



    const resp = await Category.create({ ...req.body })

    if (resp) {
      res.status(200).json({
        status: "200",
        resp,
        message: 'Category Added'
      })
    }
  }
  catch (e) {
    console.log(e);
    res.status(400).json({
      e,
      message: "Category Not Added"
    })
  }
}
exports.addDeal = async (req, res) => {
  try {
    // console.log(JSON.parse(req.body.location));
    let text = req.file.path
    let text2 = text.split("uploads")
    let text3 = "uploads\\" + text2[1];
    const obj = {
      ...req.body,
      // location: JSON.parse(req.body.location),
      image: text3
    }
    console.log(req.body);
    const resp = await Deal.create({ ...obj })

    // var endDate = new Date(req.body.toDate);
    // var day = toDate.getDate();
    // var month = toDate.getMonth();
    // var hour = toDate.getHours();
    // var minutes = toDate.getMinutes();
    // var seconds = toDate.getSeconds();
    // cron.schedule(
    //   `${seconds} ${minutes} ${hour} ${day} ${month} * `,
    //   async () => {
    //     await Deal.updateOne(
    //       { _id: resp._id },
    //       { $set: { status: false } }
    //     );
    //   }
    // );
    if (!!resp) {
      res.status(200).json({
        status: "200",
        resp,
        message: 'Deal Created'
      })
    }
  }
  catch (e) {
    console.log(e);
    res.status(400).json({
      e,
      message: "Deal Not Created"
    })
  }

}
exports.addProductToStore = async (req, res) => {
  try {
    console.log(req.body);
    let array = [];
    for (i of req?.body?.storeId) {
      array.push({ productId: req?.body?.productId, storeId: i })
    }
    const s = await ProductInStore.create([...array]);
    res
      .json({
        status: "200",
        product: s,
        message: "product saved to branch",
      })
      .status(200);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "400",
      error: err,
    });
  }
}



exports.addProduct = async (req, res) => {
  try {
    let text = req.file.path
    let text2 = text.split("uploads")
    let text3 = "uploads\\" + text2[1];
    const s = await Product.create({ ...req.body, image: text3 });
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
// exports.getProdByStoreId = async (req, res) => {
//   try {
//     const products = await Product.find({ storeId: req.body.branchId });
//     if (products) {
//       res.status(200).json({
//         status: "200",
//         products: products,
//       });
//     } else {
//       res.status(404).json({
//         status: "404",
//         message: "no prods found",
//       });
//     }
//   } catch (err) {
//     res.status(400).json({
//       status: "400",
//       error: err,
//     });
//   }
// };
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
    if (store.status == false) {
      const s = await Store.updateOne(
        { _id: store._id },
        {
          $set: {
            offerName: req.body.offerName,
            offerImage: req.files[0].path,
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
        message: "offer already active",
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
            offerImage: req.files[0].path,
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
exports.addOffer = async (req, res) => {
  try {

    // console.log(req.body)
    let array = [];
    for (i of req?.body?.branchId) {
      array.push({ ...req.body, branchId: i })
    }
    console.log(array);
    const p = await Offers.create([...array])
    if (p) {


      res.status(200).json({
        status: "200",
        product: p,
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
