const UserProducts = require("../models/userProducts");
const productService = require("./product");

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
async function getProductsIdsAndAmounts(userid, userProductsType) {
  const products = await UserProducts.findOne({
    userid: userid,
    userProductsType: userProductsType,
  }).select("-_id products");
  return products.products;
}

async function findProductInList(userid, productid, userProductsType) {
  const userProducts = await UserProducts.findOne({
    userid: userid,
    userProductsType: userProductsType,
  }).select("-_id products");
  const products = userProducts["products"];
  for (let i = 0; i < products.length; i++) {
    if (productid == products[i].productid) return true;
  }
  return false;
}

async function addProductToList(userid, productid, userProductsType) {
  const isProductExsist = await productService.isProductExsist(productid);
  if (isProductExsist) {
    const foundProductInList = await findProductInList(
      userid,
      productid,
      userProductsType
    );
    if (!foundProductInList) {
      await UserProducts.updateOne(
        { userid: userid, userProductsType },
        { $push: { products: { productid: productid, amount: 1 } } }
      );
    } else {
      await UserProducts.updateOne(
        { userid: userid, userProductsType, "products.productid": productid },
        { $inc: { "products.$.amount": 1 } }
      );
    }
  }
}

async function removeAllUserProducts(userid) {
  const userProducts = await UserProducts.deleteMany({
    userid: userid,
  })
  return
  }
async function deleteProduct(userid, userProductsType, productid){
  /*await UserProducts.updateOne(
    { userid: userid, userProductsType, "products.productid": productid },
    { $pop: { "products" }
  );*/
}
module.exports = {
  getList,
  createUserProducts,
  getProductsIdsAndAmounts,
  findProductInList,
  addProductToList,
  removeAllUserProducts,
  deleteProduct
};
