var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// configure express app
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// cofngure session,passport for user authentication
app.use(express.session({ secret: process.env('SESSION_SECRET') }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

// configure routes
var routes = require('./routes/index');
var login = require('./routes/passport')

app.use('/', routes);
app.use('/login', login);






server.listen(4000);

io.sockets.on("connection", function(socket){
  console.log("socket connected");

  socket.on("play", function(data){
    console.log(data.data)
  });

  socket.on("update", function(data){
    console.log(data.data)
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




module.exports = app;
