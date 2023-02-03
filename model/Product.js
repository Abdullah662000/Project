const mongoose = require("mongoose");
const schema = mongoose.Schema({
  name: { type: String, required: true },
  categoryId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "category"
  },

  image: String,
  orignalPrice: { type: Number, required: true },


});

module.exports = mongoose.model("Product", schema);
