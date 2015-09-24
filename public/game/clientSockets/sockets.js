var runningGrunt = false;

var Player = require("../prefabs/player.js");
var Bullet = require("../prefabs/bullet.js");
socketFunctions = {};

function getQueryVariable(variable) {
   var query = window.location.search.substring(1);
   var vars = query.split("&");
   for (var i=0;i<vars.length;i++) {
           var pair = vars[i].split("=");
           if(pair[0] == variable){return pair[1];}
   }
   return(false);
}

socketFunctions.startClick = function(ctx) {
  if (runningGrunt) { return; }
  ctx.game.state.socket = io.connect();
  var room = getQueryVariable("room") || "default";
  ctx.game.state.socket.emit("knockknock", room);
}

socketFunctions.createPlay = function(ctx) {
  if (runningGrunt) { return; };

  var game = ctx.game;
  var enemies = ctx.enemies;
  var socket = ctx.game.state.socket;

  socket.on("setup", function(playerMap) {
    for (var key in playerMap) {
      if (key === socket.id) {continue;}
      var enemySprite = "player" + (Math.floor(Math.random()*3) + 2);
      var enemy = new Player(game, 200, 100, enemySprite, false);
      game.add.existing(enemy);
      enemies.players[key] = enemy;
      enemies.bullets[key] = [];
    }
  });
  socket.on("newPlayer", function(playerId) {
    var enemySprite = "player" + (Math.floor(Math.random()*3) + 2);
    var enemy = new Player(game, 200, 100, enemySprite, false);
    game.add.existing(enemy);
    enemies.players[playerId] = enemy;
    enemies.bullets[playerId] = [];
  });
  socket.on("updateAll", function(data) {
    for (var key in data) {
      if (key === socket.id) {
        handleSelf(data, key, ctx);
      } else {
        handleEnemy(data, key, ctx);
      }
    }
  });
  socket.on("playerDisconnected", function(playerId) {
    delete enemies.players[playerId].destroy();
    for (var bullet in enemies.bullets[playerId]) {
      bullet.destroy();
    }
    delete enemies.bullets[playerId];
  });
}

socketFunctions.updatePlay = function(ctx) {
  if (runningGrunt) { return; };

  var hitPlayers = [];
  for (var enemyClientId in ctx.enemies.players) {
    var enemy = ctx.enemies.players[enemyClientId];
    if (enemy.visible && ctx.game.physics.arcade.overlap(ctx.game.bullets, enemy, ctx.collisionHandler, null, ctx)) {
      var hitPlayer = { id: enemyClientId };
      hitPlayers.push(hitPlayer);
    }
  }

  // Get bullet info
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
    bullets: liveBullets,
    hitPlayers: hitPlayers
  });
}

function handleSelf(data, key, ctx) {
  var self = ctx.player1;
  if (data[key].status === "alive") {
  } else if (data[key].status === "hit") {
    ctx.flame.reset(self.body.x, self.body.y-100);
    ctx.flame.animations.play('blow', 30, false, true);
    self.kill();
  } else if (data[key].status === "respawning") {
    ctx.respawn(self);
  } else if (data[key].status === "dead") {
  }
}

function createBullet(serverEnemyData, clientEnemyBullets, game, enemy, i) {
  var bulletData = serverEnemyData.bullets[i];
  var bullet = new Bullet(game, bulletData.x, bulletData.y, enemy);
  game.add.existing(bullet);
  clientEnemyBullets.push(bullet);
  // console.log("SERVER DATA: (", bulletData.x, ",", bulletData.y, ")");
  // console.log("CLIENT DATA: (", bulletData.x, ",", bulletData.y, ")");
}

function handleEnemy(data, key, ctx) {
  var game = ctx.game;
  var enemies = ctx.enemies;
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
  // console.log(enemyData.bullets);
  while (enemyBullets.length > 0) { enemyBullets.pop().destroy(); }

  for (var i=0; i<enemyData.bullets.length; i++) {
    // console.log("ENEMY ID:", key);
    createBullet(enemyData, enemyBullets, game, enemy, i);
    // debugger;
  }
  // console.log("UPDATE DONE");

  if (enemyData.status === "alive") {
  } else if (enemyData.status === "hit") {
    ctx.flame.reset(enemy.body.x, enemy.body.y-100);
    ctx.flame.animations.play('blow', 30, false, true);
    enemy.kill();
  } else if (enemyData.status === "respawning") {
    ctx.respawn(enemy);
  } else if (enemyData.status === "dead") {
  }
}

module.exports = socketFunctions
