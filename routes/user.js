const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  userSignup,
  userSignin,
  addFavProduct,
  addFavStore,
  getFavProduct,
  getFavStore,
  getAllFavProduct,
  deleteFavProduct,
  getAllFavStore,
  deleteFavStore,
} = require("../controller/userController");
const verification = require("../controller/verification");
router.post("/userSignup", userSignup);
router.post("/addFavProduct", verification, addFavProduct);
router.post("/getFavProduct", verification, getFavProduct);
router.post("/addFavStore", verification, addFavStore);
router.post("/getAllFavStore", verification, getAllFavStore);
router.post("/getAllFavProducts", verification, getAllFavProduct);
router.post("/deleteFavProd", verification, deleteFavProduct);
router.post("/deleteFavStore", verification, deleteFavStore);
router.post("/getFavStore", verification, getFavStore);
router.post("/userSignin", userSignin);
module.exports = router;
