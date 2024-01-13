const http = require("http");
const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const errorController = require("./controllers/404");
// const mongoConnect = require("./utils/database").mongoconnect;
const User = require("./models/user");

const MONGODB_URI =
  "mongodb+srv://coolsuedeadidas:1password1@cluster0.s9dqd5j.mongodb.net/shop?w=majority";
// const MONGODB_URI =
//   "mongodb+srv://coolsuedeadidas:1password1@cluster0.s9dqd5j.mongodb.net/shop?retryWrites=true&w=majority";

const store = new MongoDBStore({
  uri: MONGODB_URI, // a connection string to specify which database server to store our session data
  collection: "sessions", // To define the collection where our new sessions will be stored
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const bodyParser = require("body-parser");
const { error } = require("console");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    // to configure our session
    secret: "superman",
    resave: false,
    saveUninitialized: false,
    store: store, // where all of our 'session data' for users will now be stored!
  })
);

// app.use((req, res, next) => {
//   User.findById("6598cd9676cd0a620f50db18")
//     .then((user) => {
//       req.user = user;
//       next();
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404Page);

// mongoConnect(() => {
//   console.log();
//   app.listen(3000);
// });
mongoose
  .connect(MONGODB_URI)
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
