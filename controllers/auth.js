exports.getLoginPage = (req, res, next) => {
  // const isLoggedIn = req.get("Cookie").trim().split("=")[1];
  // console.log(isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  req.isLoggedIn = true;
  res.setHeader("Set-Cookie", "loggedIn=true; HttpOnly"); // This sets the cookie to stay logged in for only 5 sec!
  res.redirect("/");
};
