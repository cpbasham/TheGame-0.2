var runningGrunt = false;

var Player = require("../prefabs/player.js");
var Bullet = require("../prefabs/bullet.js");
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
      enemies.players[key] = enemy;
      enemies.bullets[key] = [];
    }
  });
  socket.on("newPlayer", function(data) {
    var enemy = new Player(game, 200, 100, 'player', false);
    game.add.existing(enemy);
    enemies.players[data.clientId] = enemy;
    enemies.bullets[data.clientId] = [];
  });
  socket.on("updateAll", function(data) {
    for (var key in data) {
      key = parseInt(key);
      if (key === socket.clientId) {continue;}
      var enemy = enemies.players[key];
      var enemyBullets = enemies.bullets[key];
      var enemyData = data[key];
      enemy.position.x = enemyData.x;
      enemy.position.y = enemyData.y;
      // console.log("About to update direction");
      enemy.face(enemyData.dir);
      enemy.frame = enemyData.currentFrame;
      // enemy.animate(enemyData.isMoving)
      // enemy.bulletInfo = enemyData.bullets
      while (enemyBullets.length > 0) { enemyBullets.pop().destroy(); }

      for (var i=0; i<enemyData.bullets.length; i++) {
        bulletData = enemyData.bullets[i];
        var bullet = new Bullet(game, bulletData.x, bulletData.y, enemy);
        game.add.existing(bullet);
        enemyBullets.push(bullet);
      }
    }
  });
  socket.on("playerDisconnected", function(data) {
    delete enemies.players[data.clientId].destroy();
    for (var bullet in enemies.bullets[data.clientId]) {
      bullet.destroy();
    }
    delete enemies.bullets[data.clientId];
  });
}

socketFunctions.updatePlay = function(ctx) {
  if (runningGrunt) { return; };

  // console.log("MY BULLET:", ctx.game.bullets.children.filter(function(bullet) { return bullet.alive; })[0]);

  var liveBullets = ctx.game.bullets.children.filter(function(bullet) {
    return bullet.alive;
  }).map(function(bullet) {
    return {x: bullet.position.x, y: bullet.position.y};
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
    bullets: liveBullets
  });
}

module.exports = socketFunctions
