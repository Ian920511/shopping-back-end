const passport = require("../config/passport")

const authenticate = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) return next(err)

    if (!user) {
      res.status(401)
      return res.json({error: 'Your token is invalid'})
    }

    req.user = user;
    return next();
  })(req, res, next);
};

function checkRole(role) {
  return function (req, res, next) {
    if (!req.user || req.user.role !== role) {
      res.status(403).json({ message: 'Forbidden' });
    } else {
      next();
    }
  }
}

module.exports = {
  authenticate,
  checkRole
}