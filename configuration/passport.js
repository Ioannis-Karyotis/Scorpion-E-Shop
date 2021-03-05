const mongoose = require('mongoose'),
      passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      JwtStrategy = require('passport-jwt').Strategy,
      FacebookStrategy = require('passport-facebook').Strategy,
      GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
      {ExtractJwt } = require('passport-jwt'),
      User    = require("../models/user"),
      Admin    = require("../models/admin"),   
      objEncDec     = require('object-encrypt-decrypt'),
      config = require('./index'),
      logger          = require('simple-node-logger').createSimpleLogger('Logs.log'),
      dotenv      = require('dotenv');

dotenv.config();

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
function trimBody(inside){

  Object.keys(inside).forEach(function(key,index) {
    inside[key].trim();
  });
  return inside;
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
          logger.error("Admin attempt failed");
          done(error, false);
        }
        if (!admin || !admin.validateAdminPassword(config.ADMIN_PASS)) {
          logger.error("Admin with id: ",payload.sub._id," was not found.");
          req.user = undefined;
          return done(null, false);
        }
        req.user = admin;
        logger.info("Admin logged in success!!!");
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
          logger.error("User with id: ",payload.sub," was not found.");
          req.user = undefined;
          return done(null, false);
        }
        req.user = user;
        logger.error("User with id: ",payload.sub," has logged in.");
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
      hashobj = objEncDec.decrypt(payload.sub);
      hashobj = trimBody(hashobj);
      const user = User.findOne({"local.email": hashobj.email , "local.forgotPassHash" : hashobj.hash }, function(err,user){
        if(err){
          done(error, false);
        }
        var date = new Date();
        if (!user || user.local.forgotValidUntil < date) {
          user.local.forgotPassHash = null;
          user.local.forgotPassSalt = null;
          user.local.forgotValidUntil = null;
          user.save();
          logger.warn("Could not authenticate User");
          return done(null, false);
        }
        done(null, user);
    });  
  });
}));        

passport.use("facebook" , new FacebookStrategy({
      clientID: config.oauth.facebook.clientID,
      clientSecret: config.oauth.facebook.clientSecret,
      callbackURL: process.env.ROOT + "/auth/facebook/callback",
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
      callbackURL: process.env.ROOT+"/auth/google/callback",
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
  email =  email.trim();
  password = password.trim();
  process.nextTick(function(){
    Admin.findOne({"local.email" : email}, function(err,admin){
      if(!admin || !admin.validatePassword(password)){
        User.findOne({ "local.email" : email }, function(err,user){
          if(!user || !user.validatePassword(password)) {
            user={};
            return done(null, false);
          }
          logger.info("Logged in as user");
          return done(null, user);
        });
      }else{
        logger.info("Logged in as admin");
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
