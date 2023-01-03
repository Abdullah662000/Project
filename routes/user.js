const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userSignup, userSignin } = require("../controller/userController");
router.post("/userSignup", userSignup);
router.get("/userSignin", userSignin);
module.exports = router;
