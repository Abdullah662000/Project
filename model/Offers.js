const mongoose = require("mongoose");
const schema = mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  offerPrice: { type: Number, required: true },
  image: String,
  startDate: { type: Date },
  endDate: { type: Date },
  productId: { type: Array, required: true },
  storeId: { type: Array, required: true },
});
module.exports = mongoose.model("Offers", schema);
