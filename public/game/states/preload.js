
'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    //boilerplate code. displays animated loading image while loading other assets
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.load.setPreloadSprite(this.asset);
    // ????
    this.asset.anchor.setTo(-1, -1);

    //load game assets: (NEW)
    this.load.image('background', 'assets/images/Stage.png');
    this.load.image('platformSmall', 'assets/images/platformsmall.png');
    this.load.image('platformLarge', 'assets/images/platformlarge.png');
    this.load.image('ground', 'assets/images/newGround.png');


    //load game assets: (OLD)
    this.load.image('startButton', 'assets/images/start-button.png');
    this.load.image('backgroundOld', 'assets/images/background.png');
    this.load.image('groundOld', 'assets/images/ground.png');
    this.load.image('ground1Old', 'assets/images/ground1.png');  //tried to crop out clear space
    this.load.image('floorOld', 'assets/images/floor.png');
    this.load.spritesheet('kaboom', '../assets/images/explode.png', 128, 128);
    this.load.spritesheet('explosion', '../assets/images/explosion1.png', 200, 141, 11);
    this.load.spritesheet('bullet', 'assets/images/bird.png', 34, 24, 1);
    this.load.spritesheet('player', 'assets/images/running100x141.png', 100, 141, 6);

    // this.load.tilemap('level1', 'assets/tilemaps/testmap.json', null, Phaser.Tilemap.TILED_JSON);
    // this.load.image('tiles', 'assets/images/testmap.png');

    this.load.spritesheet('enemy', 'assets/images/enemy.png', 193, 178, 9);
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');   //TODO: Change this to 'menu'
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;
