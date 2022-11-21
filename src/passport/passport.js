const passportJWT = require("passport-jwt");
const { User } = require("../db/usersSchema");
require("dotenv").config();
const secret = process.env.SECRET;

const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

const strategy = new Strategy(params, async function (payload, done) {
  console.log(payload);
  await User.find({ _id: payload._id })
    .then(([user]) => {
      if (!user) {
        return done(new Error("User not found"));
      }
      return done(null, user);
    })
    .catch((err) => done(err));
});

module.exports = strategy;
