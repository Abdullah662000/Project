const mongoose = require("mongoose");
const schema = mongoose.Schema({
  name: { type: String, required: true },
  image: { data: Buffer, contentType: String },
  startDate: { type: Date },
  endDate: { type: Date },
  storeId: { type: Array, required: true },
});
module.exports = mongoose.model("Offers", schema);
