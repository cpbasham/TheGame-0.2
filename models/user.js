var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
  username: String,
  password: String,
  hscore: { type: Number, default: 0},
  lastConnection: { type: Date, default: Date.now }
});

mongoose.model('User', UserSchema);

