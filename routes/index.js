module.exports = function(express,passport){

  var router = express.Router();

  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express', user: req.user });
  });

  router.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });

  router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
  router.get('/auth/google/callback',
    passport.authenticate('google', {
      successRedirect : '/rooms',
      failureRedirect : '/'
    })
  );


  router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
  router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect : '/rooms',
      failureRedirect : '/'
    })
  );

  router.get('/thegame', function(req,res){
    res.render('game', {title: 'DA GAME', user: req.user });
  });

  router.get('/rooms', function(req,res){
    res.render('rooms', {title: 'Room View', user: req.user });
  });

  return router;
}



