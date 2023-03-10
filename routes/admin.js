const router = require("express").Router();
const path = require("path");
const { v4: uuidv4 } = require("uuid");
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
  // getProdByBranchId,
  getAllParentStore,
  addOfferByBranch,
  addOfferOnStore,
  addOfferOnProduct,
  getNearbyOffer,
  getNearbyProducts,
  addDeal,
  addOffer,
  addProductToBranchOfStore,
  addCategory,
  getCategories,
  getBranchesByStoreId,
  getAllDeals,
  getProductById,

  getAllOffersData,
  addProductToStore,
  getProductsByStore,
} = require("../controller/adminController");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //   cb(null, path.join(__dirname, '../uploads/'));
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let upload = multer({ storage, fileFilter });
router.post("/adminSignin", adminSignin);
router.post("/adminSignup", adminSignup);
// router.post("/getProdByBranchId", verification, getProdByBranchId);
router.post("/addBranch", upload.single("files"), addStore); //send image from frontend
router.post("/getStoreByCity", getStoreByCity);
router.post("/getStore", getStore);
router.get("/getAllStores", getAllStores);
router.post("/getStoreByLocation", getStoreByLocation);
router.post("/addStore", upload.single("files"), addParentStore);
router.post("/getParentStore", getParentStore);
router.get("/getAllParentStore", getAllParentStore);
router.post("/addProduct", upload.single("files"), addProduct);
router.post("/getSpecProduct", getSpecProduct);
router.get("/getAllProducts", getAllProducts);
router.post(
  "/addOfferByBranch",
  verification,
  upload.array("files"),
  addOfferByBranch
);
router.post(
  "/addOfferOnStore",
  verification,
  upload.array("files"),
  addOfferOnStore
);
router.post(
  "/addOffer",
  addOffer
);
router.put("/addProductToStore", addProductToStore);
router.put("/addDeal", upload.single('files'), addDeal)
router.post("/getNearbyOffer", getNearbyOffer);
router.post("/getNearbyProducts", getNearbyProducts);
router.put("/addCategory", addCategory);
router.get("/getCategories", getCategories);
router.get("/getAllDeals", getAllDeals);
router.get("/getAll", getAllDeals);
router.get("/getProductsByStore/:storeId", getProductsByStore);
router.get("/getProductById/:productId", getProductById);
router.get("/getAllOffersData", getAllOffersData);


router.get("/getBranchesByStoreId/:storeId", getBranchesByStoreId);
module.exports = router;
