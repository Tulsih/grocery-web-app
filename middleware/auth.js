const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  res.redirect("/auth/login");
};

const isGuest = (req, res, next) => {
  if (req.session && req.session.userId) {
    return res.redirect("/products");
  }
  next();
};

module.exports = { isAuthenticated, isGuest };
