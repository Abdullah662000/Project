const mongoose = require("mongoose");
const schema = mongoose.Schema({
  userId: { type: String, required: true },
  storeId: { type: mongoose.Types.ObjectId, required: true },
});
module.exports = mongoose.model("FavStore", schema);
