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
  getStoreByCity,
  addParentStore,
  getParentStore,
  getAllParentStore,
  addOfferByBranch,
  addOfferOnStore,
  addOfferOnProduct,
  getNearbyOffer,
} = require("../controller/adminController");
router.get("/adminSignin", adminSignin);
router.post("/adminSignup", adminSignup);
router.post("/addStore", addStore);
router.get("/getStoreByCity", verification, getStoreByCity);
router.get("/getStore", verification, getStore);
router.get("/getAllStores", verification, getAllStores);
router.get("/getStoreByLocation", verification, getStoreByLocation);
router.post("/addParentStore", addParentStore);
router.get("/getParentStore", verification, getParentStore);
router.get("/getAllParentStore", verification, getAllParentStore);
router.post("/addProduct", verification, addProduct);
router.get("/getSpecProduct", verification, getSpecProduct);
router.get("/getAllProducts", verification, getAllProducts);
router.post("/addOfferByBranch", verification, addOfferByBranch);
router.post("/addOfferOnStore", verification, addOfferOnStore);
router.post("/addOfferOnProduct", verification, addOfferOnProduct);
router.get("/getNearbyOffer", verification, getNearbyOffer);
module.exports = router;
