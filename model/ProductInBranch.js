const mongoose = require("mongoose");
const schema = mongoose.Schema({
    productId: mongoose.Types.ObjectId,
    branchId: {
        type: mongoose.Types.ObjectId,
        ref: "branch"
    }


});

module.exports = mongoose.model("productInBranch", schema);