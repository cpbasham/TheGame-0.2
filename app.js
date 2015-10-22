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

function getRooms() {
  var roomInfo = [];
  for (var room in rooms) {
    if(rooms.hasOwnProperty(room)) {
        var playerMap = rooms[room].playerMap;
        roomInfo.push( {name: room, numPlayers: playerMap.keys.length} );
    }
  }
  return roomInfo;
}

var rooms = {};
// var playerMap = {};
io.sockets.on("connection", function(socket){
  console.log("Socket connected:", socket.id);

  socket.on("knockknock", function(roomId) {
    socket.gameRoom = roomId;

    socket.join(socket.gameRoom, function() {
      if (! rooms.hasOwnProperty(socket.gameRoom)) {
        rooms[socket.gameRoom] = { playerMap: {} };
      }
      var playerMap = rooms[socket.gameRoom].playerMap;
      playerMap[socket.id] = {x:0, y:0, dir:"right", isMoving:false, status:"alive"};
      // console.log(rooms);
      // console.log(io.)
      socket.emit("setup", playerMap);

      socket.on("disconnect", function(data) {
        var room = socket.gameRoom;
        socket.broadcast.in(room).emit("playerDisconnected", socket.id);
        delete rooms[room].playerMap[socket.id];
        if (Object.keys(rooms[room]).length === 0) { // if room empty
          delete rooms[room];
        }
      });

      socket.on("update", function(clientData){
        var playerMap = rooms[socket.gameRoom].playerMap;
        var serverPlayer  = playerMap[socket.id];
        serverPlayer.x    = clientData.player.position.x;
        serverPlayer.y    = clientData.player.position.y;
        serverPlayer.dir  = clientData.player.direction;
        serverPlayer.currentFrame = clientData.player.currentFrame;
        serverPlayer.bullets = clientData.bullets;
        // if (serverPlayer.bullets.length > 0) {
          // console.log("CLIENT BULLETS", clientData.bullets);
          // console.log("SERVER BULLETS", serverPlaye)
          // console.log(socket.id);
        // }
        for (var i in clientData.hitPlayers) {
          var hitPlayerId = clientData.hitPlayers[i].id;
          playerMap[hitPlayerId].status = "hit";
        }
      });

      socket.broadcast.in(socket.gameRoom).emit("newPlayer", socket.id);
    });

  });

});


setInterval(function() {
  for (var room in rooms) {
    var playerMap = rooms[room].playerMap;
    io.in(room).emit("updateAll", playerMap);
    for (var key in playerMap) {
      checkPlayer(playerMap[key]);
    }
  }
}, 1000 / 30);
// }, 1000 / 1);

function checkPlayer(player) {
  if (player.status === "hit") {
    player.status = "dead";
    setTimeout(function() {
      player.status = "respawning";
    }, 1000);
  } else if (player.status === "respawning") {
    player.status = "alive";
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
