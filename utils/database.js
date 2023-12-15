const Sequelize = require("sequelize"); // imprrt it

// Create new Sequelize instance with the 'Sequelize' constructor function. We pass in some options:   database name, username of database, password, ana options object.
const sequelize = new Sequelize("node-server-project", "root", "password", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
