
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
    this.load.image('background', 'assets/gameimages/background/bg.png');
    //this.load.image('ground', 'assets/images/ground.png');
    this.load.image('ground1', 'assets/images/ground1.png');  //tried to crop out clear space
    this.load.image('floor', 'assets/images/floor.png');
    this.load.image('backgroundOld', 'assets/images/background.png');
    this.load.image('groundOld', 'assets/images/ground.png');
    this.load.image('ground1Old', 'assets/images/ground1.png');  //tried to crop out clear space
    this.load.image('floorOld', 'assets/images/floor.png');
    this.load.spritesheet('kaboom', '../assets/images/explode.png', 128, 128);
    this.load.spritesheet('explosion', '../assets/images/explosion1.png', 200, 141, 11);
    this.load.spritesheet('bullet', 'assets/images/bird.png', 34, 24, 1);

    //loading players
    this.load.atlasJSONHash('player1', '../assets/players/soldier1.png', '../assets/players/soldier1.json');
    this.load.atlasJSONHash('player2', '../assets/players/soldier2.png', '../assets/players/soldier2.json');
    this.load.atlasJSONHash('player3', '../assets/players/soldier3.png', '../assets/players/soldier3.json');
    this.load.atlasJSONHash('player4', '../assets/players/soldier4.png', '../assets/players/soldier4.json');

    //loading bullets
    this.load.atlasJSONHash('orangespin', '../assets/bullets/orangespin.png', '../assets/bullets/orangespin.json');
    this.load.atlasJSONHash('groundexp', '../assets/bullets/groundexp.png', '../assets/bullets/orangespin.json');
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
