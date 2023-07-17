const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportJWT = require("passport-jwt");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: "account",
    },
    (account, password, cb) => {
      User.findOne({ where: { account } })
        .then(async (user) => {
          //如果使用者不存在
          if (!user) return cb(null, false, "Account or password invalid");
          //如果密碼錯誤
          const match = await bcrypt.compare(password, user.password);
          if (!match) return cb(null, false, "Account or password invalid");
          
          return cb(null, user, { message: "Logged in successfully" });
        })
        .catch((error) => cb(error));
    }
  )
);

const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};
passport.use(
  new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
    User.findByPk(jwtPayload.id)
      .then((user) => cb(null, user))
      .catch((err) => cb(err));
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});
passport.deserializeUser((id, cb) => {
  return User.findByPk(id)
    .then((user) => cb(null, user.toJSON()))
    .catch((err) => cb(err));
});

module.exports = passport;
