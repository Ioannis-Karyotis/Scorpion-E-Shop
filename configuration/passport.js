const mongoose = require('mongoose'),
      passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      JwtStrategy = require('passport-jwt').Strategy,
      FacebookStrategy = require('passport-facebook').Strategy,
      GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
      {ExtractJwt } = require('passport-jwt'),
      User    = require("../models/user"),
      Admin    = require("../models/admin"),
      config = require('./index');

const cookieExtractor = function(req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['access_token'];
  }
  return token;
}
      
const cookieAdminExtractor = function(req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['admin_token'];
  }
  return token;
}

const cookieForgotPExtractor = function(req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['Change_Pass'];
  }
  return token;
}

// JSON WEB TOKENS STRATEGY
passport.use('jwtAdmin', new JwtStrategy({
  jwtFromRequest: cookieAdminExtractor,
  secretOrKey: config.JWT_SECRET_ADMIN,
  passReqToCallback: true
}, function(req, payload, done){
    process.nextTick(function(){
      Admin.findById(payload.sub._id , function(err,admin){
        if(err){
          done(error, false);
        }
        if (!admin || !admin.validateAdminPassword(config.ADMIN_PASS)) {
          console.log("admin doens't exist");
          req.user = {};
          return done(null, false);
        }
        req.user = admin;
        done(null, admin);
    });  
  });
}));    
      

// JSON WEB TOKENS STRATEGY
passport.use('jwt', new JwtStrategy({
  jwtFromRequest: cookieExtractor,
  secretOrKey: config.JWT_SECRET,
  passReqToCallback: true
}, function(req, payload, done){
    process.nextTick(function(){
      const user = User.findById(payload.sub , function(err){
        if(err){
          done(error, false);
        }
      
        if (!user) {
          console.log("user doens't exist");
          return done(null, false);
        }
        req.user = user;
        done(null, user);
    });  
  });
}));

// JSON WEB TOKENS STRATEGY
passport.use('forgot_pass', new JwtStrategy({
  jwtFromRequest: cookieForgotPExtractor,
  secretOrKey: config.JWT_SECRET,
  passReqToCallback: true
}, function(req, payload, done){
    process.nextTick(function(){
      const user = User.findOne({"local.email": payload.sub }, function(err,user){
        if(err){
          done(error, false);
        }
      
        if (!user) {
          console.log("user doens't exist");
          return done(null, false);
        }
        done(null, user);
    });  
  });
}));        

passport.use("facebook" , new FacebookStrategy({
      clientID: config.oauth.facebook.clientID,
      clientSecret: config.oauth.facebook.clientSecret,
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields: ['id', 'emails', 'name' , 'picture.type(large)']
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function(){
        User.findOne({'facebook.id': profile.id},async function(err, user){
          if(err)
            return done(err);
          if(user)
            return done(null, user);
          else {
            existingUser = await User.findOne({ "local.email": profile.emails[0].value });
            if (existingUser) {
              // We want to merge google's data with local auth
              existingUser.methods = 'facebook';
              existingUser.facebook = {
                id: profile.id,
                email: profile.emails[0].value,
                name : profile.name.givenName,
                surname : profile.name.familyName,
                profile : profile.photos[0].value
              }
              await existingUser.save();
              return done(null, existingUser);
            }else{
              var newUser = new User();
              newUser.facebook.id = profile.id;
              newUser.facebook.name = profile.name.givenName;
              newUser.facebook.surname= profile.name.familyName;
              newUser.facebook.email = profile.emails[0].value;
              newUser.facebook.profile = profile.photos[0].value;
              newUser.methods = 'facebook';
              newUser.save(function(err){
                if(err){
                  throw err;
                }

                return done(null, newUser);
              })
            }
          }  
        });
      });  
  }));
  
passport.use("google" , new GoogleStrategy({
      clientID: config.oauth.google.clientID,
      clientSecret: config.oauth.google.clientSecret,
      callbackURL: "http://localhost:3000/auth/google/callback",
      // profileFields: ['id', 'emails', 'name']
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function(){
        User.findOne({'google.id': profile.id}, async function(err, user){
          if(err)
            return done(err);
          if(user)
            return done(null, user);
          else {

            var fullname = profile.displayName.split(" ");

            existingUser = await User.findOne({ "local.email": profile.emails[0].value });
            if (existingUser) {
              // We want to merge google's data with local auth
              existingUser.methods = 'google';
              existingUser.google = {
                id: profile.id,
                email: profile.emails[0].value,
                name : fullname[0],
                surname : fullname[1],
                profile : profile.photos[0].value
              }
              await existingUser.save();
              return done(null, existingUser);
            }else{
              var newUser = new User();
              newUser.google.id = profile.id;
              newUser.google.name = fullname[0];
              newUser.google.surname = fullname[1];
              newUser.google.email = profile.emails[0].value;
              newUser.methods = 'google';
              newUser.google.profile = profile.photos[0].value;
              newUser.save(function(err){
                if(err){
                  throw err;
                }

                return done(null, newUser);
              })
            }
          }
        });
      });  
  }));
  


passport.use('local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, function (email, password, done){
  process.nextTick(function(){
    Admin.findOne({"local.email" : email}, function(err,admin){
      if(!admin || !admin.validatePassword(password)){
        User.findOne({ "local.email" : email }, function(err,user){
          console.log(user);
          if(!user || !user.validatePassword(password)) {
            user={};
            return done(null, false);
          }
          return done(null, user);
        });
      }else{
        return done(null,admin);
      }
    });      
  });
}));  




passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});






module.exports = passport;
