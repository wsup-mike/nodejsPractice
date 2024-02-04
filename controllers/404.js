exports.get404Page = (req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "ERROR 404!",
    path: "/404",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.get500Page = (req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "ERROR 500 - High Priority!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
};
