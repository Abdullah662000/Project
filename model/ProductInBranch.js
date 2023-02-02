const mongoose = require("mongoose");
const schema = mongoose.Schema({
    productId: mongoose.Types.ObjectId,
    branchId: mongoose.Types.ObjectId,



});

module.exports = mongoose.model("productInBranch", schema);