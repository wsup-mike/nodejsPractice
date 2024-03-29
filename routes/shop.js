const express = require("express");
const path = require("path");
const mainDirectoryPath = require("../utils/path");
const adminData = require("./admin");
const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", shopController.getIndexPage);
router.get("/products", shopController.getProductsPage);
router.get("/products/:productId", shopController.getProduct);
router.get("/cart", isAuth, shopController.getCartPage);
router.post("/cart", isAuth, shopController.postAddCart);
router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct);
router.get("/checkout", isAuth, shopController.getCheckoutPage);
router.get("/checkout/success", isAuth, shopController.getCheckoutSuccess);
router.get("/checkout/cancel", isAuth, shopController.getCheckoutPage);
// router.post("/create-order", isAuth, shopController.postCreateOrder);
router.get("/orders", isAuth, shopController.getOrdersPage);
router.get("/orders/:orderId", isAuth, shopController.getInvoice);

module.exports = router;
