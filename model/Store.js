const mongoose = require("mongoose");
const schema = mongoose.Schema({
  storeName: { type: String, required: true },

  storeImage: String,



});
module.exports = mongoose.model("Store", schema);
