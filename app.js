require('dotenv').load();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var session      = require('express-session');

var configDB = require('./config/database.js');
mongoose.connect(configDB.url); // connect to our database

var routes = require('./routes/index')(express, passport);


var app = express();

server = require('http').createServer(app),
io = require('socket.io').listen(server);


// required for passport
app.use(session({ secret: process.env.SESSION_SECRET })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

server.listen(4000);

var nextClientId = 0;
var playerMap = {};
io.sockets.on("connection", function(socket){
  console.log("socket connected");
  socket.clientId = nextClientId;
  nextClientId++;
  playerMap[socket.clientId] = {x:0, y:0, dir:"right"};
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
    delete playerMap[socket.clientId];
  });

  socket.on("play", function(data){
    socket.broadcast.emit("newPlayer", {clientId: socket.clientId});
    // console.log(data.data)
  });

  socket.on("update", function(data){
    playerMap[socket.clientId].x = data.player.position.x;
    playerMap[socket.clientId].y = data.player.position.y;
    playerMap[socket.clientId].dir = data.player.direction;
  });

  socket.on("click", function(data){
    console.log(data.data)
  });

  socket.on("left", function(data){
    console.log(data.data)
  });

  socket.on("right", function(data){
    console.log(data.data)
  });

  socket.on("bullet", function(data){
    console.log(data.data)
  });

});

setInterval(function() {
  io.emit("updateAll", playerMap);
// }, 1000 / 30);
}, 1000 / 1);





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
