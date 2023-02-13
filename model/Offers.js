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
    required: true,
    ref: "deals"
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
  percentage: {
    type: Number,

  }
});
schema.index({ location: "2dsphere" });
module.exports = mongoose.model("Offers", schema);
