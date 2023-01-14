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
  getProdByBranchId,
  getAllParentStore,
  addOfferByBranch,
  addOfferOnStore,
  addOfferOnProduct,
  getNearbyOffer,
  getNearbyProducts,
} = require("../controller/adminController");
router.post("/adminSignin", adminSignin);
router.post("/adminSignup", adminSignup);
router.post("/getProdByBranchId", verification, getProdByBranchId);
router.post("/addStore", verification, addStore);
router.post("/getStoreByCity", verification, getStoreByCity);
router.post("/getStore", verification, getStore);
router.get("/getAllStores", verification, getAllStores);
router.post("/getStoreByLocation", verification, getStoreByLocation);
router.post("/addParentStore", addParentStore);
router.post("/getParentStore", verification, getParentStore);
router.get("/getAllParentStore", verification, getAllParentStore);
router.post("/addProduct", verification, addProduct);
router.post("/getSpecProduct", verification, getSpecProduct);
router.get("/getAllProducts", verification, getAllProducts);
router.post("/addOfferByBranch", verification, addOfferByBranch);
router.post("/addOfferOnStore", verification, addOfferOnStore);
router.post("/addOfferOnProduct", verification, addOfferOnProduct);
router.post("/getNearbyOffer", verification, getNearbyOffer);
router.post("/getNearbyProducts", getNearbyProducts);
module.exports = router;
