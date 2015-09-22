'use strict';

var cursors;

var Player = function(game, x, y, playerName, controllable, frame) {
  Phaser.Sprite.call(this, game, x, y, playerName, controllable, frame);

  this.game.physics.enable(this, Phaser.Physics.ARCADE);
  this.game.add.existing(this);


  this.game.allowGravity;

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

  // halo = this.add.sprite(0, 0, 'bullet');
  // this.halo.anchor.setTo(3, 3);
  // this.game.addChild(this.halo);
  // this.physics.enable(this.halo, Phaser.Physics.ARCADE);

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

Player.prototype.setCollision = function(state) {
  return this.yolo = state;
}

Player.prototype.update = function() {

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
    this.animate(false);
  }

  if (cursors.up.isDown && this.yolo) {
    this.body.position.y -= 1;
    this.body.velocity.y -= 450;
  }

};

module.exports = Player;
