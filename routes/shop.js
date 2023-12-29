const express = require("express");
const path = require("path");
const mainDirectoryPath = require("../utils/path");
const adminData = require("./admin");
const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getIndexPage);
router.get("/products", shopController.getProductsPage);
router.get("/products/:productId", shopController.getProduct);
router.get("/cart", shopController.getCartPage);
router.post("/cart", shopController.postAddCart);
router.post("/cart-delete-item", shopController.postCartDeleteProduct);
router.post("/create-order", shopController.postCreateOrder);
// router.get("/orders", shopController.getOrdersPage);
// router.get("/checkout", shopController.getCheckoutPage);

module.exports = router;
