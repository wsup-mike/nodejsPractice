const Product = require("../models/product");
// const Cart = require("../models/cart");
const Order = require("../models/order");

exports.getProductsPage = (req, res, next) => {
  Product.find()
    .then((products) => {
      console.log(products);
      res.render("shop/product-list", {
        pageTitle: "Home Page - Lets Shop!",
        path: "/products",
        prods: products,
        // isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err); //
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  // first we extract product id from the URL
  const prodId = req.params.productId;

  // Then using Product model to 'find' that product
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        pageTitle: product.title,
        path: "/products",
        product: product,
        // isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err); //
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndexPage = (req, res, next) => {
  Product.find()
    .then((products) => {
      console.log(products);
      res.render("shop/index", {
        prods: products,
        pageTitle: "Lets Shop!",
        path: "/",
        // isAuthenticated: req.session.isLoggedIn,
        csrfToken: req.csrfToken(),
      });
    })
    .catch((err) => {
      const error = new Error(err); //
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCartPage = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        pageTitle: "View Cart",
        path: "/cart",
        products: products,
        // isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err); //
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postAddCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  // To remove product from CART ONLY (Not product itself!)
  const prodId = req.body.productId; // productId coming from hidden <input> from cart.ejs view
  // We will also need the price to properly delete from the cart and update it properly
  // First retrieve user's cart
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err); //
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrdersPage = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Orders Page",
        path: "/orders",
        orders: orders,
        // isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err); //
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCreateOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      console.log(user.cart.items);
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          // name: req.user.name, // when signing up, users only need email
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err); //
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckoutPage = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/cart",
    // isAuthenticated: req.session.isLoggedIn,
  });
};
