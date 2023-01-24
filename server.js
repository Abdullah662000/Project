// import  express  from "express";
// import mongoose from "mongoose";

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const adminRoute = require("./routes/admin");
const userRoute = require("./routes/user");
const bodyParser = require("body-parser");
// import dotenv from "dotenv"
// import cors from "cors"
// import adminRoute from "../routes/admin"
// import bodyParser from "body-parser";
const PORT = 5000;
dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(express.static("uploads"));
app.use("/uploads", express.static(__dirname + "/uploads"));
mongoose.connect(process.env.DATABASE, () => {
  console.log("db connected");
});
app.use("/Admin", adminRoute);
app.use("/User", userRoute);
app.get("/", (req, res) => {
  res.send("you are now live");
});
app.listen(process.env.PORT || PORT, () => {
  console.log("Server start on port " + PORT);
});
