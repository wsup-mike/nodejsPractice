const mongodb = require("mongodb");
const getDb = require("../utils/database").getDb; // Need the getDb method to connect to database

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  // An 'instance method' to save this new instance in our MongoDB database
  save() {
    // to connect to MongoDB and get the 'client' object
    const db = getDb();

    // to save the product in the MongoDB database using the 'client' object
    return db
      .collection("products")
      .insertOne(this)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // new Class method to fetch all existing products
  static fetchAll() {
    // first to get access to database
    const db = getDb();

    // To query the database and fetch all products data
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        console.log(products);
        return products;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // new comment here
  // another comment here bro!
  // but yet here's another test commit!
  // was working on this last nite

  static findByPk(prodId) {
    // first to get access to database
    const db = getDb();

    // To query the database and fetch 1 product w/ 'product id'
    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then((product) => {
        console.log(product);
        return product;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

// To export our Product model
module.exports = Product;
