const express = require("express");
const productsPageController = require("../controllers/productsPage");
const router = express.Router();

router.get("/", productsPageController.productsPage);
router.post("/addProductToCart", productsPageController.addProductToCart);
module.exports = router;
