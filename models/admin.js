const mongoose = require('mongoose');
const crypto = require('crypto');

var AdminSchema = new mongoose.Schema({
	methods: {
    type: String,
    required: true
  	},
   	local: {
		name: {
			type: String,
			lowercase: true
		},
		email: {
			type: String,
			lowercase: true
		},
		hash: String,
		salt: String,
		adminHash : String,
		adminSalt : String,
		priviledge: String
	}
})



AdminSchema.methods.setPassword = function(password) {
	this.local.salt = crypto.randomBytes(16).toString('hex');
  	this.local.hash = crypto.pbkdf2Sync(password,this.local.salt, 10000, 512, 'sha512').toString('hex');
};

AdminSchema.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.local.salt, 10000, 512, 'sha512').toString('hex');
  return this.local.hash === hash;
};

AdminSchema.methods.setAdminPassword = function(administrator) {
	this.local.adminSalt = crypto.randomBytes(16).toString('hex');
  	this.local.adminHash = crypto.pbkdf2Sync(administrator, this.local.adminSalt, 10000, 512, 'sha512').toString('hex');
};

AdminSchema.methods.validateAdminPassword = function(administrator) {
  const adminHash = crypto.pbkdf2Sync(administrator, this.local.adminSalt, 10000, 512, 'sha512').toString('hex');
  return this.local.adminHash === adminHash
};


module.exports = mongoose.model("Admin",AdminSchema);