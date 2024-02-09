const express = require("express");
const path = require("path");
const mainDirectoryPath = require("../utils/path");
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator");

const router = express.Router();

router.get("/add-product", isAuth, adminController.getAddProductPage);

router.get("/products", isAuth, adminController.getProducts);

router.post(
  "/add-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),

    // body("imageUrl").isURL(),

    body("price").isFloat(),

    body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  isAuth,
  adminController.postAddProduct
);

router.get(
  "/edit-product/:productId",
  isAuth,
  adminController.getEditProductPage
);

router.post(
  "/edit-product",
  [
    // body("title").isAlphanumeric().isLength({ min: 3 }),
    body("title").isString().isLength({ min: 3 }).trim(),

    // body("imageUrl").isURL(),

    body("price").isFloat(),

    body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  isAuth,
  adminController.postEditProductPage
);

router.delete("/product/:productId", isAuth, adminController.deleteProduct);

module.exports = router;
