(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var runningGrunt = true;

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
      if (key === socket.clientId) {
        handleSelf(data, key, ctx);
      } else {
        handleEnemy(data, key, ctx);
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

  var hitPlayers = [];
  for (var enemyClientId in ctx.enemies.players) {
    var enemy = ctx.enemies.players[enemyClientId];
    if (enemy.visible && ctx.game.physics.arcade.overlap(ctx.game.bullets, enemy, ctx.collisionHandler, null, ctx)) {
      var hitPlayer = { id: parseInt(enemyClientId) };
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
    self.visible = true;
  } else if (data[key].status === "hit") {
    ctx.flame.reset(self.body.x, self.body.y-100);
    ctx.flame.animations.play('blow', 30, false, true);
  } else {
    self.visible = false;
  }
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
  while (enemyBullets.length > 0) { enemyBullets.pop().destroy(); }

  for (var i=0; i<enemyData.bullets.length; i++) {
    bulletData = enemyData.bullets[i];
    var bullet = new Bullet(game, bulletData.x, bulletData.y, enemy);
    game.add.existing(bullet);
    enemyBullets.push(bullet);
  }

  if (enemyData.status === "alive") {
    enemy.visible = true;
  } else if (enemyData.status === "hit") {
    ctx.flame.reset(enemy.body.x, enemy.body.y-100);
    ctx.flame.animations.play('blow', 30, false, true);
  } else {
    enemy.visible = false;
  }
}

module.exports = socketFunctions

},{"../prefabs/bullet.js":3,"../prefabs/player.js":6}],2:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'thegame');
  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};

},{"./states/boot":7,"./states/gameover":8,"./states/menu":9,"./states/play":10,"./states/preload":11}],3:[function(require,module,exports){
'use strict';

var bullets;

var fireRate = 100;
var nextFire = 0;

var Bullet = function(game, x, y, player) {
  Phaser.Sprite.call(this, game, x, y, 'orangespin');

  this.game.bullets.add(this);
  this.animations.add('spin',[0,1, 2, 3, 4, 5, 6, 7, 8, 9], 60, true);
  this.alive = true;
  //this.game.physics.startSystem(Phaser.Physics.ARCADE);
  this.player = player
  this.game.physics.arcade.enableBody(this);
  // player.body.allowRotation = false;
  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;
  this.body.collideWorldBounds = true;

};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function(){

  if (this.game.input.activePointer.isDown) {
    if (this.game.time.now > nextFire && this.game.bullets.countDead() > 0) {
      nextFire = this.game.time.now + fireRate;
      var bullet = this.game.bullets.getFirstDead();

      //animate when fire(click)
      bullet.animations.add('spin');

      console.log(this.player.body.direction);
      bullet.animations.play('spin', 60, true);

      if (this.player.body.direction === 'left'){
        bullet.reset(this.player.x - 225, this.player.y + 40);
       }else if (this.player.body.direction === 'right'){
        bullet.reset(this.player.x + 150, this.player.y + 40);
       };
      //bullet.anchor.setTo(this.player.x, this.player.y);

      //bullet.reset(this.player.x+ 150, this.player.y -25);

      this.game.physics.arcade.moveToPointer(bullet, 500);
     }
  };

}


  module.exports = Bullet;

},{}],4:[function(require,module,exports){
'use strict';

// var platforms;

var Ground = function(game, x, y, width, height) {
  Phaser.TileSprite.call(this, game, x, y, 'floor');

  this.game.physics.arcade.enableBody(this);
  this.physicsType = Phaser.SPRITE;

  this.body.immovable = true;
  this.body.moves = false;
  // debugger;
  // this.platforms = this.game.add.group();
  // this.platforms.enableBody = true;
  this.game.physics.arcade.enable(this)
  // this.platforms.createMultiple(10, 'floor');

  //  for (var i = 0; i < this.platforms.children.length; i++) {
  //    this.platforms.children[i].body.allowGravity = false;
  //    this.platforms.children[i].body.immovable = true;
  //  }

   //this.platforms.physicsBodyType = Phaser.Physics.ARCADE;
  // var platform = this.platforms.getFirstDead();
  // platforms.body.immovable = true;
  // platform.body.allowGravity = false;
  // console.log(platform.body)




};

Ground.prototype = Object.create(Phaser.TileSprite.prototype);
Ground.prototype.constructor = Ground;

Ground.prototype.update = function() {




};

module.exports = Ground;

},{}],5:[function(require,module,exports){
'use strict';

var platform1;

var Platform = function(game, x, y, width, height) {
  Phaser.Sprite.call(this, game, x, y, 'ground');

  this.game.physics.arcade.enable(this, Phaser.Physics.ARCADE);

  this.body.immovable = true;
  this.body.moves = false;

  // this.platforms = this.game.add.group();
  // this.platforms.enableBody = true;
  this.game.physics.arcade.enable(this)
  // this.platforms.createMultiple(10, 'ground');





  //  for (var i = 0; i < this.platforms.children.length; i++) {
  //    this.platforms.children[i].body.allowGravity = false;
  //    this.platforms.children[i].body.immovable = true;
  //  }

   //this.platforms.physicsBodyType = Phaser.Physics.ARCADE;
  // var platform = this.platforms.getFirstDead();
  // platforms.body.immovable = true;
  // platform.body.allowGravity = false;
  // console.log(platform.body)




};

Platform.prototype = Object.create(Phaser.Sprite.prototype);
Platform.prototype.constructor = Platform;

Platform.prototype.update = function() {




};

module.exports = Platform;

},{}],6:[function(require,module,exports){
'use strict';

var cursors;

var Player = function(game, x, y, player, controllable, frame) {
  Phaser.Sprite.call(this, game, x, y, player, controllable, frame);

  this.game.physics.enable(this, Phaser.Physics.ARCADE);
  this.game.add.existing(this);


  this.game.allowGravity;

  //this.anchor.setTo(0.5, 0.5);
  //this.scale.setTo(0.5, 0.5);

  //this.animations.add('run');
  // this.animations.play('run', 15, true);

  this.animations.add('happy',[1, 2, 3, 4, 5, 6, 7, 8, 9], 10, true);
  this.animations.add('hurt',[11, 12, 13, 14, 15, 16, 17, 18, 19], 10, true);
  this.animations.add('jumpshoot',[20, 21, 22, 23, 24, 25, 26, 27, 28, 29], 10, true);
  this.animations.add('jump',[30, 31, 32, 33, 34, 35, 36, 37, 38, 39], 10, true);
  this.animations.add('melee',[40, 41, 42, 43, 44, 45, 46, 47, 48, 49], 10, true);
  this.animations.add('left',[50, 51, 52, 53, 54, 55, 56, 57, 58, 59], 10, true);//runshoot
  this.animations.add('right',[50, 51, 52, 53, 54, 55, 56, 57, 58, 59], 10, true);//runshoot
  this.animations.add('run',[60, 61, 62, 63, 64, 65, 66, 67, 68, 69], 10, true);
  this.animations.add('shoot',[70, 71, 72, 73, 74, 75, 76, 77, 78, 79], 10, true);
  // this.animations.add('throw',[80, 81, 82, 83, 84, 85, 86, 87, 88, 89], 10, true);


  this.game.physics.arcade.enableBody(this);
  this.body.collideWorldBounds = true;
  this.face("right");
  //this.animate(false);

  // halo = this.add.sprite(0, 0, 'bullet');
  // this.halo.anchor.setTo(3, 3);
  // this.game.addChild(this.halo);
  // this.physics.enable(this.halo, Phaser.Physics.ARCADE);

  // this.checkWorldBounds = true;
  // this.outOfBoundsKill = true;

  var game = this.game;
  var ctx = this;
  if (!controllable) {
    this.update = function() {}
  } else {
    cursors = this.game.input.keyboard.createCursorKeys();
  }

};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;
Player.prototype.face = function(direction) {
  if (direction === "left") {
    this.body.direction = "left";
    this.scale.x = -1;
  } else if (direction === "right") {
    this.body.direction = "right";
    this.scale.x = 1;;
  }
}
Player.prototype.animate = function(moving) {
  if (moving) {
    var velocity = (this.body.direction === "left" ? -750 : 750);
    this.body.velocity.x = velocity;
    this.animations.play(this.body.direction);
  } else {
    this.animations.stop();
    this.frame = 0;
  }

}

Player.prototype.setCollision = function(state) {
  return this.yolo = state;
}

Player.prototype.update = function() {

  this.game.physics.arcade.enable(this);
  cursors = this.game.input.keyboard.createCursorKeys();

  this.body.gravity.y = 500;
  this.body.velocity.x = 0;

  if (cursors.left.isDown) {
    this.face("left");
    this.animate(true);
  } else if (cursors.right.isDown) {
    this.face("right");
    this.animate(true);
    // else if(cursors.SPACEBAR.isDown){
    //   this.animations.play('melee', 15, false);
  } else {
    this.animations.play('shoot', 15, false);
    // this.animate(true);
  }
  if (cursors.up.isDown && this.yolo) {
    // debugger;
    this.body.position.y -= 1;
    this.body.velocity.y = -450;
  }

};

module.exports = Player;

},{}],7:[function(require,module,exports){

'use strict';

function Boot() {

}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.stage.backgroundColor = '#fff';

    //scaling options
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    this.game.input.maxPointers = 1;

    this.game.world.setBounds(0, 0, 1023, 1023);

    // ARCADE physics
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    if (this.game.device.desktop) {
      this.game.scale.pageAlignHorizontally = true;
    } else {
      this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.game.scale.minWidth =  480;
      this.game.scale.minHeight = 260;
      this.game.scale.maxWidth = 640;
      this.game.scale.maxHeight = 480;
      this.game.scale.forceOrientation(true);
      this.game.scale.pageAlignHorizontally = true;
      this.game.scale.setScreenSize(true);
    }

    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],8:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],9:[function(require,module,exports){

'use strict';

var text;

function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {

    //this.background = this.game.add.sprite(0, 0, 'background')

    var text = this.add.text(this.game.width * 0.5, this.game.height * 0.5, 'YOLO', {font: '42px Arial', fill: '#fff', align: 'center'});
    text.anchor.set(0.5);

    this.ground = this.game.add.tileSprite(240, 500, 335, 112, 'ground');

    this.ground.autoScroll(-200, 0);


    this.titleGroup = this.game.add.group();

    this.player = this.game.add.sprite(-40, 90, 'player');
    this.titleGroup.add(this.player);
    this.player.animations.add('run');
    this.player.animations.play('run', 32, true);

    // this.bird = this.game.add.sprite(-20, 100, 'bird');
    // this.titleGroup.add(this.bird);
    // this.bird.animations.add('flap');
    // this.bird.animations.play('flap', 12, true);

    this.titleGroup.x = this.game.world.centerX;
    this.titleGroup.y = this.game.world.centerY;

    //Oscillate
    this.game.add.tween(this.titleGroup).to({y:285}, 350, Phaser.Easing.Linear.NONE, true, 0, 1000, true);

    // add our start button with a callback
    //this.game.add.button(x, y, key, callback, callbackContext);
    //Every function in Phaser that has a cb also has a cb context parameter. If you fail to pass in the context parameter, Phaser will assume a null context. Generally, you will want to make your cb context `this`, as we want our cb to operate inside of a context that we can access all of our game objects from.
    this.startButton = this.game.add.button(this.game.width/2, 300, 'startButton', this.startClick, this);

    // this.titleGroup.add(this.startButton);

    this.startButton.anchor.setTo(0.5, 0.5);


  },
  startClick: function() {
    this.game.socketFunctions = require('../clientSockets/sockets.js');
    this.game.socketFunctions.startClick(this);  //TODO false == this
    this.game.state.start('play');
  },
  update: function() {
    // if(this.game.input.activePointer.justPressed()) {
      // this.game.state.start('play');
    // }
  }
};

module.exports = Menu;

},{"../clientSockets/sockets.js":1}],10:[function(require,module,exports){

  'use strict';


  var Ground = require('../prefabs/ground');
  var Player = require('../prefabs/player');
  var Bullet = require('../prefabs/bullet');
  var Platform = require('../prefabs/platform');

  function Play() {}

  Play.prototype = {
    create: function() {

      this.enemies = {players: {}, bullets: {}};

      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      this.background = this.game.add.sprite(0, 0, 'background');

      //creating players
      this.player1 = new Player(this.game, 450, 100,  'player1', true);
      this.player2 = new Player(this.game, 200, 100, 'player2', false);
      this.player3 = new Player(this.game, 300, 100,  'player3', false);
      this.player4 = new Player(this.game, 400, 100, 'player4', false);

      //adding players to stage
      this.game.add.existing(this.player1);
      this.game.add.existing(this.player2);
      this.game.add.existing(this.player3);
      this.game.add.existing(this.player4);

      //creating and adding weapon for players
      this.game.bullets = this.game.add.group();
      this.game.bullets.enableBody = true;
      this.game.bullets.physicsBodyType = Phaser.Physics.ARCADE;
      this.game.bullets.createMultiple(3, 'orangespin');
      this.game.bullets.setAll('checkWorldBounds', true);
      this.game.bullets.setAll('outOfBoundsKill', true);


      //adding explsions



      this.bullet1 = new Bullet(this.game, this.player1.x, this.player1.y, this.player1);
      //this.game.add.existing(this.bullet1);

      //ground
      // this.ground = new Ground(this.game, 0, 1322, 300, 213);
      // this.game.add.existing(this.ground);

      // this.groundtest = new Ground(this.game, 0, 1000, 1300, 1213);
      // this.game.add.existing(this.groundtest);

      //platforms
      // this.platforms = this.game.add.physicsGroup();
      // this.platforms.create(100, 1200, 'ground');
      // this.platforms.create(100, 100, 'ground');
      // this.platforms.create(200, 200, 'ground');
      // this.platforms.setAll('body.allowGravity', false);
      // this.platforms.setAll('body.immovable', true);
      // this.platforms.setAll('body.velocity.x', 100);


      //camera following player
      this.game.camera.follow(this.player1);

      //explsions
      this.flame = this.game.add.sprite(0, 0, 'kaboom');
      this.flame.scale.setTo(1.5, 1.5);
      this.blow = this.flame.animations.add('blow');

      this.groundexplosion = this.game.add.sprite(0, 0, 'groundexp');
      this.boom = this.groundexplosion.animations.add('boom')

      this.game.socketFunctions.createPlay(this);
    },
    update: function() {

      //player 1
      if (this.game.physics.arcade.collide(this.player1, this.ground)) {
        this.player1.setCollision(true);
      } else if (this.game.physics.arcade.collide(this.player1, this.platforms)) {
        this.player1.setCollision(true);
      } else {
        this.player1.setCollision(false);
      };

      // this.game.physics.arcade.collide(this.player1, this.groundtest);

      this.game.physics.arcade.collide(this.player1, this.ground);
      this.game.physics.arcade.collide(this.player2, this.ground);
      this.game.physics.arcade.collide(this.player1, this.platforms);
      // this.game.physics.arcade.collide(this.player2, this.ground);
      this.game.physics.arcade.collide(this.player1, this.platforms);

      this.game.physics.arcade.collide(this.bullet1, this.ground);
      this.game.physics.arcade.overlap(this.game.bullets, this.ground,
      function(ground, bullet) {
        bullet.kill();
      }, null, this);

      // NEED TO ADD BELOW FUNCTION FOR SOCKET STUFF
      // this.game.physics.arcade.overlap(this.game.bullets, this.player2,
      //   this.collisionHandler, null, this);

      this.game.socketFunctions.updatePlay(this);
    },

    collisionHandler: function(opponent, bullet){

      bullet.kill();
      opponent.kill()
      this.flame.reset(opponent.body.x, opponent.body.y-100);
      this.flame.animations.play('blow', 30, false, true);
      this.respawn(opponent);

    },

    respawn: function(opponent){
      opponent.reset(this.game.world.randomX, this.game.world.randomY);
    },


    clickListener: function() {
      this.game.state.start('gameover');
    }
  };

  module.exports = Play;

},{"../prefabs/bullet":3,"../prefabs/ground":4,"../prefabs/platform":5,"../prefabs/player":6}],11:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    //boilerplate code. displays animated loading image while loading other assets
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.load.setPreloadSprite(this.asset);
    // ????
    this.asset.anchor.setTo(-1, -1);

    //load game assets:
    this.load.image('startButton', 'assets/images/start-button.png');
    this.load.image('background', 'assets/gameimages/background/bg.png');
    this.load.image('ground', 'assets/images/ground.png');
    this.load.image('ground1', 'assets/images/ground1.png');  //tried to crop out clear space
    this.load.image('floor', 'assets/images/floor.png');
    this.load.spritesheet('kaboom', '../assets/images/explode.png', 128, 128);
    this.load.spritesheet('explosion', '../assets/images/explosion1.png', 200, 141, 11);
    this.load.spritesheet('bullet', 'assets/images/bird.png', 34, 24, 1);

    //loading players
    this.load.atlasJSONHash('player1', '../assets/players/soldier1.png', '../assets/players/soldier1.json');
    this.load.atlasJSONHash('player2', '../assets/players/soldier2.png', '../assets/players/soldier2.json');
    this.load.atlasJSONHash('player3', '../assets/players/soldier3.png', '../assets/players/soldier3.json');
    this.load.atlasJSONHash('player4', '../assets/players/soldier4.png', '../assets/players/soldier4.json');

    //loading bullets
    this.load.atlasJSONHash('orangespin', '../assets/bullets/orangespin.png', '../assets/bullets/orangespin.json');
    this.load.atlasJSONHash('groundexp', '../assets/bullets/groundexp.png', '../assets/bullets/orangespin.json');
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[2])