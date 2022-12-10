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
  //console.log("!!!!");
  try {
    const products = await productService.getAllProducts();
    res.send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/userProducts/:userProductsType", async (req, res) => {
  const userid = "6393b0349c67a2e0857e781f"; // in future will be = req.session.userId
  const { userProductsType } = req.params;
  console.log(userProductsType);
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
      const productsIds = await userProductsService.getProductsIds(
        userid,
        userProductsType
      );
      for (const index in productsIds) {
        const productDetails = await productService.getProduct(
          productsIds[index]
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
app.listen(process.env.PORT);
