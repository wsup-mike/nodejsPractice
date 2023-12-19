const http = require("http");
const path = require("path");
const express = require("express");
const app = express();
const errorController = require("./controllers/404");
const mongoConnect = require('./utils/database').mongoconnect;

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.set("view engine", "ejs");
app.set("views", "views");

const bodyParser = require("body-parser");
const { error } = require("console");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  // User.findByPk(1)
  //   .then((user) => {
  //     req.user = user;
  //     next();
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404Page);

mongoConnect(() => {
  console.log();
  app.listen(3000);
});
