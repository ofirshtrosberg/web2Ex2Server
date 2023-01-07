const express = require("express");
const wishListController = require("../controllers/wishList");
const router = express.Router();

router.get("/", wishListController.wishListPage);

module.exports = router;
