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
app.get("/userProducts/:userProductsType", async (req, res) => {
  const userid = "6393b0349c67a2e0857e781f"; // in future will be = req.session.userId
  const { userProductsType } = req.params;
  var productsDetails = [];
  try {
    const foundList = await userProductsService.getList(
      userid,
      userProductsType
    );
    if (!foundList) {
      await userProductsService.createUserProducts(userid, userProductsType);
    }
    if (userProductsType == "shoppingBag") {
      const products = await userProductsService.getProductsIdsAndAmounts(
        userid,
        userProductsType
      );
      for (const index in products) {
        const productDetails = await productService.getProduct(
          products[index].productid
        );
        productsDetails.push(productDetails);
      }
    }
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
    const foundList = await userProductsService.removeAllUserProducts(
      userid,
    );
  } catch (error) {
    res.status(500).send(error);
  }
});
app.post("/userProducts/shoppingBag/delete", async (req,res) => {
  var productsDetails = [];
  const userid = "6393b0349c67a2e0857e781f"; // in future will be = req.session.userId
  const productToDelete = req.body.productToDelete;
  try {
    console.log("1")
    await userProductsService.deleteProduct(
      userid, "shoppingBag", productToDelete
    );
    console.log("2")
    const products = await userProductsService.getProductsIdsAndAmounts(
      userid,
      "shoppingBag"
    );
    console.log("3")
    for (const index in products) {
      const productDetails = await productService.getProduct(
        products[index].productid
      );
      productsDetails.push(productDetails);
    }
    console.log("4")
    res.json(productsDetails);
  } catch (error) {
    res.status(500).send(error);
  }


});


app.listen(process.env.PORT);
