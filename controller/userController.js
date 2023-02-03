const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const FavProduct = require("../model/FavProduct");
const FavStore = require("../model/FavStore");
const Deals = require("../model/Deal")
const Offers = require("../model/Offers")
const productModel = require("../model/Product");
const mongoose = require("mongoose");
const Product = require("../model/Product");
const ProductInBranch = require("../model/ProductInBranch");
const Branch = require("../model/Branch");
const Deal = require("../model/Deal");

const ObjectId = require('mongodb').ObjectID
//User Sign in Sign up
exports.userSignup = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash(req.body.password, salt);
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashpass,
    });
    const find = await User.findOne({ email: req.body.email });
    if (find) {
      return res.status(400).json({
        status: "400",
        message: "user already exists",
      });
    }
    const s = await user.save();
    res.status(200).json({
      status: "200",
      user: s,
    });
  } catch (err) {
    res.status(400).json({
      status: "400",
      error: err,
    });
  }
};
exports.getBranchesOnBaseOfProductAndStore = async (req, res) => {

  try {
    const products = await Offers.find({ ...req.body }).populate("branchId").populate("productId");

    // console.log(result);
    if (products.length > 0) {
      res.status(200).json({
        "message": "Found",
        status: "200",
        products,

      })
    }
    else {
      res.status(200).json({
        "message": "Products Not Found",
        status: "200",
      })
    }

  }
  catch (e) {
    console.log(e);
    res.status(400).json({

      error: e.message
    })
  }

}





exports.searchProductFormDifferentStores = async (req, res) => {

  try {
    const products = await Product.find({ "name": { "$regex": req.body.name, "$options": "i" } });
    const result = await searchProducts(products);
    // console.log(result);
    if (products.length > 0) {
      res.status(200).json({
        "message": "Found",
        status: "200",

        result
      })
    }
    else {
      res.status(200).json({
        "message": "Products Not Found",
        status: "200",
      })
    }

  }
  catch (e) {
    console.log(e);
    res.status(400).json({

      error: e.message
    })
  }

}
async function searchProducts(products) {
  let obj = [];
  const data = await Promise.all(products.map(async (ele) => {
    const result = await ProductInBranch.find({ productId: ele._id });
    for (let i of result) {

      obj.push(i);
    }


  }))
  console.log(obj);
  let arry = [];


  const data1 = await Promise.all(obj.map(async (ele) => {
    // return ele.branchId.storeId;
    const result = await Branch.findOne({ _id: ele.branchId });
    console.log("123");
    // console.log(e);
    if (!arry.find(el => el?.storeId.toString() === result?.storeId.toString() && el?.productId.toString() === ele?.productId.toString())) {
      arry.push({ storeId: result?.storeId.toString(), productId: ele?.productId.toString() });
    }
    // return result?.storeId;

  }))
  console.log(arry);

  // console.log(data1);
  let arry1 = [];
  const data3 = await Promise.all(arry.map(async (ele, i) => {

    const result = await Deal.findOne({ status: true, storeId: ele.storeId });
    return !!result && arry[i]
    // return await ProductInBranch.find({ productId: ele._id }).populate("branchId");

  }))
  // console.log(data3);
  const data4 = await Promise.all(data3.map(async (ele) => {

    const result = await Offers.findOne({ storeId: ele.storeId, productId: ele.productId }).populate("productId").populate("storeId");
    return !!result && result
    // return await ProductInBranch.find({ productId: ele._id }).populate("branchId");

  }))
  // console.log(data4);
  // console.log(data1);
  return data4;
  // console.log(data);



}

exports.getNearbyDealsStores = async (req, res) => {
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
      status: true
    };
    const deals = await Deals.find(query).populate("storeId");



    // console.log(result);
    if (deals.length > 0) {
      res.status(200).json({
        status: "200",
        deals: deals,
      });
    } else {
      res.status(200).json({
        status: "200",
        message: "no deals found",
      });
    }
  }
  catch (e) {
    console.log(e);
    res.status(400).json({
      status: "404",
      message: "no deals found",
    });
  }


}


exports.getNearbyDealsBranches = async (req, res) => {
  try {
    const { lng, lat, dealId } = req.body;
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
      dealId: dealId
    };
    const deals = await Offers.find(query).populate("branchId").populate({ path: "productId", populate: { path: "categoryId" } });
    // const result = await findDeals(deals);

    console.log(deals);
    if (deals.length > 0) {
      res.status(200).json({
        status: "200",
        deals: deals,
      });
    } else {
      res.status(200).json({
        status: "200",
        message: "no deals found",
      });
    }
  }
  catch (e) {
    res.status(400).json({
      status: "404",
      message: "no deals found",
    });
  }


}

exports.getNearbyDealsProducts = async (req, res) => {
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
      status: true
    };
    const deals = await Deals.find(query);
    const result = await findDeals(deals);

    console.log(result);
    if (result.length > 0) {
      res.status(200).json({
        status: "200",
        deals: result,
      });
    } else {
      res.status(200).json({
        status: "200",
        message: "no deals found",
      });
    }
  }
  catch (e) {
    res.status(400).json({
      status: "404",
      message: "no deals found",
    });
  }


}

async function findDeals(deals) {

  const data = await Promise.all(deals.map(async (ele) => {
    return await Offers.find({ dealId: ele._id }).populate("productId");

  }))
  return data;
  // console.log(data);



}
exports.userSignin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
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
          message: "email or pass incorrect",
        });
      }
    } else {
      res.status(400).json({
        status: "400",
        message: "email or pass incorrect",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "400",
      error: err,
    });
  }
};
//Fav Product
exports.addFavProduct = async (req, res) => {
  try {
    const favProd = new FavProduct({
      userId: req.body.userId,
      productId: req.body.productId,
    });
    await favProd.save();
    res.status(200).json({
      status: "200",
      message: "product added to fav",
      favProd
    });
  } catch (err) {
    res.status(400).json({
      status: "400",
      error: err,
    });
  }
};
exports.getFavProduct = async (req, res) => {
  try {
    const favProd = await FavProduct.find({
      _id: req.body.id,
    });
    if (favProd) {
      res.status(200).json({
        status: "200",
        favProd: favProd,
      });
    } else {
      res.status(404).json({
        status: "404",
        message: "no fav prods found",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "400",
      error: err,
    });
  }
};
exports.getAllFavProduct = async (req, res) => {
  try {
    // const prod = await FavProduct.find({ userId: req.body.userId });
    // console.log(prod);
    const prod1 = await FavProduct.aggregate([
      {
        $match: {
          userId: req.body.userId
        }
      },
      {
        $lookup:
        {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'inventory_docs'
        }
      }
    ])
    console.log(prod1);
    if (prod1.length > 0) {
      // for (let i = 0; i < prod.length; i++) {
      //   let data = await productModel.findOne({ branchId: prod[i].productId });
      //   console.log(data);
      //   if (data !== null) {
      //     prod[i].productDetails = data;
      //   }
      // }
      // console.log(prod);
      res.status(200).json({
        status: "200",
        favProds: prod1,
      });
    } else {

      res.status(404).json({
        status: "404",
        message: "no fav prods found",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "400",
      error: err,
    });
  }
};
exports.deleteFavProduct = async (req, res) => {
  try {
    const prod = await FavProduct.deleteOne({
      _id: req.body.id,
    });
    if (prod) {
      res.status(200).json({
        status: "200",
        prod: prod,
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "400",
      error: err,
    });
  }
};
//Fav Store
exports.addFavStore = async (req, res) => {
  try {
    const favstore = new FavStore({
      userId: req.body.userId,
      storeId: req.body.storeId,
    });
    await favstore.save();
    res.status(200).json({
      status: "200",
      message: "store added to fav",
      favstore
    });
  } catch (err) {
    res.status(400).json({
      status: "400",
      error: err,
    });
  }
};
exports.getFavStore = async (req, res) => {
  try {
    const favstore = await FavStore.find({
      _id: req.body.id,
    });
    if (favstore) {
      res.status(200).json({
        status: "200",
        favstore: favstore,
      });
    } else {
      res.status(404).json({
        status: "404",
        message: "fav store not found",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "400",
      error: err,
    });
  }
};
exports.getAllFavStore = async (req, res) => {
  try {
    // const store = await FavStore.find({ userId: req.body.userId });
    const store1 = await FavStore.aggregate([
      {
        $match: {
          userId: req.body.userId
        }
      },
      {
        $lookup:
        {
          from: 'stores',
          localField: 'storeId',
          foreignField: '_id',
          as: 'inventory_docs'
        }
      }
    ])
    if (store1.length > 0) {
      res.status(200).json({
        status: "200",
        stores: store1,
      });
    } else {
      res.status(404).json({
        status: "404",
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
exports.deleteFavStore = async (req, res) => {
  try {
    const store = await FavStore.deleteOne({ _id: req.body.id });
    res.status(200).json({
      status: "200",
      message: "store deleted from fav",
    });
  } catch (err) {
    res.status(400).json({
      status: "400",
      error: err,
    });
  }
};
