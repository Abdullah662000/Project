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
router.post("/userSignup", userSignup);
router.post("/addFavProduct", addFavProduct);
router.get("/getFavProduct", getFavProduct);
router.post("/addFavStore", addFavStore);
router.get("/getAllFavStore", getAllFavStore);
router.get("/getAllFavProducts", getAllFavProduct);
router.post("/deleteFavProd", deleteFavProduct);
router.post("/deleteFavStore", deleteFavStore);
router.get("/getFavStore", getFavStore);
router.get("/userSignin", userSignin);
module.exports = router;
