'use strict';

var bullets;

var fireRate = 100;
var nextFire = 0;

var Bullet = function(game, x, y, player) {
  Phaser.Sprite.call(this, game, x, y, 'orangespin');

  this.game.bullets.add(this);
  this.animations.add('spin',[0,1, 2, 3, 4, 5, 6, 7, 8, 9], 60, true);
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

      //animate when fire(click)
      bullet.animations.add('spin');

      console.log(this.player.body.direction);
      bullet.animations.play('spin', 60, true);

      if (this.player.body.direction === 'left'){
        bullet.reset(this.player.x - 225, this.player.y + 40);
       }else if (this.player.body.direction === 'right'){
        bullet.reset(this.player.x + 150, this.player.y + 40);
       };
      //bullet.anchor.setTo(this.player.x, this.player.y);

      //bullet.reset(this.player.x+ 150, this.player.y -25);

      this.game.physics.arcade.moveToPointer(bullet, 500);
     }
  };

}


  module.exports = Bullet;
