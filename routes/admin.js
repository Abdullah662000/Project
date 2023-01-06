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
router.post("/addStore", addStore);
router.get("/getStoreByCity", getStoreByCity);
router.get("/getStore", getStore);
router.get("/getAllStores", getAllStores);
router.get("/getStoreByLocation", getStoreByLocation);
router.post("/addProduct", addProduct);
router.get("/getSpecProduct", getSpecProduct);
router.get("/getAllProducts", getAllProducts);
router.post("/addOffer", addOffer);
module.exports = router;
