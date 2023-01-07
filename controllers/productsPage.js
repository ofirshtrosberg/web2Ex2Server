const productService = require("../services/product");
const userProductsService = require("../services/userProducts");
async function productsPage(req, res) {
  try {
    const products = await productService.getAllProducts();
    res.send(products);
  } catch (error) {
    res.status(500).send(error);
  }
}
async function addProductToCart(req, res) {
  const userid = "6393b0349c67a2e0857e781f"; // in future will be = req.session.userId
  try {
    const productToAdd = req.body.productToAdd;
    await userProductsService.addProductToList(
      userid,
      productToAdd,
      "shoppingBag"
    );
    res.status(200);
  } catch (error) {
    res.status(500).send(error);
  }
}
module.exports = { productsPage, addProductToCart };
