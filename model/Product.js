const mongoose = require("mongoose");
const schema = mongoose.Schema({
  name: { type: String, required: true },
  branchId: { type: mongoose.Types.ObjectId, required: true },
  image: String,
  orignalPrice: { type: Number, required: true },
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },
  offerPrice: Number,
  offerImage: String,
  offerName: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  status: { type: Boolean, default: false },
});
schema.index({ location: "2dsphere" });
module.exports = mongoose.model("Product", schema);
