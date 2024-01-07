const mongoose = require("mongoose"); // 1) import mongoose

const Schema = mongoose.Schema; // 2) use Schema constructor to create new Schema

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User", // Connects any other mongoose models are related to this SPECIFI data. To refer to the 'User' model
    required: true,
  },
}); // 3) Create the new 'product' schema

module.exports = mongoose.model("Product", productSchema);

// const mongodb = require("mongodb");
// const getDb = require("../utils/database").getDb; // Need the getDb method to connect to database
// const ObjectId = mongodb.ObjectId;

// class Product {
//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.userId = userId;
//   }

//   // An 'instance method' to save this new instance in our MongoDB database
//   save() {
//     const db = getDb(); // to connect to MongoDB and get the 'client' object

//     let dbOperation; // new variable to capture results of a given database operation

//     if (this._id) {
//       // Product exists! Proceed with updating product!
//       dbOperation = db
//         .collection("products")
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       // Product does NOT exist! Let's insert into database as new product!
//       dbOperation = db.collection("products").insertOne(this);
//     }

//     return dbOperation
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   // new Class method to fetch all existing products
//   static fetchAll() {
//     // first to get access to database
//     const db = getDb();

//     // To query the database and fetch all products data
//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then((products) => {
//         console.log(products);
//         return products;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   // new static method
//   static findByPk(prodId) {
//     // first to get access to database
//     const db = getDb();

//     // To query the database and fetch 1 product w/ 'product id'
//     return db
//       .collection("products")
//       .find({ _id: new mongodb.ObjectId(prodId) })
//       .next()
//       .then((product) => {
//         console.log(product);
//         return product;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   static deleteById(prodId) {
//     // get access to database
//     const db = getDb();

//     // Query to find the document by product id  to DELETE it
//     return db
//       .collection("products")
//       .deleteOne({ _id: new mongodb.ObjectId(prodId) })
//       .then((result) => {
//         console.log("The product has been successfully deleted.");
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// }

// // To export our Product model
// module.exports = Product;
