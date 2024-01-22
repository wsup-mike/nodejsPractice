const express = require("express");
const { check, body } = require("express-validator");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLoginPage);

router.get("/signup", authController.getSignupPage);

router.post("/login", authController.postLogin);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage(
        "Please enter a valid email you frikin idiot. (im not gonna ask again)"
      )
      .custom((value, { req }) => {
        if (value === "hacker@gmail.com") {
          throw new Error(
            "Warning: I see you bro! You are on the unauthorized list! This email is a malicious bad actor!"
          );
        }
        return true;
      }),

    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters."
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getResetPage);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPasswordPage);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
