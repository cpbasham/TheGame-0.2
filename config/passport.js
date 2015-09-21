var mongoose = require('mongoose'),
    LocalStrategy = require('passport-local').Strategy
    User = mongoose.model('User');

module.exports = function(app, passport){

  // serialize sessions
  passport.serializeUser(function(user, done) {
      done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
      User.findById( id, function (err, user) {
          done(err, user)
      });
  });

  // use local strategy
  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));

}
