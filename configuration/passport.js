const mongoose = require('mongoose'),
      passport = require('passport'),
      LocalStrategy = require('passport-local'),
      User    = require("../models/user"),
      FacebookStrategy = require('passport-facebook').Strategy;


passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, (email, password, done) => {
  User.findOne({ email })
    .then((user) => {
      if(!user || !user.validatePassword(password)) {
        return done(null, false, { message: { 'email or password': 'is invalid' } });
      }

      return done(null, user);
    }).catch(done);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});



passport.use(new FacebookStrategy({
    clientID: 537686946939757,
    clientSecret: "c47aa3886774d13942417cf5d95305b1",
    callbackURL: "http://localhost:3000/"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ "local.email": profile.emails[0].value }, function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
));




module.exports = passport;
