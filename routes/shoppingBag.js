const express = require("express");
const shoppingBagController = require("../controllers/shoppingBag");
const router = express.Router();

router.get("/", shoppingBagController.shoppingBagPage);
router.post("/delete", shoppingBagController.deleteProducts);
router.post("/addOrder", shoppingBagController.addOrder);
router.get("/clearBag", shoppingBagController.clearBag);
module.exports = router;
