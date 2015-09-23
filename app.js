require('dotenv').load();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');


<<<<<<< HEAD
=======

>>>>>>> e25a59315d6d91185a1d8d673d895f8365636082
// load passport.js
require('./config/passport.js')(passport);

// setup routes
var routes = require('./routes/index')(express, passport);


// connect to mongo through mongoose
mongoose.connect(process.env.MONGO_DB_URL);

// load express
var app = express();
server = require('http').createServer(app);
io = require('socket.io').listen(server);


// required for passport
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());


server.listen(8080);

var nextClientId = 0;
var playerMap = {};
io.sockets.on("connection", function(socket){
  console.log("socket connected");
  socket.clientId = nextClientId;
  nextClientId++;
  playerMap[socket.clientId] = {x:0, y:0, dir:"right", isMoving:false, status:"alive"};
  // console.log("added", socket.clientId, "to playerMap");

  socket.emit("setup",
    {
      clientId: socket.clientId,
      playerMap: playerMap
    }
  );

  // console.log(io.sockets.sockets[0]);
  // console.log(io.sockets.sockets[1]);

  socket.on("disconnect", function(data) {
    socket.broadcast.emit("playerDisconnected", {clientId: socket.clientId});
    delete playerMap[socket.clientId];
  });

  socket.on("play", function(data){
    socket.broadcast.emit("newPlayer", {clientId: socket.clientId});
    // console.log(data.data)
  });

  socket.on("update", function(clientData){
    var serverPlayer  = playerMap[socket.clientId];
    serverPlayer.x    = clientData.player.position.x;
    serverPlayer.y    = clientData.player.position.y;
    serverPlayer.dir  = clientData.player.direction;
    serverPlayer.currentFrame = clientData.player.currentFrame;
    serverPlayer.bullets = clientData.bullets;
    for (var i in clientData.hitPlayers) {
      var hitPlayerId = clientData.hitPlayers[i].id;
      playerMap[hitPlayerId].status = "hit";
    }
  });
});



setInterval(function() {
  io.emit("updateAll", playerMap);
  for (var key in playerMap) {
    checkPlayer(playerMap[key]);
  }
}, 1000 / 30);
// }, 1000 / 1);

function checkPlayer(player) {
  if (player.status === "hit") {
    player.status = "dead";
    setTimeout(function() {
      player.status = "alive";
      // console.log("P KEY:", key);
    }, 1000);
  }
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
// app.use('/game', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
