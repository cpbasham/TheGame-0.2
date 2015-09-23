var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(4000);

var RECEIVED_ROOM_NAME = 'test-room';

// var rooms = {};
var playerMap = {};
io.sockets.on("connection", function(socket){
  console.log("Socket connected:", socket.id);
  socket.join(RECEIVED_ROOM_NAME, function() {
    // if (! rooms.hasOwnProperty(RECEIVED_ROOM_NAME)) {
    //   rooms[RECEIVED_ROOM_NAME] = { playerMap: {} };
    // }
    // var playerMap = rooms[RECEIVED_ROOM_NAME].playerMap;
    playerMap[socket.id] = {x:0, y:0, dir:"right", isMoving:false, status:"alive"};

    socket.emit("setup", playerMap);
  });



  socket.on("disconnect", function(data) {
    socket.broadcast.emit("playerDisconnected", socket.id);
    delete playerMap[socket.id];
  });

  socket.on("play", function(data){
    socket.broadcast.emit("newPlayer", socket.id);
  });

  socket.on("update", function(clientData){
    var serverPlayer  = playerMap[socket.id];
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
    }, 1000);
  }
}



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

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
