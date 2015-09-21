
  'use strict';


  var Ground = require('../prefabs/ground');
  var Player = require('../prefabs/player');
  var Bullet = require('../prefabs/bullet');
  var cursors;




  function Play() {}

  Play.prototype = {
    create: function() {
      this.enemies = {};
      var game = this.game;
      var enemies = this.enemies;
      var socket = this.game.state.socket;
      socket.on("setup", function(data) {
        socket.clientId = data.clientId;
        for (var key in data.playerMap) {
          key = parseInt(key);
          if (key === socket.clientId) {continue;}
          var enemy = new Player(game, 200, 100, 'player', false);
          game.add.existing(enemy);
          enemies[data.clientId] = enemy;
        }
      });
      socket.on("newPlayer", function(data) {
        var enemy = new Player(game, 200, 100, 'player', false);
        game.add.existing(enemy);
        enemies[data.clientId] = enemy;
      });
      socket.on("updateAll", function(data) {
        console.log(data);
        console.log(enemies);
        for (var key in data) {
          key = parseInt(key);
          if (key === socket.clientId) {continue;}
          enemies[key].position.x = data[key].x;
          enemies[key].position.y = data[key].y;
        }
      });

      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      this.game.physics.arcade.gravity.y = 500;

      this.background = this.game.add.sprite(0, 0, 'background');

      this.player1 = new Player(this.game, 100, 100, 'player', true);
      this.bullet1 = new Bullet(this.game, this.player1.x, this.player1.y, this.player1);
      this.game.add.existing(this.player1);
      this.game.add.existing(this.bullet1);

      //movement for these are the same because of same keystrokes
      // this.player2 = new Player(this.game, 200, 100, 'player', false);

      // this.game.add.existing(this.player2);

      // this.ground = new Ground(this.game, 0, 700, 2000, 112);
      // this.game.add.existing(this.ground);

      this.game.camera.follow(this.player1);

      // cursors = this.game.input.keyboard.createCursorKeys();
      // debugger;

    },
    update: function() {

      this.game.physics.enable(this.player1);
      this.game.physics.arcade.collide(this.player1, this.ground);

      var socket = this.game.state.socket;
      var dir = this.player1.scale.x < 0 ? "left" : "right";
      socket.emit("update",
        {
        player:
          {
          position:
            {
            x: this.player1.position.x,
            y: this.player1.position.y
            },
          direction: dir
          }
        }
      );

    },

    clickListener: function() {
      this.game.state.start('gameover');
    }
  };

  module.exports = Play;
