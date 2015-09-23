'use strict';

var bullets;

var fireRate = 100;
var nextFire = 0;



var Bullet = function(game, x, y, player) {
  Phaser.Sprite.call(this, game, x, y, 'bullet');


  this.game.bullets.add(this);
  this.alive = true;
  //this.game.physics.startSystem(Phaser.Physics.ARCADE);
  this.player = player
  this.game.physics.arcade.enableBody(this);

  // player.body.allowRotation = false;

  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;
  this.body.collideWorldBounds = true;


};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function(){

  if (this.game.input.activePointer.isDown) {
    if (this.game.time.now > nextFire && this.game.bullets.countDead() > 0) {
      nextFire = this.game.time.now + fireRate;

      var bullet = this.game.bullets.getFirstDead();

      bullet.reset(this.player.x, this.player.y);

      this.game.physics.arcade.moveToPointer(bullet, 1000);
     }
  };

}


  module.exports = Bullet;
