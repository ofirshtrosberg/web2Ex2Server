const Product = require("../models/Product");

async function getProduct(productId) {
  const product = await Product.findOne({ _id: productId });
  return product;
}
async function getAllProducts() {
  const product = await Product.find({});
  return product;
}
async function isProductExsist(productid) {
  const product = await Product.find({ _id: productid });
  if (product) return true;
  return false;
}
module.exports = { getProduct, getAllProducts, isProductExsist };
