const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const FavProduct = require("../model/FavProduct");
const FavStore = require("../model/FavStore");
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
    const prod = await FavProduct.find({ userId: req.body.userId });
    if (prod) {
      res.status(200).json({
        status: "200",
        favProds: prod,
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
    const store = await FavStore.find({ userId: req.body.userId });
    if (store) {
      res.status(200).json({
        status: "200",
        stores: store,
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
