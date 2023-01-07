const mongoose = require("mongoose");
const schema = mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  branchName: String,
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
  },
  locationByCountry: {
    type: String,
    required: true,
  },
  locationByCity: {
    type: String,
    required: true,
  },
  openingTime: { type: Date },
  closingTime: { type: Date },
  offerName: { type: String },
  status: { type: Boolean, default: false },
  startDate: { type: Date },
  endDate: { type: Date },
});
module.exports = mongoose.model("Store", schema);
