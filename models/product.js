const getDb = require('../utils/database').getDb; // Need the getDb method to connect to database

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

    // to save the product in the MongoDB database using the 'client' object

  }
}

// Define the product model
const Product = sequelize.define("product", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// To export our Product model
module.exports = Product;
