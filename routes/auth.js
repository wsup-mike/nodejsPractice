const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLoginPage);

router.get("/signup", authController.getSignupPage);

router.post("/login", authController.postLogin);

router.post("/signup", authController.postSignup);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getResetPage);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPasswordPage);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
