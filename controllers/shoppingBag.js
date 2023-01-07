const userProductsService = require("../services/userProducts");

async function shoppingBagPage(req, res) {
  const userid = "6393b0349c67a2e0857e781f"; // in future will be = req.session.userId
  try {
    const foundList = await userProductsService.getList(userid, "shoppingBag");
    if (!foundList) {
      await userProductsService.createUserProducts(userid, "shoppingBag");
    }
    var productsDetails = await userProductsService.fixProductsData(
      "shoppingBag",
      userid
    );
    res.json(productsDetails);

    // else if(userProductsType == "wishList")
    //else not found
  } catch (error) {
    res.status(500).send(error);
  }
}
async function deleteProducts(req, res) {
  var productsDetails = [];
  const userid = "6393b0349c67a2e0857e781f"; // in future will be = req.session.userId
  const productToDelete = req.body.productToDelete;
  try {
    await userProductsService.deleteProduct(
      userid,
      "shoppingBag",
      productToDelete
    );
    var productsDetails = await userProductsService.fixProductsData(
      "shoppingBag",
      userid
    );
    // console.log("inside delete");
    // console.log(productsDetails);
    res.json(productsDetails);
  } catch (error) {
    res.status(500).send(error);
  }
}
async function addOrder(req, res) {
  console.log("1!!!!!");
  const userid = "6393b0349c67a2e0857e781f"; // in future will be = req.session.userId
  try {
    await userProductsService.addorder(
      userid,
      req.body.client_name,
      req.body.credit_card_number
    );
    res.status(200);
  } catch (error) {
    res.status(500).send(error);
  }
}
async function clearBag(req, res) {
  const userid = "6393b0349c67a2e0857e781f"; // in future will be = req.session.userId
  try {
    // need to send the type of list -> shopping bag
    await userProductsService.removeAllUserProducts(userid);
  } catch (error) {
    res.status(500).send(error);
  }
}
module.exports = { shoppingBagPage, deleteProducts, addOrder, clearBag };
