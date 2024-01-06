const Product = require("../models/product");
// const Cart = require("../models/cart");

exports.getIndexPage = (req, res, next) => {
  Product.find()
    .then((products) => {
      console.log(products);
      res.render("shop/index", {
        prods: products,
        pageTitle: "Lets Shop!",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProductsPage = (req, res, next) => {
  Product.find()
    .then((products) => {
      console.log(products);
      res.render("shop/product-list", {
        pageTitle: "Home Page - Lets Shop!",
        path: "/products",
        prods: products,
      });
    })
    .catch((err) => {
      console.log(err);
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
      });
    })
    .catch((err) => console.log(err));
};

exports.getCartPage = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        pageTitle: "View Cart",
        path: "/cart",
        products: products,
      });
    })
    .catch((err) => {
      console.log(err);
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
    .deleteItemFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.getOrdersPage = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Orders Page",
        path: "/orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCreateOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .addOrder()
    // .getCart()
    // .then((cart) => {
    //   fetchedCart = cart;
    //   return cart.getProducts();
    // })
    // .then((products) => {
    //   return req.user
    //     .createOrder()
    //     .then((order) => {
    //       return order.addProducts(
    //         products.map((product) => {
    //           product.orderItem = { quantity: product.cartItem.quantity };
    //           return product;
    //         })
    //       );
    //     })
    //     .catch((err) => console.log(err));
    //   // console.log(products);
    // })
    // .then((result) => {
    //   return fetchedCart.setProducts(null);
    // })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getCheckoutPage = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/cart",
  });
};
