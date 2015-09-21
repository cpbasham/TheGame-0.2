
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

      //movement for these are the same because of same keystrokes
      //creating players
      this.player1 = new Player(this.game, 100, 100, 'player', true);
      this.player2 = new Player(this.game, 200, 100, 'player', false);

      //adding players to stage
      this.game.add.existing(this.player1);
      this.game.add.existing(this.player2);

      //creating and adding weapon for players
        this.bullet1 = new Bullet(this.game, this.player1.x, this.player1.y, this.player1);
       this.game.add.existing(this.bullet1);

      //camera followingm player one
      this.game.camera.follow(this.player1);



    },
    update: function() {

      this.game.physics.arcade.overlap(this.bullet1.bullets, this.player2,  this.collisionHandler, null, this);

      this.game.physics.arcade.collide(this.player1, this.ground);
      this.game.physics.arcade.collide(this.player1, this.platform);
      this.game.physics.arcade.collide(this.player2, this.ground);
    },


    collisionHandler: function(bullet, opponent){
      bullet.kill();
      opponent.kill()
      console.log(this.flame.animations.play);
      this.flame.reset(opponent.body.x, opponent.body.y-100);
      console.log(this.flame.animations.play);
      this.flame.animations.play('blow', 30, false, true);

    },

    clickListener: function() {
      this.game.state.start('gameover');
    }
  };

  module.exports = Play;
