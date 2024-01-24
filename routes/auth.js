const express = require("express");
const { check, body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLoginPage);

router.get("/signup", authController.getSignupPage);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a VALID email address, dumbo!")
      .normalizeEmail(),

    body(
      "password",
      "Your Password not good enough: Min 6 characters and ONLY alphanumeric characters only dude!"
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(), // to remove excess whitespace!
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage(
        "Please enter a valid email you frikin idiot. (im not gonna ask again)"
      )
      .custom((value, { req }) => {
        // if (value === "hacker@gmail.com") {
        //   throw new Error(
        //     "Warning: I see you bro! You are on the unauthorized list! This email is a malicious bad actor!"
        //   );
        // }
        // return true;
        return User.findOne({ email: value }).then((userDoc) => {
          // if the user actually exists!
          if (userDoc) {
            // // then no need to create new user
            // req.flash("error", "E-mail already exists!");
            // return res.redirect("/signup");
            return Promise.reject("E-mail already exists!");
          }
        });
      })
      .normalizeEmail(),

    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters."
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),

    body("confirmPassword", "")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do NOT match!");
        }
        return true;
      })
      .trim(),
  ],

  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getResetPage);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPasswordPage);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
