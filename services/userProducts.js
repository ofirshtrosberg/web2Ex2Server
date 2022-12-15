const UserProducts = require("../models/userProducts");
const productService = require("./product");
const Orders = require("../models/orders");
var ObjectId = require("mongoose").Types.ObjectId;

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
    if (productid == products[i]._id) return true;
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
        { $push: { products: { _id: productid, amount: 1 } } }
      );
    } else {
      await UserProducts.updateOne(
        { userid: userid, userProductsType, "products._id": productid },
        { $inc: { "products.$.amount": 1 } }
      );
    }
  }
}

async function removeAllUserProducts(userid) {
  const userProducts = await UserProducts.deleteMany({
    userid: userid,
  });
  return;
}
async function deleteProduct(userid, userProductsType, productid) {
  var currentProducts = await getProductsIdsAndAmounts(
    userid,
    userProductsType
  );
  for (let i = 0; i < currentProducts.length; i++) {
    if (currentProducts[i]._id.toString() == productid) {
      currentProducts.splice(i, 1);
      break;
    }
  }
  await UserProducts.updateOne(
    { userid, userProductsType },
    {
      $set: {
        products: currentProducts,
      },
    }
  );
}


async function addorder(userId, client_name, credit_card_number) {
  const products = await getList(userId, "shoppingBag");
  Orders.create({
    client_name: client_name,
    credit_card_number:credit_card_number,
    items: products
  });
}



module.exports = {
  getList,
  createUserProducts,
  getProductsIdsAndAmounts,
  findProductInList,
  addProductToList,
  removeAllUserProducts,
  deleteProduct,
  addorder
};