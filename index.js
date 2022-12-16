require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const methodOverride = require("method-override");
const { default: mongoose } = require("mongoose");
const userProductsService = require("./services/userProducts");
const productService = require("./services/product");

const corsOptions = {
  origin: "*",
  credentials: true,
  optionsSuccessStatus: 200,
};
bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
const oneDay = 1000 * 60 * 60 * 24;
app.use(
  session({
    secret: "mysecrctekey",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);
mongoose
  .connect(process.env.CONNECTION_STRING, { useNewUrlParser: true })
  .then(() => {
    console.log("mongo connection open");
  })
  .catch((err) => {
    console.log("no connection start");
  });
app.get("/", async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.post("/addProductToCart", async (req, res) => {
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
});
async function fixProductsData(userProductsType, userid) {
  var productsDetails = [];
  if (userProductsType == "shoppingBag") {
    const products = await userProductsService.getProductsIdsAndAmounts(
      userid,
      userProductsType
    );
    var productDetails;

    for (const index in products) {
      var productDetailsPlusAmount = {
        _id: "",
        title: "",
        imgsrc1: "",
        imgsrc2: "",
        description: "",
        price: 0,
        amount: 0,
      };
      productDetails = await productService.getProduct(products[index]._id);
      productDetailsPlusAmount._id = productDetails._id.toString();
      productDetailsPlusAmount.title = productDetails.title;
      productDetailsPlusAmount.imgsrc1 = productDetails.imgsrc1;
      productDetailsPlusAmount.imgsrc2 = productDetails.imgsrc2;
      productDetailsPlusAmount.description = productDetails.description;
      productDetailsPlusAmount.price = productDetails.price;
      productDetailsPlusAmount.amount = products[index].amount;
      productsDetails.push(productDetailsPlusAmount);
    }
  }
  return productsDetails;
}
app.get("/userProducts/:userProductsType", async (req, res) => {
  const userid = "6393b0349c67a2e0857e781f"; // in future will be = req.session.userId
  const { userProductsType } = req.params;
  try {
    const foundList = await userProductsService.getList(
      userid,
      userProductsType
    );
    if (!foundList) {
      await userProductsService.createUserProducts(userid, userProductsType);
    }
    var productsDetails = await fixProductsData(userProductsType, userid);
    res.json(productsDetails);

    // else if(userProductsType == "wishList")
    //else not found
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/userProducts", async (req, res) => {
  console.log("here");
  const userid = "6393b0349c67a2e0857e781f"; // in future will be = req.session.userId
  try {
    const foundList = await userProductsService.removeAllUserProducts(userid);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.post("/userProducts/shoppingBag/delete", async (req, res) => {
  var productsDetails = [];
  const userid = "6393b0349c67a2e0857e781f"; // in future will be = req.session.userId
  const productToDelete = req.body.productToDelete;
  try {
    await userProductsService.deleteProduct(
      userid,
      "shoppingBag",
      productToDelete
    );
    var productsDetails = await fixProductsData("shoppingBag", userid);
    // console.log("inside delete");
    // console.log(productsDetails);
    res.json(productsDetails);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(process.env.PORT);
