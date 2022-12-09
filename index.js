const express = require("express");
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const app = express();
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
const Product = require("./models/Product");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

mongoose
  .connect("mongodb://localhost:27017/farmStand", { useNewUrlParser: true })
  .then(() => {
    console.log("mongo connection open!!");
  })
  .catch((err) => {
    console.log("no connection start");
  });

// app.get("/addToMongo1/:title/:amount/:date", async (req, res) => {
//   const { title, amount, date } = req.params;
//   const addedProduct = new Product({
//     title: title,
//     amount: amount,
//     date: date,
//   });
//   try {
//     await addedProduct.save();
//     res.status(200);
//   } catch (e) {
//     res.status(500);
//   }
// });

app.listen(3000, () => {
  console.log("listening on port 3000!");
});
