const mongoose = require('mongoose');
const crypto = require('crypto');

var UserSchema = new mongoose.Schema({
	methods: {
    type: String,
    required: true
  	},
   	local: {
		name: {
			type: String,
			lowercase: true
		},
		surname:{
			type: String,
			lowercase: true
		},
		email: {
			type: String,
			lowercase: true
		},
		profile:String,
		hash: String,
		salt: String,
		forgotPassHash: String,
		forgotPassSalt: String
	},
	google: {
	    id: {
        	type: String
	    },
	    name: {
			type: String,
			lowercase: true
		},
		surname:{
			type: String,
			lowercase: true
		},
	    email: {
        	type: String,
        	lowercase: true
	    },
	    profile:String
  	},
	facebook: {
		id: {
			type: String
		},
		name: {
			type: String,
			lowercase: true
		},
		surname:{
			type: String,
			lowercase: true
		},
		email: {
			type: String,
			lowercase: true
		},
		profile:String
	}
});


UserSchema.methods.setPassword = function(password) {
	this.local.salt = crypto.randomBytes(16).toString('hex');
  	this.local.hash = crypto.pbkdf2Sync(password,this.local.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.local.salt, 10000, 512, 'sha512').toString('hex');
  return this.local.hash === hash;
};

module.exports = mongoose.model("User",UserSchema);