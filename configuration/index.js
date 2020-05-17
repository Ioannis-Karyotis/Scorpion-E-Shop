const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_SECRET_ADMIN :process.env.JWT_SECRET_ADMIN,
  ADMIN_PASS : process.env.ADMIN_PASS,
  SESSION_SECRET : process.env.JWT_SECRET_ADMIN,
  PUBLIC_STRIPE: process.env.PUBLIC_STRIPE,
  SECRET_STRIPE: process.env.SECRET_STRIPE,
  WEBHOOK_SECRET : process.env.WEBHOOK_SECRET,
  oauth: {
    google: {
      clientID: process.env.GOOGLE_CID,
      clientSecret: process.env.GOOGLE_CSECRET,
    },
    facebook: {
      clientID: process.env.FACEBOOK_CID,
      clientSecret: process.env.FACEBOOK_CSECRET,
    },
  },
};