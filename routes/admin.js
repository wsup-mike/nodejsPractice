const express = require("express");
const path = require("path");
const mainDirectoryPath = require("../utils/path");
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/add-product", isAuth, adminController.getAddProductPage);

router.get("/products", isAuth, adminController.getProducts);

router.post("/add-product", isAuth, adminController.postAddProduct);

router.get(
  "/edit-product/:productId",
  isAuth,
  adminController.getEditProductPage
);

router.post("/edit-product", isAuth, adminController.postEditProductPage);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
