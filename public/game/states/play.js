
  'use strict';


  var Ground = require('../prefabs/ground');
  var Player = require('../prefabs/player');
  var Bullet = require('../prefabs/bullet');
  var cursors;

  function Play() {}

  Play.prototype = {
    create: function() {

      this.enemies = {players: {}, bullets: {}};

      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      this.background = this.game.add.sprite(0, 0, 'background');

      //creating players
      this.player1 = new Player(this.game, 100, 100, 'player', true);
      this.player2 = new Player(this.game, 200, 1400, 'player', false);

      //adding players to stage
      this.game.add.existing(this.player1);
      // this.game.add.existing(this.player2);


      this.ground = new Ground(this.game, 0, 1400, 4000, 112);
      this.game.add.existing(this.ground);
      this.ground.body.immovable = true;
      this.ground.body.moves = false;

      //creating and adding weapon for players
      this.game.bullets = this.game.add.group();
      this.game.bullets.enableBody = true;
      this.game.bullets.physicsBodyType = Phaser.Physics.ARCADE;
      this.game.bullets.createMultiple(1, 'bullet');
      this.game.bullets.setAll('checkWorldBounds', true);
      this.game.bullets.setAll('outOfBoundsKill', true);

      this.bullet1 = new Bullet(this.game, this.player1.x, this.player1.y, this.player1);
      this.game.add.existing(this.bullet1);


      //camera followingm player one
      this.game.camera.follow(this.player1);

      this.flame = this.game.add.sprite(0, 0, 'kaboom');
      this.flame.scale.setTo(1.5, 1.5);
      this.blow = this.flame.animations.add('blow');

      this.game.socketFunctions.createPlay(this);
    },
    update: function() {

      // if (this.game.physics.arcade.collide(this.player1, this.ground)) {
      //   this.player1.body.touching.down = true;
      // };

      this.game.physics.arcade.collide(this.player1, this.ground);
      this.game.physics.arcade.collide(this.player2, this.ground);
      console.log(this.ground.body)

      // NEED TO ADD BELOW FUNCTION FOR SOCKET STUFF
      this.game.physics.arcade.overlap(this.game.bullets, this.player2,
      this.collisionHandler, null, this);


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
