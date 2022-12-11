const UserProducts = require("../models/userProducts");

async function getList(userid, userProductsType) {
  const userProducts = await UserProducts.findOne({
    userid: userid,
    userProductsType: userProductsType,
  });
  return userProducts;
}
async function createUserProducts(userid, userProductsType) {
  const userProducts = new UserProducts({
    userid: userid,
    userProductsType: userProductsType,
    products: [],
  });
  await userProducts.save();
}
async function getProductsIds(userid, userProductsType) {
  const products = await UserProducts.findOne({
    userid: userid,
    userProductsType: userProductsType,
  }).select("-_id products");
  return products.products;
}
module.exports = { getList, createUserProducts, getProductsIds };
