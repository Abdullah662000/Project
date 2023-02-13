const mongoose = require("mongoose");
const schema = mongoose.Schema({
    productId: {
        type: mongoose.Types.ObjectId,
        ref: "Product"
    },
    storeId: {
        type: mongoose.Types.ObjectId,
        ref: "Store"
    }


});

module.exports = mongoose.model("productInStore", schema);