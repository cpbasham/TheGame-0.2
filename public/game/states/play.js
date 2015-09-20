
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
