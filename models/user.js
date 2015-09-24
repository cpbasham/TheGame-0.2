var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: String,

  facebook         : {
    id           : String,
    token        : String,
    name         : String
  },

  google           : {
    id           : String,
    token        : String,
    email        : String,
    name         : String
  }
});

module.exports = mongoose.model('User', userSchema);
