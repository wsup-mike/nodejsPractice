const http = require("http");
const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csurf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

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

const csurfProtection = csurf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const bodyParser = require("body-parser");
app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
  }).single("image")
);

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
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

app.use(csurfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  // throw new Error("Sync Dummy error");
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id) // Copied from former middleware in app.js
    .then((user) => {
      // throw new Error("Async Dummy error!");
      if (!user) {
        return next();
      }
      req.user = user;
      next(); // so the incoming request wiil continue w/ next middleware in line
    })
    .catch((err) => {
      // console.log(err);
      next(new Error(err)); // For Async code errors to be properly captured
    });
});

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

app.use("/500", errorController.get500Page);
app.use(errorController.get404Page);
app.use((error, req, res, next) => {
  // res.redirect("/500");
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});

// mongoConnect(() => {
//   console.log();
//   app.listen(3000);
// });
mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    // User.findOne().then((user) => {
    //   if (!user) {
    //     const user = new User({
    //       name: "OrangeDeuce",
    //       email: "coolsuedepumas@gmail.com",
    //       cart: {
    //         items: [],
    //       },
    //     });
    //     user.save();
    //   }
    // });
    app.listen(3000);
  })
  .catch((err) => console.log(err));
