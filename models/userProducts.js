const mongoose = require("mongoose");

const userProducts = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userProductsType: {
      type: String,
      required: true,
    },
    products: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const UserProducts = mongoose.model("UserProducts", userProducts);
module.exports = UserProducts;
