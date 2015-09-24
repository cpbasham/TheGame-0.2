'use strict';

// var platforms;

var Ground = function(game, x, y, width, height) {
  Phaser.Sprite.call(this, game, x, y, 'ground');

  this.game.physics.arcade.enableBody(this);
  this.physicsType = Phaser.SPRITE;

  this.body.immovable = true;
  this.body.moves = false;
  // debugger;
  // this.platforms = this.game.add.group();
  // this.platforms.enableBody = true;
  this.game.physics.arcade.enable(this)


  // this.platforms.createMultiple(10, 'floor');

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

Ground.prototype = Object.create(Phaser.Sprite.prototype);
Ground.prototype.constructor = Ground;

Ground.prototype.update = function() {




};

module.exports = Ground;
