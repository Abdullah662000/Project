const mongoose = require("mongoose");
const schema = mongoose.Schema({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
});
module.exports = mongoose.model("FavProduct", schema);
