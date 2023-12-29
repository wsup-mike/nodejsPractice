const mongodb = require("mongodb");
const getDb = require("../utils/database").getDb;
const ObjectId = mongodb.ObjectId;

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart; // An object with a single element 'items': { items: [] }
    this._id = id; // To also add user id
  }

  save() {
    // creates new user (already hardcoded first user in database)
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    // 1st check: does product to be added exist already?
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;

    const updatedCartItems = [...this.cart.items]; // to give new array with all existing items in current cart (First to det. if we have item in cart already)

    // If product exists, determine the qty
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;

      // to be able to interact with this copy of the array
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      // in case item did NOT yet exist
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    // To add product to the cart (By ADDING product TO the array)
    const updatedCart = {
      items: updatedCartItems,
    }; // override previous (Not merge!)

    // To update the user's 'cart' property (To store this cart there)
    const db = getDb();
    return db.collection("users").updateOne(
      { _id: new ObjectId(this._id) }, // which part of data to update
      { $set: { cart: updatedCart } } // the value to update with
    );
  }

  // this will exist on every user instance
  getCart() {
    // to retrieve product ids and their quantities
    const db = getDb();
    const productIds = this.cart.items.map((i) => {
      return i.productId;
    });

    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((p) => {
          return {
            ...p,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === p._id.toString();
            }).quantity,
          };
        });
      })
      .catch((err) => console.log(err)); // Provides full access to existing user's cart!
  }

  deleteItemFromCart(productId) {
    // to filter the array and save to new variable (To retrieve everything back EXCEPT that item which we are deleting)
    const updatedCartItems = this.cart.items.filter((item) => {
      return item.productId.toString() !== productId.toString();
    });
    // now to save the new items (sans product) back to the database
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  addOrder() {
    //to first work with a NEW collection in our database!
    // to insert 1 new order that represents our current cart!
    const db = getDb();

    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: new ObjectId(this._id),
            name: this.name,
          },
        };
        return db
          .collection("orders") // to insert existing 'cart' in orders collection!
          .insertOne(order);
      })
      .then((result) => {
        this.cart = { items: [] }; // once completed, to empty the array back to []
        // to update the user in the database
        return db.collection("users").updateOne(
          { _id: new ObjectId(this._id) },
          { $set: { cart: { items: [] } } } // to clear the database
        );
      });
  }

  getOrders() {
    const db = getDb();
    return db
      .collection("orders")
      .find({ "user._id": new ObjectId(this._id) })
      .toArray();
  }

  static findById(userId) {
    const db = getDb();

    return db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) }) // converts userId to an ObjectId
      .then((user) => {
        console.log(user);
        return user;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = User;
