exports.get404Page = (req, res, next) => {
  // res.status(404).sendFile(path.join(mainDirectoryPath, "views", "404.html"));
  // console.log(path.join(mainDirectoryPath, "views", "404.html"));
  res.status(404).render("404", {
    pageTitle: "ERROR 404!",
    path: "/",
    // isAuthenticated: req.session.isLoggedIn,
  });
};
