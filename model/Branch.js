const mongoose = require("mongoose");
const schema = mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Store"
  },

  branchName: String,
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: [Number],
  },

  locationByCity: {
    type: String,
    required: true,
  },
  openingTime: { type: Date },
  closingTime: { type: Date },

});
schema.index({ location: "2dsphere" });
module.exports = mongoose.model("branch", schema);
