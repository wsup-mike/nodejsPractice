const http = require("http");
const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const errorController = require("./controllers/404");
// const mongoConnect = require("./utils/database").mongoconnect;
const User = require("./models/user");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.set("view engine", "ejs");
app.set("views", "views");

const bodyParser = require("body-parser");
const { error } = require("console");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  User.findById("6597afbfd852b56a77527a35")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404Page);

// mongoConnect(() => {
//   console.log();
//   app.listen(3000);
// });
mongoose
  .connect(
    "mongodb+srv://coolsuedeadidas:1password1@cluster0.s9dqd5j.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "OrangeDeuce",
          email: "coolsuedepumas@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch((err) => console.log(err));
