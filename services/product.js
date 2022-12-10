const Product = require("../models/Product");

async function getProduct(productId) {
  const product = await Product.findOne({ _id: productId });
  return product;
}
async function getAllProducts() {
  const product = await Product.find({});
  return product;
}
module.exports = { getProduct, getAllProducts };
