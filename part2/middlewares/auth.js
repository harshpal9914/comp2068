exports.requireAuth = (req, res, next) => {
  const isAuth = req.isAuthenticated();
  if (isAuth) {
    return next();
  }

  res.redirect('/login');
};

exports.requireNotAuth = (req, res, next) => {
  const isAuth = req.isAuthenticated();
  if (!isAuth) {
    return next();
  }

  return next(new Error('You must not be logged in'));
};
