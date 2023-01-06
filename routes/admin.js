const router = require("express").Router();
const verification = require("../controller/verification");
const {
  addStore,
  getStore,
  getAllStores,
  getStoreByLocation,
  adminSignin,
  adminSignup,
  addProduct,
  getSpecProduct,
  getAllProducts,
  addOffer,
  getStoreByCity,
} = require("../controller/adminController");
router.get("/adminSignin", adminSignin);
router.post("/adminSignup", adminSignup);
router.post("/addStore", verification, addStore);
router.get("/getStoreByCity", verification, getStoreByCity);
router.get("/getStore", verification, getStore);
router.get("/getAllStores", verification, getAllStores);
router.get("/getStoreByLocation", verification, getStoreByLocation);
router.post("/addProduct", verification, addProduct);
router.get("/getSpecProduct", verification, getSpecProduct);
router.get("/getAllProducts", verification, getAllProducts);
router.post("/addOffer", verification, addOffer);
module.exports = router;
