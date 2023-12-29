// const mongodb = require("mongodb");
const Product = require("../models/product");

// const ObjectId = mongodb.ObjectId;

exports.getAddProductPage = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product Page",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;
  const product = new Product(
    title,
    price,
    description,
    imageUrl,
    null, // for product id
    req.user._id //ObjectId is converted to a string for us
  );
  product
    .save()
    .then((result) => {
      console.log("Product created!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
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
  Product.findByPk(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditProductPage = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDescription = req.body.description;
  const updatedPrice = req.body.price;

  const product = new Product(
    updatedTitle,
    updatedPrice,
    updatedDescription,
    updatedImageUrl,
    prodId // as a string
  );

  product // this line officially saves everything to database
    .save()
    .then((result) => {
      console.log("Updated Product!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.deleteById(prodId)
    .then(() => {
      console.log("Product Destroyed");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
