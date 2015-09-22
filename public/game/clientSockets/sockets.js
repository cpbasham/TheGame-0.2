var runningGrunt = false;

var Player = require("../prefabs/player.js");
socketFunctions = {};

socketFunctions.startClick = function(ctx) {
  if (runningGrunt) { return; }
  ctx.game.state.socket = io.connect();
  ctx.game.state.socket.emit("play", {});
}

socketFunctions.createPlay = function(ctx) {
  if (runningGrunt) { return; };

  var game = ctx.game;
  var enemies = ctx.enemies;
  var socket = ctx.game.state.socket;

  socket.on("setup", function(data) {
    socket.clientId = data.clientId;
    for (var key in data.playerMap) {
      key = parseInt(key);
      if (key === socket.clientId) {continue;}
      var enemy = new Player(game, 200, 100, 'player', false);
      game.add.existing(enemy);
      enemies[key] = enemy;
    }
  });
  socket.on("newPlayer", function(data) {
    var enemy = new Player(game, 200, 100, 'player', false);
    game.add.existing(enemy);
    enemies[data.clientId] = enemy;
  });
  socket.on("updateAll", function(data) {
    for (var key in data) {
      key = parseInt(key);
      if (key === socket.clientId) {continue;}
      var enemy = enemies[key];
      var enemyData = data[key];
      enemy.position.x = enemyData.x;
      enemy.position.y = enemyData.y;
      // console.log("About to update direction");
      enemy.face(enemyData.dir);
      enemy.frame = enemyData.currentFrame;
      // enemy.animate(enemyData.isMoving)
      console.log("HEY", enemyData.bullets);
    }
  });
  socket.on("playerDisconnected", function(data) {
    delete enemies[data.clientId].destroy();
  });
}

socketFunctions.updatePlay = function(ctx) {
  if (runningGrunt) { return; };

  var liveBullets = ctx.game.bullets.children.filter(function(bullet) {
    return bullet.alive;
  });

  ctx.game.state.socket.emit("update", {
    player: {
      position: {
        x: ctx.player1.position.x,
        y: ctx.player1.position.y
      },
      direction: ctx.player1.body.direction,
      currentFrame: ctx.player1.frame
    },
    bullets: liveBullets;
  });
}

module.exports = socketFunctions
