module.exports = function(app, passport) {

    // route for home page
    app.get('/', function(req, res) {
      res.render('index');
    });


    app.get('/profile', isLoggedIn, function(req, res) {
      res.render('profile', {
        user : req.user
      });
    });


    app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
    });


    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    app.get('/auth/google/callback',
      passport.authenticate('google', {
        successRedirect : '/profile',
        failureRedirect : '/'
      })
    );

  };

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}
