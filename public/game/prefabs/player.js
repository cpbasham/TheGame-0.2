'use strict';

var cursors;

var Player = function(game, x, y, playerName, controllable, frame) {
  Phaser.Sprite.call(this, game, x, y, playerName, controllable, frame);

  // this.game.physics.enable(this);
  // this.game.physics.arcade.gravity.y = 500;

  this.anchor.setTo(0.5, 0.5);
  this.scale.setTo(0.5, 0.5);

  this.animations.add('run');
  this.animations.play('run', 15, true);

  this.animations.add('left',[0,1,2], 10, true);
  this.animations.add('right',[3,4,5], 10, true);
  //this.animations.add('jump',[], 10, true);
  //this.animations.add('shoot'[] 10, true);

  this.game.physics.arcade.enableBody(this);
  this.body.collideWorldBounds = true;
  this.face("right");
  this.animate(false);

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
    this.scale.x = -0.5;
  } else if (direction === "right") {
    this.body.direction = "right";
    this.scale.x = 0.5;
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

Player.prototype.update = function() {

  this.game.physics.arcade.enable(this);
  this.body.gravity.y = 500;

  cursors = this.game.input.keyboard.createCursorKeys();

  this.body.velocity.x = 0;
  if (cursors.left.isDown) {
    this.face("left");
    this.animate(true);
  } else if (cursors.right.isDown) {
    this.face("right");
    this.animate(true);
  } else {
    this.animate(false);
  }

  // console.log('console logging in player');
  console.log(this.body.touching.down);

  if (cursors.up.isDown && this.body.touching.down) {
    this.body.velocity.y = -150;
  };



};

module.exports = Player;
