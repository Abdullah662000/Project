const mongoose = require("mongoose");
const schema = mongoose.Schema({
    name: {
        type: String,
        required: true
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


    image: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    },
    toDate: {
        type: Date,
        required: true
    },
    fromDate: {
        type: Date,
        required: true
    },
    storeId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Store"
    },



});
schema.index({ location: "2dsphere" });
module.exports = mongoose.model("deals", schema);