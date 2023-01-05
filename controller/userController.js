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
      return res.status(400).send("user already exists");
    }
    const s = await user.save();
    res.status(200).send(s);
  } catch (err) {
    res.status(400).send(err);
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
//Fav Product
exports.addFavProduct = async (req, res) => {
  try {
    const favProd = new FavProduct({
      userId: req.body.userId,
      productId: req.body.productId,
    });
    await favProd.save();
    res.status(200).send("Product added to fav");
  } catch (err) {
    res.status(400).send(err);
  }
};
exports.getFavProduct = async (req, res) => {
  try {
    const favProd = await FavProduct.find({
      userId: req.body.userId,
      productId: req.body.productId,
    });
    if (favProd) {
      res.status(200).send(favProd);
    } else {
      res.send("No fav products");
    }
  } catch (err) {
    res.status(400).send(err);
  }
};
exports.getAllFavProduct = async (req, res) => {
  try {
    const prod = await FavProduct.find({ userId: req.body.userId });
    if (prod) {
      res.status(200).send(prod);
    } else {
      res.status(404).send("no fav products found");
    }
  } catch (err) {
    res.send(err);
  }
};
exports.deleteFavProduct = async (req, res) => {
  try {
    const prod = await FavProduct.deleteOne({
      _id: req.body.id,
    });
    if (prod) {
      res.send(prod);
    } else {
      res.status(401).send("Fav Product not found");
    }
  } catch (err) {
    res.status(400).send(err);
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
    res.status(200).send("Store added to fav");
  } catch (err) {
    res.status(400).send(err);
  }
};
exports.getFavStore = async (req, res) => {
  try {
    const favstore = await FavStore.find({
      userId: req.body.userId,
      storeId: req.body.storeId,
    });
    if (favstore) {
      res.status(200).send(favstore);
    } else {
      res.send("No fav stores");
    }
  } catch (err) {
    res.status(400).send(err);
  }
};
exports.getAllFavStore = async (req, res) => {
  try {
    const store = await FavStore.find({ userId: req.body.userId });
    if (store) {
      res.status(200).send(store);
    } else {
      res.status(404).send("no fav stores found");
    }
  } catch (err) {
    res.send(err);
  }
};
exports.deleteFavStore = async (req, res) => {
  try {
    const store = await FavStore.deleteOne({ _id: req.body.id });
    res.status(200).send("store deleted from fav");
  } catch (err) {
    res.status(400).send(err);
  }
};
