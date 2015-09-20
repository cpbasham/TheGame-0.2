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

  this.body.velocity.x = 0;

  if (cursors.left.isDown) {
    this.body.velocity.x = -750;
    this.anchor.setTo(0.5, 0);
    this.scale.x = -0.5;
    this.animations.play('left');
  } else if (cursors.right.isDown) {
    this.scale.x = 0.5;
    this.body.velocity.x = 750;
    this.animations.play('right');
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
