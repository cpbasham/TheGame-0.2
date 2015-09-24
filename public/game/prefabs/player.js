'use strict';

var cursors;

var Player = function(game, x, y, player, controllable, frame) {
  Phaser.Sprite.call(this, game, x, y, player, controllable, frame);

  this.scale.setTo(0.5, 0.5);

  this.game.physics.enable(this, Phaser.Physics.ARCADE);
  this.game.add.existing(this);

  this.game.allowGravity;
  this.anchor.setTo(0.5, 0.5);

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
    var velocity = (this.body.direction === "left" ? -500 : 500);
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

  // console.log(this.body.velocity, this.yolo);

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
  } else {
    this.animations.play('shoot', 30, false);
  }
  // console.log(cursors.up.isDown);

  if (cursors.up.isDown && this.yolo) {
    this.animations.play('jump', 1, true);
    this.body.position.y -= 1;
    this.body.velocity.y = -450;
  }

};

module.exports = Player;
