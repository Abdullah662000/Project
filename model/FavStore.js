const mongoose = require("mongoose");
const schema = mongoose.Schema({
  userId: { type: String, required: true },
  storeId: { type: String, required: true },
});
module.exports = mongoose.model("FavStore", schema);
