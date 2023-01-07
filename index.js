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

app.use("/", require("./routes/homePage"));
app.use("/shoppingBag", require("./routes/shoppingBag"));
app.use("/wishList", require("./routes/wishList"));
app.use("/productsPage", require("./routes/productsPage"));

app.listen(process.env.PORT);
