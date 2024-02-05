const mongoose = require("mongoose");

// const mongodb = require("mongodb");
const Product = require("../models/product");
const { validationResult } = require("express-validator");

// const ObjectId = mongodb.ObjectId;

exports.getAddProductPage = (req, res, next) => {
  // if (!req.session.isLoggedIn) {
  //   console.log("Unauthorized user tried to access restricted route");
  //   return res.redirect("/login");
  // }
  res.render("admin/edit-product", {
    pageTitle: "Add Product Page",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.image;
  const description = req.body.description;
  const price = req.body.price;
  const errors = validationResult(req);
  console.log(imageUrl);

  if (!errors.isEmpty()) {
    // i.e. we DO have errors, then...
    console.log(errors.array());
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add New Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  const product = new Product({
    // _id: new mongoose.Types.ObjectId("65ac1639cc8445c73d27e816"),
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user,
  });
  product
    .save()
    .then((result) => {
      console.log("Product created!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err); //
      error.httpStatusCode = 500;
      return next(error);
    });
};

// Used for 'Edit' button on Admin Products page to navigate to Edit Product Page
exports.getEditProductPage = (req, res, next) => {
  // action name
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  const prodId = req.params.productId;

  // Lets find the product to be edited
  Product.findById(prodId)
    .then((product) => {
      // throw new Error("Dummy!");
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch((err) => {
      const error = new Error(err); //
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProductPage = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;
  const updatedPrice = req.body.price;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // i.e. we DO have errors, then...
    console.log(errors.array());
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDescription,
        _id: prodId,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  Product.findById(prodId) // Here you will get back a full mongoose object
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        // what to do in case user is not authorized to perform this action!
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      product.imageUrl = updatedImageUrl;
      return product.save().then((result) => {
        console.log("Updated Product!");
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      const error = new Error(err); //
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id }) // To filter products found by 'logged-in user' ones only
    // .select("title price -_id") // for the main document
    // .populate("userId", "name") // for the populated document
    .then((products) => {
      console.log(products);
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      const error = new Error(err); //
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      console.log("Product Destroyed");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err); //
      error.httpStatusCode = 500;
      return next(error);
    });
};
