const mongoose = require("mongoose");
const schema = mongoose.Schema({
  name: { type: String, required: true },
  branchId: { type: mongoose.Types.ObjectId, required: true },
  image: { data: Buffer, contentType: String },
  orignalPrice: { type: Number, required: true },
  offerPrice: Number,
  storeId: String,
});
module.exports = mongoose.model("Product", schema);
