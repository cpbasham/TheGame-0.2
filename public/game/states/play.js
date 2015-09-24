
  'use strict';


  var Ground = require('../prefabs/ground');
  var Player = require('../prefabs/player');
  var Bullet = require('../prefabs/bullet');
  var Platform = require('../prefabs/platform');
  var text;

  function Play() {}

  Play.prototype = {
    create: function() {
      //TODO: Go FullScreen
      this.game.input.onDown.add(gofull, this)

      function gofull() {
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.game.scale.startFullScreen();
      };

      this.enemies = {players: {}, bullets: {}};

      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      this.background = this.game.add.sprite(0, 0, 'background');


      //creating players
      this.player1 = new Player(this.game, 450, 100,  'player1', true);
      // this.player2 = new Player(this.game, 200, 100, 'player2', false);
      // this.player3 = new Player(this.game, 300, 100,  'player3', false);
      // this.player4 = new Player(this.game, 400, 100, 'player4', false);

      //text above player sprite
      // this.player1.inputEnabled = true;
      // var style = { font: "20px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: this.player1.width, align: "center" };
      // text = this.game.add.text(0, 0, "YOLO", style);
      // text.anchor.set(0.5);

      //adding players to stage
      this.game.add.existing(this.player1);
      // this.game.add.existing(this.player2);
      // this.game.add.existing(this.player3);
      // this.game.add.existing(this.player4);

      //platforms
      this.platforms = this.game.add.physicsGroup();
      var platform = this.platforms.create(1398, 255, 'platformLarge');
      platform.scale.setTo(1, 0.5);
      var platform = this.platforms.create(200, 650, 'platformLarge');
      platform.scale.setTo(1, 0.5);
      var platform = this.platforms.create(2600, 600, 'platformLarge');
      platform.scale.setTo(1, 0.5);
      var platform = this.platforms.create(700, 250, 'platformSmall');
      platform.scale.setTo(1, 0.5);
      var platform = this.platforms.create(100, 395, 'platformSmall');
      platform.scale.setTo(1, 0.5);
      var platform = this.platforms.create(3450, 325, 'platformSmall');
      platform.scale.setTo(1, 0.5);
      var platform = this.platforms.create(2850, 200, 'platformSmall');
      platform.scale.setTo(1, 0.5);
      var platform = this.platforms.create(1700, 700, 'platformSmall');
      platform.scale.setTo(1, 0.5);

      this.platforms.setAll('body.allowGravity', false);
      this.platforms.setAll('body.immovable', true);

      //creating and adding weapon for players
      this.game.bullets = this.game.add.group();
      this.game.bullets.enableBody = true;
      this.game.bullets.physicsBodyType = Phaser.Physics.ARCADE;
      this.game.bullets.createMultiple(20, 'orangespin');
      // this.game.bullets.setAll('checkWorldBounds', true);
      // this.game.bullets.setAll('outOfBoundsKill', true);

      this.bullet1 = new Bullet(this.game, this.player1.x, this.player1.y, this.player1);
      this.bullet1.kill();
      // this.game.add.existing(this.bullet1);

      //ground
      this.ground = new Ground(this.game, 0, 982, 4096, 41);
      this.game.add.existing(this.ground);

      //camera following player
      this.game.camera.follow(this.player1);

      //explsions
      this.flame = this.game.add.sprite(0, 0, 'kaboom');
      this.flame.visible = false;
      this.flame.scale.setTo(1.5, 1.5);
      this.blow = this.flame.animations.add('blow');

      // Are we using this?? TODO !!!!!!
      // this.groundexplosion = this.game.add.sprite(0, 0, 'groundexp');
      // this.boom = this.groundexplosion.animations.add('boom')

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

      this.game.physics.arcade.overlap(this.game.bullets, this.platforms,
      function(bullet, platforms) {
        bullet.kill();
      }, null, this);

      // name above player positioning
      // text.x = Math.floor(this.player1.x);
      // text.y = Math.floor(this.player1.y - (this.player1.height/2));


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
      opponent.reset(this.game.world.randomX - this.game.camera.x, 0);
      // console.log(this.game.world.randomX);
      // console.log(this.game.world);
    },


    clickListener: function() {
      this.game.state.start('gameover');
    }
  };

  module.exports = Play;
