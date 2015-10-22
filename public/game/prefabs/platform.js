'use strict';



var Platform = function(game, x, y, width, height) {
  Phaser.Sprite.call(this, game, x, y, 'platformLarge');

  this.game.physics.arcade.enable(this, Phaser.Physics.ARCADE);

  this.body.immovable = true;
  this.body.moves = false;

  // this.platforms = this.game.add.group();
  // this.platforms.enableBody = true;
  this.game.physics.arcade.enable(this)
  // this.platforms.createMultiple(10, 'ground');





  //  for (var i = 0; i < this.platforms.children.length; i++) {
  //    this.platforms.children[i].body.allowGravity = false;
  //    this.platforms.children[i].body.immovable = true;
  //  }

   //this.platforms.physicsBodyType = Phaser.Physics.ARCADE;
  // var platform = this.platforms.getFirstDead();
  // platforms.body.immovable = true;
  // platform.body.allowGravity = false;
  // console.log(platform.body)




};

Platform.prototype = Object.create(Phaser.Sprite.prototype);
Platform.prototype.constructor = Platform;

Platform.prototype.update = function() {




};

module.exports = Platform;
