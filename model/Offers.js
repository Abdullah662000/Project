const mongoose = require("mongoose");
const schema = mongoose.Schema({

  discountPrice: {
    type: Number,
    required: true
  },
  branchId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "branch"
  },

  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },
  dealId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  productId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Product"
  },
  storeId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Store"
  },
});
schema.index({ location: "2dsphere" });
module.exports = mongoose.model("Offers", schema);
