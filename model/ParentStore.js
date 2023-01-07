const mongoose = require("mongoose");
const schema = mongoose.Schema({
  storeName: { type: String, required: true },
  offerName: { type: String },
  status: { type: Boolean, default: false },
});
module.exports = mongoose.model("ParentStore", schema);
