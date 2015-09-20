(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var socket = io.connect();
//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'thegame');


  socket.emit("play", {data:"this is data"});
  socket.emit("update", {data:"update data"});

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));


  game.state.start('boot');
};
},{"./states/boot":5,"./states/gameover":6,"./states/menu":7,"./states/play":8,"./states/preload":9}],2:[function(require,module,exports){
'use strict';

var bullets;

var fireRate = 100;
var nextFire = 0;


var Bullet = function(game, x, y, player) {
  Phaser.Sprite.call(this, game, x, y, 'bullet');

  //this.game.physics.startSystem(Phaser.Physics.ARCADE);
   this.player = player
   this.game.physics.arcade.enableBody(this);

    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

    this.bullets.createMultiple(50, 'bullet');
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('outOfBoundsKill', true);

    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.allowRotation = false;




    this.body.collideWorldBounds = true;
};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function(){
    //player.rotation = this.game.physics.arcade.angleToPointer(player);
    // this.bullets.x = player.x;
    // this.bullets.y = player.y;

    if (this.game.input.activePointer.isDown)
    {
      var socket = io.connect();
      socket.emit("bullet", {data:"bullet triggered"});

      if (this.game.time.now > nextFire && this.bullets.countDead() > 0)
       {
          nextFire = this.game.time.now + fireRate;

          var bullet = this.bullets.getFirstDead();

          bullet.reset(this.player.x, this.player.y);

          this.game.physics.arcade.moveToPointer(bullet, 3000);
       }
    };

  }

  module.exports = Bullet;

},{}],3:[function(require,module,exports){
'use strict';

var Ground = function(game, x, y, width, height) {
  Phaser.TileSprite.call(this, game, x, y, width, height, 'ground');

  this.game.physics.arcade.enableBody(this);
  this.physicsType = Phaser.SPRITE;

  this.body.allowGravity = false;
  this.body.immovable = true;

};

Ground.prototype = Object.create(Phaser.Sprite.prototype);
Ground.prototype.constructor = Ground;

Ground.prototype.update = function() {

  // write your prefab's specific update code here

};

module.exports = Ground;

},{}],4:[function(require,module,exports){
'use strict';

var cursors;

var Player = function(game, x, y, playerName, controllable, frame) {
  Phaser.Sprite.call(this, game, x, y, playerName, controllable, frame);

 this.game.physics.arcade.enableBody(this);

  this.anchor.setTo(0.5, 0.5);

  this.scale.setTo(0.5, 0.5);

  this.animations.add('run');
  this.animations.play('run', 15, true);

  this.animations.add('left',[0,1,2], 10, true);
  this.animations.add('right',[3,4,5], 10, true);
  //this.animations.add('jump',[], 10, true);
  //this.animations.add('shoot'[] 10, true);

  this.body.collideWorldBounds = true;
  // this.checkWorldBounds = true;
  // this.outOfBoundsKill = true;

  if (!controllable) {
    this.update = function() {
      return;
    }
  };

};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  cursors = this.game.input.keyboard.createCursorKeys();
  var socket = io.connect();

  this.body.velocity.x = 0;

  if (cursors.left.isDown) {
    this.body.velocity.x = -750;
    this.anchor.setTo(0.5, 0);
    this.scale.x = -0.5;
    this.animations.play('left');

    socket.emit("left", {data:"moved to the fucking left"})

  } else if (cursors.right.isDown) {
    this.scale.x = 0.5;
    this.body.velocity.x = 750;
    this.animations.play('right');

    socket.emit("right", {data:"moved to the fucking right"})


  } else {
    this.animations.stop();
    this.frame = 0;
  }
  if (cursors.up.isDown && this.body.touching.down){
    console.log(this.body.touching.down)
    this.body.velocity.y = -550;
  }

};

module.exports = Player;

},{}],5:[function(require,module,exports){

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

    this.game.world.setBounds(0, 0, 4000, 1536);

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

},{}],6:[function(require,module,exports){

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

},{}],7:[function(require,module,exports){

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
    this.game.state.start('play');
      var socket = io.connect();
     socket.emit("click", {data:"click data"});

  },
  update: function() {
    // if(this.game.input.activePointer.justPressed()) {
      // this.game.state.start('play');
    // }
  }
};

module.exports = Menu;

},{}],8:[function(require,module,exports){

  'use strict';


  var Ground = require('../prefabs/ground');
  var Player = require('../prefabs/player');
  var Bullet = require('../prefabs/bullet');
  var cursors;


  function Play() {}
  Play.prototype = {
    create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      this.game.physics.arcade.gravity.y = 500;

      this.background = this.game.add.sprite(0, 0, 'background');

      this.player = new Player(this.game, 0, 2000);

      this.bullet = new Bullet(this.game, this.player.x, this.player.y, this.player);
      this.game.add.existing(this.player);


      this.player1 = new Player(this.game, 100, 100, 'player', true);
      this.bullet1 = new Bullet(this.game, this.player1.x, this.player1.y, this.player1);
      this.game.add.existing(this.player1);
      this.game.add.existing(this.bullet1);

      //movement for these are the same because of same keystrokes
      this.player2 = new Player(this.game, 200, 100, 'player', false);

      this.game.add.existing(this.player2);

      // this.ground = new Ground(this.game, 0, 700, 2000, 112);
      // this.game.add.existing(this.ground);

      this.game.camera.follow(this.player1);

      // cursors = this.game.input.keyboard.createCursorKeys();

    },
    update: function() {

      this.game.physics.enable(this.player1);

      this.game.physics.arcade.collide(this.player1, this.ground);

    },

    clickListener: function() {
      this.game.state.start('gameover');
    }
  };

  module.exports = Play;

},{"../prefabs/bullet":2,"../prefabs/ground":3,"../prefabs/player":4}],9:[function(require,module,exports){

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
    this.load.image('background', 'assets/images/background.png');
    this.load.image('ground', 'assets/images/ground.png');
    this.load.spritesheet('bullet', 'assets/images/bird.png', 34, 24, 1);

    this.load.spritesheet('player', 'assets/images/running100x141.png', 100, 141, 6);

    // this.load.tilemap('level1', 'assets/tilemaps/testmap.json', null, Phaser.Tilemap.TILED_JSON);
    // this.load.image('tiles', 'assets/images/testmap.png');

    this.load.spritesheet('enemy', 'assets/images/enemy.png', 193, 178, 9);
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

},{}]},{},[1])
