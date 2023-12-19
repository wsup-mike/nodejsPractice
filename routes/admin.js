const express = require("express");
const path = require("path");
const mainDirectoryPath = require("../utils/path");
const adminController = require("../controllers/admin");

const router = express.Router();

router.get("/add-product", adminController.getAddProductPage);

// router.get("/products", adminController.getProducts);

router.post("/add-product", adminController.postAddProduct);

// router.get("/edit-product/:productId", adminController.getEditProductPage);

// router.post("/edit-product", adminController.postEditProductPage);

// router.post("/delete-product", adminController.postDeleteProduct);

module.exports = router;
