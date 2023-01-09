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
      return res.status(400).json("user already exists");
    }
    const s = await user.save();
    res.status(200).json(s);
  } catch (err) {
    res.status(400).json(err);
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
//Fav Product
exports.addFavProduct = async (req, res) => {
  try {
    const favProd = new FavProduct({
      userId: req.body.userId,
      productId: req.body.productId,
    });
    await favProd.save();
    res.status(200).json("Product added to fav");
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.getFavProduct = async (req, res) => {
  try {
    const favProd = await FavProduct.find({
      _id: req.body.id,
    });
    if (favProd) {
      res.status(200).json(favProd);
    } else {
      res.json("No fav products");
    }
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.getAllFavProduct = async (req, res) => {
  try {
    const prod = await FavProduct.find({ userId: req.body.userId });
    if (prod) {
      res.status(200).json(prod);
    } else {
      console.log("no fave prod");
      res.status(404).json("no fav products found");
    }
  } catch (err) {
    res.json(err);
  }
};
exports.deleteFavProduct = async (req, res) => {
  try {
    const prod = await FavProduct.deleteOne({
      _id: req.body.id,
    });
    if (prod) {
      res.json(prod);
    } else {
      res.status(401).json("Fav Product not found");
    }
  } catch (err) {
    res.status(400).json(err);
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
    res.status(200).json("Store added to fav");
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.getFavStore = async (req, res) => {
  try {
    console.log(req.body);
    const favstore = await FavStore.find({
      _id: req.body.id,
    });
    if (favstore) {
      res.status(200).json(favstore);
    } else {
      res.json("No fav stores");
    }
  } catch (err) {
    res.status(400).json(err);
  }
};
exports.getAllFavStore = async (req, res) => {
  try {
    const store = await FavStore.find({ userId: req.body.userId });
    if (store) {
      res.status(200).json(store);
    } else {
      res.status(404).json("no fav stores found");
    }
  } catch (err) {
    res.json(err);
  }
};
exports.deleteFavStore = async (req, res) => {
  try {
    const store = await FavStore.deleteOne({ _id: req.body.id });
    res.status(200).json("store deleted from fav");
  } catch (err) {
    res.status(400).json(err);
  }
};
