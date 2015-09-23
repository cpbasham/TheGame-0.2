
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
