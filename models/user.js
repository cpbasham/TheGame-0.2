var mongoose = require('mongoose'),
    util = require('../config/util.js');

var UserSchema = mongoose.Schema({
  username: String,
  password: String,
  hscore: { type: Double, default: 0}
  lastConnection: { type: Date, default: Date.now }
});

UserSchema.methods = {
  authenticate: function(plainText){
    return util.encrypt(plainText) == this.password;
  }
};

mongoose.model('User', UserSchema);

